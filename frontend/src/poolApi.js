import { apiRequest } from './apiClient';

export function listPools({ filter = 'all', page = 1, limit = 30 } = {}) {
  const query = new URLSearchParams({
    filter,
    page: String(page),
    limit: String(limit),
  }).toString();

  return apiRequest(`/api/pools?${query}`);
}

export function getPoolById(id) {
  return apiRequest(`/api/pools/${id}`);
}

export function createPool(payload) {
  return apiRequest('/api/pools', {
    method: 'POST',
    auth: true,
    body: payload,
  });
}
