const PRIMARY_TOKEN_KEY = 'fantasyduel_token';
const LEGACY_TOKEN_KEYS = ['token', 'accessToken', 'authToken', 'jwt'];
const ALL_TOKEN_KEYS = [PRIMARY_TOKEN_KEY, ...LEGACY_TOKEN_KEYS];

export function getAuthToken() {
  if (typeof window === 'undefined') return '';

  for (const key of ALL_TOKEN_KEYS) {
    const token = localStorage.getItem(key);
    if (token) return token;
  }

  return '';
}

export function setAuthToken(token) {
  if (typeof window === 'undefined') return;

  for (const key of ALL_TOKEN_KEYS) {
    localStorage.removeItem(key);
  }

  if (token) {
    localStorage.setItem(PRIMARY_TOKEN_KEY, token);
  }
}

export function clearAuthToken() {
  if (typeof window === 'undefined') return;

  for (const key of ALL_TOKEN_KEYS) {
    localStorage.removeItem(key);
  }
}

export function isAuthenticated() {
  return Boolean(getAuthToken());
}
