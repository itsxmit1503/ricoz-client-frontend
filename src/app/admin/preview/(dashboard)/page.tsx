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
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminStatCard from "@/components/admin/AdminStatCard";
import Button from "@/components/ui/Button";

export default function AdminPreviewOverviewPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Preview metrics refreshed (Synthetic data)");
    }, 500);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <AdminPageHeader
        badge="PREVIEW MODE // DEMONSTRATION"
        title="Admin Overview (Preview)"
        description="Private central command visual demonstration. Displaying synthetic baseline metrics for user governance, role inspection, and master data registries."
        breadcrumbs="Console / Preview / Overview"
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            loading={isRefreshing}
            className="border-slate-800 bg-[#0c111e] text-slate-300 hover:text-white"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Refresh Telemetry
          </Button>
        }
      />

      {/* Primary Verified Metrics (Synthetic for Preview) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          title="Total User Accounts"
          value={5}
          icon={Users}
          badge="Synthetic"
          subtitle="5 accounts in synthetic directory"
        />

        <AdminStatCard
          title="Administrator Accounts"
          value={2}
          icon={ShieldCheck}
          badge="High Privilege"
          subtitle="2 accounts with admin role"
        />

        <AdminStatCard
          title="Verified Email Accounts"
          value={4}
          icon={UserCheck}
          badge="Synthetic"
          subtitle="4 confirmed email records"
        />

        <AdminStatCard
          title="Backend Service Link"
          value="PREVIEW SIM"
          icon={Server}
          badge="Read-Only"
          subtitle="Synthetic telemetry sandbox"
        />
      </div>

      {/* Quick Action Dispatch & Master Data Overview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Working Quick Shortcuts */}
        <div className="rounded-xl border border-slate-800 bg-[#0c111e] p-6 shadow-sm">
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-amber-400">
            Administrative Shortcuts
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Preview navigation across operational management modules.
          </p>

          <div className="mt-4 space-y-2">
            <Link
              href="/admin/preview/users"
              className="ui-pressable group flex items-center justify-between rounded-lg border border-slate-800 bg-[#080d17] p-3 text-xs text-slate-200 transition hover:border-slate-700 hover:bg-[#0e1424]"
            >
              <div className="flex items-center gap-2.5">
                <Users className="h-4 w-4 text-blue-400" />
                <span className="font-semibold">User Directory</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-slate-500 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/admin/preview/roles"
              className="ui-pressable group flex items-center justify-between rounded-lg border border-slate-800 bg-[#080d17] p-3 text-xs text-slate-200 transition hover:border-slate-700 hover:bg-[#0e1424]"
            >
              <div className="flex items-center gap-2.5">
                <KeyRound className="h-4 w-4 text-purple-400" />
                <span className="font-semibold">Roles &amp; Permissions Matrix</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-slate-500 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/admin/preview/master-data"
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
              <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-amber-400">
                Service Connectivity Diagnostics (Preview)
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Visual inspection of environment endpoints and authentication services.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast("Preview ping: 12ms (Simulated)", { icon: "⚡" })}
              className="border-slate-800 bg-[#080d17] text-xs text-slate-300"
            >
              Test Ping
            </Button>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-800/80 bg-[#080d17] p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">Ricoz Express REST API</span>
                <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-amber-400">
                  <CheckCircle2 className="h-3.5 w-3.5" /> PREVIEW SANDBOX
                </span>
              </div>
              <p className="mt-1.5 font-mono text-[11px] text-slate-500 truncate">
                Simulated Sandbox (No external network required)
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                Status: Safe read-only inspection mode
              </p>
            </div>

            <div className="rounded-lg border border-slate-800/80 bg-[#080d17] p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">Admin Session Gate</span>
                <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-amber-300">
                  <CheckCircle2 className="h-3.5 w-3.5" /> PREVIEW MODE
                </span>
              </div>
              <p className="mt-1.5 font-mono text-[11px] text-slate-500">
                Access: Public Read-Only Inspection
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                Security: Live production routes stay locked
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Truthful Administrative Activity Log */}
      <div className="rounded-xl border border-slate-800 bg-[#0c111e] p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-amber-400">
              Administrative Activity Ledger
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Audit trail of configuration updates and privilege changes.
            </p>
          </div>
          <Link
            href="/admin/preview/audit-logs"
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition"
          >
            Inspect Pipeline →
          </Link>
        </div>

        <div className="mt-4">
          <AdminEmptyState
            icon={History}
            title="No Live Administrative Activity Recorded"
            description="Audit logging pipeline is awaiting dedicated backend persistence. Administrative changes in development are held in memory."
          />
        </div>
      </div>
    </div>
  );
}
