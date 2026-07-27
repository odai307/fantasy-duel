const { getTeamInfo, getBootstrapData, getEventLive, getTeamPicks, FplApiError } = require('./fplApi');
const { makeError } = require('../shared/errors');
const { getOrSet } = require('../shared/cache');

async function validateFplTeamId(teamId) {
  try {
    const teamInfo = await getTeamInfo(teamId);
    return {
      isValid: true,
      teamInfo,
    };
  } catch (error) {
    if (error instanceof FplApiError && error.status === 404) {
      return {
        isValid: false,
        error: 'FPL team ID does not exist',
      };
    }
    throw makeError(500, 'Failed to validate FPL team ID', 'FPL_VALIDATION_ERROR', error.message);
  }
}

async function getTeamInfoForUser(teamId) {
  try {
    return await getTeamInfo(teamId);
  } catch (error) {
    if (error instanceof FplApiError && error.status === 404) {
      throw makeError(404, 'FPL team ID not found');
    }
    throw makeError(500, 'Failed to fetch FPL team info', 'FPL_TEAM_INFO_ERROR', error.message);
  }
}

function calculateGameweekPoints(picks, liveData) {
  const liveById = new Map(liveData.elements.map((player) => [player.id, player]));
  let gameweekPoints = 0;
  const playerDetails = [];

  for (const pick of picks.picks) {
    const playerLive = liveById.get(pick.element);
    if (!playerLive) continue;

    const basePoints = Number(playerLive.stats.total_points || 0);
    const multiplier = Number(pick.multiplier || 1);
    const points = basePoints * multiplier;
    gameweekPoints += points;

    playerDetails.push({
      elementId: pick.element,
      position: pick.position,
      multiplier,
      basePoints,
      points,
    });
  }

  return {
    gameweekPoints,
    playerDetails,
  };
}

async function getTeamScore(teamId, eventId) {
  try {
    const [picks, liveData] = await Promise.all([
      getTeamPicks(teamId, eventId),
      getEventLive(eventId),
    ]);

    const { gameweekPoints, playerDetails } = calculateGameweekPoints(picks, liveData);

    return {
      teamId,
      eventId,
      activeChip: picks.activeChip || null,
      picks: picks.picks,
      playerDetails,
      gameweekPoints,
      totalPoints: gameweekPoints,
    };
  } catch (error) {
    throw makeError(500, 'Failed to fetch FPL team score', 'FPL_SCORE_ERROR', error.message);
  }
}

async function getCurrentGameweek() {
  try {
    const bootstrap = await getBootstrapData();
    const currentEvent = bootstrap.events.find(event => event.is_current);
    return currentEvent ? currentEvent.id : null;
  } catch (error) {
    throw makeError(500, 'Failed to fetch current gameweek', 'FPL_GAMEWEEK_ERROR', error.message);
  }
}

async function getTeamOfficialPoints(teamId, eventId) {
  const targetEventId = Number(eventId);
  if (!Number.isInteger(targetEventId) || targetEventId <= 0) {
    throw makeError(400, 'Invalid event id', 'INVALID_EVENT_ID');
  }

  try {
    const picksData = await getTeamPicks(teamId, targetEventId);
    const entryHistory = picksData?.entryHistory || {};
    return {
      gameweekPoints: Number(entryHistory.points || 0),
      totalPoints: Number(entryHistory.total_points || 0),
    };
  } catch (error) {
    throw makeError(500, 'Failed to fetch official FPL points', 'FPL_OFFICIAL_POINTS_ERROR', error.message);
  }
}

function buildPlayerPhotoUrls(code) {
  const safeCode = Number(code);
  if (!Number.isInteger(safeCode) || safeCode <= 0) {
    return null;
  }

  return {
    small: `https://resources.premierleague.com/premierleague/photos/players/110x140/p${safeCode}.png`,
    medium: `https://resources.premierleague.com/premierleague/photos/players/250x250/p${safeCode}.png`,
  };
}

async function getTeamLineup(teamId, eventId = null) {
  const safeTeamId = Number(teamId);
  if (!Number.isInteger(safeTeamId) || safeTeamId <= 0) {
    throw makeError(400, 'Invalid team id', 'INVALID_TEAM_ID');
  }

  const resolvedEventId = eventId ? Number(eventId) : await getCurrentGameweek();
  if (!Number.isInteger(resolvedEventId) || resolvedEventId <= 0) {
    throw makeError(400, 'Invalid event id', 'INVALID_EVENT_ID');
  }

  try {
    const cacheKey = `fpl:lineup:${safeTeamId}:${resolvedEventId}`;
    return getOrSet(cacheKey, 30 * 1000, async () => {
    const [teamInfo, picksData, liveData, bootstrap] = await Promise.all([
      getTeamInfoForUser(safeTeamId),
      getTeamPicks(safeTeamId, resolvedEventId),
      getEventLive(resolvedEventId),
      getBootstrapData(),
    ]);

    const elementsById = new Map((bootstrap.elements || []).map((element) => [Number(element.id), element]));
    const teamsById = new Map((bootstrap.teams || []).map((team) => [Number(team.id), team]));
    const positionsById = new Map((bootstrap.elementTypes || []).map((type) => [Number(type.id), type]));
    const liveById = new Map((liveData.elements || []).map((entry) => [Number(entry.id), entry]));

    const picks = (picksData.picks || []).map((pick) => {
      const element = elementsById.get(Number(pick.element));
      const live = liveById.get(Number(pick.element));
      const team = element ? teamsById.get(Number(element.team)) : null;
      const position = element ? positionsById.get(Number(element.element_type)) : null;
      const basePoints = Number(live?.stats?.total_points || 0);
      const multiplier = Number(pick.multiplier || 1);

      return {
        elementId: Number(pick.element),
        pickPosition: Number(pick.position),
        multiplier,
        isCaptain: Boolean(pick.is_captain),
        isViceCaptain: Boolean(pick.is_vice_captain),
        isStarter: Number(pick.position) <= 11,
        points: basePoints * multiplier,
        basePoints,
        player: {
          id: element ? Number(element.id) : Number(pick.element),
          firstName: element?.first_name || null,
          secondName: element?.second_name || null,
          webName: element?.web_name || null,
          teamShortName: team?.short_name || null,
          teamName: team?.name || null,
          positionName: position?.singular_name_short || null,
          code: element?.code ? Number(element.code) : null,
          photo: buildPlayerPhotoUrls(element?.code),
        },
      };
    });

    const starters = picks
      .filter((pick) => pick.isStarter)
      .sort((a, b) => a.pickPosition - b.pickPosition);
    const bench = picks
      .filter((pick) => !pick.isStarter)
      .sort((a, b) => a.pickPosition - b.pickPosition);

    // Use FPL's official entry history points as source of truth for GW total.
    // Local per-pick sums can differ (for example with bench/processing nuances).
    const gameweekPoints = Number(picksData?.entryHistory?.points || 0);

    return {
      teamId: safeTeamId,
      eventId: resolvedEventId,
      teamInfo: {
        managerName: teamInfo.playerName,
        teamName: teamInfo.teamName,
        overallPoints: Number(teamInfo.overallPoints || 0),
        overallRank: Number(teamInfo.overallRank || 0),
      },
      activeChip: picksData.activeChip || null,
      automaticSubs: picksData.automaticSubs || [],
      entryHistory: {
        points: Number(picksData?.entryHistory?.points || 0),
        totalPoints: Number(picksData?.entryHistory?.total_points || 0),
        rank: Number(picksData?.entryHistory?.rank || 0),
        rankSort: Number(picksData?.entryHistory?.rank_sort || 0),
        eventTransfers: Number(picksData?.entryHistory?.event_transfers || 0),
        eventTransfersCost: Number(picksData?.entryHistory?.event_transfers_cost || 0),
        pointsOnBench: Number(picksData?.entryHistory?.points_on_bench || 0),
      },
      gameweekPoints,
      starters,
      bench,
    };
    });
  } catch (error) {
    if (error?.code === 'INVALID_TEAM_ID' || error?.code === 'INVALID_EVENT_ID') {
      throw error;
    }
    throw makeError(500, 'Failed to fetch team lineup', 'FPL_LINEUP_ERROR', error.message);
  }
}

async function getGameweekDeadline(gameweek) {
  const targetGameweek = Number(gameweek);
  if (!Number.isInteger(targetGameweek) || targetGameweek <= 0) {
    throw makeError(400, 'Invalid gameweek', 'INVALID_GAMEWEEK');
  }

  try {
    const bootstrap = await getBootstrapData();
    const event = bootstrap.events.find((item) => Number(item.id) === targetGameweek);

    if (!event) {
      throw makeError(404, `Gameweek ${targetGameweek} not found`, 'GAMEWEEK_NOT_FOUND');
    }

    if (!event.deadline_time) {
      throw makeError(500, `Gameweek ${targetGameweek} deadline is unavailable`, 'GAMEWEEK_DEADLINE_UNAVAILABLE');
    }

    return new Date(event.deadline_time);
  } catch (error) {
    if (error?.code === 'GAMEWEEK_NOT_FOUND' || error?.code === 'GAMEWEEK_DEADLINE_UNAVAILABLE') {
      throw error;
    }
    throw makeError(500, 'Failed to fetch gameweek deadline', 'FPL_GAMEWEEK_DEADLINE_ERROR', error.message);
  }
}

async function assertGameweekOpen(gameweek, action = 'perform this action') {
  const targetGameweek = Number(gameweek);
  const deadline = await getGameweekDeadline(targetGameweek);
  const now = new Date();

  if (now >= deadline) {
    throw makeError(
      409,
      `Gameweek ${targetGameweek} is locked. You cannot ${action} after the FPL deadline (${deadline.toISOString()}).`,
      'GAMEWEEK_LOCKED',
    );
  }
}

module.exports = {
  validateFplTeamId,
  getTeamScore,
  getCurrentGameweek,
  getTeamInfoForUser,
  getGameweekDeadline,
  assertGameweekOpen,
  getTeamOfficialPoints,
  getTeamLineup,
};
