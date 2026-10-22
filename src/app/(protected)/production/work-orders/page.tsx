"use client";

import { ClipboardList, FileText, Pencil, Plus, RefreshCw, Search, Trash2, X } from "lucide-react";
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

const LOCKED_FOR_DELETE: WorkOrderStatus[] = ["IN_PROGRESS", "COMPLETED"]; // backend refuses these

function WorkOrdersContent() {
  const router = useRouter();
  const fromPlan = useSearchParams().get("fromPlan"); // set by "Create work order" on the plans page
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
    if (fromPlan) router.replace("/production/work-orders"); // drop ?fromPlan= from the URL
  }

  async function handleCreate(values: WorkOrderInput) {
    try {
      await workOrderService.create({ ...values, createdBy: user?._id });
      toast.success(`${values.workOrderNumber} created`);
      closeAdd();
      orders.reload(); // reload so product and plan names come back populated
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
      toast.error(getErrorMessage(err, "Could not advance work order status."));
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
    <div className="ui-page-enter mx-auto max-w-7xl space-y-6">
      {/* Header Deck */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-700/60 bg-slate-800 text-blue-400">
              <FileText className="h-4 w-4" />
            </span>
            <p className="text-xs font-medium text-blue-400">
              Production
            </p>
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Work Orders
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            {orders.loading ? "Loading work orders…" : `${filtered.length} of ${orders.items.length} work orders`}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={orders.reload}
            disabled={orders.loading}
            aria-label="Refresh orders"
            title="Refresh orders"
            className="rounded-lg border border-slate-700/80 bg-slate-900/80 p-2.5 text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${orders.loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setAdding(true)}
            disabled={!ready}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" /> New Work Order
          </button>
        </div>
      </div>

      {/* Status Filter Row */}
      <StatusFilterCards
        options={WORK_ORDER_STATUSES}
        counts={counts}
        active={statusFilter}
        onChange={setStatusFilter}
      />

      {/* Search & Priority Filter Strip */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/70 p-4 shadow-sm sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Filter Work Orders
            </h2>
            <p className="text-[11px] text-slate-500">Search by job code, product specification, or associated production plan</p>
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
            aria-label="Search work orders"
            icon={Search}
            placeholder="Search by work order number, product name or plan…"
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

      {/* Orders Data Table */}
      <div className="overflow-hidden rounded-xl border border-slate-800/90 bg-slate-900/80 shadow-xl shadow-black/20">
        {orders.loading ? (
          <div className="flex flex-col items-center justify-center p-16 text-slate-400">
            <Spinner className="h-7 w-7 text-blue-400" />
            <p className="mt-3 text-xs font-medium">Loading shop-floor work orders…</p>
          </div>
        ) : orders.error ? (
          <div className="p-12 text-center">
            <p className="text-sm font-medium text-red-400">{orders.error}</p>
            <button onClick={orders.reload} className="mt-3 text-xs font-semibold text-blue-400 underline hover:text-blue-300">
              Try again
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-slate-950/60 text-slate-500">
              <ClipboardList className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-slate-200">No work orders found</h3>
            <p className="mt-1 text-xs text-slate-400">
              {search || statusFilter || priorityFilter ? "No orders match your active filters." : "Start by issuing your first shop-floor work order."}
            </p>
            {!orders.items.length && ready && (
              <button
                onClick={() => setAdding(true)}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-500"
              >
                <Plus className="h-3.5 w-3.5" /> Dispatch Work Order
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800/90 bg-slate-950/70 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-3.5">Work Order</th>
                  <th className="px-5 py-3.5">Product</th>
                  <th className="px-5 py-3.5">Production Progress</th>
                  <th className="px-5 py-3.5">Target Due</th>
                  <th className="px-5 py-3.5">Priority</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((o) => {
                  const percent = Math.min(100, Math.round((o.producedQuantity / o.plannedQuantity) * 100));
                  const overdue = isOverdue(o.dueDate, o.status);
                  const next = NEXT_STEP[o.status];
                  const locked = LOCKED_FOR_DELETE.includes(o.status);
                  return (
                    <tr key={o._id} className="ui-table-row">
                      <td className="whitespace-nowrap px-5 py-3.5">
                        <p className="font-mono font-semibold text-blue-300">{o.workOrderNumber}</p>
                        {o.productionPlan ? (
                          <p className="mt-0.5 text-[11px] text-slate-400">
                            Plan: <span className="font-mono text-slate-300">{o.productionPlan.planNumber}</span>
                          </p>
                        ) : (
                          <p className="mt-0.5 text-[10px] uppercase font-semibold text-slate-400">Standalone</p>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        {o.product ? (
                          <div>
                            <p className="font-medium text-slate-200">{o.product.name}</p>
                            <p className="font-mono text-[11px] text-slate-400">{o.product.code}</p>
                          </div>
                        ) : (
                          <span className="text-slate-500">Deleted product</span>
                        )}
                      </td>
                      <td className="min-w-[180px] px-5 py-3.5">
                        <div className="mb-1.5 flex items-center justify-between text-xs font-mono">
                          <span className="font-semibold text-slate-200">
                            {o.producedQuantity.toLocaleString()} / {o.plannedQuantity.toLocaleString()}
                          </span>
                          <span className={`font-bold ${percent >= 100 ? "text-emerald-400" : "text-blue-400"}`}>
                            {percent}%
                          </span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-slate-950/80 border border-slate-800">
                          <div
                            className={`h-full rounded-full transition-[width] duration-300 ease-out ${
                              percent >= 100 ? "bg-emerald-500" : "bg-blue-500"
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        {o.rejectedQuantity > 0 && (
                          <p className="mt-1 text-[10px] font-semibold text-red-400">
                            ⚠ {o.rejectedQuantity.toLocaleString()} scrap rejected
                          </p>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className={`font-mono ${overdue ? "font-semibold text-red-400" : "text-slate-300"}`}>
                            {formatDate(o.dueDate)}
                          </span>
                          {overdue && (
                            <span className="rounded border border-red-500/30 bg-red-500/10 px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider text-red-300">
                              Overdue
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5">
                        <Badge meta={findMeta(PRIORITIES, o.priority)} />
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5">
                        <Badge meta={findMeta(WORK_ORDER_STATUSES, o.status)} />
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {next && (
                            <button
                              onClick={() => advance(o, next.to)}
                              disabled={busyId === o._id}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-blue-500/40 bg-blue-600/20 px-2.5 py-1 text-xs font-semibold text-blue-200 transition hover:bg-blue-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:opacity-50"
                            >
                              {busyId === o._id && <Spinner className="h-3 w-3" />}
                              <span>{next.label}</span>
                            </button>
                          )}
                          <button
                            onClick={() => setEditing(o)}
                            aria-label={`Edit ${o.workOrderNumber}`}
                            title="Edit Work Order"
                            className="rounded-lg border border-slate-800 bg-slate-900/80 p-1.5 text-slate-400 transition hover:border-slate-700 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setToDelete(o)}
                            disabled={locked}
                            title={locked ? "Active and completed orders cannot be deleted" : "Delete Work Order"}
                            aria-label={`Delete ${o.workOrderNumber}`}
                            className="rounded-lg border border-slate-800 bg-slate-900/80 p-1.5 text-slate-400 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 disabled:cursor-not-allowed disabled:opacity-30"
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

      <Modal open={adding} wide onClose={closeAdd} title="New Production Work Order">
        <WorkOrderForm
          initial={addInitial}
          products={products.items}
          plans={plans.items}
          submitLabel="Release Work Order"
          onSubmit={handleCreate}
          onCancel={closeAdd}
        />
      </Modal>

      <Modal open={Boolean(editing)} wide onClose={() => setEditing(null)} title="Edit Work Order">
        {editing && (
          <WorkOrderForm
            key={editing._id}
            initial={workOrderToForm(editing)}
            products={products.items}
            plans={plans.items}
            submitLabel="Save Changes"
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete Work Order"
        message={`Are you sure you want to permanently delete work order ${toDelete?.workOrderNumber}? Associated production logs will be removed.`}
        loading={deleting}
        confirmLabel="Confirm Deletion"
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}

export default function WorkOrdersPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-16"><Spinner className="h-7 w-7 text-blue-400" /></div>}>
      <WorkOrdersContent />
    </Suspense>
  );
}
