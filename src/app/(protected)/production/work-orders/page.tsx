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
    <div className="ui-page-enter mx-auto max-w-7xl space-y-6">
      {/* Header Deck */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-700 bg-[#121826] text-blue-400">
              <FileText className="h-4 w-4" />
            </span>
            <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              Execution Control
            </p>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Production Work Orders
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            {orders.loading ? "Loading work orders…" : `${filtered.length} of ${orders.items.length} orders scheduled`}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={orders.reload}
            disabled={orders.loading}
            aria-label="Refresh orders"
            title="Refresh orders"
            className="rounded-lg border border-slate-700 bg-[#121826] p-2.5 text-slate-200 transition hover:border-slate-600 hover:bg-[#192235] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${orders.loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setAdding(true)}
            disabled={!ready}
            className="inline-flex min-h-9.5 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:opacity-60"
          >
            <Plus className="h-4 w-4" /> New Work Order
          </button>
        </div>
      </div>

      {/* Filter Cards */}
      <StatusFilterCards options={WORK_ORDER_STATUSES} counts={counts} active={statusFilter} onChange={setStatusFilter} />

      {/* Search and Priority Filter */}
      <div className="rounded-xl border border-slate-800 bg-[#0c111e] p-4">
        <div className="grid gap-3 sm:grid-cols-[1fr_180px]">
          <Input
            label=""
            aria-label="Search work orders"
            icon={Search}
            placeholder="Search by order number, product name, or plan code…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select
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

      {/* Work Orders Data Table */}
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0c111e] shadow-xl">
        {orders.loading ? (
          <div className="flex flex-col items-center justify-center p-16 text-slate-300">
            <Spinner className="h-7 w-7 text-blue-400" />
            <p className="mt-3 text-xs font-medium">Loading production queue…</p>
          </div>
        ) : orders.error ? (
          <div className="p-12 text-center">
            <p className="text-sm font-medium text-rose-400">{orders.error}</p>
            <button
              onClick={orders.reload}
              className="mt-3 text-xs font-semibold text-blue-400 underline hover:text-blue-300"
            >
              Retry loading
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center p-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-[#080d17] text-slate-400">
              <ClipboardList className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-white">No work orders found</h3>
            <p className="mt-1 text-xs text-slate-300">
              {orders.items.length ? "No orders match your filter criteria." : "Create your first batch work order to begin floor execution."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-[#080d17] text-xs font-semibold uppercase tracking-wider text-slate-300">
                <tr>
                  <th className="px-5 py-3.5">Work Order Code</th>
                  <th className="px-5 py-3.5">Manufactured Part</th>
                  <th className="px-5 py-3.5">Batch Progress</th>
                  <th className="px-5 py-3.5">Target Completion</th>
                  <th className="px-5 py-3.5">Priority</th>
                  <th className="px-5 py-3.5">Stage Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filtered.map((o) => {
                  const percent = Math.min(100, Math.round((o.producedQuantity / o.plannedQuantity) * 100));
                  const overdue = isOverdue(o.dueDate, o.status);
                  const next = NEXT_STEP[o.status];
                  const locked = LOCKED_FOR_DELETE.includes(o.status);
                  return (
                    <tr key={o._id} className="ui-table-row">
                      <td className="px-5 py-3.5">
                        <p className="font-mono text-xs font-bold text-blue-300">{o.workOrderNumber}</p>
                        {o.productionPlan && (
                          <p className="text-[11px] text-slate-300 font-mono">Plan: {o.productionPlan.planNumber}</p>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        {o.product ? (
                          <>
                            <p className="font-semibold text-white">{o.product.name}</p>
                            <p className="font-mono text-xs text-blue-300">{o.product.code}</p>
                          </>
                        ) : (
                          <span className="text-slate-400 font-medium">Deleted product reference</span>
                        )}
                      </td>
                      <td className="min-w-45 px-5 py-3.5 font-mono">
                        <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                          <div className="h-full rounded-full bg-blue-500" style={{ width: `${percent}%` }} />
                        </div>
                        <p className="mt-1.5 text-xs text-slate-300 font-sans">
                          <strong className="text-white font-mono">{o.producedQuantity.toLocaleString()}</strong> /{" "}
                          <span className="font-mono text-slate-300">{o.plannedQuantity.toLocaleString()}</span> ({percent}%)
                          {o.rejectedQuantity > 0 && (
                            <span className="ml-2 text-rose-400 font-semibold">{o.rejectedQuantity} scrap</span>
                          )}
                        </p>
                      </td>
                      <td className={`px-5 py-3.5 font-mono ${overdue ? "font-bold text-rose-400" : "text-slate-200"}`}>
                        {formatDate(o.dueDate)}
                        {overdue && <span className="ml-2 text-[10px] uppercase tracking-wider text-rose-400 bg-rose-500/10 px-1 rounded border border-rose-500/20 font-sans">overdue</span>}
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge meta={findMeta(PRIORITIES, o.priority)} />
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge meta={findMeta(WORK_ORDER_STATUSES, o.status)} />
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {next && (
                            <button
                              onClick={() => advance(o, next.to)}
                              disabled={busyId === o._id}
                              className="mr-1 inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-[#121826] px-2.5 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-slate-600 hover:text-white disabled:opacity-50"
                            >
                              {busyId === o._id && <Spinner className="h-3 w-3" />}
                              {next.label}
                            </button>
                          )}
                          <button
                            onClick={() => setEditing(o)}
                            aria-label={`Edit ${o.workOrderNumber}`}
                            title="Edit work order"
                            className="rounded-lg border border-slate-700 bg-[#121826] p-1.5 text-slate-300 transition hover:border-slate-600 hover:text-white"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setToDelete(o)}
                            disabled={locked}
                            aria-label={`Delete ${o.workOrderNumber}`}
                            title={locked ? "Cannot delete after production has begun" : "Delete"}
                            className="rounded-lg border border-slate-700 bg-[#121826] p-1.5 text-slate-300 transition hover:border-rose-600 hover:bg-rose-950/40 hover:text-rose-400 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
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

      <Modal open={adding && ready} wide title="Create Production Work Order" onClose={closeAdd}>
        <WorkOrderForm
          initial={addInitial}
          products={products.items}
          plans={plans.items}
          submitLabel="Create work order"
          onSubmit={handleCreate}
          onCancel={closeAdd}
        />
      </Modal>

      <Modal open={Boolean(editing)} wide title="Edit Work Order" onClose={() => setEditing(null)}>
        {editing && (
          <WorkOrderForm
            key={editing._id}
            initial={workOrderToForm(editing)}
            products={products.items}
            plans={plans.items}
            submitLabel="Save changes"
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete Work Order?"
        message={`${toDelete?.workOrderNumber} will be permanently removed. This action cannot be reversed.`}
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
