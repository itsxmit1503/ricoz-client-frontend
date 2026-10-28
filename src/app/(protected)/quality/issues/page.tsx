"use client";

import { Pencil, Plus, RefreshCw, Search, ShieldAlert, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import QualityIssueForm, {
  emptyQualityForm,
  qualityIssueToForm,
} from "@/components/quality/QualityIssueForm";
import Badge from "@/components/ui/Badge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import Spinner from "@/components/ui/Spinner";
import StatusFilterCards from "@/components/ui/StatusFilterCards";
import { useList } from "@/hooks/useList";
import { productService } from "@/services/product.service";
import { qualityIssueService } from "@/services/qualityIssue.service";
import { workOrderService } from "@/services/workOrder.service";
import { findMeta } from "@/types/common";
import {
  inspectorName,
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
          (i.defectType ?? "").toLowerCase().includes(q) ||
          (i.workOrder?.workOrderNumber ?? "").toLowerCase().includes(q) ||
          (i.product?.name ?? "").toLowerCase().includes(q) ||
          (i.product?.code ?? "").toLowerCase().includes(q)) &&
        (!statusFilter || i.status === statusFilter) &&
        (!severityFilter || i.severity === severityFilter) &&
        (!typeFilter || i.type === typeFilter),
    );
  }, [issues.items, search, statusFilter, severityFilter, typeFilter]);

  const suggestedNumber = useMemo(
    () => nextNumber("QI", issues.items.map((i) => i.issueNumber)),
    [issues.items],
  );

  async function handleSave(values: QualityIssueInput) {
    const editing = modal !== null && modal !== "new" ? modal : null;
    try {
      if (editing) {
        await qualityIssueService.update(editing._id, withClosedAt(values, editing.closedAt));
        toast.success("Quality issue updated");
      } else {
        await qualityIssueService.create(withClosedAt(values));
        toast.success("Quality issue logged");
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
      toast.success("Quality issue deleted");
      setToDelete(null);
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not delete quality issue."));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="ui-page-enter mx-auto max-w-7xl space-y-5">
      {/* Header Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950/60 border border-blue-800/50 px-2 py-0.5 rounded">
              ASSURANCE // QUALITY LAB
            </span>
            <span className="text-slate-600 font-mono">•</span>
            <span className="font-mono text-xs text-slate-300 font-semibold">
              {issues.loading ? "Loading…" : `${filtered.length} of ${issues.items.length} incidents logged`}
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
            Non-Conformance & Quality Incidents
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={issues.reload}
            disabled={issues.loading}
            aria-label="Refresh quality log"
            title="Refresh quality log"
            className="rounded-lg border border-slate-700 bg-[#121826] p-2.5 text-slate-200 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${issues.loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setModal("new")}
            disabled={!ready}
            className="inline-flex min-h-9.5 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-500 transition disabled:opacity-60"
          >
            <Plus className="h-4 w-4" /> Log Quality Incident
          </button>
        </div>
      </div>

      {/* Unified Quality Console */}
      <div className="border border-slate-800/90 bg-[#0b101c] rounded-xl overflow-hidden shadow-xl">
        {/* Integrated Command Strip: Filter pills + Search + Severity */}
        <div className="p-4 border-b border-slate-800/80 bg-[#080d17] flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <StatusFilterCards options={ISSUE_STATUSES} counts={counts} active={statusFilter} onChange={setStatusFilter} />

          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <div className="w-full sm:w-60">
              <Input
                label=""
                aria-label="Search issues"
                icon={Search}
                placeholder="Search issue ID, part, defect…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-36">
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
            </div>
            <div className="w-full sm:w-40">
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
        </div>

        {/* Data Table */}
        {issues.loading ? (
          <div className="flex flex-col items-center justify-center p-16 text-slate-300">
            <Spinner className="h-7 w-7 text-blue-400" />
            <p className="mt-3 text-xs font-semibold">Querying quality control records…</p>
          </div>
        ) : issues.error ? (
          <div className="p-12 text-center text-rose-400">{issues.error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-slate-400">No quality incidents match query.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800/80 bg-[#080d17] text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-5">Incident ID</th>
                  <th className="py-3 px-5">Work Order</th>
                  <th className="py-3 px-5">Part / SKU</th>
                  <th className="py-3 px-5">Severity</th>
                  <th className="py-3 px-5 text-right">Pass / Total</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5">Inspector</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filtered.map((i) => (
                  <tr key={i._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-5 font-bold text-white">
                      <Link
                        href={`/quality/details?id=${i._id}`}
                        className="hover:text-blue-400 transition"
                      >
                        {i.issueNumber}
                      </Link>
                    </td>
                    <td className="py-3.5 px-5 font-mono text-slate-300">
                      {i.workOrder?.workOrderNumber ?? "—"}
                    </td>
                    <td className="py-3.5 px-5 font-sans font-semibold text-slate-100">
                      {i.product ? (
                        <div>
                          <p className="font-semibold text-white">{i.product.name}</p>
                          <p className="font-mono text-xs text-blue-400">{i.product.code}</p>
                        </div>
                      ) : (
                        <span className="text-slate-400">General</span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 font-sans">
                      <Badge meta={findMeta(SEVERITIES, i.severity)} />
                    </td>
                    <td className="py-3.5 px-5 text-right font-bold text-white">
                      <span className="text-emerald-400">{i.quantityPassed}</span> / {i.quantityInspected}
                    </td>
                    <td className="py-3.5 px-5 font-sans">
                      <Badge meta={findMeta(ISSUE_STATUSES, i.status)} />
                    </td>
                    <td className="py-3.5 px-5 font-sans text-slate-300">
                      {inspectorName(i.inspector)}
                    </td>
                    <td className="py-3.5 px-5 text-right font-sans">
                      <div className="flex justify-end gap-1.5">
                        <Link
                          href={`/quality/details?id=${i._id}`}
                          className="rounded-lg border border-slate-700 bg-[#121826] px-2.5 py-1 text-xs font-semibold text-blue-400 hover:text-white transition"
                        >
                          Audit
                        </Link>
                        <button
                          onClick={() => setModal(i)}
                          aria-label="Edit issue"
                          title="Edit issue"
                          className="rounded-lg border border-slate-700 bg-[#121826] p-1.5 text-slate-300 transition hover:border-slate-600 hover:text-white"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setToDelete(i)}
                          aria-label="Delete issue"
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

      {/* Modal */}
      {modal && (
        <Modal
          open
          wide
          title={modal === "new" ? "Log Quality Incident" : `Edit ${modal.issueNumber}`}
          onClose={() => setModal(null)}
        >
          <QualityIssueForm
            initial={modal === "new" ? emptyQualityForm(suggestedNumber) : qualityIssueToForm(modal)}
            workOrders={workOrders.items}
            products={products.items}
            submitLabel={modal === "new" ? "Log issue" : "Save changes"}
            onSubmit={handleSave}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}

      {/* Delete Dialog */}
      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete Quality Issue"
        message={`Are you sure you want to delete ${toDelete?.issueNumber}? Quality compliance history for this report will be permanently removed.`}
        confirmLabel="Confirm Deletion"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
