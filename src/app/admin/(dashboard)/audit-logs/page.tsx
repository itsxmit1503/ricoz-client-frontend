"use client";

import { AlertCircle, History, Terminal } from "lucide-react";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

export default function AdminAuditLogsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <AdminPageHeader
        title="Administrative Audit Trail"
        description="Immutable record of security events, privilege adjustments, and configuration modifications."
        breadcrumbs="Console / Audit Logs"
      />

      {/* Honest Backend Pipeline Notice */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">
        <div className="flex items-start gap-3.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/15 text-amber-400">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-amber-200">
              Audit Logging Pipeline: Awaiting Dedicated Backend Collection
            </h3>
            <p className="mt-1 text-xs text-slate-300 leading-relaxed">
              The Ricoz MFG Express backend does not currently have an audit log collection pipeline or MongoDB collection (<code className="text-amber-300">AuditLogModel</code>). Historical administrator activities, login attempts, and privilege modifications are not fabricated or simulated.
            </p>
          </div>
        </div>
      </div>

      {/* Technical Specifications for Backend Requirement */}
      <div className="rounded-xl border border-slate-800 bg-[#0c111e] p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-purple-400" />
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-purple-300">
            Backend Integration Specification
          </h2>
        </div>
        <p className="mt-1 text-xs text-slate-400">
          The following endpoint and data schema are required to enable persistent audit logging:
        </p>

        <div className="mt-4 rounded-lg border border-slate-800/80 bg-[#080d17] p-4 font-mono text-xs text-slate-300 space-y-2">
          <p className="text-purple-400">
            <strong>Endpoint:</strong> GET /api/v1/audit-logs (Paginated, filtered by action &amp; actor)
          </p>
          <p className="text-slate-400">
            <strong>Expected Document Schema:</strong>
          </p>
          <pre className="text-[11px] text-slate-300 overflow-x-auto p-2 bg-[#050810] rounded border border-slate-900">
{`interface AuditLogRecord {
  _id: string;
  timestamp: string;          // ISO 8601 UTC
  actorId: string;            // Admin User ID
  actorEmail: string;         // Admin Email
  action: "LOGIN" | "ROLE_CHANGE" | "USER_DELETE" | "SETTING_UPDATE";
  targetResource: string;     // e.g. "User:670fa93b..."
  outcome: "SUCCESS" | "FAILURE";
  ipAddress?: string;         // Anonymized IP
  metadata?: Record<string, unknown>;
}`}
          </pre>
        </div>
      </div>

      {/* Clean Truthful Empty State */}
      <AdminEmptyState
        icon={History}
        title="Zero Audit Events Recorded"
        description="No historical administrative log entries are stored in the active database. Once the backend pipeline is connected, security audit entries will stream here in real time."
      />
    </div>
  );
}
