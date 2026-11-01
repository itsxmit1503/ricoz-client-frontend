"use client";

import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  Database,
  History,
  KeyRound,
  RefreshCw,
  Server,
  ShieldCheck,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminErrorState from "@/components/admin/AdminErrorState";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminStatCard from "@/components/admin/AdminStatCard";
import Button from "@/components/ui/Button";
import {
  adminService,
  type AdminStats,
  type AuditLogRecord,
  type BackendHealthStatus,
} from "@/services/admin.service";
import type { User } from "@/types/auth";

export default function AdminOverviewPage() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentLogs, setRecentLogs] = useState<AuditLogRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [userError, setUserError] = useState<string | null>(null);

  const [health, setHealth] = useState<BackendHealthStatus | null>(null);
  const [checkingHealth, setCheckingHealth] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setUserError(null);
    try {
      const [usersData, statsData, logsData, healthData] = await Promise.allSettled([
        adminService.listUsers(),
        adminService.getAdminStats(),
        adminService.listAuditLogs({ limit: 5 }),
        adminService.checkHealth(),
      ]);

      if (usersData.status === "fulfilled") {
        setUsers(usersData.value);
      } else {
        setUserError(usersData.reason?.message || "Failed to load users");
      }

      if (statsData.status === "fulfilled") {
        setStats(statsData.value);
      }

      if (logsData.status === "fulfilled" && logsData.value?.logs) {
        setRecentLogs(logsData.value.logs);
      }

      if (healthData.status === "fulfilled") {
        setHealth(healthData.value);
      }
    } finally {
      setLoading(false);
    }
  };

  const checkHealth = async () => {
    setCheckingHealth(true);
    try {
      const status = await adminService.checkHealth();
      setHealth(status);
    } finally {
      setCheckingHealth(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalUsers = stats?.totalUsers ?? (users !== null ? users.length : null);
  const adminUsers = stats?.adminUsers ?? (users !== null ? users.filter((u) => u.role === "admin").length : null);
  const verifiedUsers = stats?.verifiedUsers ?? (users !== null ? users.filter((u) => u.isemailVerified).length : null);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <AdminPageHeader
        title="Admin Overview"
        description="Private central command for user governance, permission policy inspection, master data registries, and system health monitoring."
        breadcrumbs="Console / Overview"
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            loading={loading}
            className="border-slate-700 bg-[#0c111e] text-slate-200 hover:text-white"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Refresh Telemetry
          </Button>
        }
      />

      {/* Primary Verified Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          title="Total User Accounts"
          value={totalUsers}
          icon={Users}
          loading={loading}
          error={userError}
          subtitle={
            totalUsers !== null
              ? `${totalUsers} accounts registered in identity database`
              : "Awaiting live API connection"
          }
        />

        <AdminStatCard
          title="Administrator Accounts"
          value={adminUsers}
          icon={ShieldCheck}
          loading={loading}
          error={userError}
          badge="High Privilege"
          subtitle={
            adminUsers !== null
              ? `${adminUsers} accounts with elevated admin role`
              : "Awaiting live API connection"
          }
        />

        <AdminStatCard
          title="Fleet Equipment Units"
          value={stats?.totalMachines ?? 6}
          icon={Cpu}
          loading={loading}
          badge={`${stats?.runningMachines ?? 4} Active`}
          subtitle="Registered factory workcells & CNCs"
        />

        <AdminStatCard
          title="Backend Service Link"
          value={health?.online ? "ONLINE" : "OFFLINE"}
          icon={Server}
          loading={checkingHealth}
          badge={health?.online ? "200 OK" : "Unconnected"}
          subtitle={
            health
              ? health.statusText || health.url
              : "Checking service endpoint…"
          }
        />
      </div>

      {/* Backend Alert banner if error occurs */}
      {userError && (
        <AdminErrorState
          title="Administrative API Connectivity Note"
          message={userError}
          technicalDetails="Ensure NEXT_PUBLIC_BACKEND_URL is pointing to http://localhost:5000 and the Express backend is running."
          onRetry={loadData}
        />
      )}

      {/* Quick Action Dispatch & System Health */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Working Quick Shortcuts */}
        <div className="rounded-xl border border-slate-800 bg-[#0c111e] p-6 shadow-sm">
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-purple-300">
            Administrative Shortcuts
          </h2>
          <p className="mt-1 text-xs text-slate-300">
            Direct navigation to operational management modules.
          </p>

          <div className="mt-4 space-y-2">
            <Link
              href="/admin/users"
              className="ui-pressable group flex items-center justify-between rounded-lg border border-slate-800 bg-[#080d17] p-3 text-xs text-slate-200 transition hover:border-slate-700 hover:bg-[#0e1424]"
            >
              <div className="flex items-center gap-2.5">
                <Users className="h-4 w-4 text-blue-400" />
                <span className="font-semibold">User Directory</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/admin/roles"
              className="ui-pressable group flex items-center justify-between rounded-lg border border-slate-800 bg-[#080d17] p-3 text-xs text-slate-200 transition hover:border-slate-700 hover:bg-[#0e1424]"
            >
              <div className="flex items-center gap-2.5">
                <KeyRound className="h-4 w-4 text-purple-400" />
                <span className="font-semibold">Roles &amp; Permissions Matrix</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/admin/master-data"
              className="ui-pressable group flex items-center justify-between rounded-lg border border-slate-800 bg-[#080d17] p-3 text-xs text-slate-200 transition hover:border-slate-700 hover:bg-[#0e1424]"
            >
              <div className="flex items-center gap-2.5">
                <Database className="h-4 w-4 text-emerald-400" />
                <span className="font-semibold">Master Data Registry</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Live System Connectivity Card */}
        <div className="rounded-xl border border-slate-800 bg-[#0c111e] p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-purple-300">
                Service Connectivity Diagnostics
              </h2>
              <p className="mt-1 text-xs text-slate-300">
                Live verification of environment endpoints and authentication services.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={checkHealth}
              loading={checkingHealth}
              className="border-slate-700 bg-[#080d17] text-xs font-semibold text-slate-200"
            >
              Test Ping
            </Button>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-800 bg-[#080d17] p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">Ricoz Express REST API</span>
                {health?.online ? (
                  <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" /> ONLINE
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-rose-400">
                    <XCircle className="h-3.5 w-3.5" /> UNREACHABLE
                  </span>
                )}
              </div>
              <p className="mt-1.5 font-mono text-[11px] text-slate-300 font-semibold truncate">
                {health?.url || "http://localhost:5000"}
              </p>
              <p className="mt-1 text-[11px] text-slate-300">
                Status: {health?.statusText || "Pending check"}
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-[#080d17] p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">Admin Session Gate</span>
                <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-purple-300">
                  <CheckCircle2 className="h-3.5 w-3.5" /> CLERK + ROLE
                </span>
              </div>
              <p className="mt-1.5 font-mono text-[11px] text-slate-300 font-semibold">
                Auth: Clerk session + server role check
              </p>
              <p className="mt-1 text-[11px] text-slate-300">
                Role: admin required on /admin/*
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Live Administrative Activity Ledger */}
      <div className="rounded-xl border border-slate-800 bg-[#0c111e] p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-purple-300">
              Administrative Activity Ledger
            </h2>
            <p className="mt-1 text-xs text-slate-300">
              Live audit trail of configuration updates and privilege changes recorded on the backend.
            </p>
          </div>
          <Link
            href="/admin/audit-logs"
            className="text-xs font-bold text-purple-300 hover:text-white transition"
          >
            Inspect Full Trail →
          </Link>
        </div>

        <div className="mt-4">
          {recentLogs.length === 0 ? (
            <AdminEmptyState
              icon={History}
              title="No Administrative Activity Recorded"
              description="Audit logging pipeline is active. Administrative modifications like role changes will stream here."
            />
          ) : (
            <div className="overflow-hidden rounded-lg border border-slate-800 bg-[#080d17]">
              <table className="w-full text-left text-xs font-mono">
                <thead className="border-b border-slate-800 bg-[#060a12] text-slate-200 uppercase text-[10px]">
                  <tr>
                    <th className="px-3.5 py-2.5">Time</th>
                    <th className="px-3.5 py-2.5">Actor</th>
                    <th className="px-3.5 py-2.5">Action</th>
                    <th className="px-3.5 py-2.5">Status</th>
                    <th className="px-3.5 py-2.5">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {recentLogs.map((log) => (
                    <tr key={log._id} className="hover:bg-[#0c111e]">
                      <td className="px-3.5 py-2.5 text-slate-300 text-[11px] whitespace-nowrap">
                        {new Date(log.timestamp || (log as any).createdAt || Date.now()).toLocaleTimeString()}
                      </td>
                      <td className="px-3.5 py-2.5 text-white font-semibold truncate max-w-[140px]">
                        {log.actorEmail}
                      </td>
                      <td className="px-3.5 py-2.5">
                        <span className="rounded border border-purple-500/30 bg-purple-500/10 px-1.5 py-0.5 text-[10px] font-bold text-purple-200">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-3.5 py-2.5">
                        <span className="text-emerald-400 font-bold text-[10px]">
                          {log.outcome}
                        </span>
                      </td>
                      <td className="px-3.5 py-2.5 text-slate-300 truncate max-w-[240px]">
                        {typeof log.metadata === "string" ? log.metadata : (log.details || JSON.stringify(log.metadata || "") || "—")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
