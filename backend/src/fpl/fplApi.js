const axios = require('axios');
const { getOrSet } = require('../shared/cache');

const FPL_BASE_URL = 'https://fantasy.premierleague.com/api';

class FplApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'FplApiError';
    this.status = status;
  }
}

async function fetchFplData(endpoint) {
  const cacheKey = `fpl:endpoint:${endpoint}`;
  const ttlByEndpoint = (() => {
    if (endpoint === '/bootstrap-static/') return 5 * 60 * 1000;
    if (endpoint.includes('/live/')) return 30 * 1000;
    if (endpoint.includes('/picks/')) return 30 * 1000;
    if (endpoint.startsWith('/entry/')) return 60 * 1000;
    return 30 * 1000;
  })();

  return getOrSet(cacheKey, ttlByEndpoint, async () => {
    try {
      const response = await axios.get(`${FPL_BASE_URL}${endpoint}`, {
        timeout: 10000,
        headers: {
          'User-Agent': 'FantasyDuel/1.0 (https://fantasyduel.gh)',
        },
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new FplApiError(`FPL API error: ${error.response.status} ${error.response.statusText}`, error.response.status);
      } else if (error.code === 'ECONNABORTED') {
        throw new FplApiError('FPL API request timed out', 408);
      } else {
        throw new FplApiError(`FPL API request failed: ${error.message}`, 500);
      }
    }
  });
}

async function getTeamInfo(teamId) {
  if (!Number.isInteger(teamId) || teamId <= 0) {
    throw new FplApiError('Invalid team ID: must be a positive integer', 400);
  }

  const data = await fetchFplData(`/entry/${teamId}/`);
  return {
    id: data.id,
    name: data.name,
    playerName: data.player_first_name + ' ' + data.player_last_name,
    region: data.player_region_name,
    teamName: data.name,
    favouriteTeam: data.favourite_team,
    startedEvent: data.started_event,
    overallPoints: data.summary_overall_points,
    overallRank: data.summary_overall_rank,
    eventPoints: data.summary_event_points,
    eventRank: data.summary_event_rank,
    lastDeadlineBank: data.last_deadline_bank,
    lastDeadlineValue: data.last_deadline_value,
    currentEvent: data.current_event,
  };
}

async function getBootstrapData() {
  const data = await fetchFplData('/bootstrap-static/');
  return {
    events: data.events, // Gameweeks
    gameSettings: data.game_settings,
    phases: data.phases,
    teams: data.teams,
    elements: data.elements, // Players
    elementStats: data.element_stats,
    elementTypes: data.element_types, // Positions
  };
}

async function getEventLive(eventId) {
  const data = await fetchFplData(`/event/${eventId}/live/`);
  return {
    elements: data.elements, // Player performances in this GW
  };
}

async function getTeamPicks(teamId, eventId) {
  const data = await fetchFplData(`/entry/${teamId}/event/${eventId}/picks/`);
  return {
    activeChip: data.active_chip,
    automaticSubs: data.automatic_subs,
    entryHistory: data.entry_history,
    picks: data.picks, // Selected players
  };
}

async function getFixtures(eventId = null) {
  const endpoint = eventId ? `/fixtures/?event=${Number(eventId)}` : '/fixtures/';
  const data = await fetchFplData(endpoint);
  return Array.isArray(data) ? data : [];
}

module.exports = {
  getTeamInfo,
  getBootstrapData,
  getEventLive,
  getTeamPicks,
  getFixtures,
  FplApiError,
};
