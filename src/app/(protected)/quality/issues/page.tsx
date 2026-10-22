"use client";

import { Eye, Pencil, Plus, RefreshCw, Search, ShieldCheck, Trash2 } from "lucide-react";
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
    <div className="ui-page-enter mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-blue-300/80">Quality Assurance & Compliance</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-100">Quality Issues</h1>
          <p className="mt-1 text-sm text-slate-400">
            {issues.loading ? "Loading…" : `${filtered.length} of ${issues.items.length} issues`}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={issues.reload}
            aria-label="Refresh"
            className="rounded-lg border border-slate-700/90 bg-slate-900/70 p-2.5 text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            <RefreshCw className={`h-4 w-4 ${issues.loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setModal("new")}
            disabled={!ready}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-950/20 transition hover:bg-blue-500 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            <Plus className="h-4 w-4" /> New Issue
          </button>
        </div>
      </div>

      <div className="ui-section-enter mt-7">
        <StatusFilterCards options={ISSUE_STATUSES} counts={counts} active={statusFilter} onChange={setStatusFilter} />
      </div>

      <div className="ui-surface mt-4 rounded-xl p-3 sm:p-4">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Filter quality issues</p>
          {(search || statusFilter || severityFilter || typeFilter) && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatusFilter("");
                setSeverityFilter("");
                setTypeFilter("");
              }}
              className="text-xs font-medium text-blue-400 transition hover:text-blue-300"
            >
              Clear filters
            </button>
          )}
        </div>
        <div className="grid gap-3 sm:grid-cols-[1fr_170px_190px]">
          <Input
            label=""
            aria-label="Search issues"
            icon={Search}
            placeholder="Search by issue, work order, product or defect…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select
            aria-label="Filter by severity"
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
          >
            <option value="">All severities</option>
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
            <option value="">All types</option>
            {QUALITY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="ui-section-enter mt-4 overflow-hidden rounded-xl border border-slate-800/90 bg-slate-900/80 shadow-lg shadow-slate-950/10">
        {issues.loading ? (
          <div className="flex justify-center p-16"><Spinner className="h-7 w-7" /></div>
        ) : issues.error ? (
          <div className="p-12 text-center">
            <p className="text-red-400">{issues.error}</p>
            <button onClick={issues.reload} className="mt-3 text-sm font-medium text-blue-400 hover:text-blue-300">Try again</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center p-16 text-center">
            <ShieldCheck className="h-10 w-10 text-slate-600" />
            <p className="mt-4 text-slate-300">{issues.items.length ? "No issues match your filters." : "No quality issues yet."}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] text-left text-sm">
              <thead className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-3 font-medium">Issue</th>
                  <th className="px-5 py-3 font-medium">Work order</th>
                  <th className="px-5 py-3 font-medium">Product</th>
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="px-5 py-3 text-right font-medium">Inspected / Pass / Fail</th>
                  <th className="px-5 py-3 font-medium">Severity</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map((i) => (
                  <tr key={i._id} className="ui-table-row hover:bg-slate-800/40">
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/quality/details?id=${i._id}`}
                        className="font-mono text-xs font-medium text-blue-300 hover:text-blue-200 hover:underline"
                      >
                        {i.issueNumber}
                      </Link>
                      {i.defectType && (
                        <p className="mt-0.5 max-w-[160px] truncate text-xs text-slate-400" title={i.defectType}>
                          {i.defectType}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-300">
                      {i.workOrder?.workOrderNumber ?? <span className="text-slate-500">Deleted</span>}
                    </td>
                    <td className="px-5 py-3.5">
                      {i.product ? (
                        <span className="font-medium text-slate-200">{i.product.name}</span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5"><Badge meta={findMeta(QUALITY_TYPES, i.type)} /></td>
                    <td className="px-5 py-3.5 text-right font-mono text-xs tabular-nums">
                      <span className="text-slate-200">{i.quantityInspected}</span>
                      <span className="mx-1 text-slate-500">/</span>
                      <span className="font-medium text-emerald-400">{i.quantityPassed}</span>
                      <span className="mx-1 text-slate-500">/</span>
                      <span className={i.quantityFailed > 0 ? "font-medium text-red-400" : "text-slate-400"}>
                        {i.quantityFailed}
                      </span>
                    </td>
                    <td className="px-5 py-3.5"><Badge meta={findMeta(SEVERITIES, i.severity)} /></td>
                    <td className="px-5 py-3.5"><Badge meta={findMeta(ISSUE_STATUSES, i.status)} /></td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-1">
                        <Link
                          href={`/quality/details?id=${i._id}`}
                          aria-label={`View ${i.issueNumber}`}
                          title="View details"
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => setModal(i)}
                          aria-label={`Edit ${i.issueNumber}`}
                          title="Edit issue"
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setToDelete(i)}
                          aria-label={`Delete ${i.issueNumber}`}
                          title="Delete issue"
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-red-500/10 hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
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

      <Modal open={modal !== null} wide title={modal === "new" ? "New Quality Issue" : "Edit Quality Issue"} onClose={() => setModal(null)}>
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
        title="Delete quality issue?"
        message={`${toDelete?.issueNumber} will be permanently removed. This can't be undone.`}
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}