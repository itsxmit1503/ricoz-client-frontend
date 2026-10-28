"use client";

import { Pencil, Plus, RefreshCw, Search, Trash2, Wrench } from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import MaintenanceForm, {
  emptyMaintenanceForm,
  maintenanceToForm,
  type AssigneeOption,
} from "@/components/maintenance/MaintenanceForm";
import Badge from "@/components/ui/Badge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import Spinner from "@/components/ui/Spinner";
import StatusFilterCards from "@/components/ui/StatusFilterCards";
import { useAuth } from "@/hooks/useAuth";
import { useList } from "@/hooks/useList";
import { machineService } from "@/services/machine.service";
import { maintenanceService } from "@/services/maintenance.service";
import { findMeta, userName } from "@/types/common";
import {
  MAINTENANCE_PRIORITIES,
  MAINTENANCE_STATUSES,
  MAINTENANCE_TYPES,
  withCompletedAt,
  type MaintenanceInput,
  type MaintenanceStatus,
  type MaintenanceWorkOrder,
} from "@/types/maintenance";
import { formatDate, isOverdue, nextNumber } from "@/utils/format";
import { getErrorMessage } from "@/utils/getErrorMessage";

const NEXT_STEP: Partial<Record<MaintenanceStatus, { label: string; to: MaintenanceStatus }>> = {
  OPEN: { label: "Start work", to: "IN_PROGRESS" },
  ASSIGNED: { label: "Start work", to: "IN_PROGRESS" },
  IN_PROGRESS: { label: "Complete", to: "COMPLETED" },
};

export default function MaintenanceWorkOrdersPage() {
  const { user } = useAuth();
  const orders = useList(maintenanceService.list, "Could not load maintenance work orders.");
  const machines = useList(machineService.list, "Could not load machines.");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [modal, setModal] = useState<"new" | MaintenanceWorkOrder | null>(null);
  const [toDelete, setToDelete] = useState<MaintenanceWorkOrder | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const ready = !orders.loading && !machines.loading;

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
          o.maintenanceNumber.toLowerCase().includes(q) ||
          o.title.toLowerCase().includes(q) ||
          (o.machine?.name ?? "").toLowerCase().includes(q) ||
          (o.machine?.code ?? "").toLowerCase().includes(q)) &&
        (!statusFilter || o.status === statusFilter) &&
        (!priorityFilter || o.priority === priorityFilter) &&
        (!typeFilter || o.type === typeFilter),
    );
  }, [orders.items, search, statusFilter, priorityFilter, typeFilter]);

  const suggestedNumber = useMemo(
    () => nextNumber("MW", orders.items.map((o) => o.maintenanceNumber)),
    [orders.items],
  );

  const assignees = useMemo<AssigneeOption[]>(() => {
    const list: AssigneeOption[] = [];
    if (user) list.push({ id: user._id, label: `Me (${user.username || user.email})` });
    if (modal !== null && modal !== "new" && modal.assignedTo && modal.assignedTo._id !== user?._id) {
      list.push({ id: modal.assignedTo._id, label: userName(modal.assignedTo) });
    }
    return list;
  }, [user, modal]);

  async function handleSave(values: Omit<MaintenanceInput, "completedAt">) {
    const editing = modal !== null && modal !== "new" ? modal : null;
    try {
      if (editing) {
        await maintenanceService.update(editing._id, withCompletedAt(values, editing.completedAt));
        toast.success(`${values.maintenanceNumber} updated`);
      } else {
        await maintenanceService.create(withCompletedAt(values));
        toast.success(`${values.maintenanceNumber} created`);
      }
      setModal(null);
      orders.reload();
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not save maintenance work order."));
    }
  }

  async function advance(order: MaintenanceWorkOrder, to: MaintenanceStatus) {
    setBusyId(order._id);
    try {
      await maintenanceService.update(order._id, withCompletedAt({ status: to }, order.completedAt));
      toast.success(`${order.maintenanceNumber} → ${findMeta(MAINTENANCE_STATUSES, to).label}`);
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
      await maintenanceService.remove(toDelete._id);
      orders.setItems((list) => list.filter((o) => o._id !== toDelete._id));
      toast.success(`${toDelete.maintenanceNumber} deleted`);
      setToDelete(null);
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not delete maintenance work order."));
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
              <Wrench className="h-4 w-4" />
            </span>
            <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              Asset Reliability
            </p>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Maintenance Work Orders
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            {orders.loading ? "Loading maintenance queue…" : `${filtered.length} of ${orders.items.length} maintenance orders scheduled`}
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
            onClick={() => setModal("new")}
            disabled={!ready}
            className="inline-flex min-h-9.5 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:opacity-60"
          >
            <Plus className="h-4 w-4" /> New Maintenance Order
          </button>
        </div>
      </div>

      {/* Filter Cards */}
      <StatusFilterCards options={MAINTENANCE_STATUSES} counts={counts} active={statusFilter} onChange={setStatusFilter} />

      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-slate-800 bg-[#0c111e] p-4">
        <div className="grid gap-3 sm:grid-cols-[1fr_170px_170px]">
          <Input
            label=""
            aria-label="Search maintenance"
            icon={Search}
            placeholder="Search by order number, maintenance title, or equipment code…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select
            aria-label="Filter by priority"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="">All Priorities</option>
            {MAINTENANCE_PRIORITIES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </Select>
          <Select
            aria-label="Filter by type"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All Maintenance Types</option>
            {MAINTENANCE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Maintenance Data Table */}
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0c111e] shadow-xl">
        {orders.loading ? (
          <div className="flex flex-col items-center justify-center p-16 text-slate-300">
            <Spinner className="h-7 w-7 text-blue-400" />
            <p className="mt-3 text-xs font-medium">Loading maintenance records…</p>
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
              <Wrench className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-white">No maintenance orders found</h3>
            <p className="mt-1 text-xs text-slate-300">
              {orders.items.length ? "No orders match your filter parameters." : "Zero open maintenance orders recorded on machinery fleet."}
            </p>
            {!orders.items.length && ready && (
              <button
                onClick={() => setModal("new")}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-500"
              >
                <Plus className="h-3.5 w-3.5" /> Create work order
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-[#080d17] text-xs font-semibold uppercase tracking-wider text-slate-300">
                <tr>
                  <th className="px-5 py-3.5">Order Number</th>
                  <th className="px-5 py-3.5">Task Description</th>
                  <th className="px-5 py-3.5">Target Machine</th>
                  <th className="px-5 py-3.5">Type</th>
                  <th className="px-5 py-3.5">Priority</th>
                  <th className="px-5 py-3.5">Assigned Specialist</th>
                  <th className="px-5 py-3.5">Scheduled Execution</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filtered.map((o) => {
                  const next = NEXT_STEP[o.status];
                  const overdue = isOverdue(o.scheduledDate, o.status);
                  return (
                    <tr key={o._id} className="ui-table-row">
                      <td className="px-5 py-3.5 font-mono font-bold text-blue-300">
                        {o.maintenanceNumber}
                      </td>
                      <td className="max-w-[220px] px-5 py-3.5">
                        <p className="truncate font-semibold text-white" title={o.title}>
                          {o.title}
                        </p>
                      </td>
                      <td className="px-5 py-3.5">
                        {o.machine ? (
                          <>
                            <p className="font-semibold text-white">{o.machine.name}</p>
                            <p className="font-mono text-xs text-blue-300">{o.machine.code}</p>
                          </>
                        ) : (
                          <span className="text-slate-400 font-medium">Deleted machine reference</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge meta={findMeta(MAINTENANCE_TYPES, o.type)} />
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge meta={findMeta(MAINTENANCE_PRIORITIES, o.priority)} />
                      </td>
                      <td className="px-5 py-3.5 text-slate-200">
                        {o.assignedTo ? userName(o.assignedTo) : <span className="text-slate-400 font-mono">—</span>}
                      </td>
                      <td className={`px-5 py-3.5 font-mono ${overdue ? "font-bold text-rose-400" : "text-slate-200"}`}>
                        {formatDate(o.scheduledDate)}
                        {overdue && <span className="ml-2 text-[10px] uppercase tracking-wider text-rose-400 bg-rose-500/10 px-1 rounded border border-rose-500/20 font-sans">overdue</span>}
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge meta={findMeta(MAINTENANCE_STATUSES, o.status)} />
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {next && (
                            <button
                              onClick={() => advance(o, next.to)}
                              disabled={busyId === o._id}
                              className="mr-1 inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-700 bg-[#121826] px-2.5 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-slate-600 hover:text-white disabled:opacity-50"
                            >
                              {busyId === o._id && <Spinner className="h-3 w-3" />}
                              {next.label}
                            </button>
                          )}
                          <button
                            onClick={() => setModal(o)}
                            aria-label={`Edit ${o.maintenanceNumber}`}
                            title="Edit maintenance order"
                            className="rounded-lg border border-slate-700 bg-[#121826] p-1.5 text-slate-300 transition hover:border-slate-600 hover:text-white"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setToDelete(o)}
                            aria-label={`Delete ${o.maintenanceNumber}`}
                            title="Delete maintenance order"
                            className="rounded-lg border border-slate-700 bg-[#121826] p-1.5 text-slate-300 transition hover:border-rose-600 hover:bg-rose-950/40 hover:text-rose-400"
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

      <Modal open={modal !== null} wide title={modal === "new" ? "New Maintenance Work Order" : "Edit Maintenance Work Order"} onClose={() => setModal(null)}>
        {modal !== null && (
          <MaintenanceForm
            key={modal === "new" ? "new" : modal._id}
            initial={modal === "new" ? emptyMaintenanceForm(suggestedNumber) : maintenanceToForm(modal)}
            machines={machines.items}
            assignees={assignees}
            submitLabel={modal === "new" ? "Create work order" : "Save changes"}
            onSubmit={handleSave}
            onCancel={() => setModal(null)}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete Maintenance Work Order?"
        message={`${toDelete?.maintenanceNumber} will be permanently removed. Scheduled tasks will be cancelled.`}
        confirmLabel="Confirm Deletion"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
