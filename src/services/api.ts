"use client";

import axios, { AxiosInstance } from "axios";

type TokenGetter = () => Promise<string | null>;

let getToken: TokenGetter = async () => null;

/** Called by <AuthProvider> so every request can carry the current Clerk session token. */
export function setTokenGetter(fn: TokenGetter) {
  getToken = fn;
}

export const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Clerk session tokens are short-lived; getToken() returns a fresh/cached one each time.
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
