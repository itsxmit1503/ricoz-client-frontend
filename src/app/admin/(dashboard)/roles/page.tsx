"use client";

import {
  Check,
  Info,
  Lock,
  RefreshCw,
} from "lucide-react";
import { useEffect, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import Button from "@/components/ui/Button";
import { adminService } from "@/services/admin.service";
import type { User } from "@/types/auth";

interface SystemRoleDefinition {
  id: "admin" | "user";
  name: string;
  badge: "admin" | "user";
  description: string;
  scope: string;
  permissions: { key: string; label: string; active: boolean }[];
  isImmutable: boolean;
}

const SYSTEM_ROLES: SystemRoleDefinition[] = [
  {
    id: "admin",
    name: "System Administrator",
    badge: "admin",
    description:
      "Unrestricted administrative access to the Private Admin Console, user governance, master data overview, and system connectivity configurations.",
    scope: "Platform-wide & Private Admin Console",
    isImmutable: true,
    permissions: [
      { key: "admin.console", label: "Access Private Admin Console (/admin/*)", active: true },
      { key: "admin.users.read", label: "Inspect User Directory & Verification States", active: true },
      { key: "admin.roles.view", label: "Inspect System Roles & Authorization Model", active: true },
      { key: "admin.master_data.view", label: "Inspect Master Data Repositories", active: true },
      { key: "admin.settings.view", label: "Inspect Environment & Service Configurations", active: true },
      { key: "erp.all", label: "Access Standard Manufacturing Operations", active: true },
    ],
  },
  {
    id: "user",
    name: "Manufacturing Operator",
    badge: "user",
    description:
      "Operational access to plant-floor work orders, machine tracking, inventory stock, maintenance, quality issues, and bills of materials.",
    scope: "Manufacturing Operations Cockpit (/dashboard/*)",
    isImmutable: false,
    permissions: [
      { key: "admin.console", label: "Access Private Admin Console (/admin/*)", active: false },
      { key: "erp.work_orders", label: "Manage Work Orders & Production Plans", active: true },
      { key: "erp.machines", label: "View Fleet Registry & Diagnostics", active: true },
      { key: "erp.inventory", label: "Inspect Warehouse Stock & Bins", active: true },
      { key: "erp.maintenance", label: "View Maintenance Work Orders", active: true },
      { key: "erp.quality", label: "Log Quality Non-conformances", active: true },
      { key: "erp.bom", label: "Inspect Hierarchical Bills of Materials", active: true },
    ],
  },
];

export default function AdminRolesPage() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await adminService.listUsers();
      setUsers(data);
    } catch {
      setUsers(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const adminCount = users ? users.filter((u) => u.role === "admin").length : null;
  const userCount = users ? users.filter((u) => u.role === "user").length : null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <AdminPageHeader
        title="Roles & Authorization Architecture"
        description="Inspect existing application role definitions, operational scope boundaries, and active permission entitlements."
        breadcrumbs="Console / Roles & Permissions"
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={loadUsers}
            loading={loading}
            className="border-slate-800 bg-[#0c111e] text-slate-300 hover:text-white"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Refresh Counts
          </Button>
        }
      />

      {/* Backend RBAC Architecture Notice */}
      <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-purple-500/30 bg-purple-500/15 text-purple-300">
            <Info className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-200">
              Authorization Model Status: Static Schema Enforced
            </h3>
            <p className="mt-1 text-xs text-slate-300 leading-relaxed">
              The application authorization model is governed by MongoDB <code className="text-purple-300">UserModel.role</code> enum (<code className="text-purple-300">&quot;admin&quot; | &quot;user&quot;</code>). Fine-grained dynamic RBAC (custom permission policies, group inheritance, and field-level permissions) requires backend schema extensions.
            </p>
          </div>
        </div>
      </div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {SYSTEM_ROLES.map((role) => {
          const count = role.id === "admin" ? adminCount : userCount;

          return (
            <div
              key={role.id}
              className="flex flex-col rounded-xl border border-slate-800 bg-[#0c111e] p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <AdminStatusBadge variant={role.badge}>
                      {role.name.toUpperCase()}
                    </AdminStatusBadge>
                    {role.isImmutable && (
                      <span className="font-mono text-[10px] text-slate-500">
                        (System Default)
                      </span>
                    )}
                  </div>
                  <h2 className="mt-2 text-base font-bold text-white tracking-tight">
                    {role.name}
                  </h2>
                </div>

                <div className="text-right">
                  <span className="font-mono text-2xl font-bold text-white">
                    {count !== null ? count : "—"}
                  </span>
                  <span className="block font-mono text-[10px] text-slate-400 uppercase">
                    Assigned Accounts
                  </span>
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-400 leading-relaxed">
                {role.description}
              </p>

              <div className="mt-3 rounded-lg border border-slate-800/80 bg-[#080d17] p-2.5 font-mono text-[11px] text-slate-300">
                <span className="text-slate-500 uppercase">Scope: </span>
                {role.scope}
              </div>

              {/* Permissions Checklist */}
              <div className="mt-5 flex-1 space-y-2 border-t border-slate-800/80 pt-4">
                <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Enforced Permissions
                </p>
                <ul className="space-y-1.5 font-mono text-xs">
                  {role.permissions.map((perm) => (
                    <li
                      key={perm.key}
                      className={`flex items-center gap-2 rounded px-2 py-1 ${
                        perm.active
                          ? "text-slate-200 bg-slate-900/40"
                          : "text-slate-600 line-through"
                      }`}
                    >
                      {perm.active ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <Lock className="h-3.5 w-3.5 text-slate-600 shrink-0" />
                      )}
                      <span className="truncate">{perm.label}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 border-t border-slate-800/80 pt-3 text-right">
                <span className="font-mono text-[11px] text-slate-500">
                  {role.id === "admin"
                    ? "Protected System Role (Immutable)"
                    : "Standard Employee Privilege"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
