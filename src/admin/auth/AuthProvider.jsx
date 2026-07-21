import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./authContext";
import { getToken, onUnauthorized } from "../api/client";
import * as api from "../api/admin";

export default function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getToken());
  // Set when the session dies mid-session, so the login page can explain why
  // the user was bounced instead of silently showing an empty form.
  const [expired, setExpired] = useState(false);

  // Any 401 from any request unwinds the session exactly once.
  useEffect(() => {
    onUnauthorized(() => {
      setTokenState((current) => {
        if (current) setExpired(true);
        return null;
      });
    });
    return () => onUnauthorized(null);
  }, []);

  const signIn = useCallback(async (credentials) => {
    const data = await api.login(credentials);
    setExpired(false);
    setTokenState(data?.token ?? getToken());
    return data;
  }, []);

  const signOut = useCallback(async () => {
    await api.logout();
    setExpired(false);
    setTokenState(null);
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated: Boolean(token), expired, signIn, signOut }),
    [token, expired, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
