"use client";

import { Cpu, Eye, Plus, RefreshCw, Search, Trash2, Wrench, X } from "lucide-react";
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
      toast.success(`${machine.code} registered to equipment fleet`);
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
      toast.success(`${toDelete.code} decommissioned & removed`);
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
            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-700/60 bg-slate-800 text-blue-400">
              <Cpu className="h-4 w-4" />
            </span>
            <p className="text-xs font-medium text-blue-400">
              Equipment
            </p>
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Machines
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            {loading ? "Loading machines…" : `${filtered.length} of ${machines.length} machines`}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={reload}
            disabled={loading}
            aria-label="Refresh machines list"
            title="Refresh list"
            className="rounded-lg border border-slate-700/80 bg-slate-900/80 p-2.5 text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={() => setAdding(true)}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <Plus className="h-4 w-4" /> Add Machine
          </button>
        </div>
      </div>

      {/* 6-State Equipment Filter Grid */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
        {MACHINE_STATUSES.map((s) => {
          const active = statusFilter === s.value;
          const count = counts[s.value] ?? 0;
          return (
            <button
              key={s.value}
              onClick={() => setStatusFilter(active ? "" : s.value)}
              className={`group relative rounded-xl border p-3 text-left transition duration-150 ease-out motion-reduce:transition-none active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                active
                  ? "border-blue-500/80 bg-blue-600/15 shadow-sm shadow-blue-950/40"
                  : "border-slate-800/80 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/90"
              }`}
            >
              <div className="flex items-center justify-between gap-1.5">
                <span className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
                  <span className={`h-2 w-2 rounded-full ${s.dot}`} />
                  <span className="truncate">{s.label}</span>
                </span>
                {active && (
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400 ring-2 ring-blue-400/30" />
                )}
              </div>
              <div className="mt-2.5 flex items-baseline justify-between">
                <span className={`text-xl font-semibold tabular-nums tracking-tight ${active ? "text-blue-200" : "text-slate-100"}`}>
                  {count}
                </span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500 group-hover:text-slate-400">
                  Filter
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Search Input Bar */}
      <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-800/80 bg-slate-900/70 p-3.5 shadow-sm sm:p-4">
        <div className="flex-1">
          <Input
            label=""
            aria-label="Search machines"
            icon={Search}
            placeholder="Search by equipment name, code, or floor location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {(search || statusFilter) && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setStatusFilter("");
            }}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs font-semibold text-blue-400 transition hover:border-slate-700 hover:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <X className="h-3.5 w-3.5" /> Clear filters
          </button>
        )}
      </div>

      {/* Machines Data Table */}
      <div className="overflow-hidden rounded-xl border border-slate-800/90 bg-slate-900/80 shadow-xl shadow-black/20">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-16 text-slate-400">
            <Spinner className="h-7 w-7 text-blue-400" />
            <p className="mt-3 text-xs font-medium">Loading machines…</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <p className="text-sm font-medium text-red-400">{error}</p>
            <button
              onClick={reload}
              className="mt-3 text-xs font-semibold text-blue-400 underline hover:text-blue-300"
            >
              Retry loading
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-slate-950/60 text-slate-500">
              <Wrench className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-slate-200">No equipment units found</h3>
            <p className="mt-1 text-xs text-slate-400">
              {search || statusFilter ? "No machines matched your active filters." : "Start by registering equipment units to the fleet."}
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
              <thead className="border-b border-slate-800/90 bg-slate-950/70 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-3.5">Equipment Code</th>
                  <th className="px-5 py-3.5">Machine Name</th>
                  <th className="px-5 py-3.5">Operating Status</th>
                  <th className="px-5 py-3.5">Plant Location</th>
                  <th className="px-5 py-3.5">Commissioned</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((m) => (
                  <tr key={m._id} className="ui-table-row">
                    <td className="whitespace-nowrap px-5 py-3.5 font-mono font-semibold text-blue-300">
                      {m.code}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-200">
                      <Link
                        href={`/machines/details?id=${m._id}`}
                        className="transition hover:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded"
                      >
                        {m.name}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5">
                      <MachineStatusBadge status={m.status} />
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-slate-400 font-medium">
                      {m.location || <span className="text-slate-600">—</span>}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5">
                      {m.isActive ? (
                        <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium text-[11px]">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          Ready
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-slate-500 text-[11px]">
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                          Offline
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/machines/details?id=${m._id}`}
                          title="Inspect equipment details"
                          aria-label={`View ${m.code}`}
                          className="rounded-lg border border-slate-800 bg-slate-900/80 p-1.5 text-slate-400 transition hover:border-slate-700 hover:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setToDelete(m)}
                          title="Decommission machine"
                          aria-label={`Delete ${m.code}`}
                          className="rounded-lg border border-slate-800 bg-slate-900/80 p-1.5 text-slate-400 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
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

      <Modal open={adding} title="Commission New Machine" onClose={() => setAdding(false)}>
        <MachineForm
          submitLabel="Register Equipment"
          onSubmit={handleCreate}
          onCancel={() => setAdding(false)}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Decommission Equipment"
        message={`Are you sure you want to decommission and permanently remove “${toDelete?.name}” (${toDelete?.code}) from the active fleet? This action cannot be undone.`}
        confirmLabel="Decommission Asset"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
