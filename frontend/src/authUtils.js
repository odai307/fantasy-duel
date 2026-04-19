const TOKEN_KEYS = ['token', 'accessToken', 'authToken', 'jwt', 'fantasyduel_token'];

export function getAuthToken() {
  if (typeof window === 'undefined') return '';

  for (const key of TOKEN_KEYS) {
    const token = localStorage.getItem(key);
    if (token) return token;
  }

  return '';
}

export function isAuthenticated() {
  return Boolean(getAuthToken());
}
