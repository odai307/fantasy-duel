import { apiRequest } from './apiClient';
import { validateAuthResponse } from '../utils/apiValidators';

export function registerUser(payload) {
  return apiRequest('/api/auth/register', {
    method: 'POST',
    body: payload,
  }).then((data) => validateAuthResponse(data, 'register'));
}

export function loginUser(payload) {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: payload,
  }).then((data) => validateAuthResponse(data, 'login'));
}

export function validateFplTeam(payload) {
  return apiRequest('/api/auth/validate-fpl', {
    method: 'POST',
    body: payload,
    auth: true,
  });
}

export function setupFplTeam(payload) {
  return apiRequest('/api/auth/setup-fpl', {
    method: 'POST',
    body: payload,
    auth: true,
  }).then((data) => validateAuthResponse(data, 'setup FPL'));
}

export function fetchCurrentUser() {
  return apiRequest('/api/auth/me', {
    auth: true,
  }).then((data) => validateAuthResponse(data, 'me'));
}
