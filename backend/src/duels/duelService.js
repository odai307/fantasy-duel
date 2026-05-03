const { Prisma } = require('@prisma/client');

const prisma = require('../shared/config/db');
const { makeError } = require('../shared/errors');

const INVITE_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const INVITE_CODE_LENGTH = 6;
const MAX_INVITE_CODE_RETRIES = 6;

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

function toSafeDuel(duel, viewerUserId = null) {
  const isCreator = viewerUserId && duel.createdById === viewerUserId;
  const isOpponent = viewerUserId && duel.opponentId === viewerUserId;

  return {
    id: duel.id,
    inviteCode: isCreator ? duel.inviteCode : null,
    status: duel.status,
    gameweek: duel.gameweek,
    entryFee: duel.entryFee,
    createdAt: duel.createdAt,
    updatedAt: duel.updatedAt,
    lockedAt: duel.lockedAt,
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
  const preferredCode = normalizeInviteCode(input.inviteCode);

  for (let attempt = 0; attempt < MAX_INVITE_CODE_RETRIES; attempt += 1) {
    const inviteCode = preferredCode || randomInviteCode();

    try {
      const duel = await prisma.duel.create({
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

      return { duel: toSafeDuel(duel, userId) };
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
}

async function joinDuelByCode(userId, { inviteCode }) {
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

  const now = new Date();
  const updated = await prisma.$transaction(async (tx) => {
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

  // TODO(wallet): enforce atomic wallet debit for paid duel entries before finalizing the join.
  return {
    joined: true,
    message: 'Successfully joined duel',
    duel: toSafeDuel(updated, userId),
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

module.exports = {
  createDuel,
  joinDuelByCode,
  getDuelById,
  listDuels,
};
