"use client";

import { useContext } from "react";
import { AuthContext, type AuthContextValue } from "@/context/AuthContext";

const defaultAuthContext: AuthContextValue = {
  user: null,
  loading: false,
  logout: async () => {},
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    return defaultAuthContext;
  }
  return ctx;
}
