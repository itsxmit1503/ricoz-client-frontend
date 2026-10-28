"use client";

import { CalendarClock, FileSpreadsheet, Pencil, Plus, RefreshCw, Search, Trash2 } from "lucide-react";
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
import {
  PLAN_STATUSES,
  PRIORITIES,
  type PlanStatus,
  type ProductionPlan,
  type ProductionPlanInput,
} from "@/types/production";
import { formatDate, nextNumber } from "@/utils/format";
import { getErrorMessage } from "@/utils/getErrorMessage";

const LOCKED_FOR_DELETE: PlanStatus[] = ["IN_PROGRESS", "COMPLETED"];

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

  const ready = !plans.loading && !products.loading;

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

  const suggestedNumber = useMemo(
    () => nextNumber("PLAN", plans.items.map((p) => p.planNumber)),
    [plans.items],
  );

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
      plans.reload();
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
    <div className="ui-page-enter mx-auto max-w-7xl space-y-5">
      {/* Header Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950/60 border border-blue-800/50 px-2 py-0.5 rounded">
              SCHEDULING // PRODUCTION PLANS
            </span>
            <span className="text-slate-600 font-mono">•</span>
            <span className="font-mono text-xs text-slate-300 font-semibold">
              {plans.loading ? "Loading…" : `${filtered.length} of ${plans.items.length} master plans scheduled`}
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
            Master Production Plans (MRP)
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={plans.reload}
            disabled={plans.loading}
            aria-label="Refresh plans"
            title="Refresh plans"
            className="rounded-lg border border-slate-700 bg-[#121826] p-2.5 text-slate-200 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${plans.loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setModal("new")}
            disabled={!ready}
            className="inline-flex min-h-9.5 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-500 transition disabled:opacity-60"
          >
            <Plus className="h-4 w-4" /> New Production Plan
          </button>
        </div>
      </div>

      {/* Unified Master Plan Console */}
      <div className="border border-slate-800/90 bg-[#0b101c] rounded-xl overflow-hidden shadow-xl">
        {/* Integrated Command Strip: Filter pills + Search + Priority */}
        <div className="p-4 border-b border-slate-800/80 bg-[#080d17] flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <StatusFilterCards options={PLAN_STATUSES} counts={counts} active={statusFilter} onChange={setStatusFilter} />

          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <div className="w-full sm:w-64">
              <Input
                label=""
                aria-label="Search plans"
                icon={Search}
                placeholder="Search plan, SKU code…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-44">
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
        </div>

        {/* Data Table */}
        {plans.loading ? (
          <div className="flex flex-col items-center justify-center p-16 text-slate-300">
            <Spinner className="h-7 w-7 text-blue-400" />
            <p className="mt-3 text-xs font-semibold">Querying master production schedules…</p>
          </div>
        ) : plans.error ? (
          <div className="p-12 text-center text-rose-400">{plans.error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-slate-400">No production plans match query.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800/80 bg-[#080d17] text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-5">Plan Number</th>
                  <th className="py-3 px-5">Target Part / SKU</th>
                  <th className="py-3 px-5 text-right">Target Output</th>
                  <th className="py-3 px-5">Priority</th>
                  <th className="py-3 px-5">Schedule State</th>
                  <th className="py-3 px-5">Start Window</th>
                  <th className="py-3 px-5">End Window</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filtered.map((p) => {
                  const canDelete = !LOCKED_FOR_DELETE.includes(p.status);
                  return (
                    <tr key={p._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-5 font-bold text-white">
                        {p.planNumber}
                      </td>
                      <td className="py-3.5 px-5 font-sans font-semibold text-slate-100">
                        {p.product ? (
                          <div>
                            <p className="font-semibold text-white">{p.product.name}</p>
                            <p className="font-mono text-xs text-blue-400">{p.product.code}</p>
                          </div>
                        ) : (
                          <span className="text-slate-400">Deleted product</span>
                        )}
                      </td>
                      <td className="py-3.5 px-5 text-right font-bold text-white">
                        {p.plannedQuantity.toLocaleString()}{" "}
                        <span className="text-xs font-normal text-slate-300 font-sans">
                          {p.product?.unit ?? "units"}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 font-sans">
                        <Badge meta={findMeta(PRIORITIES, p.priority)} />
                      </td>
                      <td className="py-3.5 px-5 font-sans">
                        <Badge meta={findMeta(PLAN_STATUSES, p.status)} />
                      </td>
                      <td className="py-3.5 px-5 text-slate-300">
                        {formatDate(p.startDate)}
                      </td>
                      <td className="py-3.5 px-5 text-slate-300">
                        {formatDate(p.dueDate)}
                      </td>
                      <td className="py-3.5 px-5 text-right font-sans">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/production/work-orders?fromPlan=${p._id}`}
                            className="rounded border border-blue-500/50 bg-blue-600/20 px-2.5 py-1 text-xs font-bold text-blue-300 hover:bg-blue-600 hover:text-white transition"
                          >
                            Dispatch WO
                          </Link>
                          <button
                            onClick={() => setModal(p)}
                            aria-label="Edit plan"
                            title="Edit plan"
                            className="rounded-lg border border-slate-700 bg-[#121826] p-1.5 text-slate-300 transition hover:border-slate-600 hover:text-white"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setToDelete(p)}
                            disabled={!canDelete}
                            aria-label="Delete plan"
                            title={canDelete ? "Delete plan" : "Cannot delete active or completed plans"}
                            className="rounded-lg border border-slate-700 bg-[#121826] p-1.5 text-slate-300 transition hover:border-rose-600 hover:bg-rose-950/40 hover:text-rose-400 disabled:opacity-30 disabled:cursor-not-allowed"
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

      {/* Modals */}
      {modal && (
        <Modal
          open
          wide
          title={modal === "new" ? "Create Production Plan" : `Edit ${modal.planNumber}`}
          onClose={() => setModal(null)}
        >
          <ProductionPlanForm
            initial={modal === "new" ? emptyPlanForm(suggestedNumber) : planToForm(modal)}
            products={products.items}
            submitLabel={modal === "new" ? "Create plan" : "Save changes"}
            onSubmit={handleSave}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete Production Plan"
        message={`Are you sure you want to delete ${toDelete?.planNumber}? Work orders planned against this schedule may be affected.`}
        confirmLabel="Confirm Deletion"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
