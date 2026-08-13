const prisma = require('../shared/config/db');
const { makeError } = require('../shared/errors');
const { requireAuthenticatedUser } = require('../shared/authHelper');
const {
  getTeamScore,
  getCurrentGameweek,
  getTeamInfoForUser,
  getTeamLineup,
} = require('./fplService');
const { getBootstrapData, getFixtures } = require('./fplApi');
const { syncParticipantScoresForGameweek } = require('./scoreSyncUtils');
const env = require('../shared/config/env');

// ============================================================================
// CONTROLLER HANDLERS
// ============================================================================

/**
 * GET /api/fpl/team-info
 * Retrieve connected FPL team details for the authenticated manager.
 */
async function getCurrentUserFplTeamInfo(req, res, next) {
  try {
    const userId = requireAuthenticatedUser(req);
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { fplTeamId: true },
    });

    if (!user?.fplTeamId) {
      throw makeError(400, 'No FPL team ID associated with your account');
    }

    const teamInfo = await getTeamInfoForUser(user.fplTeamId);
    return res.status(200).json({ teamInfo });
  } catch (error) {
    return next(error);
  }
}

/**
 * GET /api/fpl/current-gameweek
 * Get the currently active or upcoming Premier League Gameweek number.
 */
async function getCurrentGameweekRoute(req, res, next) {
  try {
    const currentGw = await getCurrentGameweek();
    if (!currentGw) {
      throw makeError(500, 'Unable to determine current gameweek');
    }
    return res.status(200).json({ currentGameweek: currentGw });
  } catch (error) {
    return next(error);
  }
}

/**
 * GET /api/fpl/open-gameweeks
 * List all 38 Premier League gameweeks with deadline timestamps and open/locked status.
 */
async function getOpenGameweeksRoute(req, res, next) {
  try {
    const bootstrap = await getBootstrapData();
    const now = new Date();

    const gameweeks = (bootstrap.events || [])
      .filter((event) => event && event.deadline_time)
      .map((event) => {
        const deadline = new Date(event.deadline_time);
        return {
          id: Number(event.id),
          name: event.name || `Gameweek ${event.id}`,
          deadlineTime: deadline.toISOString(),
          isCurrent: Boolean(event.is_current),
          isNext: Boolean(event.is_next),
          isOpen: now < deadline,
        };
      })
      .sort((a, b) => a.id - b.id);

    return res.status(200).json({
      now: now.toISOString(),
      gameweeks,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * GET /api/fpl/fixtures/upcoming
 * Fetch upcoming or live Premier League fixtures with team badges and kickoff times.
 */
async function getUpcomingFixturesRoute(req, res, next) {
  try {
    const bootstrap = await getBootstrapData();
    const now = new Date();
    const limit = Math.min(20, Math.max(1, Number(req.query.limit || 6)));
    const requestedEventId = req.query.eventId ? Number(req.query.eventId) : null;

    const events = (bootstrap.events || []).map((event) => ({
      id: Number(event.id),
      name: event.name || `Gameweek ${event.id}`,
      isCurrent: Boolean(event.is_current),
      isNext: Boolean(event.is_next),
      deadlineTime: event.deadline_time ? new Date(event.deadline_time) : null,
    }));

    const targetEvent = requestedEventId
      ? events.find((event) => event.id === requestedEventId)
      : events.find((event) => event.isNext) ||
        events.find((event) => event.deadlineTime && now < event.deadlineTime) ||
        events.find((event) => event.isCurrent) ||
        null;

    if (!targetEvent?.id) {
      throw makeError(500, 'Unable to determine target gameweek for upcoming fixtures');
    }

    const teamsById = new Map(
      (bootstrap.teams || []).map((team) => [
        Number(team.id),
        {
          id: Number(team.id),
          name: team.name || '',
          shortName: team.short_name || '',
          code: Number(team.code || 0),
        },
      ])
    );

    const fixtures = await getFixtures(targetEvent.id);
    const normalized = fixtures
      .sort((a, b) => new Date(a.kickoff_time || 0) - new Date(b.kickoff_time || 0))
      .map((fixture) => {
        const homeTeam = teamsById.get(Number(fixture.team_h));
        const awayTeam = teamsById.get(Number(fixture.team_a));
        return {
          id: Number(fixture.id),
          eventId: Number(fixture.event),
          kickoffTime: fixture.kickoff_time ? new Date(fixture.kickoff_time).toISOString() : null,
          started: Boolean(fixture.started),
          finished: Boolean(fixture.finished),
          homeTeam,
          awayTeam,
        };
      });

    const live = normalized.filter((fixture) => fixture.started && !fixture.finished).slice(0, limit);
    const upcoming = normalized.filter((fixture) => !fixture.started && !fixture.finished).slice(0, limit);

    return res.status(200).json({
      eventId: targetEvent.id,
      eventName: targetEvent.name,
      live,
      upcoming,
      fixtures: upcoming,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * GET /api/fpl/team-score
 * Retrieve live Gameweek score breakdown for the authenticated user's FPL squad.
 */
async function getMyTeamScore(req, res, next) {
  try {
    const userId = requireAuthenticatedUser(req);
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { fplTeamId: true },
    });

    if (!user?.fplTeamId) {
      throw makeError(400, 'No FPL team ID associated with your account');
    }

    const eventId = req.query.eventId ? Number(req.query.eventId) : await getCurrentGameweek();
    if (!eventId) {
      throw makeError(500, 'Unable to determine current gameweek');
    }

    const scoreData = await getTeamScore(user.fplTeamId, eventId);
    return res.status(200).json({ scoreData });
  } catch (error) {
    return next(error);
  }
}

/**
 * GET /api/fpl/entry/:teamId/lineup
 * Retrieve 15-player squad lineup for the visual pitch page (starters, bench, captaincy).
 */
async function getEntryLineupRoute(req, res, next) {
  try {
    const teamId = Number(req.params.teamId);
    const eventId = req.query.eventId ? Number(req.query.eventId) : null;

    if (!Number.isInteger(teamId) || teamId <= 0) {
      throw makeError(400, 'Invalid team id');
    }

    if (eventId !== null && (!Number.isInteger(eventId) || eventId <= 0)) {
      throw makeError(400, 'Invalid event id');
    }

    const lineup = await getTeamLineup(teamId, eventId);
    return res.status(200).json({ lineup });
  } catch (error) {
    return next(error);
  }
}

/**
 * POST /api/fpl/sync-my-scores
 * Trigger an on-demand score synchronization for the authenticated user's pool participations.
 */
async function syncMyFplScores(req, res, next) {
  try {
    const userId = requireAuthenticatedUser(req);
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { fplTeamId: true },
    });

    if (!user?.fplTeamId) {
      throw makeError(400, 'No FPL team ID associated with your account');
    }

    const currentGw = await getCurrentGameweek();
    if (!currentGw) {
      throw makeError(500, 'Unable to determine current gameweek');
    }

    const scoreData = await getTeamScore(user.fplTeamId, currentGw);

    // Idempotent delta sync against previously stored points
    const updatedCount = await prisma.$transaction(async (tx) => {
      const participants = await tx.poolParticipant.findMany({
        where: {
          userId,
          pool: {
            gameweek: currentGw,
          },
        },
        select: {
          id: true,
          gameweekPoints: true,
        },
      });

      return syncParticipantScoresForGameweek(tx, participants, scoreData.gameweekPoints);
    });

    return res.status(200).json({
      message: `Synced FPL scores for GW ${currentGw}`,
      updatedParticipants: updatedCount,
      scoreData,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * POST /api/fpl/sync-all-scores
 * Admin bulk synchronization endpoint across all registered FPL managers.
 */
async function syncAllFplScores(req, res, next) {
  try {
    if (!env.allowFplSyncAll) {
      throw makeError(403, 'Bulk FPL sync is disabled');
    }

    const currentGw = await getCurrentGameweek();
    if (!currentGw) {
      throw makeError(500, 'Unable to determine current gameweek');
    }

    const usersWithFpl = await prisma.user.findMany({
      where: {
        fplTeamId: { not: null },
      },
      select: { id: true, fplTeamId: true },
    });

    let totalUpdated = 0;
    const results = [];

    for (const user of usersWithFpl) {
      try {
        const scoreData = await getTeamScore(user.fplTeamId, currentGw);
        const updatedCount = await prisma.$transaction(async (tx) => {
          const participants = await tx.poolParticipant.findMany({
            where: {
              userId: user.id,
              pool: {
                gameweek: currentGw,
              },
            },
            select: {
              id: true,
              gameweekPoints: true,
            },
          });

          return syncParticipantScoresForGameweek(tx, participants, scoreData.gameweekPoints);
        });

        totalUpdated += updatedCount;
        results.push({ userId: user.id, updated: updatedCount, score: scoreData.gameweekPoints });
      } catch (error) {
        results.push({ userId: user.id, error: error.message });
      }
    }

    return res.status(200).json({
      message: `Synced FPL scores for GW ${currentGw} for all users`,
      totalUpdated,
      results,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getCurrentUserFplTeamInfo,
  getCurrentGameweekRoute,
  getOpenGameweeksRoute,
  getUpcomingFixturesRoute,
  getMyTeamScore,
  getEntryLineupRoute,
  syncMyFplScores,
  syncAllFplScores,
};
