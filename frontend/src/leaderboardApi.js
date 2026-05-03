import { apiRequest } from './apiClient';
import { validateLeaderboardResponse } from './apiValidators';

export function getLeaderboard({ period = 'all_time', page = 1, limit = 30 } = {}) {
  const query = new URLSearchParams({
    period,
    page: String(page),
    limit: String(limit),
  }).toString();

  return apiRequest(`/api/leaderboard?${query}`, {
    optionalAuth: true,
  }).then(validateLeaderboardResponse);
}
