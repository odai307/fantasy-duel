const { Prisma } = require('@prisma/client');

const prisma = require('../shared/config/db');
const { makeError } = require('../shared/errors');
const { normalizeInviteCode, randomInviteCode, MAX_INVITE_CODE_RETRIES } = require('../shared/inviteCodeUtils');
const { getOrSet } = require('../shared/cache');
const {
  getTeamScore,
  getTeamInfoForUser,
  getTeamOfficialPoints,
  getCurrentGameweek,
  assertGameweekOpen
} = require('../fpl/fplService');
const { buildScorePatch } = require('../fpl/scoreSyncUtils');

async function refreshPoolParticipantScores(pool) {
  if (!pool?.id || !pool?.gameweek) {
    return;
  }

  const participants = await prisma.poolParticipant.findMany({
    where: { poolId: pool.id },
    select: {
      id: true,
      gameweekPoints: true,
      userId: true,
      user: {
        select: {
          fplTeamId: true,
        },
      },
    },
  });

  for (const participant of participants) {
    const teamId = participant.user?.fplTeamId;
    if (!teamId) {
      continue;
    }

    try {
      const teamInfo = await getTeamInfoForUser(teamId);
      let nextGameweekPoints = Number(teamInfo?.eventPoints || 0);

      // If pool GW differs from the manager's current GW, fall back to event-specific score.
      if (Number(teamInfo?.currentEvent) !== Number(pool.gameweek)) {
        const scoreData = await getTeamScore(teamId, Number(pool.gameweek));
        nextGameweekPoints = Number(scoreData?.gameweekPoints || 0);
      }

      const patch = buildScorePatch(participant.gameweekPoints, nextGameweekPoints);

      await prisma.poolParticipant.update({
        where: { id: participant.id },
        data: {
          gameweekPoints: patch.gameweekPoints,
          points: {
            increment: patch.delta,
          },
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      // Best-effort refresh: keep leaderboard available even if one external FPL lookup fails.
      console.warn('[pool-score-refresh] failed to refresh participant score', {
        poolId: pool.id,
        participantId: participant.id,
        userId: participant.userId,
        error: error.message,
      });
    }
  }
}

function toSafePool(pool, { viewerUserId = null, exposeInviteCodeToCreator = false } = {}) {
  const canSeeInviteCode = exposeInviteCodeToCreator && viewerUserId && pool.createdById === viewerUserId;
  const isJoined = Boolean(viewerUserId) && Array.isArray(pool.participants)
    ? pool.participants.some((participant) => participant.userId === viewerUserId)
    : false;

  return {
    id: pool.id,
    name: pool.name,
    description: pool.description,
    gameweek: pool.gameweek,
    entryFee: pool.entryFee,
    maxParticipants: pool.maxParticipants,
    visibility: pool.visibility,
    inviteCode: canSeeInviteCode ? pool.inviteCode : null,
    status: pool.status,
    createdAt: pool.createdAt,
    updatedAt: pool.updatedAt,
    createdBy: pool.createdBy
      ? {
          id: pool.createdBy.id,
          firstName: pool.createdBy.firstName,
          lastName: pool.createdBy.lastName,
        }
      : null,
    participantCount: pool._count?.participants ?? undefined,
    isJoined,
  };
}

async function findPoolOrThrow(poolId) {
  const pool = await prisma.pool.findUnique({
    where: { id: poolId },
    include: {
      createdBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  if (!pool) {
    throw makeError(404, 'Pool not found');
  }

  return pool;
}

async function assertPoolAccess(pool, userId) {
  if (pool.visibility !== 'PRIVATE') {
    return;
  }

  if (!userId) {
    throw makeError(404, 'Pool not found');
  }

  if (pool.createdById === userId) {
    return;
  }

  const participant = await prisma.poolParticipant.findUnique({
    where: {
      poolId_userId: {
        poolId: pool.id,
        userId,
      },
    },
    select: { id: true },
  });

  if (!participant) {
    throw makeError(404, 'Pool not found');
  }
}

async function createPool(input, userId) {
  await assertGameweekOpen(input.gameweek, 'create or join pools for this gameweek');

  // Check if user has FPL team connected
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { fplTeamId: true },
  });

  if (!user?.fplTeamId) {
    throw makeError(403, 'You must connect your Fantasy Premier League team before creating pools. Please set up your FPL team in your profile.');
  }

  const existingPool = await prisma.pool.findUnique({
    where: {
      createdById_gameweek: {
        createdById: userId,
        gameweek: input.gameweek,
      },
    },
  });

  if (existingPool) {
    throw makeError(409, 'You already created a pool for this gameweek');
  }

  try {
    for (let attempt = 0; attempt < MAX_INVITE_CODE_RETRIES; attempt += 1) {
      const inviteCode = randomInviteCode();

      try {
        const pool = await prisma.$transaction(async (tx) => {
          const createdPool = await tx.pool.create({
            data: {
              name: input.name,
              description: input.description || null,
              gameweek: input.gameweek,
              entryFee: input.entryFee,
              maxParticipants: input.maxParticipants ?? null,
              visibility: input.visibility,
              inviteCode,
              createdById: userId,
            },
          });

          await tx.poolParticipant.create({
            data: {
              poolId: createdPool.id,
              userId,
            },
          });

          return tx.pool.findUnique({
            where: { id: createdPool.id },
            include: {
              createdBy: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
              _count: {
                select: {
                  participants: true,
                },
              },
            },
          });
        });

        if (!pool) {
          throw makeError(500, 'Failed to create pool');
        }

        return {
          pool: toSafePool(pool, {
            viewerUserId: userId,
            exposeInviteCodeToCreator: true,
          }),
        };
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
          continue;
        }
        throw error;
      }
    }

    throw makeError(500, 'Could not generate unique invite code');
  } catch (error) {
    throw error;
  }
}

async function listPools({ filter, gameweek, minEntryFee, maxEntryFee, sortBy, page, limit }, userId = null) {
  if (filter === 'joined_by_me' && !userId) {
    return {
      pools: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0,
      },
    };
  }

  const where = {
    status: 'OPEN',
  };

  if (typeof gameweek === 'number') {
    where.gameweek = gameweek;
  }

  if (filter === 'free_entry') {
    where.entryFee = 0;
  } else if (filter === 'my_gameweek') {
    const currentGameweek = await getCurrentGameweek();
    if (!currentGameweek) {
      throw makeError(500, 'Unable to determine current gameweek');
    }
    where.gameweek = Number(currentGameweek);
  } else if (filter === 'joined_by_me') {
    where.participants = {
      some: { userId },
    };
  }

  if (filter !== 'free_entry' && (minEntryFee !== undefined || maxEntryFee !== undefined)) {
    where.entryFee = {
      ...(minEntryFee !== undefined ? { gte: minEntryFee } : {}),
      ...(maxEntryFee !== undefined ? { lte: maxEntryFee } : {}),
    };
  }

  if (filter !== 'joined_by_me' && userId) {
    where.OR = [
      { visibility: 'PUBLIC' },
      {
        participants: {
          some: { userId },
        },
      },
    ];
  } else if (filter !== 'joined_by_me') {
    where.visibility = 'PUBLIC';
  }

  const skip = (page - 1) * limit;
  const isOpenSpotsFilter = filter === 'open_spots';
  const orderBy = (() => {
    if (sortBy === 'entry_fee_asc') return [{ entryFee: 'asc' }, { createdAt: 'desc' }];
    if (sortBy === 'entry_fee_desc') return [{ entryFee: 'desc' }, { createdAt: 'desc' }];
    if (sortBy === 'gameweek_asc') return [{ gameweek: 'asc' }, { createdAt: 'desc' }];
    return [{ createdAt: 'desc' }];
  })();

  let pools;
  let total;

  if (isOpenSpotsFilter) {
    const allPools = await prisma.pool.findMany({
      where,
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            participants: true,
          },
        },
      },
      orderBy,
    });

    const openSpotsPools = allPools.filter((pool) => (
      pool.maxParticipants === null
        ? true
        : Number(pool._count?.participants || 0) < Number(pool.maxParticipants)
    ));

    if (sortBy === 'participants_desc') {
      openSpotsPools.sort((a, b) => Number(b._count?.participants || 0) - Number(a._count?.participants || 0));
    }

    total = openSpotsPools.length;
    pools = openSpotsPools.slice(skip, skip + limit);
  } else {
    [pools, total] = await Promise.all([
    prisma.pool.findMany({
      where,
      include: {
        participants: userId
          ? {
              where: { userId },
              select: { userId: true },
            }
          : false,
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            },
          },
          _count: {
            select: {
              participants: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.pool.count({ where }),
    ]);

    if (sortBy === 'participants_desc') {
      pools.sort((a, b) => Number(b._count?.participants || 0) - Number(a._count?.participants || 0));
    }
  }

  return {
    pools: pools.map((pool) => toSafePool(pool, { viewerUserId: userId })),
    pagination: {
      page,
      limit,
      total,
      totalPages: total === 0 ? 0 : Math.ceil(total / limit),
    },
  };
}

async function getPoolById(poolId, userId) {
  const pool = await prisma.pool.findUnique({
    where: { id: poolId },
    include: {
      createdBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      _count: {
        select: {
          participants: true,
        },
      },
    },
  });

  if (!pool) {
    throw makeError(404, 'Pool not found');
  }

  await assertPoolAccess(pool, userId);

  return {
    pool: toSafePool(pool, {
      viewerUserId: userId,
      exposeInviteCodeToCreator: true,
    }),
  };
}

async function getPoolLeaderboard(poolId, userId, { page, limit }) {
  const cacheKey = `pool:leaderboard:${poolId}:${userId || 'anon'}:${page}:${limit}`;
  return getOrSet(cacheKey, 30 * 1000, async () => {
    const pool = await findPoolOrThrow(poolId);
    await assertPoolAccess(pool, userId);
    await refreshPoolParticipantScores(pool);
    const scoringGameweek = Number(pool.gameweek);

    const skip = (page - 1) * limit;

    const [participants, total] = await Promise.all([
      prisma.poolParticipant.findMany({
        where: { poolId },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              fplManagerName: true,
              fplTeamName: true,
              fplTeamId: true,
            },
          },
        },
        orderBy: [
          { points: 'desc' },
          { gameweekPoints: 'desc' },
          { joinedAt: 'asc' },
        ],
        skip,
        take: limit,
      }),
      prisma.poolParticipant.count({
        where: { poolId },
      }),
    ]);

    const enrichedEntries = await Promise.all(participants.map(async (participant) => {
    let gameweekPoints = Number(participant.gameweekPoints || 0);
    let totalPoints = Number(participant.points || 0);

    const fplTeamId = participant.user?.fplTeamId;
    if (fplTeamId && scoringGameweek) {
      try {
        const officialPoints = await getTeamOfficialPoints(fplTeamId, scoringGameweek);
        gameweekPoints = Number(officialPoints.gameweekPoints || 0);
        totalPoints = Number(officialPoints.totalPoints || 0);
      } catch (error) {
        console.warn('[pool-leaderboard] failed to fetch official FPL points', {
          poolId,
          participantId: participant.id,
          userId: participant.userId,
          fplTeamId,
          error: error.message,
        });
      }
    }

    return {
      points: totalPoints,
      totalPoints,
      gameweekPoints,
      isCurrentUser: participant.userId === userId,
      user: {
        id: participant.user.id,
        firstName: participant.user.firstName,
        lastName: participant.user.lastName,
        fplTeamId: participant.user.fplTeamId,
        fplManagerName: participant.user.fplManagerName,
        fplTeamName: participant.user.fplTeamName,
      },
    };
    }));

  enrichedEntries.sort((a, b) => {
    if (b.gameweekPoints !== a.gameweekPoints) {
      return b.gameweekPoints - a.gameweekPoints;
    }
    if (b.totalPoints !== a.totalPoints) {
      return b.totalPoints - a.totalPoints;
    }
    return String(a.user?.fplManagerName || '').localeCompare(String(b.user?.fplManagerName || ''));
  });

    const leaderboard = enrichedEntries.map((entry, index) => ({
      ...entry,
      rank: skip + index + 1,
    }));

    return {
      poolId: pool.id,
      currentGameweek: scoringGameweek,
      leaderboard,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  });
}

async function joinPool(poolId, userId, { inviteCode }) {
  // Check if user has FPL team connected
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { fplTeamId: true },
  });

  if (!user?.fplTeamId) {
    throw makeError(403, 'You must connect your Fantasy Premier League team before joining pools. Please set up your FPL team in your profile.');
  }

  const pool = await findPoolOrThrow(poolId);
  await assertGameweekOpen(pool.gameweek, 'create or join pools for this gameweek');

  if (pool.status !== 'OPEN') {
    throw makeError(409, 'Pool is not open for new participants');
  }

  const existingParticipant = await prisma.poolParticipant.findUnique({
    where: {
      poolId_userId: {
        poolId,
        userId,
      },
    },
  });

  if (existingParticipant) {
    return {
      joined: false,
      message: 'You already joined this pool',
      poolId: pool.id,
    };
  }

  if (pool.visibility === 'PRIVATE') {
    const normalizedInputCode = normalizeInviteCode(inviteCode);
    const normalizedPoolCode = normalizeInviteCode(pool.inviteCode);

    if (!normalizedInputCode || normalizedInputCode !== normalizedPoolCode) {
      throw makeError(403, 'Invalid invite code');
    }
  }

  let participant;
  try {
    participant = await prisma.$transaction(async (tx) => {
      // Lock the pool row so concurrent joins for the same pool serialize capacity checks.
      const lockedPoolRows = await tx.$queryRaw`
        SELECT id, status, max_participants
        FROM pools
        WHERE id = ${poolId}
        FOR UPDATE
      `;

      const lockedPool = lockedPoolRows?.[0];

      if (!lockedPool) {
        throw makeError(404, 'Pool not found');
      }

      if (lockedPool.status !== 'OPEN') {
        throw makeError(409, 'Pool is not open for new participants');
      }

      const lockedMaxParticipants = lockedPool.max_participants === null
        ? null
        : Number(lockedPool.max_participants);

      if (lockedMaxParticipants !== null) {
        const totalParticipants = await tx.poolParticipant.count({
          where: { poolId },
        });

        if (totalParticipants >= lockedMaxParticipants) {
          throw makeError(409, 'Pool has reached maximum participants');
        }
      }

      // TODO(wallet): for paid pools, enforce balance checks and atomic wallet debit before join.
      return tx.poolParticipant.create({
        data: {
          poolId,
          userId,
        },
      });
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return {
        joined: false,
        message: 'You already joined this pool',
        poolId: pool.id,
      };
    }
    throw error;
  }

  return {
    joined: true,
    message: 'Successfully joined pool',
    poolId: pool.id,
    participant: {
      id: participant.id,
      poolId: participant.poolId,
      userId: participant.userId,
      points: participant.points,
      gameweekPoints: participant.gameweekPoints,
      joinedAt: participant.joinedAt,
    },
  };
}

async function joinPoolByCode(userId, { inviteCode }) {
  const normalizedCode = normalizeInviteCode(inviteCode);
  const pool = await prisma.pool.findFirst({
    where: {
      inviteCode: normalizedCode,
    },
    select: { id: true },
  });

  if (!pool) {
    throw makeError(404, 'Pool not found for this invite code');
  }

  // TODO(wallet): by-code joins should share the same wallet debit flow once wallet is implemented.
  return joinPool(pool.id, userId, { inviteCode: normalizedCode });
}

module.exports = {
  createPool,
  listPools,
  getPoolById,
  getPoolLeaderboard,
  joinPool,
  joinPoolByCode,
};
