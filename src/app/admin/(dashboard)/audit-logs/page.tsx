"use client";

import {
  CheckCircle2,
  Filter,
  History,
  RefreshCw,
  Search,
  ShieldCheck,
  Terminal,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminErrorState from "@/components/admin/AdminErrorState";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Spinner from "@/components/ui/Spinner";
import { adminService, type AuditLogItem } from "@/services/admin.service";
import { formatDate } from "@/utils/format";

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getAuditLogs();
      setLogs(data);
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || "Failed to retrieve audit log trail.");
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    const q = search.trim().toLowerCase();
    return logs.filter((log) => {
      const matchesSearch =
        !q ||
        log.actorEmail.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.targetResource.toLowerCase().includes(q) ||
        (log.details && log.details.toLowerCase().includes(q));

      const matchesAction = actionFilter === "all" || log.action === actionFilter;

      return matchesSearch && matchesAction;
    });
  }, [logs, search, actionFilter]);

  const uniqueActions = useMemo(() => {
    const set = new Set<string>();
    logs.forEach((l) => set.add(l.action));
    return Array.from(set);
  }, [logs]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <AdminPageHeader
        title="Administrative Audit Trail"
        description="Immutable real-time ledger of security events, privilege adjustments, and configuration modifications recorded by the Ricoz MFG backend."
        breadcrumbs="Console / Audit Logs"
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={fetchLogs}
            loading={loading}
            className="border-slate-700 bg-[#0c111e] text-slate-200 hover:text-white"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Refresh Trail
          </Button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-slate-800 bg-[#0c111e] p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:max-w-xs">
            <Input
              label=""
              aria-label="Search audit logs"
              placeholder="Filter by actor, action, or details…"
              icon={Search}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="h-9.5 rounded-lg border border-slate-700 bg-[#0d131f] px-3 font-mono text-xs text-slate-200 focus:border-purple-500 focus:outline-none"
            >
              <option value="all">All Event Actions</option>
              {uniqueActions.map((act) => (
                <option key={act} value={act}>
                  {act}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-[#0c111e] p-16">
          <Spinner className="h-8 w-8 text-purple-400" />
          <p className="mt-3 font-mono text-xs text-slate-300">Retrieving audit events from backend…</p>
        </div>
      ) : error ? (
        <AdminErrorState
          title="Audit Log Pipeline Error"
          message={error}
          technicalDetails="Ensure the backend is online and the endpoint /admin/audit-logs is responding."
          onRetry={fetchLogs}
        />
      ) : filteredLogs.length === 0 ? (
        <AdminEmptyState
          icon={History}
          title={logs.length === 0 ? "Zero Audit Events Recorded" : "No Matching Log Records"}
          description={
            logs.length === 0
              ? "No administrative events have been recorded yet. Administrative modifications like role changes will appear here."
              : "No audit events match your search or action filter."
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0c111e] shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-[#080d17] font-mono uppercase tracking-wider text-slate-200">
                <tr>
                  <th className="px-4 py-3 font-bold">Timestamp</th>
                  <th className="px-4 py-3 font-bold">Actor</th>
                  <th className="px-4 py-3 font-bold">Action</th>
                  <th className="px-4 py-3 font-bold">Target</th>
                  <th className="px-4 py-3 font-bold">Status</th>
                  <th className="px-4 py-3 font-bold">Details</th>
                  <th className="px-4 py-3 font-bold text-right">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono">
                {filteredLogs.map((log) => (
                  <tr key={log._id} className="transition-colors hover:bg-[#0e1424]">
                    <td className="px-4 py-3 text-slate-300 whitespace-nowrap text-[11px]">
                      {new Date(log.createdAt).toLocaleString("en-IN", {
                        dateStyle: "short",
                        timeStyle: "medium",
                      })}
                    </td>

                    <td className="px-4 py-3">
                      <span className="font-bold text-white block truncate max-w-[180px]">
                        {log.actorEmail}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span className="inline-block rounded border border-purple-500/40 bg-purple-500/15 px-2 py-0.5 font-mono text-[10px] font-bold text-purple-200">
                        {log.action}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-slate-300">
                      <span className="text-slate-200 font-semibold">{log.targetResource}</span>
                      {log.targetId && (
                        <span className="block text-[10px] text-slate-400 font-mono truncate max-w-[120px]">
                          {log.targetId}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {log.outcome === "SUCCESS" ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                          <CheckCircle2 className="h-3.5 w-3.5" /> SUCCESS
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400">
                          <XCircle className="h-3.5 w-3.5" /> {log.outcome}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-slate-300 max-w-[280px] truncate" title={log.details}>
                      {log.details || "—"}
                    </td>

                    <td className="px-4 py-3 text-right text-slate-400 text-[11px] font-mono">
                      {log.ipAddress || "127.0.0.1"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-800 bg-[#080d17] px-4 py-2.5 text-right">
            <span className="font-mono text-[11px] text-slate-300 font-semibold">
              Showing {filteredLogs.length} of {logs.length} logged events
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
