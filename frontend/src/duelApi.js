import { apiRequest } from './apiClient';
import {
  validateDuelByIdResponse,
  validateDuelListResponse,
  validateJoinResult,
} from './apiValidators';

export function createDuel(payload) {
  return apiRequest('/api/duels', {
    method: 'POST',
    auth: true,
    body: payload,
  }).then(validateDuelByIdResponse);
}

export function joinDuelByCode(inviteCode) {
  return apiRequest('/api/duels/join-by-code', {
    method: 'POST',
    auth: true,
    body: { inviteCode },
  }).then((data) => {
    validateJoinResult(data, 'joinDuelByCode response');
    return validateDuelByIdResponse(data);
  });
}

export function getDuelById(id) {
  return apiRequest(`/api/duels/${id}`, {
    auth: true,
  }).then(validateDuelByIdResponse);
}

export function listDuels({ status = 'all', page = 1, limit = 30 } = {}) {
  const query = new URLSearchParams({
    status,
    page: String(page),
    limit: String(limit),
  }).toString();

  return apiRequest(`/api/duels?${query}`, {
    auth: true,
  }).then(validateDuelListResponse);
}
