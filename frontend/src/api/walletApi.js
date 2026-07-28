import { apiRequest } from './apiClient';

export async function initializeDeposit(amount) {
  return apiRequest('/api/wallet/deposit/initialize', {
    method: 'POST',
    body: { amount },
    auth: true,
  });
}

export async function verifyDeposit(reference) {
  return apiRequest('/api/wallet/deposit/verify', {
    method: 'POST',
    body: { reference },
    auth: true,
  });
}

export async function requestWithdrawal(payload) {
  return apiRequest('/api/wallet/withdraw', {
    method: 'POST',
    body: payload,
    auth: true,
  });
}

export async function getTransactions(page = 1, limit = 15) {
  return apiRequest(`/api/wallet/transactions?page=${page}&limit=${limit}`, {
    auth: true,
  });
}
