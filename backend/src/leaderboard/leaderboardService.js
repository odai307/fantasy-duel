const prisma = require('../shared/config/db');

function rankingMode(period) {
  return period === 'this_week' ? 'this_week' : 'all_time';
}

function normalizeNumber(value) {
  return Number.isFinite(Number(value)) ? Number(value) : 0;
}

function compareByMode(mode) {
  if (mode === 'this_week') {
    return (a, b) => {
      if (b.gameweekPoints !== a.gameweekPoints) return b.gameweekPoints - a.gameweekPoints;
      if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
      if (b.duelsPlayed !== a.duelsPlayed) return b.duelsPlayed - a.duelsPlayed;
      return a.userFullName.localeCompare(b.userFullName);
    };
  }

  return (a, b) => {
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
    if (b.gameweekPoints !== a.gameweekPoints) return b.gameweekPoints - a.gameweekPoints;
    if (b.duelsPlayed !== a.duelsPlayed) return b.duelsPlayed - a.duelsPlayed;
    return a.userFullName.localeCompare(b.userFullName);
  };
}

async function listLeaderboard({ period, page, limit }) {
  const mode = rankingMode(period);

  const [users, poolStats, createdDuelsCount, opponentDuelsCount] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    }),
    prisma.poolParticipant.groupBy({
      by: ['userId'],
      _sum: {
        points: true,
        gameweekPoints: true,
      },
      _count: {
        _all: true,
      },
    }),
    prisma.duel.groupBy({
      by: ['createdById'],
      _count: {
        _all: true,
      },
    }),
    prisma.duel.groupBy({
      by: ['opponentId'],
      _count: {
        _all: true,
      },
      where: {
        opponentId: {
          not: null,
        },
      },
    }),
  ]);

  const poolStatsByUserId = new Map(poolStats.map((row) => [row.userId, row]));
  const createdDuelsByUserId = new Map(createdDuelsCount.map((row) => [row.createdById, row._count._all]));
  const opponentDuelsByUserId = new Map(
    opponentDuelsCount
      .filter((row) => row.opponentId)
      .map((row) => [row.opponentId, row._count._all]),
  );

  const rows = users.map((user) => {
    const userPoolStats = poolStatsByUserId.get(user.id);
    const createdCount = normalizeNumber(createdDuelsByUserId.get(user.id));
    const opponentCount = normalizeNumber(opponentDuelsByUserId.get(user.id));
    const totalPoints = normalizeNumber(userPoolStats?._sum?.points);
    const gameweekPoints = normalizeNumber(userPoolStats?._sum?.gameweekPoints);
    const poolsJoined = normalizeNumber(userPoolStats?._count?._all);

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      userFullName: [user.firstName, user.lastName].filter(Boolean).join(' ').trim(),
      totalPoints,
      gameweekPoints,
      poolsJoined,
      duelsCreated: createdCount,
      duelsPlayed: createdCount + opponentCount,
    };
  });

  rows.sort(compareByMode(mode));

  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * limit;
  const pagedRows = rows.slice(start, start + limit).map((row, index) => ({
    rank: start + index + 1,
    user: row.user,
    totalPoints: row.totalPoints,
    gameweekPoints: row.gameweekPoints,
    poolsJoined: row.poolsJoined,
    duelsCreated: row.duelsCreated,
    duelsPlayed: row.duelsPlayed,
  }));

  return {
    period: mode,
    leaderboard: pagedRows,
    pagination: {
      page: safePage,
      limit,
      total,
      totalPages,
    },
  };
}

module.exports = {
  listLeaderboard,
};
