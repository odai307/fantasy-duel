const { Prisma } = require('@prisma/client');

const prisma = require('../shared/config/db');
const { makeError } = require('../shared/errors');
const { normalizeInviteCode, randomInviteCode, MAX_INVITE_CODE_RETRIES } = require('../shared/inviteCodeUtils');
const { assertGameweekOpen, getGameweekDeadline, getTeamOfficialPoints } = require('../fpl/fplService');
const { requireAuthenticatedUser } = require('../shared/authHelper');
const {
  validateCreateDuelInput,
  validateJoinByCodeInput,
  validateDuelIdParams,
  validateListDuelsQuery,
} = require('./duelValidation');

// ============================================================================
// HELPER UTILITIES
// ============================================================================

/**
 * Determine the outcome of a duel based on the participants' final Gameweek scores.
 *
 * @param {number} creatorScore - Score of the duel creator
 * @param {number} opponentScore - Score of the opponent
 * @returns {'CREATOR_WIN' | 'OPPONENT_WIN' | 'DRAW'} Result status
 */
function determineDuelWinner(creatorScore, opponentScore) {
  if (creatorScore > opponentScore) return 'CREATOR_WIN';
  if (opponentScore > creatorScore) return 'OPPONENT_WIN';
  return 'DRAW';
}

/**
 * Format and sanitize a Duel entity for client responses.
 * - Protects private details (e.g., only the creator sees the invite code).
 * - Attaches convenient participant role flags (`isCreator`, `isOpponent`).
 *
 * @param {object} duel - The raw duel database record with relations
 * @param {string|null} viewerUserId - The authenticated user's ID
 * @returns {object} Sanitized duel response payload
 */
function formatDuelResponse(duel, viewerUserId = null) {
  const isCreator = viewerUserId && duel.createdById === viewerUserId;
  const isOpponent = viewerUserId && duel.opponentId === viewerUserId;

  return {
    id: duel.id,
    inviteCode: isCreator ? duel.inviteCode : null,
    status: duel.status,
    result: duel.result,
    gameweek: duel.gameweek,
    entryFee: duel.entryFee,
    createdAt: duel.createdAt,
    updatedAt: duel.updatedAt,
    lockedAt: duel.lockedAt,
    closedAt: duel.closedAt,
    cancelledAt: duel.cancelledAt,
    createdByScore: duel.createdByScore,
    opponentScore: duel.opponentScore,
    createdBy: duel.createdBy
      ? {
          id: duel.createdBy.id,
          firstName: duel.createdBy.firstName,
          lastName: duel.createdBy.lastName,
        }
      : null,
    opponent: duel.opponent
      ? {
          id: duel.opponent.id,
          firstName: duel.opponent.firstName,
          lastName: duel.opponent.lastName,
        }
      : null,
    isCreator: Boolean(isCreator),
    isOpponent: Boolean(isOpponent),
  };
}

/**
 * Query a duel by its ID including creator and opponent relations, or throw a 404 error.
 *
 * @param {string} duelId - Duel UUID
 * @returns {Promise<object>} Duel database record
 */
async function getDuelOrThrow(duelId) {
  const duel = await prisma.duel.findUnique({
    where: { id: duelId },
    include: {
      createdBy: { select: { id: true, firstName: true, lastName: true } },
      opponent: { select: { id: true, firstName: true, lastName: true } },
    },
  });

  if (!duel) {
    throw makeError(404, 'Duel not found');
  }

  return duel;
}

/**
 * Ensure that the requesting user is an authorized participant (creator or opponent) of the duel.
 *
 * @param {object} duel - The duel record
 * @param {string} userId - The requesting user's ID
 */
function validateDuelAccess(duel, userId) {
  if (!userId) {
    throw makeError(401, 'Unauthorized');
  }

  if (duel.createdById !== userId && duel.opponentId !== userId) {
    throw makeError(404, 'Duel not found');
  }
}

// ============================================================================
// CONTROLLER HANDLERS
// ============================================================================

/**
 * POST /api/duels
 * Create a new 1v1 duel.
 *
 * Requirements:
 * 1. Target Gameweek must be currently open.
 * 2. Creator must have a connected FPL team.
 * 3. Creator must have sufficient wallet balance if an entry fee is specified.
 *
 * Actions:
 * - Atomically deducts entry fee from wallet balance.
 * - Logs an ENTRY_FEE transaction.
 * - Generates a collision-resistant 6-character invite code.
 * - Creates the duel in 'OPEN' status.
 */
async function createDuel(req, res, next) {
  try {
    const userId = requireAuthenticatedUser(req);
    const input = validateCreateDuelInput(req.body);

    // 1. Verify that the requested Gameweek has not passed its deadline
    await assertGameweekOpen(input.gameweek, 'create duels for this gameweek');

    // 2. Fetch creator's profile details (FPL team link & wallet balance)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { fplTeamId: true, walletBalance: true },
    });

    if (!user?.fplTeamId) {
      throw makeError(
        403,
        'You must connect your Fantasy Premier League team before creating duels. Please set up your FPL team in your profile.'
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

    // 3. Atomically deduct fee & create duel with retry on invite code collision
    for (let attempt = 0; attempt < MAX_INVITE_CODE_RETRIES; attempt += 1) {
      const inviteCode = randomInviteCode();

      try {
        const createdDuel = await prisma.$transaction(async (tx) => {
          // Deduct entry fee and create an audit transaction if fee > 0
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
                reference: `fd_fee_duel_create_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
                description: `Duel Entry Fee (GW ${input.gameweek})`,
              },
            });
          }

          // Persist the open duel record
          return tx.duel.create({
            data: {
              gameweek: input.gameweek,
              entryFee: input.entryFee,
              inviteCode,
              createdById: userId,
              status: 'OPEN',
            },
            include: {
              createdBy: { select: { id: true, firstName: true, lastName: true } },
              opponent: { select: { id: true, firstName: true, lastName: true } },
            },
          });
        });

        return res.status(201).json({ duel: formatDuelResponse(createdDuel, userId) });
      } catch (error) {
        // Prisma unique constraint violation (P2002) on inviteCode -> retry
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
 * POST /api/duels/join-by-code
 * Join an existing open duel using its 6-character invite code.
 *
 * Requirements:
 * 1. Target Gameweek must be currently open.
 * 2. Opponent must have a connected FPL team.
 * 3. Opponent cannot join their own duel.
 * 4. Opponent must have sufficient wallet balance for the entry fee.
 * 5. Duel must be in 'OPEN' status with no existing opponent.
 *
 * Actions:
 * - Atomically deducts entry fee from opponent wallet balance.
 * - Concurrency guard: Locks duel using an atomic conditional update to prevent race conditions.
 * - Changes duel status to 'LOCKED'.
 */
async function joinDuelByCode(req, res, next) {
  try {
    const userId = requireAuthenticatedUser(req);
    const input = validateJoinByCodeInput(req.body);

    // 1. Verify user has a connected FPL team
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { fplTeamId: true, walletBalance: true },
    });

    if (!user?.fplTeamId) {
      throw makeError(
        403,
        'You must connect your Fantasy Premier League team before joining duels. Please set up your FPL team in your profile.'
      );
    }

    const normalizedCode = normalizeInviteCode(input.inviteCode);
    if (!normalizedCode) {
      throw makeError(400, 'Invite code is required');
    }

    // 2. Fetch duel by invite code
    const duel = await prisma.duel.findUnique({
      where: { inviteCode: normalizedCode },
      include: {
        createdBy: { select: { id: true, firstName: true, lastName: true } },
        opponent: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    if (!duel) {
      throw makeError(404, 'Duel not found for this code');
    }

    // 3. Validation guards
    await assertGameweekOpen(duel.gameweek, 'join duels for this gameweek');

    if (duel.createdById === userId) {
      throw makeError(409, 'You cannot join your own duel as opponent');
    }

    if (duel.opponentId === userId) {
      return res.status(200).json({
        joined: false,
        message: 'You already joined this duel',
        duel: formatDuelResponse(duel, userId),
      });
    }

    if (duel.status !== 'OPEN') {
      throw makeError(409, 'Duel is not open for joining');
    }

    if (duel.opponentId) {
      throw makeError(409, 'Duel already has an opponent');
    }

    const fee = Number(duel.entryFee || 0);
    const currentBalance = Number(user.walletBalance || 0);
    if (fee > 0 && currentBalance < fee) {
      throw makeError(
        400,
        `Insufficient wallet balance. You have GHS ${currentBalance.toFixed(2)} available, but entry fee is GHS ${fee.toFixed(2)}. Please deposit funds to continue.`
      );
    }

    // 4. Atomically deduct fee & lock duel with optimistic concurrency guard
    const lockTimestamp = new Date();
    const lockedDuel = await prisma.$transaction(async (tx) => {
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
            reference: `fd_fee_duel_join_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            description: `Duel Entry Fee (GW ${duel.gameweek})`,
          },
        });
      }

      // Atomic update condition ensures duel hasn't been claimed simultaneously by another user
      const updateResult = await tx.duel.updateMany({
        where: {
          id: duel.id,
          status: 'OPEN',
          opponentId: null,
        },
        data: {
          opponentId: userId,
          status: 'LOCKED',
          lockedAt: lockTimestamp,
        },
      });

      if (updateResult.count !== 1) {
        throw makeError(409, 'Duel was just taken by another user');
      }

      return tx.duel.findUnique({
        where: { id: duel.id },
        include: {
          createdBy: { select: { id: true, firstName: true, lastName: true } },
          opponent: { select: { id: true, firstName: true, lastName: true } },
        },
      });
    });

    if (!lockedDuel) {
      throw makeError(500, 'Failed to finalize duel join');
    }

    return res.status(200).json({
      joined: true,
      message: 'Successfully joined duel',
      duel: formatDuelResponse(lockedDuel, userId),
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * POST /api/duels/:id/settle
 * Conclude and settle a locked duel after the Gameweek deadline has passed.
 *
 * Requirements:
 * 1. Duel must be in 'LOCKED' status with an opponent.
 * 2. Gameweek deadline must be in the past.
 * 3. Both managers must have linked FPL teams.
 *
 * Actions:
 * - Fetches official FPL points for both teams.
 * - Computes winner/draw result (`determineDuelWinner`).
 * - Updates status to 'CLOSED' with recorded final scores.
 */
async function settleDuel(req, res, next) {
  try {
    const userId = requireAuthenticatedUser(req);
    const { id } = validateDuelIdParams(req.params);

    const duel = await getDuelOrThrow(id);
    validateDuelAccess(duel, userId);

    if (duel.status === 'CANCELLED') {
      throw makeError(409, 'Cancelled duel cannot be settled');
    }

    if (duel.status === 'CLOSED') {
      return res.status(200).json({
        settled: false,
        message: 'Duel already settled',
        duel: formatDuelResponse(duel, userId),
      });
    }

    if (duel.status !== 'LOCKED' || !duel.opponentId) {
      throw makeError(409, 'Duel must be locked with an opponent before settlement');
    }

    // 1. Verify that the Gameweek deadline has passed
    const deadline = await getGameweekDeadline(duel.gameweek);
    if (new Date() < deadline) {
      throw makeError(
        409,
        `Gameweek ${duel.gameweek} is still open. Duel can be settled after deadline (${deadline.toISOString()}).`,
        'GAMEWEEK_STILL_OPEN'
      );
    }

    // 2. Fetch linked FPL team IDs for both managers
    const [creator, opponent] = await Promise.all([
      prisma.user.findUnique({
        where: { id: duel.createdById },
        select: { fplTeamId: true },
      }),
      prisma.user.findUnique({
        where: { id: duel.opponentId },
        select: { fplTeamId: true },
      }),
    ]);

    if (!creator?.fplTeamId || !opponent?.fplTeamId) {
      throw makeError(409, 'Both duel participants must have linked FPL teams to settle this duel');
    }

    // 3. Fetch official Gameweek scores from official FPL API
    const [creatorPoints, opponentPoints] = await Promise.all([
      getTeamOfficialPoints(creator.fplTeamId, duel.gameweek),
      getTeamOfficialPoints(opponent.fplTeamId, duel.gameweek),
    ]);

    const createdByScore = Number(creatorPoints?.gameweekPoints || 0);
    const opponentScore = Number(opponentPoints?.gameweekPoints || 0);
    const duelResult = determineDuelWinner(createdByScore, opponentScore);

    // 4. Update duel to CLOSED with final scores and outcome
    const settledDuel = await prisma.duel.update({
      where: { id: duel.id },
      data: {
        status: 'CLOSED',
        result: duelResult,
        createdByScore,
        opponentScore,
        closedAt: new Date(),
      },
      include: {
        createdBy: { select: { id: true, firstName: true, lastName: true } },
        opponent: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    return res.status(200).json({
      settled: true,
      message: 'Duel settled successfully',
      duel: formatDuelResponse(settledDuel, userId),
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * POST /api/duels/:id/cancel
 * Cancel an open duel created by the user before an opponent joins.
 *
 * Requirements:
 * 1. Requester must be the creator.
 * 2. Duel must be in 'OPEN' status with no opponent.
 *
 * Actions:
 * - Atomically refunds 100% of the entry fee back to the creator's wallet.
 * - Logs a PRIZE_PAYOUT / refund transaction.
 * - Sets status to 'CANCELLED'.
 */
async function cancelDuel(req, res, next) {
  try {
    const userId = requireAuthenticatedUser(req);
    const { id } = validateDuelIdParams(req.params);

    const duel = await getDuelOrThrow(id);

    if (duel.createdById !== userId) {
      throw makeError(403, 'Only the creator can cancel this duel');
    }

    if (duel.status !== 'OPEN' || duel.opponentId) {
      throw makeError(409, 'Only open duels without an opponent can be cancelled');
    }

    const fee = Number(duel.entryFee || 0);

    // Atomically refund the entry fee and update status to CANCELLED
    const cancelledDuel = await prisma.$transaction(async (tx) => {
      if (fee > 0) {
        await tx.user.update({
          where: { id: userId },
          data: { walletBalance: { increment: fee } },
        });

        await tx.transaction.create({
          data: {
            userId,
            amount: fee,
            type: 'PRIZE_PAYOUT',
            status: 'SUCCESS',
            reference: `fd_refund_duel_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            description: `Refund: Cancelled Duel (GW ${duel.gameweek})`,
          },
        });
      }

      return tx.duel.update({
        where: { id: duel.id },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date(),
        },
        include: {
          createdBy: { select: { id: true, firstName: true, lastName: true } },
          opponent: { select: { id: true, firstName: true, lastName: true } },
        },
      });
    });

    return res.status(200).json({
      cancelled: true,
      message:
        fee > 0
          ? `Duel cancelled. GHS ${fee.toFixed(2)} entry fee refunded to your wallet!`
          : 'Duel cancelled successfully.',
      duel: formatDuelResponse(cancelledDuel, userId),
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * GET /api/duels/:id
 * Retrieve details for a specific duel.
 * Access is restricted to participants (creator or opponent).
 */
async function getDuelById(req, res, next) {
  try {
    const userId = requireAuthenticatedUser(req);
    const { id } = validateDuelIdParams(req.params);

    const duel = await getDuelOrThrow(id);
    validateDuelAccess(duel, userId);

    return res.status(200).json({ duel: formatDuelResponse(duel, userId) });
  } catch (error) {
    return next(error);
  }
}

/**
 * GET /api/duels
 * List all duels in which the authenticated user participates.
 * Supports status filtering ('all', 'open', 'locked', 'closed', 'cancelled') and pagination.
 */
async function listDuels(req, res, next) {
  try {
    const userId = requireAuthenticatedUser(req);
    const query = validateListDuelsQuery(req.query);

    const where = {
      OR: [{ createdById: userId }, { opponentId: userId }],
    };

    if (query.status && query.status !== 'all') {
      where.status = query.status.toUpperCase();
    }

    const skip = (query.page - 1) * query.limit;

    const [duels, total] = await Promise.all([
      prisma.duel.findMany({
        where,
        include: {
          createdBy: { select: { id: true, firstName: true, lastName: true } },
          opponent: { select: { id: true, firstName: true, lastName: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: query.limit,
      }),
      prisma.duel.count({ where }),
    ]);

    return res.status(200).json({
      duels: duels.map((duel) => formatDuelResponse(duel, userId)),
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createDuel,
  joinDuelByCode,
  settleDuel,
  cancelDuel,
  getDuelById,
  listDuels,
};
