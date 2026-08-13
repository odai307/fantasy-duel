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
  assertGameweekOpen,
} = require('../fpl/fplService');
const { buildScorePatch } = require('../fpl/scoreSyncUtils');
const { requireAuthenticatedUser } = require('../shared/authHelper');
const {
  validateCreatePoolInput,
  validateListPoolsQuery,
  validatePoolIdParams,
  validatePoolLeaderboardQuery,
  validateJoinPoolInput,
  validateJoinPoolByCodeInput,
} = require('./poolValidation');

// ============================================================================
// HELPER UTILITIES
// ============================================================================

/**
 * Synchronize live Gameweek scores from the official FPL API for all participants in a pool.
 * Uses a delta-patching approach to update points reliably without negative drifts.
 *
 * @param {object} pool - Pool database record with id and gameweek
 */
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

      // If pool GW differs from manager's current event, pull event-specific score
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
      // Best-effort refresh: log warning and continue without breaking the leaderboard
      console.warn('[pool-score-refresh] failed to refresh participant score', {
        poolId: pool.id,
        participantId: participant.id,
        userId: participant.userId,
        error: error.message,
      });
    }
  }
}

/**
 * Format and sanitize a Pool entity for client responses.
 * - Protects private pool invite codes unless the viewer is the creator.
 * - Computes `isJoined` boolean if the viewer is authenticated.
 *
 * @param {object} pool - Raw pool database record with relations
 * @param {object} options - Configuration options
 * @param {string|null} options.viewerUserId - Authenticated user's ID
 * @param {boolean} options.exposeInviteCodeToCreator - Whether to include inviteCode for the creator
 * @returns {object} Sanitized pool object
 */
function formatPoolResponse(pool, { viewerUserId = null, exposeInviteCodeToCreator = false } = {}) {
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

/**
 * Query a pool by ID with its creator details, or throw a 404 error.
 *
 * @param {string} poolId - Pool UUID
 * @returns {Promise<object>} Pool record
 */
async function getPoolOrThrow(poolId) {
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

/**
 * Validate that a user has permission to view a private pool.
 * Allows access if:
 * 1. Pool is PUBLIC.
 * 2. User is the creator of the pool.
 * 3. User is an active participant in the pool.
 *
 * @param {object} pool - Pool database record
 * @param {string|null} userId - The requesting user's ID
 */
async function validatePoolAccess(pool, userId) {
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

// ============================================================================
// CONTROLLER HANDLERS
// ============================================================================

/**
 * POST /api/pools
 * Create a new multi-manager pool (Public or Private).
 *
 * Requirements:
 * 1. Target Gameweek must be currently open.
 * 2. Creator must have a connected FPL team.
 * 3. Creator must have sufficient wallet balance for the entry fee.
 *
 * Actions:
 * - Atomically deducts entry fee from creator's wallet balance.
 * - Creates an ENTRY_FEE transaction.
 * - Creates the pool with a unique 6-character invite code.
 * - Automatically registers the creator as the first participant.
 */
async function createPool(req, res, next) {
  try {
    const userId = requireAuthenticatedUser(req);
    const input = validateCreatePoolInput(req.body);

    // 1. Verify that the requested Gameweek is open for pool creation
    await assertGameweekOpen(input.gameweek, 'create or join pools for this gameweek');

    // 2. Verify creator has connected FPL team and sufficient wallet balance
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { fplTeamId: true, walletBalance: true },
    });

    if (!user?.fplTeamId) {
      throw makeError(
        403,
        'You must connect your Fantasy Premier League team before creating pools. Please set up your FPL team in your profile.'
      );
    }

    const fee = Number(input.entryFee || 0);
    const currentBalance = Number(user.walletBalance || 0);
    if (fee > 0 && currentBalance < fee) {
      throw makeError(
        400,
        `Insufficient wallet balance. You have GHS ${currentBalance.toFixed(2)} available, but entry fee is GHS ${fee.toFixed(2)}. Please deposit funds to continue.`
      );
    }

    // 3. Atomically persist pool, deduct fee, and add creator as participant
    for (let attempt = 0; attempt < MAX_INVITE_CODE_RETRIES; attempt += 1) {
      const inviteCode = randomInviteCode();

      try {
        const pool = await prisma.$transaction(async (tx) => {
          if (fee > 0) {
            await tx.user.update({
              where: { id: userId },
              data: { walletBalance: { decrement: fee } },
            });

            await tx.transaction.create({
              data: {
                userId,
                amount: fee,
                type: 'ENTRY_FEE',
                status: 'SUCCESS',
                reference: `fd_fee_pool_create_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
                description: `Pool Entry Fee: ${input.name}`,
              },
            });
          }

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

          // Creator is automatically registered as participant #1
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

        return res.status(201).json({
          pool: formatPoolResponse(pool, {
            viewerUserId: userId,
            exposeInviteCodeToCreator: true,
          }),
        });
      } catch (error) {
        // Prisma unique constraint violation on inviteCode -> retry
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
          continue;
        }
        throw error;
      }
    }

    throw makeError(500, 'Could not generate unique invite code');
  } catch (error) {
    return next(error);
  }
}

/**
 * GET /api/pools
 * Browse and filter open pools with pagination and sorting.
 *
 * Query filters:
 * - filter: 'all', 'free_entry', 'my_gameweek', 'open_spots', 'joined_by_me'
 * - gameweek: filter by specific gameweek number
 * - minEntryFee / maxEntryFee: filter by fee range
 * - sortBy: 'newest', 'entry_fee_asc', 'entry_fee_desc', 'participants_desc', 'gameweek_asc'
 */
async function listPools(req, res, next) {
  try {
    const validatedQuery = validateListPoolsQuery(req.query);
    const userId = req.user?.sub || null;
    const { filter, gameweek, minEntryFee, maxEntryFee, sortBy, page, limit } = validatedQuery;

    if (filter === 'joined_by_me' && !userId) {
      return res.status(200).json({
        pools: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0,
        },
      });
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

    // Visibility filter: unauthenticated users only see PUBLIC; authenticated users see PUBLIC + private pools they joined
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

    return res.status(200).json({
      pools: pools.map((pool) => formatPoolResponse(pool, { viewerUserId: userId })),
      pagination: {
        page,
        limit,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * GET /api/pools/:id
 * Retrieve details for a specific pool.
 * Enforces privacy access control for PRIVATE pools.
 */
async function getPoolById(req, res, next) {
  try {
    const userId = req.user?.sub || null;
    const { id } = validatePoolIdParams(req.params);

    const pool = await prisma.pool.findUnique({
      where: { id },
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

    await validatePoolAccess(pool, userId);

    return res.status(200).json({
      pool: formatPoolResponse(pool, {
        viewerUserId: userId,
        exposeInviteCodeToCreator: true,
      }),
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * GET /api/pools/:id/leaderboard
 * Fetch the ranked leaderboard for a pool.
 * Dynamically syncs live official FPL Gameweek scores and caches results for 30s.
 */
async function getPoolLeaderboard(req, res, next) {
  try {
    const userId = req.user?.sub || null;
    const { id } = validatePoolIdParams(req.params);
    const query = validatePoolLeaderboardQuery(req.query);
    const { page, limit } = query;

    const cacheKey = `pool:leaderboard:${id}:${userId || 'anon'}:${page}:${limit}`;
    const result = await getOrSet(cacheKey, 30 * 1000, async () => {
      const pool = await getPoolOrThrow(id);
      await validatePoolAccess(pool, userId);
      await refreshPoolParticipantScores(pool);
      const scoringGameweek = Number(pool.gameweek);

      const skip = (page - 1) * limit;

      const [participants, total] = await Promise.all([
        prisma.poolParticipant.findMany({
          where: { poolId: id },
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
          where: { poolId: id },
        }),
      ]);

      const enrichedEntries = await Promise.all(
        participants.map(async (participant) => {
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
                poolId: id,
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
        })
      );

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

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

/**
 * POST /api/pools/:id/join
 * Join a pool by its ID (with optional invite code for private pools).
 *
 * Requirements:
 * 1. User must have linked FPL team.
 * 2. Gameweek must be open.
 * 3. Pool must be 'OPEN' and below maximum capacity.
 * 4. User cannot join twice.
 * 5. Private pools require valid matching inviteCode.
 * 6. User must have sufficient wallet balance for entry fee.
 *
 * Actions:
 * - Uses pessimistic row locking (`FOR UPDATE`) to prevent capacity race conditions.
 * - Atomically deducts entry fee and registers participant.
 */
async function joinPool(req, res, next) {
  try {
    const userId = requireAuthenticatedUser(req);
    const { id: poolId } = validatePoolIdParams(req.params);
    const input = validateJoinPoolInput(req.body);

    // 1. Verify user has linked FPL team
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { fplTeamId: true, walletBalance: true },
    });

    if (!user?.fplTeamId) {
      throw makeError(
        403,
        'You must connect your Fantasy Premier League team before joining pools. Please set up your FPL team in your profile.'
      );
    }

    const pool = await getPoolOrThrow(poolId);
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
      return res.status(200).json({
        joined: false,
        message: 'You already joined this pool',
        poolId: pool.id,
      });
    }

    // Private pool requires valid invite code
    if (pool.visibility === 'PRIVATE') {
      const normalizedInputCode = normalizeInviteCode(input.inviteCode);
      const normalizedPoolCode = normalizeInviteCode(pool.inviteCode);

      if (!normalizedInputCode || normalizedInputCode !== normalizedPoolCode) {
        throw makeError(403, 'Invalid invite code');
      }
    }

    const fee = Number(pool.entryFee || 0);
    const currentBalance = Number(user.walletBalance || 0);
    if (fee > 0 && currentBalance < fee) {
      throw makeError(
        400,
        `Insufficient wallet balance. You have GHS ${currentBalance.toFixed(2)} available, but entry fee is GHS ${fee.toFixed(2)}. Please deposit funds to continue.`
      );
    }

    // 2. Pessimistic lock row for capacity checks and atomically deduct fee
    let participant;
    try {
      participant = await prisma.$transaction(async (tx) => {
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

        if (fee > 0) {
          await tx.user.update({
            where: { id: userId },
            data: { walletBalance: { decrement: fee } },
          });

          await tx.transaction.create({
            data: {
              userId,
              amount: fee,
              type: 'ENTRY_FEE',
              status: 'SUCCESS',
              reference: `fd_fee_pool_join_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
              description: `Pool Entry Fee: ${pool.name}`,
            },
          });
        }

        return tx.poolParticipant.create({
          data: {
            poolId,
            userId,
          },
        });
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        return res.status(200).json({
          joined: false,
          message: 'You already joined this pool',
          poolId: pool.id,
        });
      }
      throw error;
    }

    return res.status(200).json({
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
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * POST /api/pools/join-by-code
 * Convenience route to join a pool directly by entering its invite code.
 */
async function joinPoolByCode(req, res, next) {
  try {
    const userId = requireAuthenticatedUser(req);
    const input = validateJoinPoolByCodeInput(req.body);

    const normalizedCode = normalizeInviteCode(input.inviteCode);
    const pool = await prisma.pool.findFirst({
      where: {
        inviteCode: normalizedCode,
      },
      select: { id: true },
    });

    if (!pool) {
      throw makeError(404, 'Pool not found for this invite code');
    }

    // Reuse the joinPool core logic with the resolved poolId
    req.params = { id: pool.id };
    req.body = { inviteCode: normalizedCode };
    return joinPool(req, res, next);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createPool,
  listPools,
  getPoolById,
  getPoolLeaderboard,
  joinPool,
  joinPoolByCode,
};
