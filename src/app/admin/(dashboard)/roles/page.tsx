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
  id: "admin" | "supervisor" | "operator" | "user";
  name: string;
  badge: "admin" | "warning" | "user" | "neutral";
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
      "Unrestricted administrative access to the Private Admin Console, user governance, audit logging, master data overview, and system connectivity configurations.",
    scope: "Platform-wide & Private Admin Console",
    isImmutable: true,
    permissions: [
      { key: "admin.console", label: "Access Private Admin Console (/admin/*)", active: true },
      { key: "admin.users.manage", label: "Manage User Directory, Roles & Statuses", active: true },
      { key: "admin.audit.view", label: "Inspect Live Administrative Audit Trail", active: true },
      { key: "admin.master_data.view", label: "Inspect Master Data Repositories", active: true },
      { key: "admin.settings.manage", label: "Configure Environment & Facility Metadata", active: true },
      { key: "erp.all", label: "Access Full Manufacturing Operations Cockpit", active: true },
    ],
  },
  {
    id: "supervisor",
    name: "Operations Supervisor",
    badge: "warning",
    description:
      "Shift management, line scheduling oversight, quality non-conformance review, and inventory replenishment approval.",
    scope: "Plant Floor & Operations Supervision (/dashboard/*)",
    isImmutable: false,
    permissions: [
      { key: "admin.console", label: "Access Private Admin Console (/admin/*)", active: false },
      { key: "erp.work_orders", label: "Approve Work Orders & Production Plans", active: true },
      { key: "erp.machines", label: "Assign Fleets & Manage Workcenters", active: true },
      { key: "erp.quality", label: "Review & Signoff Quality Issues", active: true },
      { key: "erp.inventory", label: "Approve Reorder & Transfer Requests", active: true },
      { key: "erp.maintenance", label: "Dispatch Maintenance Work Orders", active: true },
    ],
  },
  {
    id: "operator",
    name: "Machine Operator",
    badge: "user",
    description:
      "Direct plant-floor work execution, work order logging, machine telemetry dispatch, and maintenance request creation.",
    scope: "Assigned Workcells & Stations (/dashboard/*)",
    isImmutable: false,
    permissions: [
      { key: "admin.console", label: "Access Private Admin Console (/admin/*)", active: false },
      { key: "erp.work_orders", label: "Execute Work Orders & Log Output", active: true },
      { key: "erp.machines", label: "Log Run/Halt States & Sensor Alerts", active: true },
      { key: "erp.maintenance", label: "Request Machine Maintenance", active: true },
      { key: "erp.quality", label: "Flag Non-conforming Units", active: true },
      { key: "admin.settings", label: "Access Administration Configurations", active: false },
    ],
  },
  {
    id: "user",
    name: "General User",
    badge: "neutral",
    description:
      "Read-only operational visibility into manufacturing metrics, bills of materials, and production dashboards.",
    scope: "Standard Portal Viewer",
    isImmutable: false,
    permissions: [
      { key: "admin.console", label: "Access Private Admin Console (/admin/*)", active: false },
      { key: "erp.view", label: "View Plant KPI Summaries & Status", active: true },
      { key: "erp.bom", label: "Inspect Hierarchical Bills of Materials", active: true },
      { key: "erp.inventory", label: "View Stock Inventory Counts", active: true },
      { key: "erp.work_orders", label: "Execute Production Work Orders", active: false },
      { key: "admin.settings", label: "Access Administration Configurations", active: false },
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

  const getRoleCount = (roleId: string) => {
    if (!users) return null;
    return users.filter((u) => u.role === roleId).length;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <AdminPageHeader
        title="Roles & Authorization Architecture"
        description="Inspect application role definitions, operational scope boundaries, and active permission entitlements enforced by backend middleware."
        breadcrumbs="Console / Roles & Permissions"
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={loadUsers}
            loading={loading}
            className="border-slate-700 bg-[#0c111e] text-slate-200 hover:text-white"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Refresh Counts
          </Button>
        }
      />

      {/* Backend RBAC Architecture Notice */}
      <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-purple-500/40 bg-purple-500/20 text-purple-200">
            <Info className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-200">
              Authorization Model Status: Multi-Role Schema Active
            </h3>
            <p className="mt-1 text-xs text-slate-200 leading-relaxed">
              The application authorization model is governed by MongoDB <code className="text-purple-300 font-bold">UserModel.role</code> enum (<code className="text-purple-200 font-bold">&quot;admin&quot; | &quot;supervisor&quot; | &quot;operator&quot; | &quot;user&quot;</code>). Endpoint access is strictly guarded by the <code className="text-purple-300 font-bold">requireRole(&quot;admin&quot;)</code> Express middleware.
            </p>
          </div>
        </div>
      </div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {SYSTEM_ROLES.map((role) => {
          const count = getRoleCount(role.id);

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
                      <span className="font-mono text-[10px] text-slate-400 font-semibold">
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
                  <span className="block font-mono text-[10px] text-slate-300 font-bold uppercase">
                    Assigned Accounts
                  </span>
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-200 leading-relaxed">
                {role.description}
              </p>

              <div className="mt-3 rounded-lg border border-slate-800 bg-[#080d17] p-2.5 font-mono text-[11px] text-slate-200">
                <span className="text-slate-400 uppercase font-semibold">Scope: </span>
                {role.scope}
              </div>

              {/* Permissions Checklist */}
              <div className="mt-5 flex-1 space-y-2 border-t border-slate-800 pt-4">
                <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-300">
                  Enforced Permissions
                </p>
                <ul className="space-y-1.5 text-xs">
                  {role.permissions.map((perm) => (
                    <li
                      key={perm.key}
                      className={`flex items-center gap-2 rounded px-2 py-1 ${
                        perm.active
                          ? "text-slate-100 bg-slate-900/60 font-medium"
                          : "text-slate-400 line-through"
                      }`}
                    >
                      {perm.active ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <Lock className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                      )}
                      <span className="truncate">{perm.label}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 border-t border-slate-800 pt-3 text-right">
                <span className="font-mono text-[11px] text-slate-400 font-semibold">
                  {role.id === "admin"
                    ? "Protected System Role (Immutable)"
                    : "Standard Operational Role"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
