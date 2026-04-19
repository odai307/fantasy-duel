const { Prisma } = require('@prisma/client');

const prisma = require('../shared/config/db');

const HIGH_STAKES_MIN_ENTRY_FEE = 100;

function makeError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function normalizeInviteCode(inviteCode) {
  if (!inviteCode) return null;
  return inviteCode.trim().replace(/\s+/g, '').toUpperCase();
}

function toSafePool(pool) {
  return {
    id: pool.id,
    name: pool.name,
    description: pool.description,
    gameweek: pool.gameweek,
    entryFee: pool.entryFee,
    maxParticipants: pool.maxParticipants,
    visibility: pool.visibility,
    inviteCode: pool.visibility === 'PRIVATE' ? pool.inviteCode : null,
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
  };
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

  try {
    const pool = await prisma.pool.create({
      data: {
        name: input.name,
        description: input.description || null,
        gameweek: input.gameweek,
        entryFee: input.entryFee,
        maxParticipants: input.maxParticipants ?? null,
        visibility: input.visibility,
        inviteCode: input.visibility === 'PRIVATE' ? normalizeInviteCode(input.inviteCode) : null,
        createdById: userId,
      },
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

    return { pool: toSafePool(pool) };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw makeError(409, 'Invite code already exists');
    }

    throw error;
  }
}

async function listPools({ filter, gameweek, page, limit }) {
  const where = {
    visibility: 'PUBLIC',
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

async function getPoolById(poolId) {
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

  if (!pool || pool.visibility !== 'PUBLIC') {
    throw makeError(404, 'Pool not found');
  }

  return { pool: toSafePool(pool) };
}

module.exports = {
  createPool,
  listPools,
  getPoolById,
};
