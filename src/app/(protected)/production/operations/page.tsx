"use client";

import { Activity, CirclePlay, Pause, Pencil, Plus, RefreshCw, Search, SquareCheckBig } from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import OperationForm, {
  emptyOperationForm,
  operationToForm,
} from "@/components/operations/OperationForm";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import Spinner from "@/components/ui/Spinner";
import StatusFilterCards from "@/components/ui/StatusFilterCards";
import { useAuth } from "@/hooks/useAuth";
import { useList } from "@/hooks/useList";
import { machineService } from "@/services/machine.service";
import { operationService } from "@/services/operationExecution.service";
import { workOrderService } from "@/services/workOrder.service";
import { findMeta, userName } from "@/types/common";
import {
  OPERATION_STATUSES,
  withTimestamps,
  type OperationExecution,
  type OperationInput,
  type OperationStatus,
} from "@/types/operation";
import { getErrorMessage } from "@/utils/getErrorMessage";

const ACTIONS: Partial<Record<OperationStatus, { label: string; to: OperationStatus; icon: typeof Pause }[]>> = {
  NOT_STARTED: [{ label: "Start", to: "RUNNING", icon: CirclePlay }],
  RUNNING: [
    { label: "Pause", to: "PAUSED", icon: Pause },
    { label: "Complete", to: "COMPLETED", icon: SquareCheckBig },
  ],
  PAUSED: [
    { label: "Resume", to: "RUNNING", icon: CirclePlay },
    { label: "Complete", to: "COMPLETED", icon: SquareCheckBig },
  ],
};

const fmtTime = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleString(undefined, { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "—";

export default function OperationExecutionPage() {
  const { user } = useAuth();
  const operations = useList(operationService.list, "Could not load operations.");
  const workOrders = useList(workOrderService.list, "Could not load work orders.");
  const machines = useList(machineService.list, "Could not load machines.");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [machineFilter, setMachineFilter] = useState("");
  const [modal, setModal] = useState<"new" | OperationExecution | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const ready = !operations.loading && !workOrders.loading && !machines.loading;

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    operations.items.forEach((o) => (map[o.status] = (map[o.status] ?? 0) + 1));
    return map;
  }, [operations.items]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return operations.items.filter(
      (o) =>
        (!q ||
          o.operationName.toLowerCase().includes(q) ||
          (o.workOrder?.workOrderNumber ?? "").toLowerCase().includes(q) ||
          (o.machine?.name ?? "").toLowerCase().includes(q) ||
          (o.machine?.code ?? "").toLowerCase().includes(q)) &&
        (!statusFilter || o.status === statusFilter) &&
        (!machineFilter || o.machine?._id === machineFilter),
    );
  }, [operations.items, search, statusFilter, machineFilter]);

  async function handleSave(values: Omit<OperationInput, "startedAt" | "completedAt" | "operator">) {
    const editing = modal !== null && modal !== "new" ? modal : null;
    try {
      if (editing) {
        await operationService.update(editing._id, withTimestamps(values, editing));
        toast.success(`${values.operationName} updated`);
      } else {
        await operationService.create({ ...withTimestamps(values), operator: user?._id });
        toast.success(`${values.operationName} created`);
      }
      setModal(null);
      operations.reload();
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not save operation."));
    }
  }

  async function changeStatus(op: OperationExecution, to: OperationStatus) {
    setBusyId(op._id);
    try {
      await operationService.update(op._id, withTimestamps({ status: to }, op));
      toast.success(`${op.operationName} → ${findMeta(OPERATION_STATUSES, to).label}`);
      operations.reload();
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not change status."));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="ui-page-enter mx-auto max-w-7xl space-y-5">
      {/* Header Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950/60 border border-blue-800/50 px-2 py-0.5 rounded">
              SHOP FLOOR // STATION DISPATCH
            </span>
            <span className="text-slate-600 font-mono">•</span>
            <span className="font-mono text-xs text-slate-300 font-semibold">
              {operations.loading ? "Loading…" : `${filtered.length} of ${operations.items.length} operations active`}
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Workstation Operations
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Real-time step dispatch, cycle time telemetry, and operator tracking across CNC & assembly stations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={operations.reload}
            disabled={operations.loading}
            aria-label="Refresh operations"
            title="Refresh operations"
            className="rounded-lg border border-slate-700 bg-[#121826] p-2.5 text-slate-200 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${operations.loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setModal("new")}
            disabled={!ready}
            className="inline-flex min-h-9.5 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-500 transition disabled:opacity-60"
          >
            <Plus className="h-4 w-4" /> New Operation
          </button>
        </div>
      </div>

      {/* Unified Operations Console */}
      <div className="border border-slate-800/90 bg-[#0b101c] rounded-xl overflow-hidden shadow-xl">
        {/* Integrated Command Strip: Filter pills + Search + Machine Select */}
        <div className="p-4 border-b border-slate-800/80 bg-[#080d17] flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <StatusFilterCards options={OPERATION_STATUSES} counts={counts} active={statusFilter} onChange={setStatusFilter} />

          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <div className="w-full sm:w-64">
              <Input
                label=""
                aria-label="Search operations"
                icon={Search}
                placeholder="Search operation, order, machine…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-48">
              <Select
                aria-label="Filter by machine"
                value={machineFilter}
                onChange={(e) => setMachineFilter(e.target.value)}
              >
                <option value="">All Machines / Stations</option>
                {machines.items.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.code} — {m.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </div>

        {/* Data Table */}
        {operations.loading ? (
          <div className="flex flex-col items-center justify-center p-16 text-slate-300">
            <Spinner className="h-7 w-7 text-blue-400" />
            <p className="mt-3 text-xs font-semibold">Querying workstation routing…</p>
          </div>
        ) : operations.error ? (
          <div className="p-12 text-center text-rose-400">{operations.error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-slate-400">No workstation operations matching query.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800/80 bg-[#080d17] text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-5">Workstation Operation</th>
                  <th className="py-3 px-5">Work Order Reference</th>
                  <th className="py-3 px-5">Assigned Machine / Cell</th>
                  <th className="py-3 px-5">Operator</th>
                  <th className="py-3 px-5">Output Yield</th>
                  <th className="py-3 px-5">Execution State</th>
                  <th className="py-3 px-5">Dispatched</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filtered.map((op) => {
                  const actions = ACTIONS[op.status] ?? [];
                  const isBusy = busyId === op._id;
                  const pct = op.plannedQuantity > 0 ? Math.min(100, Math.round((op.goodQuantity / op.plannedQuantity) * 100)) : 0;

                  return (
                    <tr key={op._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-5 font-bold text-white">
                        {op.operationName}
                      </td>
                      <td className="py-3.5 px-5 font-mono text-slate-300">
                        {op.workOrder?.workOrderNumber ?? "—"}
                      </td>
                      <td className="py-3.5 px-5 font-sans font-semibold text-slate-100">
                        {op.machine ? (
                          <div>
                            <p className="font-semibold text-white">{op.machine.name}</p>
                            <p className="font-mono text-xs text-blue-400">{op.machine.code}</p>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-normal">Manual / Unassigned</span>
                        )}
                      </td>
                      <td className="py-3.5 px-5 font-sans text-slate-300">
                        {op.operator ? userName(op.operator) : "—"}
                      </td>
                      <td className="py-3.5 px-5 font-sans">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="font-mono text-xs font-semibold text-white">
                            {op.goodQuantity}/{op.plannedQuantity}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 font-sans">
                        <Badge meta={findMeta(OPERATION_STATUSES, op.status)} />
                      </td>
                      <td className="py-3.5 px-5 font-sans text-slate-400">
                        {fmtTime(op.startedAt)}
                      </td>
                      <td className="py-3.5 px-5 text-right font-sans">
                        <div className="flex items-center justify-end gap-1.5">
                          {actions.map((act) => {
                            const Icon = act.icon;
                            return (
                              <button
                                key={act.to}
                                onClick={() => changeStatus(op, act.to)}
                                disabled={isBusy}
                                className="inline-flex items-center gap-1 rounded border border-blue-500/40 bg-blue-600/20 px-2 py-1 text-xs font-bold text-blue-300 hover:bg-blue-600 hover:text-white transition disabled:opacity-50"
                              >
                                {isBusy ? <Spinner className="h-3 w-3" /> : <Icon className="h-3 w-3" />}
                                {act.label}
                              </button>
                            );
                          })}
                          <button
                            onClick={() => setModal(op)}
                            aria-label="Edit operation"
                            title="Edit operation"
                            className="rounded-lg border border-slate-700 bg-[#121826] p-1.5 text-slate-300 transition hover:border-slate-600 hover:text-white"
                          >
                            <Pencil className="h-3.5 w-3.5" />
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

      {/* Dispatch Modal */}
      {modal && (
        <Modal
          open
          wide
          title={modal === "new" ? "Dispatch Operation" : `Edit ${modal.operationName}`}
          onClose={() => setModal(null)}
        >
          <OperationForm
            initial={modal === "new" ? emptyOperationForm : operationToForm(modal)}
            workOrders={workOrders.items}
            machines={machines.items}
            submitLabel={modal === "new" ? "Dispatch Operation" : "Save changes"}
            onSubmit={handleSave}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}
    </div>
  );
}
