import { createContext, useContext } from "react";

// Split from the provider component so this module exports no components —
// keeps react-refresh able to hot-reload AuthProvider cleanly.
export const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
