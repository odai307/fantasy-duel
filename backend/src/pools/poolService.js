const { Prisma } = require('@prisma/client');

const prisma = require('../shared/config/db');
const { makeError } = require('../shared/errors');

const HIGH_STAKES_MIN_ENTRY_FEE = 100;
const INVITE_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const INVITE_CODE_LENGTH = 6;
const MAX_INVITE_CODE_RETRIES = 5;

function normalizeInviteCode(inviteCode) {
  if (!inviteCode) return null;
  return inviteCode.trim().replace(/\s+/g, '').toUpperCase();
}

function randomInviteCode(length = INVITE_CODE_LENGTH) {
  let code = '';
  for (let i = 0; i < length; i += 1) {
    const index = Math.floor(Math.random() * INVITE_CODE_ALPHABET.length);
    code += INVITE_CODE_ALPHABET[index];
  }
  return code;
}

function toSafePool(pool, { viewerUserId = null, exposeInviteCodeToCreator = false } = {}) {
  const canSeeInviteCode = exposeInviteCodeToCreator && viewerUserId && pool.createdById === viewerUserId;

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

  const preferredCode = normalizeInviteCode(input.inviteCode);

  try {
    for (let attempt = 0; attempt < MAX_INVITE_CODE_RETRIES; attempt += 1) {
      const inviteCode = preferredCode || randomInviteCode();

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
          if (preferredCode) {
            throw makeError(409, 'Invite code already exists');
          }
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

async function listPools({ filter, gameweek, page, limit }, userId = null) {
  const where = {
    status: 'OPEN',
  };

  if (typeof gameweek === 'number') {
    where.gameweek = gameweek;
  }

  if (filter === 'free_entry') {
    where.entryFee = 0;
  } else if (filter === 'high_stakes') {
    where.entryFee = { gte: HIGH_STAKES_MIN_ENTRY_FEE };
  }

  if (userId) {
    where.OR = [
      { visibility: 'PUBLIC' },
      {
        participants: {
          some: { userId },
        },
      },
    ];
  } else {
    where.visibility = 'PUBLIC';
  }

  const skip = (page - 1) * limit;

  const [pools, total] = await Promise.all([
    prisma.pool.findMany({
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
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.pool.count({ where }),
  ]);

  return {
    pools: pools.map(toSafePool),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
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
  const pool = await findPoolOrThrow(poolId);
  await assertPoolAccess(pool, userId);

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

  const leaderboard = participants.map((participant, index) => ({
    rank: skip + index + 1,
    points: participant.points,
    gameweekPoints: participant.gameweekPoints,
    isCurrentUser: participant.userId === userId,
    user: {
      id: participant.user.id,
      firstName: participant.user.firstName,
      lastName: participant.user.lastName,
    },
  }));

  return {
    poolId: pool.id,
    leaderboard,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

async function joinPool(poolId, userId, { inviteCode }) {
  const pool = await findPoolOrThrow(poolId);

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
