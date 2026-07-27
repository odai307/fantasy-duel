const express = require('express');
const router = express.Router();
const asyncHandler = require('../shared/middleware/asyncHandler');
const { requireAuthenticatedUser } = require('../shared/authHelper');
const { getTeamScore, getCurrentGameweek, getTeamInfoForUser, getTeamLineup } = require('../fpl/fplService');
const { getBootstrapData, getFixtures } = require('../fpl/fplApi');
const prisma = require('../shared/config/db');
const { makeError } = require('../shared/errors');
const authMiddleware = require('../shared/middleware/authMiddleware');
const env = require('../shared/config/env');
const { syncParticipantScoresForGameweek } = require('./scoreSyncUtils');

const getCurrentUserFplTeamInfo = asyncHandler(async (req, res) => {
  const userId = requireAuthenticatedUser(req);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { fplTeamId: true },
  });

  if (!user?.fplTeamId) {
    throw makeError(400, 'No FPL team ID associated with your account');
  }

  const teamInfo = await getTeamInfoForUser(user.fplTeamId);
  return res.json({ teamInfo });
});

const getCurrentGameweekRoute = asyncHandler(async (req, res) => {
  const currentGw = await getCurrentGameweek();
  if (!currentGw) {
    throw makeError(500, 'Unable to determine current gameweek');
  }
  res.json({ currentGameweek: currentGw });
});

const getOpenGameweeksRoute = asyncHandler(async (req, res) => {
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

  res.json({
    now: now.toISOString(),
    gameweeks,
  });
});

const getUpcomingFixturesRoute = asyncHandler(async (req, res) => {
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
    : events.find((event) => event.isNext)
      || events.find((event) => event.deadlineTime && now < event.deadlineTime)
      || events.find((event) => event.isCurrent)
      || null;

  if (!targetEvent?.id) {
    throw makeError(500, 'Unable to determine target gameweek for upcoming fixtures');
  }

  const teamsById = new Map((bootstrap.teams || []).map((team) => [
    Number(team.id),
    {
      id: Number(team.id),
      name: team.name || '',
      shortName: team.short_name || '',
      code: Number(team.code || 0),
    },
  ]));

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

  const live = normalized
    .filter((fixture) => fixture.started && !fixture.finished)
    .slice(0, limit);

  const upcoming = normalized
    .filter((fixture) => !fixture.started && !fixture.finished)
    .slice(0, limit);

  res.json({
    eventId: targetEvent.id,
    eventName: targetEvent.name,
    live,
    upcoming,
    fixtures: upcoming,
  });
});

const getMyTeamScore = asyncHandler(async (req, res) => {
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
  res.json({ scoreData });
});

const getEntryLineupRoute = asyncHandler(async (req, res) => {
  const teamId = Number(req.params.teamId);
  const eventId = req.query.eventId ? Number(req.query.eventId) : null;

  if (!Number.isInteger(teamId) || teamId <= 0) {
    throw makeError(400, 'Invalid team id');
  }

  if (eventId !== null && (!Number.isInteger(eventId) || eventId <= 0)) {
    throw makeError(400, 'Invalid event id');
  }

  const lineup = await getTeamLineup(teamId, eventId);
  res.json({ lineup });
});

// Sync FPL scores for the current user
const syncMyFplScores = asyncHandler(async (req, res) => {
  const userId = requireAuthenticatedUser(req);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { fplTeamId: true },
  });

  if (!user.fplTeamId) {
    throw makeError(400, 'No FPL team ID associated with your account');
  }

  const currentGw = await getCurrentGameweek();
  if (!currentGw) {
    throw makeError(500, 'Unable to determine current gameweek');
  }

  const scoreData = await getTeamScore(user.fplTeamId, currentGw);

  // Idempotent sync: apply delta against previously stored GW score.
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

  res.json({
    message: `Synced FPL scores for GW ${currentGw}`,
    updatedParticipants: updatedCount,
    scoreData,
  });
});

// Admin endpoint to sync all users (optional, for testing)
const syncAllFplScores = asyncHandler(async (req, res) => {
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

  res.json({
    message: `Synced FPL scores for GW ${currentGw} for all users`,
    totalUpdated,
    results,
  });
});

router.get('/team-info', authMiddleware, getCurrentUserFplTeamInfo);
router.get('/current-gameweek', getCurrentGameweekRoute);
router.get('/open-gameweeks', getOpenGameweeksRoute);
router.get('/fixtures/upcoming', getUpcomingFixturesRoute);
router.get('/entry/:teamId/lineup', getEntryLineupRoute);
router.get('/team-score', authMiddleware, getMyTeamScore);
router.post('/sync-my-scores', authMiddleware, syncMyFplScores);
router.post('/sync-all-scores', authMiddleware, syncAllFplScores);

module.exports = router;
