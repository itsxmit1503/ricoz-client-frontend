"use client";

import { Eye, Pencil, Plus, RefreshCw, Search, ShieldAlert, ShieldCheck, Trash2 } from "lucide-react";
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
      issues.reload();
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
            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-700 bg-[#121826] text-blue-400">
              <ShieldAlert className="h-4 w-4" />
            </span>
            <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              Quality Assurance
            </p>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Non-Conformance & CAPA Issues
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            {issues.loading ? "Loading defects…" : `${filtered.length} of ${issues.items.length} issues tracked`}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={issues.reload}
            disabled={issues.loading}
            aria-label="Refresh quality log"
            title="Refresh quality log"
            className="rounded-lg border border-slate-700 bg-[#121826] p-2.5 text-slate-200 transition hover:border-slate-600 hover:bg-[#192235] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${issues.loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setModal("new")}
            disabled={!ready}
            className="inline-flex min-h-9.5 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:opacity-60"
          >
            <Plus className="h-4 w-4" /> Log Quality Issue
          </button>
        </div>
      </div>

      {/* Filter Cards */}
      <StatusFilterCards options={ISSUE_STATUSES} counts={counts} active={statusFilter} onChange={setStatusFilter} />

      {/* Filter Bar */}
      <div className="rounded-xl border border-slate-800 bg-[#0c111e] p-4">
        <div className="grid gap-3 sm:grid-cols-[1fr_170px_190px]">
          <Input
            label=""
            aria-label="Search issues"
            icon={Search}
            placeholder="Search by issue ID, work order, part, or defect type…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select
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
            aria-label="Filter by type"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All Issue Types</option>
            {QUALITY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Issues Data Table */}
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0c111e] shadow-xl">
        {issues.loading ? (
          <div className="flex flex-col items-center justify-center p-16 text-slate-300">
            <Spinner className="h-7 w-7 text-blue-400" />
            <p className="mt-3 text-xs font-medium">Loading quality inspection logs…</p>
          </div>
        ) : issues.error ? (
          <div className="p-12 text-center">
            <p className="text-sm font-medium text-rose-400">{issues.error}</p>
            <button
              onClick={issues.reload}
              className="mt-3 text-xs font-semibold text-blue-400 underline hover:text-blue-300"
            >
              Retry loading
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center p-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-[#080d17] text-slate-400">
              <ShieldCheck className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-white">No quality issues found</h3>
            <p className="mt-1 text-xs text-slate-300">
              {issues.items.length ? "No issues match your current filters." : "Zero non-conformances recorded on active production lines."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-[#080d17] text-xs font-semibold uppercase tracking-wider text-slate-300">
                <tr>
                  <th className="px-5 py-3.5">Issue Reference</th>
                  <th className="px-5 py-3.5">Work Order</th>
                  <th className="px-5 py-3.5">Product Part</th>
                  <th className="px-5 py-3.5">Type</th>
                  <th className="px-5 py-3.5 text-right">Inspected / Pass / Fail</th>
                  <th className="px-5 py-3.5">Severity</th>
                  <th className="px-5 py-3.5">Resolution Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filtered.map((i) => (
                  <tr key={i._id} className="ui-table-row">
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/quality/details?id=${i._id}`}
                        className="font-mono text-xs font-bold text-blue-300 hover:text-blue-200"
                      >
                        {i.issueNumber}
                      </Link>
                      {i.defectType && (
                        <p className="max-w-[180px] truncate text-xs text-slate-300 font-medium" title={i.defectType}>
                          {i.defectType}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-200">
                      {i.workOrder?.workOrderNumber ?? <span className="text-slate-400">—</span>}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-white">
                      {i.product ? i.product.name : <span className="text-slate-400 font-mono">—</span>}
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge meta={findMeta(QUALITY_TYPES, i.type)} />
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono text-xs">
                      <span className="text-white font-bold">{i.quantityInspected}</span> /{" "}
                      <span className="text-emerald-400 font-semibold">{i.quantityPassed}</span> /{" "}
                      <span className={i.quantityFailed > 0 ? "text-rose-400 font-bold" : "text-slate-300"}>
                        {i.quantityFailed}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge meta={findMeta(SEVERITIES, i.severity)} />
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge meta={findMeta(ISSUE_STATUSES, i.status)} />
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex justify-end gap-1.5">
                        <Link
                          href={`/quality/details?id=${i._id}`}
                          aria-label={`View ${i.issueNumber}`}
                          title="View issue details"
                          className="rounded-lg border border-slate-700 bg-[#121826] p-1.5 text-slate-300 transition hover:border-slate-600 hover:text-white"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setModal(i)}
                          aria-label={`Edit ${i.issueNumber}`}
                          title="Edit issue"
                          className="rounded-lg border border-slate-700 bg-[#121826] p-1.5 text-slate-300 transition hover:border-slate-600 hover:text-white"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setToDelete(i)}
                          aria-label={`Delete ${i.issueNumber}`}
                          title="Delete issue"
                          className="rounded-lg border border-slate-700 bg-[#121826] p-1.5 text-slate-300 transition hover:border-rose-600 hover:bg-rose-950/40 hover:text-rose-400"
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

      <Modal open={modal !== null} wide title={modal === "new" ? "Log Quality Issue" : "Edit Quality Issue"} onClose={() => setModal(null)}>
        {modal !== null && (
          <QualityIssueForm
            key={modal === "new" ? "new" : modal._id}
            initial={modal === "new" ? emptyQualityForm(suggestedNumber) : qualityIssueToForm(modal)}
            workOrders={workOrders.items}
            products={products.items}
            submitLabel={modal === "new" ? "Create issue" : "Save changes"}
            onSubmit={handleSave}
            onCancel={() => setModal(null)}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete Quality Record?"
        message={`${toDelete?.issueNumber} will be permanently removed from quality history. This action cannot be reversed.`}
        confirmLabel="Confirm Deletion"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
