import { apiRequest } from './apiClient';
import {
  validateJoinResult,
  validatePoolByIdResponse,
  validatePoolLeaderboardResponse,
  validatePoolListResponse,
} from './apiValidators';

export function listPools({ filter = 'all', page = 1, limit = 30 } = {}) {
  const query = new URLSearchParams({
    filter,
    page: String(page),
    limit: String(limit),
  }).toString();

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
