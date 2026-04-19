import { getAuthToken } from './authUtils';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

function buildHeaders(headers, body, auth) {
  const nextHeaders = { ...headers };

  if (body && !(body instanceof FormData) && !nextHeaders['Content-Type']) {
    nextHeaders['Content-Type'] = 'application/json';
  }

  if (auth) {
    const token = getAuthToken();
    if (token) {
      nextHeaders.Authorization = `Bearer ${token}`;
    }
  }

  return nextHeaders;
}

function parseJsonSafely(text) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function apiRequest(path, options = {}) {
  const { method = 'GET', body, headers = {}, auth = false, signal } = options;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: buildHeaders(headers, body, auth),
    body: body && !(body instanceof FormData) ? JSON.stringify(body) : body,
    signal,
  });

  const text = await response.text();
  const data = parseJsonSafely(text);

  if (!response.ok) {
    const error = new Error(data?.message || `Request failed (${response.status})`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}
