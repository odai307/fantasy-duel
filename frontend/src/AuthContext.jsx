import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { fetchCurrentUser, loginUser, registerUser } from './authApi';
import { clearAuthToken, getAuthToken, setAuthToken } from './authUtils';

const AuthContext = createContext(null);

function fullName(user) {
  return [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim();
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getAuthToken());
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const logout = useCallback(() => {
    clearAuthToken();
    setToken('');
    setUser(null);
  }, []);

  const refreshMe = useCallback(async () => {
    if (!token) {
      setUser(null);
      return null;
    }

    try {
      const data = await fetchCurrentUser();
      setUser(data?.user || null);
      return data?.user || null;
    } catch (error) {
      if (error.status === 401 || error.status === 403) {
        logout();
      }
      throw error;
    }
  }, [logout, token]);

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      if (!token) {
        if (active) {
          setUser(null);
          setIsInitializing(false);
        }
        return;
      }

      try {
        const data = await fetchCurrentUser();
        if (active) {
          setUser(data?.user || null);
        }
      } catch (error) {
        if (active && (error.status === 401 || error.status === 403)) {
          logout();
        }
      } finally {
        if (active) {
          setIsInitializing(false);
        }
      }
    }

    bootstrap();
    return () => {
      active = false;
    };
  }, [logout, token]);

  const login = useCallback(async ({ email, password }) => {
    const data = await loginUser({ email, password });
    if (!data?.token) {
      throw new Error('Login token missing from response');
    }

    setAuthToken(data.token);
    setToken(data.token);
    setUser(data?.user || null);
    return data;
  }, []);

  const register = useCallback(async (payload) => registerUser(payload), []);

  const authStatus = useMemo(() => {
    if (isInitializing) return 'initializing';
    if (user) return 'authenticated';
    if (token) return 'stale_token';
    return 'anonymous';
  }, [isInitializing, user, token]);

  const value = useMemo(
    () => ({
      token,
      user,
      userFullName: fullName(user),
      authStatus,
      isAuthenticated: authStatus === 'authenticated',
      isInitializing,
      login,
      register,
      logout,
      refreshMe,
    }),
    [token, user, authStatus, isInitializing, login, register, logout, refreshMe],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
