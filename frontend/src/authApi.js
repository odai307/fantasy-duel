import { apiRequest } from './apiClient';
import { validateAuthResponse } from './apiValidators';

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

export function fetchCurrentUser() {
  return apiRequest('/api/auth/me', {
    auth: true,
  }).then((data) => validateAuthResponse(data, 'me'));
}
