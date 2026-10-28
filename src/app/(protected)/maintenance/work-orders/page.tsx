"use client";

import { Pencil, Plus, RefreshCw, Search, Trash2, Wrench } from "lucide-react";
import Link from "next/link";
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

const LOCKED_FOR_DELETE: MaintenanceStatus[] = ["IN_PROGRESS", "COMPLETED"];

export default function MaintenanceWorkOrdersPage() {
  const { user } = useAuth();
  const orders = useList(maintenanceService.list, "Could not load maintenance orders.");
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
      toast.error(getErrorMessage(err, "Could not save maintenance order."));
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
      toast.error(getErrorMessage(err, "Could not delete maintenance order."));
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
              ASSET HEALTH // PREVENTIVE MAINTENANCE
            </span>
            <span className="text-slate-600 font-mono">•</span>
            <span className="font-mono text-xs text-slate-300 font-semibold">
              {orders.loading ? "Loading…" : `${filtered.length} of ${orders.items.length} orders scheduled`}
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
            Maintenance Work Orders & Fleet Reliability
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
            onClick={() => setModal("new")}
            disabled={!ready}
            className="ui-pressable inline-flex min-h-9.5 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-500 transition disabled:opacity-60"
          >
            <Plus className="h-4 w-4" /> New Maintenance Order
          </button>
        </div>
      </div>

      {/* Unified Maintenance Console */}
      <div className="border border-slate-800/90 bg-[#0b101c] rounded-xl overflow-hidden shadow-xl">
        {/* Integrated Command Strip: Filter pills + Search + Priority + Type */}
        <div className="p-4 border-b border-slate-800/80 bg-[#080d17] flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <StatusFilterCards options={MAINTENANCE_STATUSES} counts={counts} active={statusFilter} onChange={setStatusFilter} />

          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <div className="w-full sm:w-60">
              <Input
                label=""
                aria-label="Search maintenance"
                icon={Search}
                placeholder="Search MWO, machine, title…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-36">
              <Select
                label=""
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
            </div>
            <div className="w-full sm:w-36">
              <Select
                label=""
                aria-label="Filter by type"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="">All Types</option>
                {MAINTENANCE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
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
            <p className="mt-3 text-xs font-semibold">Querying maintenance schedule…</p>
          </div>
        ) : orders.error ? (
          <div className="p-12 text-center text-rose-400">{orders.error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-slate-400">No maintenance orders matching query.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800/80 bg-[#080d17] text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-5">Order ID</th>
                  <th className="py-3 px-5">Equipment Machine</th>
                  <th className="py-3 px-5">Maintenance Title</th>
                  <th className="py-3 px-5">Service Type</th>
                  <th className="py-3 px-5">Priority</th>
                  <th className="py-3 px-5">Service State</th>
                  <th className="py-3 px-5">Scheduled Date</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filtered.map((o) => {
                  const step = NEXT_STEP[o.status];
                  const overdue = isOverdue(o.scheduledDate, o.status);
                  const canDelete = !LOCKED_FOR_DELETE.includes(o.status);
                  const isBusy = busyId === o._id;

                  return (
                    <tr key={o._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-5 font-bold text-white">
                        {o.maintenanceNumber}
                      </td>
                      <td className="py-3.5 px-5 font-sans font-semibold text-slate-100">
                        {o.machine ? (
                          <div>
                            <p className="font-semibold text-white">{o.machine.name}</p>
                            <p className="font-mono text-xs text-blue-400">{o.machine.code}</p>
                          </div>
                        ) : (
                          <span className="text-slate-400">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3.5 px-5 font-sans text-slate-200">
                        {o.title}
                      </td>
                      <td className="py-3.5 px-5 font-sans">
                        <Badge meta={findMeta(MAINTENANCE_TYPES, o.type)} />
                      </td>
                      <td className="py-3.5 px-5 font-sans">
                        <Badge meta={findMeta(MAINTENANCE_PRIORITIES, o.priority)} />
                      </td>
                      <td className="py-3.5 px-5 font-sans">
                        <Badge meta={findMeta(MAINTENANCE_STATUSES, o.status)} />
                      </td>
                      <td className={`py-3.5 px-5 ${overdue ? "text-rose-400 font-bold" : "text-slate-300"}`}>
                        {formatDate(o.scheduledDate)}
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
                            onClick={() => setModal(o)}
                            aria-label="Edit order"
                            title="Edit order"
                            className="ui-pressable rounded-lg border border-slate-700 bg-[#121826] p-1.5 text-slate-300 transition hover:border-slate-600 hover:text-white"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setToDelete(o)}
                            disabled={!canDelete}
                            aria-label="Delete order"
                            title={canDelete ? "Delete order" : "Cannot delete active or completed orders"}
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
      {modal && (
        <Modal
          open
          wide
          title={modal === "new" ? "Dispatch Maintenance Order" : `Edit ${modal.maintenanceNumber}`}
          onClose={() => setModal(null)}
        >
          <MaintenanceForm
            initial={modal === "new" ? emptyMaintenanceForm(suggestedNumber) : maintenanceToForm(modal)}
            machines={machines.items}
            assignees={assignees}
            submitLabel={modal === "new" ? "Create order" : "Save changes"}
            onSubmit={handleSave}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete Maintenance Order"
        message={`Are you sure you want to delete ${toDelete?.maintenanceNumber}? Scheduled maintenance logs for this equipment will be removed.`}
        confirmLabel="Confirm Deletion"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
