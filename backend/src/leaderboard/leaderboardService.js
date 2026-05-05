const { Prisma } = require('@prisma/client');
const prisma = require('../shared/config/db');

function rankingMode(period) {
  return period === 'this_week' ? 'this_week' : 'all_time';
}

function buildOrderBy(mode) {
  if (mode === 'this_week') {
    return Prisma.sql`gameweek_points DESC, total_points DESC, duels_played DESC, user_full_name ASC`;
  }

  return Prisma.sql`total_points DESC, gameweek_points DESC, duels_played DESC, user_full_name ASC`;
}

async function listLeaderboard({ period, page, limit }) {
  const mode = rankingMode(period);
  const total = await prisma.user.count();
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, totalPages);
  const offset = (safePage - 1) * limit;
  const orderBy = buildOrderBy(mode);

  const rows = await prisma.$queryRaw(
    Prisma.sql`
      SELECT
        u.id,
        u.first_name AS firstName,
        u.last_name AS lastName,
        COALESCE(pp.total_points, 0) AS totalPoints,
        COALESCE(pp.gameweek_points, 0) AS gameweekPoints,
        COALESCE(pp.pools_joined, 0) AS poolsJoined,
        COALESCE(cd.duels_created, 0) AS duelsCreated,
        COALESCE(od.duels_played, 0) AS duelsPlayed,
        TRIM(CONCAT(COALESCE(u.first_name, ''), ' ', COALESCE(u.last_name, ''))) AS userFullName
      FROM users u
      LEFT JOIN (
        SELECT user_id, SUM(points) AS total_points, SUM(gameweek_points) AS gameweek_points, COUNT(*) AS pools_joined
        FROM pool_participants
        GROUP BY user_id
      ) pp ON pp.user_id = u.id
      LEFT JOIN (
        SELECT created_by_id, COUNT(*) AS duels_created
        FROM duels
        GROUP BY created_by_id
      ) cd ON cd.created_by_id = u.id
      LEFT JOIN (
        SELECT opponent_id, COUNT(*) AS duels_played
        FROM duels
        WHERE opponent_id IS NOT NULL
        GROUP BY opponent_id
      ) od ON od.opponent_id = u.id
      ORDER BY ${orderBy}
      LIMIT ${limit}
      OFFSET ${offset}
    `,
  );

  const leaderboard = rows.map((row, index) => ({
    rank: offset + index + 1,
    user: {
      id: row.id,
      firstName: row.firstName,
      lastName: row.lastName,
    },
    totalPoints: Number(row.totalPoints),
    gameweekPoints: Number(row.gameweekPoints),
    poolsJoined: Number(row.poolsJoined),
    duelsCreated: Number(row.duelsCreated),
    duelsPlayed: Number(row.duelsPlayed),
  }));

  return {
    period: mode,
    leaderboard,
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
