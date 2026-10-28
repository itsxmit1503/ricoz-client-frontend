"use client";

import { Activity, CirclePlay, Cog, Pause, Pencil, Plus, RefreshCw, Search, SquareCheckBig } from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import OperationForm, { emptyOperationForm, operationToForm } from "@/components/operations/OperationForm";
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
    <div className="ui-page-enter mx-auto max-w-7xl space-y-6">
      {/* Header Deck */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-700 bg-[#121826] text-blue-400">
              <Activity className="h-4 w-4" />
            </span>
            <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              Station Operations
            </p>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Workstation Operation Execution
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            {operations.loading ? "Loading operation states…" : `${filtered.length} of ${operations.items.length} operations active`}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={operations.reload}
            disabled={operations.loading}
            aria-label="Refresh operations"
            title="Refresh operations"
            className="rounded-lg border border-slate-700 bg-[#121826] p-2.5 text-slate-200 transition hover:border-slate-600 hover:bg-[#192235] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${operations.loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setModal("new")}
            disabled={!ready}
            className="inline-flex min-h-9.5 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:opacity-60"
          >
            <Plus className="h-4 w-4" /> New Operation
          </button>
        </div>
      </div>

      {/* Filter Cards */}
      <StatusFilterCards options={OPERATION_STATUSES} counts={counts} active={statusFilter} onChange={setStatusFilter} />

      {/* Search and Machine Select */}
      <div className="rounded-xl border border-slate-800 bg-[#0c111e] p-4">
        <div className="grid gap-3 sm:grid-cols-[1fr_240px]">
          <Input
            label=""
            aria-label="Search operations"
            icon={Search}
            placeholder="Search by operation name, work order code, or machine…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select
            aria-label="Filter by machine"
            value={machineFilter}
            onChange={(e) => setMachineFilter(e.target.value)}
          >
            <option value="">All Workstations</option>
            {machines.items.map((m) => (
              <option key={m._id} value={m._id}>
                {m.code} — {m.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Operations Data Table */}
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0c111e] shadow-xl">
        {operations.loading ? (
          <div className="flex flex-col items-center justify-center p-16 text-slate-300">
            <Spinner className="h-7 w-7 text-blue-400" />
            <p className="mt-3 text-xs font-medium">Loading workstation telemetry…</p>
          </div>
        ) : operations.error ? (
          <div className="p-12 text-center">
            <p className="text-sm font-medium text-rose-400">{operations.error}</p>
            <button
              onClick={operations.reload}
              className="mt-3 text-xs font-semibold text-blue-400 underline hover:text-blue-300"
            >
              Retry loading
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center p-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-[#080d17] text-slate-400">
              <Cog className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-white">No active operations found</h3>
            <p className="mt-1 text-xs text-slate-300">
              {operations.items.length ? "No operations match your current filter." : "Log an operation execution step for an active work order."}
            </p>
            {!operations.items.length && ready && (
              <button
                onClick={() => setModal("new")}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-500"
              >
                <Plus className="h-3.5 w-3.5" /> Start first operation
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-[#080d17] text-xs font-semibold uppercase tracking-wider text-slate-300">
                <tr>
                  <th className="px-5 py-3.5">Operation Name</th>
                  <th className="px-5 py-3.5">Work Order Code</th>
                  <th className="px-5 py-3.5">Assigned Workstation</th>
                  <th className="px-5 py-3.5">Station Operator</th>
                  <th className="w-48 px-5 py-3.5">Yield Output</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Dispatched</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filtered.map((o) => {
                  const pct = o.plannedQuantity > 0 ? Math.min(100, Math.round((o.goodQuantity / o.plannedQuantity) * 100)) : 0;
                  const actions = ACTIONS[o.status] ?? [];
                  return (
                    <tr key={o._id} className="ui-table-row">
                      <td className="px-5 py-3.5 font-bold text-white">
                        {o.operationName}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs font-bold text-blue-300">
                        {o.workOrder?.workOrderNumber ?? <span className="text-slate-400 font-sans">—</span>}
                      </td>
                      <td className="px-5 py-3.5">
                        {o.machine ? (
                          <>
                            <p className="font-semibold text-white">{o.machine.name}</p>
                            <p className="font-mono text-xs text-blue-300">{o.machine.code}</p>
                          </>
                        ) : (
                          <span className="text-slate-400 font-mono">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-slate-200">
                        {userName(o.operator)}
                      </td>
                      <td className="px-5 py-3.5 font-mono">
                        <div className="flex justify-between text-xs text-slate-300">
                          <span className="text-white font-bold">{o.goodQuantity}</span> /{" "}
                          <span>{o.plannedQuantity}</span>
                          {o.rejectedQuantity > 0 && <span className="text-rose-400 font-bold ml-1">{o.rejectedQuantity} scrap</span>}
                        </div>
                        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-800">
                          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${pct}%` }} />
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge meta={findMeta(OPERATION_STATUSES, o.status)} />
                      </td>
                      <td className="px-5 py-3.5 font-mono text-slate-300">
                        {fmtTime(o.startedAt)}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {actions.map(({ label, to, icon: Icon }) => (
                            <button
                              key={to}
                              onClick={() => changeStatus(o, to)}
                              disabled={busyId === o._id}
                              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-700 bg-[#121826] px-2.5 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-slate-600 hover:text-white disabled:opacity-50"
                            >
                              {busyId === o._id ? <Spinner className="h-3 w-3" /> : <Icon className="h-3.5 w-3.5" />}
                              {label}
                            </button>
                          ))}
                          <button
                            onClick={() => setModal(o)}
                            aria-label={`Edit ${o.operationName}`}
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

      <Modal open={modal !== null} title={modal === "new" ? "New Station Operation" : "Edit Station Operation"} onClose={() => setModal(null)}>
        {modal !== null && (
          <OperationForm
            key={modal === "new" ? "new" : modal._id}
            initial={modal === "new" ? emptyOperationForm : operationToForm(modal)}
            workOrders={workOrders.items}
            machines={machines.items}
            submitLabel={modal === "new" ? "Dispatch operation" : "Save changes"}
            onSubmit={handleSave}
            onCancel={() => setModal(null)}
          />
        )}
      </Modal>
    </div>
  );
}
