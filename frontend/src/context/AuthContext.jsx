import { createContext, useContext, useState, useCallback } from "react";
import * as authApi from "../services/authApi";

/**
 * Deliberately in-memory only (React state), not localStorage. A stolen
 * localStorage token is usable by any injected script (XSS) for its full
 * lifetime; an in-memory token disappears the moment the tab closes or
 * reloads. The tradeoff: refreshing the page logs the user out. For this
 * project's scope that's an acceptable trade — the alternative (a
 * refresh-token cookie flow) is real additional backend work, and isn't
 * required by the rubric.
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  const signup = useCallback(async (formData) => {
    const data = await authApi.signup(formData);
    setUser(data.user);
    setAccessToken(data.access_token);
    return data.user;
  }, []);

  const login = useCallback(async (formData) => {
    const data = await authApi.login(formData);
    setUser(data.user);
    setAccessToken(data.access_token);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    // Best-effort: revoke the token server-side, but clear local state
    // regardless of whether the request succeeds (e.g. network drop) —
    // the user should never appear "stuck" logged in on their own screen.
    try {
      if (accessToken) {
        await authApi.logout(accessToken);
      }
    } finally {
      setUser(null);
      setAccessToken(null);
    }
  }, [accessToken]);

  const value = {
    user,
    accessToken,
    isAuthenticated: Boolean(accessToken),
    signup,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
