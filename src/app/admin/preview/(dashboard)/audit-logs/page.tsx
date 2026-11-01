"use client";

import { AlertCircle, History, ShieldAlert, Terminal, UserCheck } from "lucide-react";
import toast from "react-hot-toast";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import Button from "@/components/ui/Button";

interface SyntheticAuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: "LOGIN" | "ROLE_CHANGE" | "SETTING_UPDATE" | "REGISTRY_SYNC";
  target: string;
  outcome: "SUCCESS" | "FAILURE";
  ipAddress: string;
}

const SYNTHETIC_LOGS: SyntheticAuditEvent[] = [
  {
    id: "evt_99101",
    timestamp: "2026-10-28 21:15:32 UTC",
    actor: "admin@ricoz.mfg",
    action: "LOGIN",
    target: "Console:SessionEstablished",
    outcome: "SUCCESS",
    ipAddress: "192.168.1.104",
  },
  {
    id: "evt_99102",
    timestamp: "2026-10-28 20:45:10 UTC",
    actor: "admin@ricoz.mfg",
    action: "ROLE_CHANGE",
    target: "User:m.vance@ricoz.mfg",
    outcome: "SUCCESS",
    ipAddress: "192.168.1.104",
  },
  {
    id: "evt_99103",
    timestamp: "2026-10-28 19:20:44 UTC",
    actor: "admin@ricoz.mfg",
    action: "SETTING_UPDATE",
    target: "Facility:MFG-US-EAST",
    outcome: "SUCCESS",
    ipAddress: "192.168.1.104",
  },
  {
    id: "evt_99104",
    timestamp: "2026-10-28 18:02:11 UTC",
    actor: "system_daemon",
    action: "REGISTRY_SYNC",
    target: "MachineRegistry:CNC-04",
    outcome: "SUCCESS",
    ipAddress: "127.0.0.1",
  },
];

export default function AdminPreviewAuditLogsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <AdminPageHeader
        badge="PREVIEW MODE // AUDIT VISUALIZATION"
        title="Administrative Audit Trail (Preview)"
        description="Immutable record of security events, privilege adjustments, and configuration modifications. Displaying synthetic entries to preview the timeline interface."
        breadcrumbs="Console / Preview / Audit Logs"
      />

      {/* Backend Pipeline Status Notice */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">
        <div className="flex items-start gap-3.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/15 text-amber-400">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-amber-200">
              Audit Logging Pipeline: Visual Demonstration Preview
            </h3>
            <p className="mt-1 text-xs text-slate-300 leading-relaxed">
              Below is a visual simulation of the administrative audit log timeline. The live Express backend requires provisioning of the <code className="text-amber-300">AuditLogModel</code> collection and <code className="text-amber-300">GET /api/v1/audit-logs</code> endpoint before live database events stream here.
            </p>
          </div>
        </div>
      </div>

      {/* Synthetic Audit Log Table Preview */}
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0c111e] shadow-sm">
        <div className="border-b border-slate-800 bg-[#080d17] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-amber-400" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
              Simulated Audit Ledger
            </span>
          </div>
          <span className="font-mono text-[10px] text-amber-400 border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 rounded">
            SYNTHETIC TIMELINE
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="border-b border-slate-800 bg-[#060a12] uppercase tracking-wider text-slate-400 text-[11px]">
              <tr>
                <th className="px-4 py-3">Timestamp (UTC)</th>
                <th className="px-4 py-3">Actor</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Target Resource</th>
                <th className="px-4 py-3">Outcome</th>
                <th className="px-4 py-3 text-right">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {SYNTHETIC_LOGS.map((log) => (
                <tr key={log.id} className="transition-colors hover:bg-[#0e1424]">
                  <td className="px-4 py-3 text-slate-400 text-[11px] whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-200">
                    {log.actor}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 text-[10px] text-purple-300 font-bold">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300 text-[11px]">
                    {log.target}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] text-emerald-400 font-bold">
                      ● {log.outcome}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-slate-500 text-[11px]">
                    {log.ipAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-800 bg-[#080d17] px-4 py-2 text-right">
          <span className="font-mono text-[11px] text-slate-500">
            Showing 4 synthetic audit event entries (Visual Proof of Concept)
          </span>
        </div>
      </div>
    </div>
  );
}
