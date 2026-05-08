const { Prisma } = require('@prisma/client');
const prisma = require('../shared/config/db');
const { getTeamInfoForUser, getTeamOfficialPoints } = require('../fpl/fplService');
const { getOrSet } = require('../shared/cache');

function rankingMode(period) {
  return period === 'this_week' ? 'this_week' : 'all_time';
}

function buildOrderBy(mode) {
  if (mode === 'this_week') {
    return Prisma.sql`gameweek_points DESC, total_points DESC, duels_played DESC, "displayName" ASC`;
  }

  return Prisma.sql`total_points DESC, gameweek_points DESC, duels_played DESC, "displayName" ASC`;
}

async function listLeaderboard({ period, page, limit }) {
  const mode = rankingMode(period);
  const cacheKey = `leaderboard:${mode}:${page}:${limit}`;
  return getOrSet(cacheKey, 30 * 1000, async () => {
    const total = await prisma.user.count();
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(page, totalPages);
    const offset = (safePage - 1) * limit;
    const orderBy = buildOrderBy(mode);

    const rows = await prisma.$queryRaw(
    Prisma.sql`
      SELECT
        u.id,
        u.email,
        u.first_name AS "firstName",
        u.last_name AS "lastName",
        u.fpl_team_id AS "fplTeamId",
        u.fpl_team_name AS "fplTeamName",
        u.fpl_manager_name AS "fplManagerName",
        COALESCE(pp.total_points, 0) AS "totalPoints",
        COALESCE(pp.gameweek_points, 0) AS "gameweekPoints",
        COALESCE(pp.pools_joined, 0) AS "poolsJoined",
        COALESCE(cd.duels_created, 0) AS "duelsCreated",
        COALESCE(od.duels_played, 0) AS "duelsPlayed",
        CASE 
          WHEN u.fpl_team_name IS NOT NULL THEN u.fpl_team_name
          ELSE TRIM(CONCAT(COALESCE(u.first_name, ''), ' ', COALESCE(u.last_name, '')))
        END AS "displayName"
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

  // Enrich missing identity fields from FPL when possible so leaderboard
  // consistently shows manager/team names like the pool leaderboard.
    for (const row of rows) {
    const hasManagerName = Boolean(row.fplManagerName && String(row.fplManagerName).trim());
    const hasTeamName = Boolean(row.fplTeamName && String(row.fplTeamName).trim());
    const teamId = row.fplTeamId === null || row.fplTeamId === undefined
      ? null
      : Number(row.fplTeamId);

    if (!teamId) {
      continue;
    }

    try {
      const teamInfo = await getTeamInfoForUser(teamId);
      const nextManagerName = teamInfo?.playerName || row.fplManagerName || null;
      const nextTeamName = teamInfo?.teamName || row.fplTeamName || null;
      const officialPoints = await getTeamOfficialPoints(teamId, Number(teamInfo?.currentEvent));

      row.fplManagerName = nextManagerName;
      row.fplTeamName = nextTeamName;
      row.totalPoints = Number(officialPoints.totalPoints || 0);
      row.gameweekPoints = Number(officialPoints.gameweekPoints || 0);

      if (!hasManagerName || !hasTeamName) {
        await prisma.user.update({
          where: { id: row.id },
          data: {
            fplManagerName: nextManagerName,
            fplTeamName: nextTeamName,
          },
        });
      }
    } catch (error) {
      // Best-effort enrichment only: don't fail leaderboard if FPL is unavailable.
      console.warn('[leaderboard-enrich] failed to refresh FPL identity', {
        userId: row.id,
        fplTeamId: teamId,
        error: error.message,
      });
    }
  }

    rows.sort((a, b) => {
    const totalA = Number(a.totalPoints || 0);
    const totalB = Number(b.totalPoints || 0);
    if (totalB !== totalA) {
      return totalB - totalA;
    }

    const gwA = Number(a.gameweekPoints || 0);
    const gwB = Number(b.gameweekPoints || 0);
    if (gwB !== gwA) {
      return gwB - gwA;
    }

    return String(a.displayName || '').localeCompare(String(b.displayName || ''));
  });

    const leaderboard = rows.map((row, index) => ({
    rank: offset + index + 1,
    user: {
      id: row.id,
      email: row.email,
      firstName: row.firstName,
      lastName: row.lastName,
      fplTeamId: row.fplTeamId === null ? null : Number(row.fplTeamId),
      fplManagerName: row.fplManagerName,
      fplTeamName: row.fplTeamName,
    },
    totalPoints: Number(row.totalPoints || 0),
    gameweekPoints: Number(row.gameweekPoints || 0),
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
  });
}

module.exports = {
  listLeaderboard,
};
