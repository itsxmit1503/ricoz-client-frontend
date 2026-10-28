import { api } from "./api";
import type { User } from "@/types/auth";

export interface AdminUsersResponse {
  success: boolean;
  message?: string;
  users: User[];
}

export interface BackendHealthStatus {
  online: boolean;
  url: string;
  statusText?: string;
  checkedAt: string;
}

export const adminService = {
  /**
   * Fetches user directory from the administrative backend API.
   * If backend URL is unset or returns an error, throws an informative error
   * rather than returning fake mock data.
   */
  async listUsers(): Promise<User[]> {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      throw new Error("NEXT_PUBLIC_BACKEND_URL is not configured in your environment.");
    }

    try {
      // Primary admin data endpoint from Express router: /admin/data
      const res = await api.get<AdminUsersResponse>("/admin/data");
      if (res.data?.users && Array.isArray(res.data.users)) {
        return res.data.users;
      }
      return [];
    } catch (err: unknown) {
      // Fallback check to /user/me or re-throw detailed error
      const error = err as { response?: { status?: number; data?: { message?: string } }; message?: string };
      if (error.response?.status === 401) {
        throw new Error("Backend authorization required. The backend expects an admin JWT session.");
      }
      throw new Error(error.response?.data?.message || error.message || "Failed to reach administrative user API.");
    }
  },

  /**
   * Checks live backend connectivity without assuming health.
   */
  async checkHealth(): Promise<BackendHealthStatus> {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const now = new Date().toLocaleTimeString();

    if (!backendUrl) {
      return {
        online: false,
        url: "Unconfigured (NEXT_PUBLIC_BACKEND_URL empty)",
        statusText: "Backend URL is not set in environment.",
        checkedAt: now,
      };
    }

    try {
      const res = await fetch(backendUrl, { method: "GET", cache: "no-store" });
      const text = await res.text().catch(() => "");
      return {
        online: res.ok,
        url: backendUrl,
        statusText: res.ok ? text || "Service responding" : `HTTP ${res.status}: ${res.statusText}`,
        checkedAt: now,
      };
    } catch (err: unknown) {
      const error = err as Error;
      return {
        online: false,
        url: backendUrl,
        statusText: error.message || "Connection refused",
        checkedAt: now,
      };
    }
  },
};
