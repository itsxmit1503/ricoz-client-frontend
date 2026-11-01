import type { Role, User } from "@/types/auth";
import { api } from "./api";

export interface BackendHealthStatus {
  online: boolean;
  url: string;
  statusText: string;
}

interface ServerUser {
  id: string;
  _id?: string;
  username?: string;
  email: string;
  role: Role;
  isActive?: boolean;
  isemailVerified: boolean;
  createdAt?: string;
}

const toUser = (u: ServerUser): User => ({
  _id: u.id || u._id || "",
  username: u.username,
  email: u.email,
  role: u.role,
  isActive: u.isActive !== false,
  isemailVerified: u.isemailVerified,
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
}

export interface MasterDataCounts {
  products: number;
  machines: number;
  inventory: number;
  suppliers: number;
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

export const adminService = {
  updateUserRole: (id: string, role: Role) =>
    api.patch<{ user: ServerUser }>(`/admin/users/${id}/role`, { role }).then((r) => toUser(r.data.user)),

  updateUserStatus: (id: string, isActive: boolean) =>
    api.patch<{ user: ServerUser }>(`/admin/users/${id}/status`, { isActive }).then((r) => toUser(r.data.user)),

  listAuditLogs: (params: { page?: number; limit?: number; action?: string; outcome?: string; actor?: string; search?: string } = {}) =>
    api.get<AuditLogPage>("/admin/audit-logs", { params }).then((r) => r.data),

  getAuditLogs: (params: { limit?: number; search?: string; action?: string } = {}) =>
    api.get<AuditLogPage>("/admin/audit-logs", { params }).then((r) => r.data.logs || []),

  masterDataCounts: () =>
    api.get<{ counts: MasterDataCounts }>("/admin/master-data").then((r) => r.data.counts),

  getSettings: () => api.get<{ settings: OrgSettings }>("/admin/settings").then((r) => r.data.settings),

  saveSettings: (payload: OrgSettings) =>
    api.put<{ settings: OrgSettings }>("/admin/settings", payload).then((r) => r.data.settings),

  updateSettings: (payload: OrgSettings) =>
    api.put<{ settings: OrgSettings }>("/admin/settings", payload).then((r) => r.data.settings),

  listUsers: () =>
    api.get<{ users: ServerUser[] }>("/admin/data").then((r) => r.data.users.map(toUser)),

  getAdminStats: () =>
    api.get<{ success: boolean; stats: AdminStats }>("/admin/stats").then((r) => r.data.stats),

  async checkHealth(): Promise<BackendHealthStatus> {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000";
    try {
      const res = await api.get("/", { timeout: 5000 });
      return { online: true, url, statusText: `HTTP ${res.status}` };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unreachable";
      return { online: false, url, statusText: msg };
    }
  },
};
