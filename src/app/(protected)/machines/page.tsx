"use client";

import { Eye, Plus, RefreshCw, Search, Trash2, Wrench } from "lucide-react";
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
    <div className="ui-page-enter mx-auto max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">Operations</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-50">Machines</h1>
          <p className="mt-1 text-sm text-slate-400">
            {loading ? "Loading…" : `${filtered.length} of ${machines.length} machines`}
          </p>
        </div>
        <div className="flex w-full gap-2 sm:w-auto sm:gap-3">
          <button onClick={reload} aria-label="Refresh"
            className="rounded-lg border border-slate-700/90 bg-slate-900/60 p-2.5 text-slate-300 transition duration-150 hover:border-slate-600 hover:bg-slate-800 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button onClick={() => setAdding(true)}
            className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition duration-150 hover:bg-blue-500 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 sm:flex-none">
            <Plus className="h-4 w-4" /> Add Machine
          </button>
        </div>
      </div>

      {/* status summary — click to filter */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {MACHINE_STATUSES.map((s) => {
          const active = statusFilter === s.value;
          return (
            <button key={s.value} onClick={() => setStatusFilter(active ? "" : s.value)}
              className={`rounded-xl border p-3 text-left transition duration-150 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
                active ? "border-blue-500 bg-blue-500/10" : "border-slate-800 bg-slate-900 hover:border-slate-700"
              }`}>
              <span className="flex items-center gap-2 text-xs text-slate-400">
                <span className={`h-2 w-2 rounded-full ${s.dot}`} /> {s.label}
              </span>
              <span className="mt-1 block text-2xl font-semibold">{counts[s.value] ?? 0}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 rounded-xl border border-slate-800/90 bg-slate-900/60 p-4 sm:p-5">
        <Input label="" aria-label="Search machines" icon={Search} placeholder="Search by name, code or location…"
          value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-slate-800/90 bg-slate-900/80 sm:mt-6">
        {loading ? (
          <div className="flex min-h-64 items-center justify-center p-8 sm:p-16"><Spinner className="h-7 w-7" /></div>
        ) : error ? (
          <div className="p-8 text-center sm:p-12">
            <p className="text-red-400">{error}</p>
            <button onClick={reload} className="mt-3 text-sm font-medium text-blue-400 hover:text-blue-300">Try again</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center p-8 text-center sm:p-16">
            <Wrench className="h-10 w-10 text-slate-600" />
            <p className="mt-4 text-slate-300">{machines.length ? "No machines match your filters." : "No machines yet."}</p>
            {!machines.length && (
              <button onClick={() => setAdding(true)} className="mt-3 text-sm font-medium text-blue-400 hover:text-blue-300">
                Add your first machine
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <p className="border-b border-slate-800 px-5 py-2 text-xs text-slate-500 sm:hidden">
              Swipe horizontally to see all machine details.
            </p>
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="whitespace-nowrap px-5 py-3 font-medium">Code</th>
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="whitespace-nowrap px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Location</th>
                  <th className="whitespace-nowrap px-5 py-3 font-medium">Active</th>
                  <th className="whitespace-nowrap px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map((m) => (
                  <tr key={m._id} className="transition-colors duration-150 hover:bg-slate-800/40 motion-reduce:transition-none">
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-300">{m.code}</td>
                    <td className="px-5 py-3.5 font-medium">
                      <Link href={`/machines/details?id=${m._id}`} className="transition-colors duration-150 hover:text-blue-300 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400">{m.name}</Link>
                    </td>
                    <td className="px-5 py-3.5"><MachineStatusBadge status={m.status} /></td>
                    <td className="px-5 py-3.5 text-slate-300">{m.location || "—"}</td>
                    <td className="px-5 py-3.5">
                      <span className={m.isActive ? "text-emerald-400" : "text-slate-500"}>{m.isActive ? "Yes" : "No"}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-1">
                        <Link href={`/machines/details?id=${m._id}`} aria-label={`View ${m.code}`}
                          className="rounded-lg p-2 text-slate-400 transition duration-150 hover:bg-slate-800 hover:text-white motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400">
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button onClick={() => setToDelete(m)} aria-label={`Delete ${m.code}`}
                          className="rounded-lg p-2 text-slate-400 transition duration-150 hover:bg-red-500/10 hover:text-red-400 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400">
                          <Trash2 className="h-4 w-4" />
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

      <Modal open={adding} title="Add Machine" onClose={() => setAdding(false)}>
        <MachineForm submitLabel="Create machine" onSubmit={handleCreate} onCancel={() => setAdding(false)} />
      </Modal>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete machine?"
        message={`“${toDelete?.name}” (${toDelete?.code}) will be permanently removed. This can't be undone.`}
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}