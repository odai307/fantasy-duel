import { apiRequest } from './apiClient';
import { validateJoinResult } from '../utils/apiValidators';

export function getMyFplTeamInfo() {
  return apiRequest('/api/fpl/team-info', {
    auth: true,
  }).then((data) => {
    if (!data.teamInfo) throw new Error('Invalid team info response');
    return data.teamInfo;
  });
}

export function getCurrentGameweek() {
  return apiRequest('/api/fpl/current-gameweek').then((data) => {
    if (!data.currentGameweek) throw new Error('Invalid gameweek response');
    return data.currentGameweek;
  });
}

export function getOpenGameweeks() {
  return apiRequest('/api/fpl/open-gameweeks').then((data) => {
    if (!Array.isArray(data?.gameweeks)) {
      throw new Error('Invalid open gameweeks response');
    }
    return data.gameweeks;
  });
}

export function getMyTeamScore(eventId) {
  const query = eventId ? `?eventId=${eventId}` : '';
  return apiRequest(`/api/fpl/team-score${query}`, {
    auth: true,
  }).then((data) => {
    if (!data.scoreData) throw new Error('Invalid score data response');
    return data.scoreData;
  });
}

export function syncMyFplScores() {
  return apiRequest('/api/fpl/sync-my-scores', {
    method: 'POST',
    auth: true,
  }).then((data) => validateJoinResult(data, 'sync FPL scores response'));
}

export function getEntryLineup(teamId, { eventId } = {}) {
  const query = eventId ? `?eventId=${Number(eventId)}` : '';
  return apiRequest(`/api/fpl/entry/${Number(teamId)}/lineup${query}`).then((data) => {
    if (!data?.lineup) {
      throw new Error('Invalid lineup response');
    }
    return data.lineup;
  });
}

export function getUpcomingFixtures({ eventId, limit = 6 } = {}) {
  const queryParams = new URLSearchParams();
  if (eventId) queryParams.set('eventId', String(Number(eventId)));
  if (limit) queryParams.set('limit', String(Number(limit)));
  const query = queryParams.toString();

  return apiRequest(`/api/fpl/fixtures/upcoming${query ? `?${query}` : ''}`).then((data) => {
    if (!Array.isArray(data?.upcoming) || !Array.isArray(data?.live)) {
      throw new Error('Invalid upcoming fixtures response');
    }
    return data;
  });
}
