"use client";

import {
  ArrowRight,
  CheckCircle2,
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
import { adminService, type BackendHealthStatus } from "@/services/admin.service";
import type { User } from "@/types/auth";

export default function AdminOverviewPage() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [userError, setUserError] = useState<string | null>(null);

  const [health, setHealth] = useState<BackendHealthStatus | null>(null);
  const [checkingHealth, setCheckingHealth] = useState(false);

  const loadData = async () => {
    setLoadingUsers(true);
    setUserError(null);
    try {
      const userList = await adminService.listUsers();
      setUsers(userList);
    } catch (err: unknown) {
      const error = err as Error;
      setUserError(error.message || "Could not retrieve user directory.");
      setUsers(null);
    } finally {
      setLoadingUsers(false);
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
    checkHealth();
  }, []);

  // Compute metrics only if real data was loaded
  const totalUsers = users !== null ? users.length : null;
  const adminUsers = users !== null ? users.filter((u) => u.role === "admin").length : null;
  const verifiedUsers = users !== null ? users.filter((u) => u.isemailVerified).length : null;

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
            onClick={() => {
              loadData();
              checkHealth();
            }}
            loading={loadingUsers || checkingHealth}
            className="border-slate-800 bg-[#0c111e] text-slate-300 hover:text-white"
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
          loading={loadingUsers}
          error={userError}
          subtitle={
            users !== null
              ? `${totalUsers} accounts in user database`
              : "Awaiting live API connection"
          }
        />

        <AdminStatCard
          title="Administrator Accounts"
          value={adminUsers}
          icon={ShieldCheck}
          loading={loadingUsers}
          error={userError}
          badge="High Privilege"
          subtitle={
            users !== null
              ? `${adminUsers} accounts with admin role`
              : "Awaiting live API connection"
          }
        />

        <AdminStatCard
          title="Verified Email Accounts"
          value={verifiedUsers}
          icon={UserCheck}
          loading={loadingUsers}
          error={userError}
          subtitle={
            users !== null
              ? `${verifiedUsers} confirmed email records`
              : "Awaiting live API connection"
          }
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
          technicalDetails="Ensure NEXT_PUBLIC_BACKEND_URL is pointing to a running Ricoz Express backend instance with valid admin token session."
          onRetry={loadData}
        />
      )}

      {/* Quick Action Dispatch & Master Data Overview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Working Quick Shortcuts */}
        <div className="rounded-xl border border-slate-800 bg-[#0c111e] p-6 shadow-sm">
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-purple-400">
            Administrative Shortcuts
          </h2>
          <p className="mt-1 text-xs text-slate-400">
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
              <ArrowRight className="h-3.5 w-3.5 text-slate-500 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/admin/roles"
              className="ui-pressable group flex items-center justify-between rounded-lg border border-slate-800 bg-[#080d17] p-3 text-xs text-slate-200 transition hover:border-slate-700 hover:bg-[#0e1424]"
            >
              <div className="flex items-center gap-2.5">
                <KeyRound className="h-4 w-4 text-purple-400" />
                <span className="font-semibold">Roles &amp; Permissions Matrix</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-slate-500 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/admin/master-data"
              className="ui-pressable group flex items-center justify-between rounded-lg border border-slate-800 bg-[#080d17] p-3 text-xs text-slate-200 transition hover:border-slate-700 hover:bg-[#0e1424]"
            >
              <div className="flex items-center gap-2.5">
                <Database className="h-4 w-4 text-emerald-400" />
                <span className="font-semibold">Master Data Registry</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-slate-500 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Live System Connectivity Card */}
        <div className="rounded-xl border border-slate-800 bg-[#0c111e] p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-purple-400">
                Service Connectivity Diagnostics
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Live verification of environment endpoints and authentication services.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={checkHealth}
              loading={checkingHealth}
              className="border-slate-800 bg-[#080d17] text-xs text-slate-300"
            >
              Test Ping
            </Button>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-800/80 bg-[#080d17] p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">Ricoz Express REST API</span>
                {health?.online ? (
                  <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" /> ONLINE
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-rose-400">
                    <XCircle className="h-3.5 w-3.5" /> UNREACHABLE
                  </span>
                )}
              </div>
              <p className="mt-1.5 font-mono text-[11px] text-slate-500 truncate">
                {health?.url || "NEXT_PUBLIC_BACKEND_URL"}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                Status: {health?.statusText || "Pending check"}
              </p>
            </div>

            <div className="rounded-lg border border-slate-800/80 bg-[#080d17] p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">Admin Session Gate</span>
                <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-purple-300">
                  <CheckCircle2 className="h-3.5 w-3.5" /> ISOLATED DEV
                </span>
              </div>
              <p className="mt-1.5 font-mono text-[11px] text-slate-500">
                Token: HMAC-SHA256 (HttpOnly)
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                Duration: 8h session lifespan
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Truthful Administrative Activity Log */}
      <div className="rounded-xl border border-slate-800 bg-[#0c111e] p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-purple-400">
              Administrative Activity Ledger
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Audit trail of configuration updates and privilege changes.
            </p>
          </div>
          <Link
            href="/admin/audit-logs"
            className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition"
          >
            Inspect Pipeline →
          </Link>
        </div>

        <div className="mt-4">
          <AdminEmptyState
            icon={History}
            title="No Administrative Activity Recorded"
            description="Audit logging pipeline is awaiting dedicated backend persistence. Administrative changes in development are held in memory."
          />
        </div>
      </div>
    </div>
  );
}
