const { Prisma } = require('@prisma/client');

const prisma = require('../shared/config/db');
const { makeError } = require('../shared/errors');
const { normalizeInviteCode, randomInviteCode, MAX_INVITE_CODE_RETRIES } = require('../shared/inviteCodeUtils');
const { assertGameweekOpen, getGameweekDeadline, getTeamOfficialPoints } = require('../fpl/fplService');

function toResultFromScores(createdByScore, opponentScore) {
  if (createdByScore > opponentScore) return 'CREATOR_WIN';
  if (opponentScore > createdByScore) return 'OPPONENT_WIN';
  return 'DRAW';
}

function toSafeDuel(duel, viewerUserId = null) {
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

async function findDuelByIdOrThrow(id) {
  const duel = await prisma.duel.findUnique({
    where: { id },
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

function assertDuelAccess(duel, userId) {
  if (!userId) {
    throw makeError(401, 'Unauthorized');
  }

  if (duel.createdById !== userId && duel.opponentId !== userId) {
    throw makeError(404, 'Duel not found');
  }
}

async function createDuel(input, userId) {
  await assertGameweekOpen(input.gameweek, 'create duels for this gameweek');

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { fplTeamId: true, walletBalance: true },
  });

  if (!user?.fplTeamId) {
    throw makeError(403, 'You must connect your Fantasy Premier League team before creating duels. Please set up your FPL team in your profile.');
  }

  const fee = Number(input.entryFee || 0);
  const currentBalance = Number(user.walletBalance || 0);
  if (fee > 0 && currentBalance < fee) {
    throw makeError(400, `Insufficient wallet balance. You have GHS ${currentBalance.toFixed(2)} available, but entry fee is GHS ${fee.toFixed(2)}. Please deposit funds to continue.`);
  }

  for (let attempt = 0; attempt < MAX_INVITE_CODE_RETRIES; attempt += 1) {
    const inviteCode = randomInviteCode();

    try {
      const duel = await prisma.$transaction(async (tx) => {
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
              reference: `fd_fee_duel_create_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
              description: `Duel Entry Fee (GW ${input.gameweek})`,
            },
          });
        }

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

      return { duel: toSafeDuel(duel, userId) };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        continue;
      }

      throw error;
    }
  }

  throw makeError(500, 'Could not generate unique invite code');
}

async function joinDuelByCode(userId, { inviteCode }) {
  // Check if user has FPL team connected
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { fplTeamId: true, walletBalance: true },
  });

  if (!user?.fplTeamId) {
    throw makeError(403, 'You must connect your Fantasy Premier League team before joining duels. Please set up your FPL team in your profile.');
  }

  const normalizedCode = normalizeInviteCode(inviteCode);

  if (!normalizedCode) {
    throw makeError(400, 'Invite code is required');
  }

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

  await assertGameweekOpen(duel.gameweek, 'join duels for this gameweek');

  if (duel.createdById === userId) {
    throw makeError(409, 'You cannot join your own duel as opponent');
  }

  if (duel.opponentId === userId) {
    return {
      joined: false,
      message: 'You already joined this duel',
      duel: toSafeDuel(duel, userId),
    };
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
    throw makeError(400, `Insufficient wallet balance. You have GHS ${currentBalance.toFixed(2)} available, but entry fee is GHS ${fee.toFixed(2)}. Please deposit funds to continue.`);
  }

  const now = new Date();
  const updated = await prisma.$transaction(async (tx) => {
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
          reference: `fd_fee_duel_join_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          description: `Duel Entry Fee (GW ${duel.gameweek})`,
        },
      });
    }

    const updateResult = await tx.duel.updateMany({
      where: {
        id: duel.id,
        status: 'OPEN',
        opponentId: null,
      },
      data: {
        opponentId: userId,
        status: 'LOCKED',
        lockedAt: now,
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

  if (!updated) {
    throw makeError(500, 'Failed to finalize duel join');
  }

  return {
    joined: true,
    message: 'Successfully joined duel',
    duel: toSafeDuel(updated, userId),
  };
}

async function settleDuel(id, userId) {
  const duel = await findDuelByIdOrThrow(id);
  assertDuelAccess(duel, userId);

  if (duel.status === 'CANCELLED') {
    throw makeError(409, 'Cancelled duel cannot be settled');
  }

  if (duel.status === 'CLOSED') {
    return {
      settled: false,
      message: 'Duel already settled',
      duel: toSafeDuel(duel, userId),
    };
  }

  if (duel.status !== 'LOCKED' || !duel.opponentId) {
    throw makeError(409, 'Duel must be locked with an opponent before settlement');
  }

  const deadline = await getGameweekDeadline(duel.gameweek);
  if (new Date() < deadline) {
    throw makeError(
      409,
      `Gameweek ${duel.gameweek} is still open. Duel can be settled after deadline (${deadline.toISOString()}).`,
      'GAMEWEEK_STILL_OPEN',
    );
  }

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

  const [creatorPoints, opponentPoints] = await Promise.all([
    getTeamOfficialPoints(creator.fplTeamId, duel.gameweek),
    getTeamOfficialPoints(opponent.fplTeamId, duel.gameweek),
  ]);

  const createdByScore = Number(creatorPoints?.gameweekPoints || 0);
  const opponentScore = Number(opponentPoints?.gameweekPoints || 0);
  const result = toResultFromScores(createdByScore, opponentScore);

  const closed = await prisma.duel.update({
    where: { id: duel.id },
    data: {
      status: 'CLOSED',
      result,
      createdByScore,
      opponentScore,
      closedAt: new Date(),
    },
    include: {
      createdBy: { select: { id: true, firstName: true, lastName: true } },
      opponent: { select: { id: true, firstName: true, lastName: true } },
    },
  });

  return {
    settled: true,
    message: 'Duel settled successfully',
    duel: toSafeDuel(closed, userId),
  };
}

async function getDuelById(id, userId) {
  const duel = await findDuelByIdOrThrow(id);
  assertDuelAccess(duel, userId);

  return {
    duel: toSafeDuel(duel, userId),
  };
}

async function listDuels(userId, { status, page, limit }) {
  const where = {
    OR: [{ createdById: userId }, { opponentId: userId }],
  };

  if (status && status !== 'all') {
    where.status = status.toUpperCase();
  }

  const skip = (page - 1) * limit;

  const [duels, total] = await Promise.all([
    prisma.duel.findMany({
      where,
      include: {
        createdBy: { select: { id: true, firstName: true, lastName: true } },
        opponent: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.duel.count({ where }),
  ]);

  return {
    duels: duels.map((duel) => toSafeDuel(duel, userId)),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

async function cancelDuel(id, userId) {
  const duel = await findDuelByIdOrThrow(id);

  if (duel.createdById !== userId) {
    throw makeError(403, 'Only the creator can cancel this duel');
  }

  if (duel.status !== 'OPEN' || duel.opponentId) {
    throw makeError(409, 'Only open duels without an opponent can be cancelled');
  }

  const fee = Number(duel.entryFee || 0);

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
          reference: `fd_refund_duel_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
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

  return {
    cancelled: true,
    message: fee > 0 ? `Duel cancelled. GHS ${fee.toFixed(2)} entry fee refunded to your wallet!` : 'Duel cancelled successfully.',
    duel: toSafeDuel(cancelledDuel, userId),
  };
}

module.exports = {
  createDuel,
  joinDuelByCode,
  settleDuel,
  cancelDuel,
  getDuelById,
  listDuels,
};
