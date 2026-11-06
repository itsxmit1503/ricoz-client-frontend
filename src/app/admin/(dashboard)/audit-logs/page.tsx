"use client";

import { ChevronLeft, ChevronRight, History, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminErrorState from "@/components/admin/AdminErrorState";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import { adminService, type AuditLogPage } from "@/services/admin.service";

const selectCls =
  "h-9.5 rounded-lg border border-slate-700 bg-[#0d131f] px-3 font-mono text-xs text-slate-200 focus:border-purple-500 focus:outline-none";

export default function AdminAuditLogsPage() {
  const [data, setData] = useState<AuditLogPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [action, setAction] = useState("");
  const [outcome, setOutcome] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.listAuditLogs({ page, limit: 20, action, outcome });
      setData(res);
    } catch (err: unknown) {
      setError((err as Error).message || "Failed to load audit logs from backend.");
    } finally {
      setLoading(false);
    }
  }, [page, action, outcome]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Administrative Audit Trail"
        description="Immutable real-time ledger of security events, privilege adjustments, and configuration modifications recorded by the backend."
        breadcrumbs="Console / Audit Logs"
        badge={data?.dataSource === "database" ? "Live Database" : "Standby Memory"}
        badgeVariant={data?.dataSource === "database" ? "database" : "store"}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={load}
            loading={loading}
            className="border-slate-700 bg-[#0c111e] text-slate-200 hover:text-white"
          >
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Refresh
          </Button>
        }
      />

      <div className="flex flex-wrap gap-2 rounded-xl border border-slate-800 bg-[#0c111e] p-4">
        <select
          value={action}
          onChange={(e) => {
            setAction(e.target.value);
            setPage(1);
          }}
          className={selectCls}
        >
          <option value="">All Actions</option>
          <option value="ROLE_CHANGE">Role change</option>
          <option value="UPDATE_USER_ROLE">Update user role</option>
          <option value="SETTING_UPDATE">Setting update</option>
          <option value="UPDATE_SYSTEM_SETTINGS">Update system settings</option>
          <option value="ACTIVATE_USER">Activate user</option>
          <option value="SUSPEND_USER">Suspend user</option>
          <option value="LOGIN">Login</option>
        </select>
        <select
          value={outcome}
          onChange={(e) => {
            setOutcome(e.target.value);
            setPage(1);
          }}
          className={selectCls}
        >
          <option value="">All Outcomes</option>
          <option value="SUCCESS">Success</option>
          <option value="FAILURE">Failure</option>
        </select>
      </div>

      {loading && !data ? (
        <div className="flex justify-center rounded-xl border border-slate-800 bg-[#0c111e] p-16">
          <Spinner className="h-8 w-8 text-purple-400" />
        </div>
      ) : error ? (
        <AdminErrorState title="Audit Logs Unreachable" message={error} onRetry={load} />
      ) : !data || data.logs.length === 0 ? (
        <AdminEmptyState
          icon={History}
          title="No Audit Events Recorded"
          description="No administrative events match the current filters. All persisted operations will stream here."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0c111e]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-[#080d17] font-mono uppercase tracking-wider text-slate-200">
                <tr>
                  <th className="px-4 py-3 font-bold">Time</th>
                  <th className="px-4 py-3 font-bold">Actor</th>
                  <th className="px-4 py-3 font-bold">Action</th>
                  <th className="px-4 py-3 font-bold">Target</th>
                  <th className="px-4 py-3 font-bold">Outcome</th>
                  <th className="px-4 py-3 font-bold">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono">
                {data.logs.map((l) => (
                  <tr key={l._id} className="hover:bg-[#0e1424]">
                    <td className="whitespace-nowrap px-4 py-3 text-slate-300 text-[11px]">
                      {new Date(l.timestamp || (l as any).createdAt || Date.now()).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-semibold text-white">{l.actorEmail}</td>
                    <td className="px-4 py-3">
                      <AdminStatusBadge variant="admin">{l.action}</AdminStatusBadge>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{l.targetResource}</td>
                    <td className="px-4 py-3">
                      <AdminStatusBadge variant={l.outcome === "SUCCESS" ? "success" : "danger"}>
                        {l.outcome}
                      </AdminStatusBadge>
                    </td>
                    <td className="max-w-xs truncate px-4 py-3 text-[11px] text-slate-300">
                      {typeof l.metadata === "string" ? l.metadata : (l.details || JSON.stringify(l.metadata || ""))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-slate-800 bg-[#080d17] px-4 py-2.5">
            <span className="font-mono text-[11px] text-slate-300 font-semibold">
              {data.total} events · page {data.page} of {Math.max(1, data.pages)}
            </span>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="h-4 w-4 text-slate-300" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={page >= data.pages}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight className="h-4 w-4 text-slate-300" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
