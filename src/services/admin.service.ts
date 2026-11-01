import { api } from "./api";
import type { User } from "@/types/auth";

export interface AdminUsersResponse {
  success: boolean;
  message?: string;
  users: User[];
  count?: number;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  adminUsers: number;
  verifiedUsers: number;
  totalMachines: number;
  runningMachines: number;
  systemStatus: string;
  databaseStatus: string;
}

export interface AuditLogItem {
  _id: string;
  actorId: string;
  actorEmail: string;
  action: string;
  targetResource: string;
  targetId?: string;
  outcome: "SUCCESS" | "FAILURE" | "WARNING";
  ipAddress?: string;
  details?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface SystemSettings {
  key?: string;
  plantName: string;
  plantCode: string;
  timezone: string;
  contactEmail: string;
  maintenanceWindow: string;
  systemBanner?: string;
  autoBackups: boolean;
  mfaEnforced: boolean;
  sessionTimeoutMinutes: number;
  updatedBy?: string;
  updatedAt?: string;
}

export interface BackendHealthStatus {
  online: boolean;
  url: string;
  statusText?: string;
  checkedAt: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export const adminService = {
  /**
   * Fetches user directory from the administrative backend API.
   */
  async listUsers(): Promise<User[]> {
    try {
      const res = await api.get<AdminUsersResponse>("/admin/users");
      if (res.data?.users && Array.isArray(res.data.users)) {
        return res.data.users;
      }
      return [];
    } catch (err: unknown) {
      // Try fallback to /admin/data
      try {
        const fallbackRes = await api.get<AdminUsersResponse>("/admin/data");
        if (fallbackRes.data?.users && Array.isArray(fallbackRes.data.users)) {
          return fallbackRes.data.users;
        }
      } catch {
        // Fall through
      }
      const error = err as { response?: { status?: number; data?: { message?: string } }; message?: string };
      throw new Error(error.response?.data?.message || error.message || "Failed to reach administrative user API.");
    }
  },

  /**
   * Updates a user's role on the backend (admin, user, operator, supervisor).
   */
  async updateUserRole(userId: string, role: User["role"]): Promise<User> {
    try {
      const res = await api.patch<{ success: boolean; user: User; message?: string }>(
        `/admin/users/${userId}/role`,
        { role }
      );
      if (res.data?.user) {
        return res.data.user;
      }
      throw new Error(res.data?.message || "Failed to update role");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      throw new Error(error.response?.data?.message || error.message || "Failed to update user role.");
    }
  },

  /**
   * Updates a user's active/suspended status on the backend.
   */
  async updateUserStatus(userId: string, isActive: boolean): Promise<User> {
    try {
      const res = await api.patch<{ success: boolean; user: User; message?: string }>(
        `/admin/users/${userId}/status`,
        { isActive }
      );
      if (res.data?.user) {
        return res.data.user;
      }
      throw new Error(res.data?.message || "Failed to update status");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      throw new Error(error.response?.data?.message || error.message || "Failed to update user status.");
    }
  },

  /**
   * Fetches overall admin statistics.
   */
  async getAdminStats(): Promise<AdminStats> {
    try {
      const res = await api.get<{ success: boolean; stats: AdminStats }>("/admin/stats");
      if (res.data?.stats) {
        return res.data.stats;
      }
      throw new Error("No stats returned from backend");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      throw new Error(error.response?.data?.message || error.message || "Failed to retrieve admin stats.");
    }
  },

  /**
   * Fetches administrative audit log entries.
   */
  async getAuditLogs(params?: {
    action?: string;
    outcome?: string;
    search?: string;
    limit?: number;
  }): Promise<AuditLogItem[]> {
    try {
      const res = await api.get<{ success: boolean; logs: AuditLogItem[]; count: number }>("/admin/audit-logs", {
        params,
      });
      if (res.data?.logs && Array.isArray(res.data.logs)) {
        return res.data.logs;
      }
      return [];
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      throw new Error(error.response?.data?.message || error.message || "Failed to retrieve audit logs.");
    }
  },

  /**
   * Fetches system configuration settings.
   */
  async getSettings(): Promise<SystemSettings> {
    try {
      const res = await api.get<{ success: boolean; settings: SystemSettings }>("/admin/settings");
      if (res.data?.settings) {
        return res.data.settings;
      }
      throw new Error("Settings not found");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      throw new Error(error.response?.data?.message || error.message || "Failed to retrieve settings.");
    }
  },

  /**
   * Updates system configuration settings.
   */
  async updateSettings(data: Partial<SystemSettings>): Promise<SystemSettings> {
    try {
      const res = await api.put<{ success: boolean; settings: SystemSettings; message?: string }>(
        "/admin/settings",
        data
      );
      if (res.data?.settings) {
        return res.data.settings;
      }
      throw new Error(res.data?.message || "Failed to update settings");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      throw new Error(error.response?.data?.message || error.message || "Failed to update settings.");
    }
  },

  /**
   * Checks live backend connectivity.
   */
  async checkHealth(): Promise<BackendHealthStatus> {
    const url = BASE_URL;
    const now = new Date().toLocaleTimeString();

    try {
      const res = await fetch(url, { method: "GET", cache: "no-store" });
      const data = await res.json().catch(() => null);
      const statusText = data?.service ? `${data.service} v${data.version || "1.0"}` : res.statusText;

      return {
        online: res.ok,
        url,
        statusText: res.ok ? statusText || "Service responding" : `HTTP ${res.status}: ${res.statusText}`,
        checkedAt: now,
      };
    } catch (err: unknown) {
      const error = err as Error;
      return {
        online: false,
        url,
        statusText: error.message || "Connection refused",
        checkedAt: now,
      };
    }
  },
};
