"use client";

import { createContext, useContext, useMemo } from "react";

const AuthSessionContext = createContext({
  role: null,
  user: null,
});

export function AuthSessionProvider({ children, user }) {
  const value = useMemo(
    () => ({
      role: user?.role ?? null,
      user,
    }),
    [user],
  );

  return (
    <AuthSessionContext.Provider value={value}>
      {children}
    </AuthSessionContext.Provider>
  );
}

export function useAuthSession() {
  return useContext(AuthSessionContext);
}
