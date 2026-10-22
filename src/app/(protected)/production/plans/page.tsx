"use client";

import { ClipboardList, FilePlus2, Pencil, Plus, RefreshCw, Search, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import ProductionPlanForm, { emptyPlanForm, planToForm } from "@/components/production/ProductionPlanForm";
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
import { productionPlanService } from "@/services/productionPlan.service";
import { findMeta } from "@/types/common";
import { PLAN_STATUSES, PRIORITIES, type ProductionPlan, type ProductionPlanInput } from "@/types/production";
import { formatDate, isOverdue, nextNumber } from "@/utils/format";
import { getErrorMessage } from "@/utils/getErrorMessage";

export default function ProductionPlansPage() {
  const { user } = useAuth();
  const plans = useList(productionPlanService.list, "Could not load production plans.");
  const products = useList(productService.list, "Could not load products.");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [modal, setModal] = useState<"new" | ProductionPlan | null>(null);
  const [toDelete, setToDelete] = useState<ProductionPlan | null>(null);
  const [deleting, setDeleting] = useState(false);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    plans.items.forEach((p) => (map[p.status] = (map[p.status] ?? 0) + 1));
    return map;
  }, [plans.items]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return plans.items.filter(
      (p) =>
        (!q ||
          p.planNumber.toLowerCase().includes(q) ||
          (p.product?.name ?? "").toLowerCase().includes(q) ||
          (p.product?.code ?? "").toLowerCase().includes(q)) &&
        (!statusFilter || p.status === statusFilter) &&
        (!priorityFilter || p.priority === priorityFilter),
    );
  }, [plans.items, search, statusFilter, priorityFilter]);

  const suggestedNumber = useMemo(() => nextNumber("PP", plans.items.map((p) => p.planNumber)), [plans.items]);
  const ready = !plans.loading && !products.loading;

  async function handleSave(values: ProductionPlanInput) {
    const editing = modal !== null && modal !== "new" ? modal : null;
    try {
      if (editing) {
        await productionPlanService.update(editing._id, values);
        toast.success(`${values.planNumber} updated`);
      } else {
        await productionPlanService.create({ ...values, createdBy: user?._id });
        toast.success(`${values.planNumber} created`);
      }
      setModal(null);
      plans.reload(); // reload so the product name comes back populated
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not save production plan."));
    }
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await productionPlanService.remove(toDelete._id);
      plans.setItems((list) => list.filter((p) => p._id !== toDelete._id));
      toast.success(`${toDelete.planNumber} deleted`);
      setToDelete(null);
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not delete production plan."));
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
              <ClipboardList className="h-4 w-4" />
            </span>
            <p className="text-xs font-medium text-blue-400">
              Production
            </p>
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Production Plans
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            {plans.loading ? "Loading plans…" : `${filtered.length} of ${plans.items.length} plans`}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={plans.reload}
            disabled={plans.loading}
            aria-label="Refresh plans"
            title="Refresh plans"
            className="rounded-lg border border-slate-700/80 bg-slate-900/80 p-2.5 text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${plans.loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setModal("new")}
            disabled={!ready}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" /> New Plan
          </button>
        </div>
      </div>

      {/* Status Filter Cards */}
      <StatusFilterCards
        options={PLAN_STATUSES}
        counts={counts}
        active={statusFilter}
        onChange={setStatusFilter}
      />

      {/* Search & Priority Filter Strip */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/70 p-4 shadow-sm sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Filter Manufacturing Plans
            </h2>
            <p className="text-[11px] text-slate-500">Filter by plan code, manufactured product, or scheduled priority</p>
          </div>
          {(search || statusFilter || priorityFilter) && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatusFilter("");
                setPriorityFilter("");
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 transition hover:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <X className="h-3.5 w-3.5" /> Clear active filters
            </button>
          )}
        </div>

        <div className="mt-3.5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px]">
          <Input
            label=""
            aria-label="Search plans"
            icon={Search}
            placeholder="Search by plan number or product…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select
            label=""
            aria-label="Filter by priority"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="">All Priorities</option>
            {PRIORITIES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Plans Data Table */}
      <div className="overflow-hidden rounded-xl border border-slate-800/90 bg-slate-900/80 shadow-xl shadow-black/20">
        {plans.loading ? (
          <div className="flex flex-col items-center justify-center p-16 text-slate-400">
            <Spinner className="h-7 w-7 text-blue-400" />
            <p className="mt-3 text-xs font-medium">Loading production plan records…</p>
          </div>
        ) : plans.error ? (
          <div className="p-12 text-center">
            <p className="text-sm font-medium text-red-400">{plans.error}</p>
            <button onClick={plans.reload} className="mt-3 text-xs font-semibold text-blue-400 underline hover:text-blue-300">
              Try again
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-slate-950/60 text-slate-500">
              <ClipboardList className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-slate-200">No production plans found</h3>
            <p className="mt-1 text-xs text-slate-400">
              {search || statusFilter || priorityFilter ? "No plans match your active filters." : "Start by scheduling your first production plan."}
            </p>
            {!plans.items.length && ready && (
              <button
                onClick={() => setModal("new")}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-500"
              >
                <Plus className="h-3.5 w-3.5" /> Create Production Plan
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800/90 bg-slate-950/70 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-3.5">Plan #</th>
                  <th className="px-5 py-3.5">Product</th>
                  <th className="px-5 py-3.5 text-right">Planned Qty</th>
                  <th className="px-5 py-3.5">Start Date</th>
                  <th className="px-5 py-3.5">Target Due</th>
                  <th className="px-5 py-3.5">Priority</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((p) => {
                  const overdue = isOverdue(p.dueDate, p.status);
                  return (
                    <tr key={p._id} className="ui-table-row">
                      <td className="whitespace-nowrap px-5 py-3.5 font-mono font-semibold text-blue-300">
                        {p.planNumber}
                      </td>
                      <td className="px-5 py-3.5">
                        {p.product ? (
                          <div>
                            <p className="font-medium text-slate-200">{p.product.name}</p>
                            <p className="font-mono text-[11px] text-slate-400">{p.product.code}</p>
                          </div>
                        ) : (
                          <span className="text-slate-500">Deleted product</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-right tabular-nums font-mono font-semibold text-slate-100">
                        {p.plannedQuantity.toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 font-mono text-slate-400">
                        {formatDate(p.startDate)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className={`font-mono ${overdue ? "font-semibold text-red-400" : "text-slate-300"}`}>
                            {formatDate(p.dueDate)}
                          </span>
                          {overdue && (
                            <span className="rounded border border-red-500/30 bg-red-500/10 px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider text-red-300">
                              Overdue
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5">
                        <Badge meta={findMeta(PRIORITIES, p.priority)} />
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5">
                        <Badge meta={findMeta(PLAN_STATUSES, p.status)} />
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/production/work-orders?fromPlan=${p._id}`}
                            aria-label={`Create work order for ${p.planNumber}`}
                            title="Generate Work Order from Plan"
                            className="rounded-lg border border-slate-800 bg-slate-900/80 p-1.5 text-slate-400 transition hover:border-slate-700 hover:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                          >
                            <FilePlus2 className="h-3.5 w-3.5" />
                          </Link>
                          <button
                            onClick={() => setModal(p)}
                            aria-label={`Edit ${p.planNumber}`}
                            title="Edit Plan"
                            className="rounded-lg border border-slate-800 bg-slate-900/80 p-1.5 text-slate-400 transition hover:border-slate-700 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setToDelete(p)}
                            aria-label={`Delete ${p.planNumber}`}
                            title="Delete Plan"
                            className="rounded-lg border border-slate-800 bg-slate-900/80 p-1.5 text-slate-400 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        open={modal !== null}
        wide
        onClose={() => setModal(null)}
        title={modal === "new" ? "New Production Plan" : "Edit Production Plan"}
      >
        {modal !== null && (
          <ProductionPlanForm
            key={modal === "new" ? "new" : modal._id}
            initial={modal === "new" ? emptyPlanForm(suggestedNumber) : planToForm(modal)}
            products={products.items}
            submitLabel={modal === "new" ? "Create Plan" : "Save Changes"}
            onSubmit={handleSave}
            onCancel={() => setModal(null)}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete Production Plan"
        message={`Are you sure you want to permanently delete plan ${toDelete?.planNumber}? Work orders already created from it will remain intact.`}
        loading={deleting}
        confirmLabel="Confirm Deletion"
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
