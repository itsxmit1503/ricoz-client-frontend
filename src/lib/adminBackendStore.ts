export interface AdminUserRecord {
  _id: string;
  id: string;
  username: string;
  name: string;
  email: string;
  role: "admin" | "user" | "operator" | "supervisor";
  isActive: boolean;
  isemailVerified: boolean;
  createdAt: string;
}

export interface PlantSettingsRecord {
  key: string;
  plantName: string;
  plantCode: string;
  timezone: string;
  contactEmail: string;
  maintenanceWindow: string;
  systemBanner: string;
  autoBackups: boolean;
  mfaEnforced: boolean;
  sessionTimeoutMinutes: number;
  updatedBy: string;
  updatedAt: string;
}

export interface AuditLogRecord {
  _id: string;
  actorId: string;
  actorEmail: string;
  action: string;
  targetResource: string;
  outcome: "SUCCESS" | "FAILURE" | "WARNING";
  ipAddress?: string;
  details?: string;
  metadata?: any;
  createdAt: string;
}

const defaultUsers: AdminUserRecord[] = [
  {
    _id: "usr_admin_01",
    id: "usr_admin_01",
    username: "system.admin",
    name: "System Administrator",
    email: "admin@ricoz.mfg",
    role: "admin",
    isActive: true,
    isemailVerified: true,
    createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
  },
  {
    _id: "usr_sup_02",
    id: "usr_sup_02",
    username: "rajesh.kumar",
    name: "Rajesh Kumar",
    email: "rajesh.k@ricoz.mfg",
    role: "supervisor",
    isActive: true,
    isemailVerified: true,
    createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
  },
  {
    _id: "usr_op_03",
    id: "usr_op_03",
    username: "anita.sharma",
    name: "Anita Sharma",
    email: "anita.s@ricoz.mfg",
    role: "operator",
    isActive: true,
    isemailVerified: true,
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    _id: "usr_op_04",
    id: "usr_op_04",
    username: "vikram.patel",
    name: "Vikram Patel",
    email: "vikram.p@ricoz.mfg",
    role: "operator",
    isActive: false,
    isemailVerified: false,
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
  {
    _id: "usr_gen_05",
    id: "usr_gen_05",
    username: "priya.mehta",
    name: "Priya Mehta",
    email: "priya.m@ricoz.mfg",
    role: "user",
    isActive: true,
    isemailVerified: true,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    _id: "usr_ext_06",
    id: "usr_ext_06",
    username: "bhavishya",
    name: "Bhavishya",
    email: "bhavishyarizzz@gmail.com",
    role: "operator",
    isActive: true,
    isemailVerified: true,
    createdAt: new Date().toISOString(),
  },
];

const defaultSettings: PlantSettingsRecord = {
  key: "global_config",
  plantName: "Ricoz Manufacturing Facility #1",
  plantCode: "RICOZ-PLANT-01",
  timezone: "Asia/Kolkata",
  contactEmail: "operations@ricoz.mfg",
  maintenanceWindow: "Sunday 02:00 - 06:00 IST",
  systemBanner: "",
  autoBackups: true,
  mfaEnforced: false,
  sessionTimeoutMinutes: 60,
  updatedBy: "System Administrator",
  updatedAt: new Date().toISOString(),
};

const defaultLogs: AuditLogRecord[] = [
  {
    _id: "log_init_01",
    actorId: "usr_admin_01",
    actorEmail: "admin@ricoz.mfg",
    action: "SYSTEM_INITIALIZATION",
    targetResource: "SYSTEM",
    outcome: "SUCCESS",
    ipAddress: "127.0.0.1",
    details: "Ricoz MFG administrative services initialized",
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
];

class MemoryStore {
  private users: AdminUserRecord[] = [...defaultUsers];
  private settings: PlantSettingsRecord = { ...defaultSettings };
  private auditLogs: AuditLogRecord[] = [...defaultLogs];

  getUsers(): AdminUserRecord[] {
    return this.users.map((u) => ({ ...u }));
  }

  getUserById(id: string): AdminUserRecord | undefined {
    return this.users.find(
      (u) =>
        u._id === id ||
        u.id === id ||
        u.email.toLowerCase() === id.toLowerCase() ||
        (u.username && u.username.toLowerCase() === id.toLowerCase())
    );
  }

  updateUserRole(id: string, role: "admin" | "user" | "operator" | "supervisor"): AdminUserRecord {
    let user = this.users.find(
      (u) =>
        u._id === id ||
        u.id === id ||
        u.email.toLowerCase() === id.toLowerCase() ||
        (u.username && u.username.toLowerCase() === id.toLowerCase())
    );

    if (!user) {
      const email = id.includes("@") ? id.toLowerCase().trim() : `${id.toLowerCase()}@ricoz.mfg`;
      user = {
        _id: id,
        id: id,
        username: email.split("@")[0],
        name: email.split("@")[0],
        email,
        role,
        isActive: true,
        isemailVerified: true,
        createdAt: new Date().toISOString(),
      };
      this.users.push(user);
      return { ...user };
    }

    user.role = role;
    return { ...user };
  }

  updateUserStatus(id: string, isActive: boolean): AdminUserRecord {
    let user = this.users.find(
      (u) =>
        u._id === id ||
        u.id === id ||
        u.email.toLowerCase() === id.toLowerCase() ||
        (u.username && u.username.toLowerCase() === id.toLowerCase())
    );

    if (!user) {
      const email = id.includes("@") ? id.toLowerCase().trim() : `${id.toLowerCase()}@ricoz.mfg`;
      user = {
        _id: id,
        id: id,
        username: email.split("@")[0],
        name: email.split("@")[0],
        email,
        role: "user",
        isActive,
        isemailVerified: true,
        createdAt: new Date().toISOString(),
      };
      this.users.push(user);
      return { ...user };
    }

    user.isActive = isActive;
    return { ...user };
  }

  getSettings(): PlantSettingsRecord {
    return { ...this.settings };
  }

  updateSettings(data: Partial<PlantSettingsRecord>): PlantSettingsRecord {
    this.settings = {
      ...this.settings,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return { ...this.settings };
  }

  getAuditLogs(params: { action?: string; outcome?: string; page?: number; limit?: number }) {
    let filtered = [...this.auditLogs];
    if (params.action) {
      filtered = filtered.filter((l) => l.action.toLowerCase().includes(params.action!.toLowerCase()));
    }
    if (params.outcome) {
      filtered = filtered.filter((l) => l.outcome.toLowerCase() === params.outcome!.toLowerCase());
    }

    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, Math.min(100, params.limit || 20));
    const total = filtered.length;
    const pages = Math.ceil(total / limit) || 1;
    const start = (page - 1) * limit;
    const logs = filtered.slice(start, start + limit);

    return { logs, total, page, pages };
  }

  addAuditLog(data: Omit<AuditLogRecord, "_id" | "createdAt">): AuditLogRecord {
    const log: AuditLogRecord = {
      ...data,
      _id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    this.auditLogs.unshift(log);
    return log;
  }
}

// Global singleton across serverless invokes within same instance
const globalForStore = globalThis as unknown as { adminMemoryStore?: MemoryStore };
export const adminFallbackStore = globalForStore.adminMemoryStore || new MemoryStore();
if (process.env.NODE_ENV !== "production") globalForStore.adminMemoryStore = adminFallbackStore;
