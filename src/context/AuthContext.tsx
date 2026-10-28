"use client";

import { useAuth as useClerkAuth, useClerk } from "@clerk/nextjs";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { api, setTokenGetter } from "@/services/api";
import type { User } from "@/types/auth";

export interface AuthContextValue {
  /** App user from the backend (has _id, role, ...). null until loaded. */
  user: User | null;
  /** true while Clerk or the backend profile is still loading */
  loading: boolean;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn, getToken } = useClerkAuth();
  const { signOut } = useClerk();
  const [user, setUser] = useState<User | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Set during render (not in an effect) so child effects that fire API calls already have it.
  setTokenGetter(() => getToken());

  // Load / create the backend profile once Clerk says we are signed in.
  useEffect(() => {
    // if (!isLoaded) return;
    if (!isSignedIn) {
      setUser(null);
      setProfileLoading(false);
      return;
    }
    let active = true;
    api
      .get<{ user: User }>("/user/me")
      .then((r) => active && setUser(r.data.user))
      .catch(() => active && setUser(null))
      .finally(() => active && setProfileLoading(false));
    return () => {
      active = false;
    };
  }, [isLoaded, isSignedIn]);

  const logout = useCallback(async () => {
    setUser(null);
    await signOut({ redirectUrl: "/login" });
  }, [signOut]);

  const value = useMemo(
    () => ({ user, loading: !isLoaded || profileLoading, logout }),
    [user, isLoaded, profileLoading, logout],
  );

  // Don't render pages (which call the API) until Clerk can hand out a token.
  if (!isLoaded) return null;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
