import axios from "axios";
import type { Role, User } from "@/types/auth";

export interface BackendHealthStatus {
  online: boolean;
  url: string;
  statusText: string;
  dataSource?: string;
}

interface ServerUser {
  id: string;
  _id?: string;
  username?: string;
  name?: string;
  email: string;
  role: Role;
  isActive?: boolean;
  isemailVerified: boolean;
  createdAt?: string;
}

const toUser = (u: ServerUser): User => ({
  _id: u.id || u._id || "",
  username: u.username || u.name || (u.email ? u.email.split("@")[0] : "User"),
  name: u.name || u.username,
  email: u.email,
  role: u.role,
  isActive: u.isActive !== false,
  isemailVerified: Boolean(u.isemailVerified),
  createdAt: u.createdAt,
});

export interface AuditLogRecord {
  _id: string;
  timestamp: string;
  actorId: string;
  actorEmail: string;
  action: string;
  targetResource: string;
  outcome: "SUCCESS" | "FAILURE" | "WARNING";
  ipAddress?: string;
  details?: string;
  metadata?: any;
  createdAt?: string;
}

export interface AuditLogPage {
  logs: AuditLogRecord[];
  total: number;
  page: number;
  pages: number;
  dataSource?: string;
}

export interface OrgSettings {
  plantName: string;
  plantCode: string;
  contactEmail: string;
  timezone?: string;
  maintenanceWindow?: string;
  autoBackups?: boolean;
  mfaEnforced?: boolean;
  sessionTimeoutMinutes?: number;
  updatedBy?: string;
  updatedAt?: string;
}

export interface MasterDataCounts {
  products: number;
  machines: number;
  inventory: number;
  suppliers: number;
}

export interface MasterDataResponse {
  counts: MasterDataCounts;
  dataSource?: string;
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

/**
 * Dedicated administrative API client routing through Next.js App Router API handlers.
 * Ensures same-origin credentials dispatch, eliminates CORS issues, and guarantees
 * truthful, human-readable error propagation instead of generic 404s.
 */
export const adminApi = axios.create({
  baseURL: "/api/admin",
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

adminApi.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;
    const backendMsg = data?.message;

    let friendlyMessage = backendMsg;
    if (!friendlyMessage) {
      if (status === 404) {
        friendlyMessage = "The requested administrative resource was not found.";
      } else if (status === 503) {
        friendlyMessage =
          data?.code === "DATABASE_UNAVAILABLE"
            ? "Administrative write blocked: MongoDB connection is offline. Changes cannot be persisted to primary storage."
            : "The Ricoz MFG backend service is currently unreachable.";
      } else if (status === 401) {
        friendlyMessage = "Administrative session expired or unauthorized. Please re-login at /admin/login.";
      } else if (status === 403) {
        friendlyMessage = "Action Forbidden: This account lacks administrative privileges.";
      } else if (error.code === "ECONNABORTED") {
        friendlyMessage = "Network timeout: The administrative service did not respond in time.";
      } else {
        friendlyMessage = error.message || "An unexpected error occurred during administrative request.";
      }
    }

    const enhancedError = new Error(friendlyMessage);
    (enhancedError as any).status = status;
    (enhancedError as any).code = data?.code;
    (enhancedError as any).response = error.response;
    return Promise.reject(enhancedError);
  }
);

export const adminService = {
  /**
   * Updates user role on the backend (admin, supervisor, operator, user).
   */
  updateUserRole: (id: string, role: Role) =>
    adminApi
      .patch<{ user: ServerUser }>(`/users/${encodeURIComponent(id)}/role`, { role })
      .then((r) => toUser(r.data.user)),

  /**
   * Updates user account status (Active vs Suspended).
   */
  updateUserStatus: (id: string, isActive: boolean) =>
    adminApi
      .patch<{ user: ServerUser }>(`/users/${encodeURIComponent(id)}/status`, { isActive })
      .then((r) => toUser(r.data.user)),

  /**
   * Retrieves paginated audit log ledger from backend.
   */
  listAuditLogs: (params: {
    page?: number;
    limit?: number;
    action?: string;
    outcome?: string;
    search?: string;
  } = {}) =>
    adminApi.get<AuditLogPage>("/audit-logs", { params }).then((r) => r.data),

  getAuditLogs: (params: { limit?: number; search?: string; action?: string } = {}) =>
    adminApi.get<AuditLogPage>("/audit-logs", { params }).then((r) => r.data.logs || []),

  /**
   * Retrieves master data inventory and catalog counts.
   */
  masterDataWithMeta: () =>
    adminApi
      .get<{ counts: MasterDataCounts; dataSource?: string }>("/master-data")
      .then((r) => ({ counts: r.data.counts, dataSource: r.data.dataSource || "store" })),

  masterDataCounts: () =>
    adminApi
      .get<{ counts: MasterDataCounts; dataSource?: string }>("/master-data")
      .then((r) => r.data.counts),

  /**
   * Retrieves system settings with dataSource metadata.
   */
  getSettingsWithMeta: () =>
    adminApi
      .get<{ settings: OrgSettings; dataSource?: string }>("/settings")
      .then((r) => ({ settings: r.data.settings, dataSource: r.data.dataSource || "store" })),

  /**
   * Retrieves system settings.
   */
  getSettings: () =>
    adminApi.get<{ settings: OrgSettings; dataSource?: string }>("/settings").then((r) => r.data.settings),

  /**
   * Persists updated system settings.
   */
  saveSettings: (payload: Partial<OrgSettings>) =>
    adminApi.put<{ settings: OrgSettings }>("/settings", payload).then((r) => r.data.settings),

  updateSettings: (payload: Partial<OrgSettings>) =>
    adminApi.put<{ settings: OrgSettings }>("/settings", payload).then((r) => r.data.settings),

  /**
   * Retrieves full employee account directory with dataSource metadata.
   */
  listUsersWithMeta: () =>
    adminApi
      .get<{ users: ServerUser[]; dataSource?: string }>("/users")
      .then((r) => ({
        users: (r.data?.users || []).map(toUser),
        dataSource: r.data?.dataSource || "store",
      })),

  /**
   * Retrieves full employee account directory.
   */
  listUsers: () =>
    adminApi
      .get<{ users: ServerUser[]; dataSource?: string }>("/users")
      .then((r) => r.data.users.map(toUser)),

  /**
   * Retrieves administrative overview telemetry metrics.
   */
  getAdminStats: () =>
    adminApi
      .get<{ success: boolean; stats: AdminStats }>("/stats")
      .then((r) => r.data.stats),

  /**
   * Checks for an active HttpOnly admin session.
   */
  async checkSession(): Promise<{ authenticated: boolean; user?: { email: string; role: Role; name?: string } }> {
    try {
      const res = await adminApi.get<{ authenticated: boolean; user?: { email: string; role: Role; name?: string } }>("/session");
      return res.data;
    } catch {
      return { authenticated: false };
    }
  },

  /**
   * Performs an end-to-end live backend connectivity ping test.
   */
  async checkHealth(): Promise<BackendHealthStatus> {
    try {
      const res = await adminApi.get<BackendHealthStatus>("/health");
      return res.data;
    } catch (err: unknown) {
      const e = err as Error;
      return {
        online: false,
        url: "Backend API Gateway",
        statusText: e.message || "Unreachable",
      };
    }
  },
};
