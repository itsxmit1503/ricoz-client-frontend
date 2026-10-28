"use client";

import { Cpu, Eye, Plus, RefreshCw, Search, Trash2, Wrench } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import MachineForm from "@/components/machines/MachineForm";
import MachineStatusBadge from "@/components/machines/MachineStatusBadge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import { useMachines } from "@/hooks/useMachines";
import { machineService } from "@/services/machine.service";
import { MACHINE_STATUSES, type Machine, type MachineInput, type MachineStatus } from "@/types/machine";
import { getErrorMessage } from "@/utils/getErrorMessage";

export default function MachineListPage() {
  const { machines, setMachines, loading, error, reload } = useMachines();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<MachineStatus | "">("");
  const [adding, setAdding] = useState(false);
  const [toDelete, setToDelete] = useState<Machine | null>(null);
  const [deleting, setDeleting] = useState(false);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    machines.forEach((m) => (map[m.status] = (map[m.status] ?? 0) + 1));
    return map;
  }, [machines]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return machines.filter(
      (m) =>
        (!q ||
          m.name.toLowerCase().includes(q) ||
          m.code.toLowerCase().includes(q) ||
          (m.location ?? "").toLowerCase().includes(q)) &&
        (!statusFilter || m.status === statusFilter),
    );
  }, [machines, search, statusFilter]);

  async function handleCreate(values: MachineInput) {
    try {
      const machine = await machineService.create(values);
      setMachines((list) => [machine, ...list]);
      toast.success(`${machine.code} created`);
      setAdding(false);
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not create machine."));
    }
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await machineService.remove(toDelete._id);
      setMachines((list) => list.filter((m) => m._id !== toDelete._id));
      toast.success(`${toDelete.code} deleted`);
      setToDelete(null);
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not delete machine."));
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
              <Cpu className="h-4 w-4" />
            </span>
            <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              Asset Fleet
            </p>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Machine Fleet & Workstations
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            {loading ? "Loading fleet…" : `${filtered.length} of ${machines.length} registered workstations`}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={reload}
            disabled={loading}
            aria-label="Refresh machines"
            title="Refresh machines"
            className="rounded-lg border border-slate-700 bg-[#121826] p-2.5 text-slate-200 transition hover:border-slate-600 hover:bg-[#192235] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setAdding(true)}
            className="inline-flex min-h-9.5 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <Plus className="h-4 w-4" /> Add Machine
          </button>
        </div>
      </div>

      {/* Status Filter Cards */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
        {MACHINE_STATUSES.map((s) => {
          const active = statusFilter === s.value;
          return (
            <button
              key={s.value}
              type="button"
              onClick={() => setStatusFilter(active ? "" : s.value)}
              className={`rounded-xl border p-3 text-left transition-all duration-150 ${
                active
                  ? "border-blue-500/80 bg-blue-600/15 shadow-xs"
                  : "border-slate-800 bg-[#0c111e] hover:border-slate-700 hover:bg-[#121826]"
              }`}
            >
              <span className="flex items-center gap-1.5 text-xs font-medium text-slate-200">
                <span className={`h-2 w-2 rounded-full ${s.dot}`} />
                <span className="truncate">{s.label}</span>
              </span>
              <span className={`mt-2 block text-xl font-bold font-mono ${active ? "text-blue-200" : "text-white"}`}>
                {counts[s.value] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="rounded-xl border border-slate-800 bg-[#0c111e] p-4">
        <Input
          label=""
          aria-label="Search machines"
          icon={Search}
          placeholder="Search by equipment name, station code, or location…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Machines Data Table */}
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0c111e] shadow-xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-16 text-slate-300">
            <Spinner className="h-7 w-7 text-blue-400" />
            <p className="mt-3 text-xs font-medium">Loading equipment telemetry…</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <p className="text-sm font-medium text-rose-400">{error}</p>
            <button
              onClick={reload}
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
            <h3 className="mt-4 text-sm font-semibold text-white">No machines found</h3>
            <p className="mt-1 text-xs text-slate-300">
              {machines.length ? "No equipment matches your search query." : "Register your first shop-floor workstation."}
            </p>
            {!machines.length && (
              <button
                onClick={() => setAdding(true)}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-500"
              >
                <Plus className="h-3.5 w-3.5" /> Add Machine
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-[#080d17] text-xs font-semibold uppercase tracking-wider text-slate-300">
                <tr>
                  <th className="px-5 py-3.5">Station Code</th>
                  <th className="px-5 py-3.5">Equipment Name</th>
                  <th className="px-5 py-3.5">Operating Status</th>
                  <th className="px-5 py-3.5">Shop Floor Location</th>
                  <th className="px-5 py-3.5">Line Active</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filtered.map((m) => (
                  <tr key={m._id} className="ui-table-row">
                    <td className="px-5 py-3.5 font-mono font-semibold text-blue-300">
                      {m.code}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-white">
                      <Link href={`/machines/details?id=${m._id}`} className="hover:text-blue-300 transition-colors">
                        {m.name}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5">
                      <MachineStatusBadge status={m.status} />
                    </td>
                    <td className="px-5 py-3.5 text-slate-300 font-mono">
                      {m.location || "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={m.isActive ? "text-emerald-400 font-semibold" : "text-slate-400"}>
                        {m.isActive ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex justify-end gap-1.5">
                        <Link
                          href={`/machines/details?id=${m._id}`}
                          aria-label={`View telemetry for ${m.code}`}
                          title="View telemetry"
                          className="rounded-lg border border-slate-700 bg-[#121826] p-1.5 text-slate-300 transition hover:border-slate-600 hover:text-white"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setToDelete(m)}
                          aria-label={`Delete ${m.code}`}
                          title="Delete machine"
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

      <Modal open={adding} title="Register New Equipment" onClose={() => setAdding(false)}>
        <MachineForm submitLabel="Create workstation" onSubmit={handleCreate} onCancel={() => setAdding(false)} />
      </Modal>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Deregister Equipment?"
        message={`"${toDelete?.name}" (${toDelete?.code}) will be removed from active telemetry monitoring. This action cannot be reversed.`}
        confirmLabel="Confirm Removal"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
