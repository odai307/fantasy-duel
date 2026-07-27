import { apiRequest } from './apiClient';
import {
  validateJoinResult,
  validatePoolByIdResponse,
  validatePoolLeaderboardResponse,
  validatePoolListResponse,
} from '../utils/apiValidators';

export function listPools({ filter = 'all', minEntryFee, maxEntryFee, sortBy = 'newest', page = 1, limit = 30 } = {}) {
  const queryParams = new URLSearchParams({
    filter,
    sortBy,
    page: String(page),
    limit: String(limit),
  });

  if (minEntryFee !== undefined && minEntryFee !== null && minEntryFee !== '') {
    queryParams.set('minEntryFee', String(minEntryFee));
  }

  if (maxEntryFee !== undefined && maxEntryFee !== null && maxEntryFee !== '') {
    queryParams.set('maxEntryFee', String(maxEntryFee));
  }

  const query = queryParams.toString();

  return apiRequest(`/api/pools?${query}`, {
    optionalAuth: true,
  }).then(validatePoolListResponse);
}

export function getPoolById(id) {
  return apiRequest(`/api/pools/${id}`, {
    optionalAuth: true,
  }).then(validatePoolByIdResponse);
}

export function getPoolLeaderboard(id, { page = 1, limit = 50 } = {}) {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  }).toString();

  return apiRequest(`/api/pools/${id}/leaderboard?${query}`, {
    optionalAuth: true,
  }).then(validatePoolLeaderboardResponse);
}

export function createPool(payload) {
  return apiRequest('/api/pools', {
    method: 'POST',
    auth: true,
    body: payload,
  }).then(validatePoolByIdResponse);
}

export function joinPoolByCode(inviteCode) {
  return apiRequest('/api/pools/join-by-code', {
    method: 'POST',
    auth: true,
    body: { inviteCode },
  }).then((data) => validateJoinResult(data, 'joinPoolByCode response'));
}

export function joinPool(poolId, { inviteCode } = {}) {
  return apiRequest(`/api/pools/${poolId}/join`, {
    method: 'POST',
    auth: true,
    body: inviteCode ? { inviteCode } : {},
  }).then((data) => validateJoinResult(data, 'joinPool response'));
}
