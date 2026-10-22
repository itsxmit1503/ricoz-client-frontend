"use client";

import { Eye, Pencil, Plus, RefreshCw, Search, ShieldCheck, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import QualityIssueForm, { emptyQualityForm, qualityIssueToForm } from "@/components/quality/QualityIssueForm";
import Badge from "@/components/ui/Badge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import Spinner from "@/components/ui/Spinner";
import StatusFilterCards from "@/components/ui/StatusFilterCards";
import { useAuth } from "@/hooks/useAuth";
import { useList } from "@/hooks/useList";
import { productService } from "@/services/product.service";
import { qualityIssueService } from "@/services/qualityIssue.service";
import { workOrderService } from "@/services/workOrder.service";
import { findMeta } from "@/types/common";
import {
  ISSUE_STATUSES,
  QUALITY_TYPES,
  SEVERITIES,
  withClosedAt,
  type QualityIssue,
  type QualityIssueInput,
} from "@/types/quality";
import { nextNumber } from "@/utils/format";
import { getErrorMessage } from "@/utils/getErrorMessage";

export default function QualityIssuesPage() {
  const { user } = useAuth();
  const issues = useList(qualityIssueService.list, "Could not load quality issues.");
  const workOrders = useList(workOrderService.list, "Could not load work orders.");
  const products = useList(productService.list, "Could not load products.");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [modal, setModal] = useState<"new" | QualityIssue | null>(null);
  const [toDelete, setToDelete] = useState<QualityIssue | null>(null);
  const [deleting, setDeleting] = useState(false);

  const ready = !issues.loading && !workOrders.loading && !products.loading;

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    issues.items.forEach((i) => (map[i.status] = (map[i.status] ?? 0) + 1));
    return map;
  }, [issues.items]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return issues.items.filter(
      (i) =>
        (!q ||
          i.issueNumber.toLowerCase().includes(q) ||
          (i.workOrder?.workOrderNumber ?? "").toLowerCase().includes(q) ||
          (i.product?.name ?? "").toLowerCase().includes(q) ||
          (i.defectType ?? "").toLowerCase().includes(q)) &&
        (!statusFilter || i.status === statusFilter) &&
        (!severityFilter || i.severity === severityFilter) &&
        (!typeFilter || i.type === typeFilter),
    );
  }, [issues.items, search, statusFilter, severityFilter, typeFilter]);

  const suggestedNumber = useMemo(() => nextNumber("QI", issues.items.map((i) => i.issueNumber)), [issues.items]);

  async function handleSave(values: QualityIssueInput) {
    const editing = modal !== null && modal !== "new" ? modal : null;
    try {
      if (editing) {
        await qualityIssueService.update(editing._id, withClosedAt(values, editing.closedAt));
        toast.success(`${values.issueNumber} updated`);
      } else {
        await qualityIssueService.create({ ...withClosedAt(values), inspector: user?._id });
        toast.success(`${values.issueNumber} created`);
      }
      setModal(null);
      issues.reload(); // reload so work order / product names come back populated
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not save quality issue."));
    }
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await qualityIssueService.remove(toDelete._id);
      issues.setItems((list) => list.filter((i) => i._id !== toDelete._id));
      toast.success(`${toDelete.issueNumber} deleted`);
      setToDelete(null);
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not delete quality issue."));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="ui-page-enter mx-auto max-w-7xl space-y-6">
      {/* Header Deck */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-700/60 bg-slate-800 text-blue-400">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <p className="text-xs font-medium text-blue-400">
              Quality
            </p>
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Quality Issues
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            {issues.loading ? "Loading issues…" : `${filtered.length} of ${issues.items.length} quality issues`}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={issues.reload}
            disabled={issues.loading}
            aria-label="Refresh quality log"
            title="Refresh quality log"
            className="rounded-lg border border-slate-700/80 bg-slate-900/80 p-2.5 text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${issues.loading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={() => setModal("new")}
            disabled={!ready}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" /> Log Issue
          </button>
        </div>
      </div>

      {/* Status Filter Cards */}
      <StatusFilterCards
        options={ISSUE_STATUSES}
        counts={counts}
        active={statusFilter}
        onChange={setStatusFilter}
      />

      {/* Search & Severity / Type Filter Strip */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/70 p-4 shadow-sm sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Filter Quality Records
            </h2>
            <p className="text-[11px] text-slate-500">Search by ticket number, work order, defect type, or classification</p>
          </div>
          {(search || statusFilter || severityFilter || typeFilter) && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatusFilter("");
                setSeverityFilter("");
                setTypeFilter("");
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 transition hover:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <X className="h-3.5 w-3.5" /> Clear active filters
            </button>
          )}
        </div>

        <div className="mt-3.5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_180px_180px]">
          <Input
            label=""
            aria-label="Search issues"
            icon={Search}
            placeholder="Search by issue number, work order, product or defect…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select
            label=""
            aria-label="Filter by severity"
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
          >
            <option value="">All Severities</option>
            {SEVERITIES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </Select>
          <Select
            label=""
            aria-label="Filter by type"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All Types</option>
            {QUALITY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Issues Data Table */}
      <div className="overflow-hidden rounded-xl border border-slate-800/90 bg-slate-900/80 shadow-xl shadow-black/20">
        {issues.loading ? (
          <div className="flex flex-col items-center justify-center p-16 text-slate-400">
            <Spinner className="h-7 w-7 text-blue-400" />
            <p className="mt-3 text-xs font-medium">Loading quality issues…</p>
          </div>
        ) : issues.error ? (
          <div className="p-12 text-center">
            <p className="text-sm font-medium text-red-400">{issues.error}</p>
            <button onClick={issues.reload} className="mt-3 text-xs font-semibold text-blue-400 underline hover:text-blue-300">
              Try again
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-slate-950/60 text-slate-500">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-slate-200">No quality issues logged</h3>
            <p className="mt-1 text-xs text-slate-400">
              {search || statusFilter || severityFilter || typeFilter ? "No issues matched your active filters." : "All production batches are currently passing inspection."}
            </p>
            {!issues.items.length && ready && (
              <button
                onClick={() => setModal("new")}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-500"
              >
                <Plus className="h-3.5 w-3.5" /> Log First Issue
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800/90 bg-slate-950/70 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-3.5">Ticket #</th>
                  <th className="px-5 py-3.5">Work Order</th>
                  <th className="px-5 py-3.5">Product</th>
                  <th className="px-5 py-3.5">Classification</th>
                  <th className="px-5 py-3.5 text-right">Inspected / Pass / Fail</th>
                  <th className="px-5 py-3.5">Severity</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((i) => (
                  <tr key={i._id} className="ui-table-row">
                    <td className="whitespace-nowrap px-5 py-3.5">
                      <Link
                        href={`/quality/details?id=${i._id}`}
                        className="font-mono font-semibold text-blue-300 hover:text-blue-200 hover:underline"
                      >
                        {i.issueNumber}
                      </Link>
                      {i.defectType && (
                        <p className="mt-0.5 max-w-[160px] truncate text-[11px] text-slate-400" title={i.defectType}>
                          {i.defectType}
                        </p>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 font-mono text-slate-300">
                      {i.workOrder?.workOrderNumber ? (
                        <span>{i.workOrder.workOrderNumber}</span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      {i.product ? (
                        <span className="font-medium text-slate-200">{i.product.name}</span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5">
                      <Badge meta={findMeta(QUALITY_TYPES, i.type)} />
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-right font-mono tabular-nums">
                      <span className="text-slate-300 font-semibold">{i.quantityInspected}</span>
                      <span className="mx-1 text-slate-600">/</span>
                      <span className="font-semibold text-emerald-400">{i.quantityPassed}</span>
                      <span className="mx-1 text-slate-600">/</span>
                      <span className={i.quantityFailed > 0 ? "font-semibold text-red-400" : "text-slate-500"}>
                        {i.quantityFailed}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5">
                      <Badge meta={findMeta(SEVERITIES, i.severity)} />
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5">
                      <Badge meta={findMeta(ISSUE_STATUSES, i.status)} />
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/quality/details?id=${i._id}`}
                          aria-label={`View ${i.issueNumber}`}
                          title="Inspect Quality Breakdown"
                          className="rounded-lg border border-slate-800 bg-slate-900/80 p-1.5 text-slate-400 transition hover:border-slate-700 hover:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Link>
                        <button
                          onClick={() => setModal(i)}
                          aria-label={`Edit ${i.issueNumber}`}
                          title="Edit Quality Record"
                          className="rounded-lg border border-slate-800 bg-slate-900/80 p-1.5 text-slate-400 transition hover:border-slate-700 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setToDelete(i)}
                          aria-label={`Delete ${i.issueNumber}`}
                          title="Delete Quality Record"
                          className="rounded-lg border border-slate-800 bg-slate-900/80 p-1.5 text-slate-400 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        open={modal !== null}
        wide
        onClose={() => setModal(null)}
        title={modal === "new" ? "Log Quality Issue" : "Edit Quality Issue"}
      >
        {modal !== null && (
          <QualityIssueForm
            key={modal === "new" ? "new" : modal._id}
            initial={modal === "new" ? emptyQualityForm(suggestedNumber) : qualityIssueToForm(modal)}
            workOrders={workOrders.items}
            products={products.items}
            submitLabel={modal === "new" ? "Submit Issue" : "Save Changes"}
            onSubmit={handleSave}
            onCancel={() => setModal(null)}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete Quality Issue"
        message={`Are you sure you want to permanently delete ticket ${toDelete?.issueNumber}? Corrective action logs will be removed.`}
        loading={deleting}
        confirmLabel="Confirm Deletion"
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
