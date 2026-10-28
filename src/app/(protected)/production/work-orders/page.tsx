"use client";

import { ClipboardList, FileText, Pencil, Plus, RefreshCw, Search, Trash2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import toast from "react-hot-toast";
import WorkOrderForm, {
  emptyWorkOrderForm,
  planToWorkOrderForm,
  workOrderToForm,
} from "@/components/production/WorkOrderForm";
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
import { workOrderService } from "@/services/workOrder.service";
import { findMeta } from "@/types/common";
import {
  PRIORITIES,
  WORK_ORDER_STATUSES,
  type WorkOrder,
  type WorkOrderInput,
  type WorkOrderStatus,
} from "@/types/production";
import { formatDate, isOverdue, nextNumber } from "@/utils/format";
import { getErrorMessage } from "@/utils/getErrorMessage";

/** One-click "next step" button per status. Anything else (pause, cancel…) is done from Edit. */
const NEXT_STEP: Partial<Record<WorkOrderStatus, { label: string; to: WorkOrderStatus }>> = {
  CREATED: { label: "Release", to: "RELEASED" },
  RELEASED: { label: "Start", to: "IN_PROGRESS" },
  IN_PROGRESS: { label: "Complete", to: "COMPLETED" },
  PAUSED: { label: "Resume", to: "IN_PROGRESS" },
};

const LOCKED_FOR_DELETE: WorkOrderStatus[] = ["IN_PROGRESS", "COMPLETED"];

function WorkOrdersContent() {
  const router = useRouter();
  const fromPlan = useSearchParams().get("fromPlan");
  const { user } = useAuth();

  const orders = useList(workOrderService.list, "Could not load work orders.");
  const plans = useList(productionPlanService.list, "Could not load production plans.");
  const products = useList(productService.list, "Could not load products.");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [adding, setAdding] = useState(Boolean(fromPlan));
  const [editing, setEditing] = useState<WorkOrder | null>(null);
  const [toDelete, setToDelete] = useState<WorkOrder | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const ready = !orders.loading && !plans.loading && !products.loading;

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    orders.items.forEach((o) => (map[o.status] = (map[o.status] ?? 0) + 1));
    return map;
  }, [orders.items]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.items.filter(
      (o) =>
        (!q ||
          o.workOrderNumber.toLowerCase().includes(q) ||
          (o.product?.name ?? "").toLowerCase().includes(q) ||
          (o.product?.code ?? "").toLowerCase().includes(q) ||
          (o.productionPlan?.planNumber ?? "").toLowerCase().includes(q)) &&
        (!statusFilter || o.status === statusFilter) &&
        (!priorityFilter || o.priority === priorityFilter),
    );
  }, [orders.items, search, statusFilter, priorityFilter]);

  const suggestedNumber = useMemo(
    () => nextNumber("WO", orders.items.map((o) => o.workOrderNumber)),
    [orders.items],
  );

  const addInitial = useMemo(() => {
    const plan = fromPlan ? plans.items.find((p) => p._id === fromPlan) : undefined;
    return plan ? planToWorkOrderForm(plan, suggestedNumber) : emptyWorkOrderForm(suggestedNumber);
  }, [fromPlan, plans.items, suggestedNumber]);

  function closeAdd() {
    setAdding(false);
    if (fromPlan) router.replace("/production/work-orders");
  }

  async function handleCreate(values: WorkOrderInput) {
    try {
      await workOrderService.create({ ...values, createdBy: user?._id });
      toast.success(`${values.workOrderNumber} created`);
      closeAdd();
      orders.reload();
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not create work order."));
    }
  }

  async function handleUpdate(values: WorkOrderInput) {
    if (!editing) return;
    try {
      await workOrderService.update(editing._id, values);
      toast.success(`${values.workOrderNumber} updated`);
      setEditing(null);
      orders.reload();
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not update work order."));
    }
  }

  async function advance(order: WorkOrder, to: WorkOrderStatus) {
    setBusyId(order._id);
    try {
      await workOrderService.update(order._id, { status: to });
      toast.success(`${order.workOrderNumber} → ${findMeta(WORK_ORDER_STATUSES, to).label}`);
      orders.reload();
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not change status."));
    } finally {
      setBusyId(null);
    }
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await workOrderService.remove(toDelete._id);
      orders.setItems((list) => list.filter((o) => o._id !== toDelete._id));
      toast.success(`${toDelete.workOrderNumber} deleted`);
      setToDelete(null);
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not delete work order."));
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
              FLOOR EXECUTION // WORK ORDERS
            </span>
            <span className="text-slate-600 font-mono">•</span>
            <span className="font-mono text-xs text-slate-300 font-semibold">
              {orders.loading ? "Loading…" : `${filtered.length} of ${orders.items.length} orders scheduled`}
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
            Production Work Order Dispatch
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={orders.reload}
            disabled={orders.loading}
            aria-label="Refresh orders"
            title="Refresh orders"
            className="ui-pressable rounded-lg border border-slate-700 bg-[#121826] p-2.5 text-slate-200 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${orders.loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setAdding(true)}
            disabled={!ready}
            className="ui-pressable inline-flex min-h-9.5 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-500 transition disabled:opacity-60"
          >
            <Plus className="h-4 w-4" /> New Work Order
          </button>
        </div>
      </div>

      {/* Unified Work Order Console */}
      <div className="border border-slate-800/90 bg-[#0b101c] rounded-xl overflow-hidden shadow-xl">
        {/* Integrated Command Strip: Status Pills + Search + Priority Select */}
        <div className="p-4 border-b border-slate-800/80 bg-[#080d17] flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <StatusFilterCards options={WORK_ORDER_STATUSES} counts={counts} active={statusFilter} onChange={setStatusFilter} />

          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <div className="w-full sm:w-64">
              <Input
                label=""
                aria-label="Search work orders"
                icon={Search}
                placeholder="Search order, SKU, plan…"
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
        {orders.loading ? (
          <div className="flex flex-col items-center justify-center p-16 text-slate-300">
            <Spinner className="h-7 w-7 text-blue-400" />
            <p className="mt-3 text-xs font-semibold">Querying production dispatch queue…</p>
          </div>
        ) : orders.error ? (
          <div className="p-12 text-center text-rose-400">{orders.error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-slate-400">No work orders matching query.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800/80 bg-[#080d17] text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-5">Work Order</th>
                  <th className="py-3 px-5">Product SKU</th>
                  <th className="py-3 px-5">Shift Plan</th>
                  <th className="py-3 px-5 text-right">Target Units</th>
                  <th className="py-3 px-5">Priority</th>
                  <th className="py-3 px-5">Dispatch State</th>
                  <th className="py-3 px-5">Due Date</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filtered.map((o) => {
                  const step = NEXT_STEP[o.status];
                  const overdue = isOverdue(o.dueDate, o.status);
                  const canDelete = !LOCKED_FOR_DELETE.includes(o.status);
                  const isBusy = busyId === o._id;

                  return (
                    <tr key={o._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-5 font-bold text-white">
                        {o.workOrderNumber}
                      </td>
                      <td className="py-3.5 px-5 font-sans font-semibold text-slate-100">
                        {o.product ? (
                          <div>
                            <p className="font-semibold text-white">{o.product.name}</p>
                            <p className="font-mono text-xs text-blue-400">{o.product.code}</p>
                          </div>
                        ) : (
                          <span className="text-slate-400">Deleted product</span>
                        )}
                      </td>
                      <td className="py-3.5 px-5 font-mono text-slate-300">
                        {o.productionPlan?.planNumber ?? "—"}
                      </td>
                      <td className="py-3.5 px-5 text-right font-bold text-white">
                        {o.plannedQuantity.toLocaleString()}{" "}
                        <span className="text-xs font-normal text-slate-300 font-sans">
                          {o.product?.unit ?? "units"}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 font-sans">
                        <Badge meta={findMeta(PRIORITIES, o.priority)} />
                      </td>
                      <td className="py-3.5 px-5 font-sans">
                        <Badge meta={findMeta(WORK_ORDER_STATUSES, o.status)} />
                      </td>
                      <td className={`py-3.5 px-5 font-mono ${overdue ? "text-rose-400 font-bold" : "text-slate-300"}`}>
                        {formatDate(o.dueDate)}
                      </td>
                      <td className="py-3.5 px-5 text-right font-sans">
                        <div className="flex items-center justify-end gap-1.5">
                          {step && (
                            <button
                              onClick={() => advance(o, step.to)}
                              disabled={isBusy}
                              className="rounded border border-blue-500/50 bg-blue-600/20 px-2.5 py-1 text-xs font-bold text-blue-300 hover:bg-blue-600 hover:text-white transition disabled:opacity-50"
                            >
                              {isBusy ? <Spinner className="h-3 w-3" /> : step.label}
                            </button>
                          )}
                          <button
                            onClick={() => setEditing(o)}
                            aria-label="Edit order"
                            title="Edit order"
                            className="ui-pressable rounded-lg border border-slate-700 bg-[#121826] p-1.5 text-slate-300 transition hover:border-slate-600 hover:text-white"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setToDelete(o)}
                            disabled={!canDelete}
                            aria-label="Delete work order"
                            title={canDelete ? "Delete work order" : "Cannot delete active or completed orders"}
                            className="ui-pressable rounded-lg border border-slate-700 bg-[#121826] p-1.5 text-slate-300 transition hover:border-rose-600 hover:bg-rose-950/40 hover:text-rose-400 disabled:opacity-30 disabled:cursor-not-allowed"
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
      <Modal open={adding} wide title="Dispatch Production Work Order" onClose={closeAdd}>
        <WorkOrderForm
          initial={addInitial}
          plans={plans.items}
          products={products.items}
          submitLabel="Create work order"
          onSubmit={handleCreate}
          onCancel={closeAdd}
        />
      </Modal>

      <Modal open={editing !== null} wide title="Update Work Order Parameters" onClose={() => setEditing(null)}>
        {editing && (
          <WorkOrderForm
            initial={workOrderToForm(editing)}
            plans={plans.items}
            products={products.items}
            submitLabel="Save changes"
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete Work Order"
        message={`Are you sure you want to delete ${toDelete?.workOrderNumber}? Production scheduling for this batch will be cancelled.`}
        confirmLabel="Confirm Deletion"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}

export default function WorkOrdersPage() {
  return (
    <Suspense fallback={null}>
      <WorkOrdersContent />
    </Suspense>
  );
}
