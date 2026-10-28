"use client";

import { Cpu, Plus, RefreshCw, Search, Wrench } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import MachineForm from "@/components/machines/MachineForm";
import MachineStatusBadge from "@/components/machines/MachineStatusBadge";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import { useMachines } from "@/hooks/useMachines";
import { machineService } from "@/services/machine.service";
import { MACHINE_STATUSES, type Machine, type MachineInput } from "@/types/machine";
import { getErrorMessage } from "@/utils/getErrorMessage";

export default function MachinesPage() {
  const { machines, setMachines, loading, error, reload } = useMachines();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Machine | null>(null);

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
      const created = await machineService.create(values);
      setMachines((list) => [created, ...list]);
      toast.success(`${created.name} added`);
      setAdding(false);
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not add machine."));
    }
  }

  async function handleUpdate(values: MachineInput) {
    if (!editing) return;
    try {
      const updated = await machineService.update(editing._id, values);
      setMachines((list) => list.map((m) => (m._id === updated._id ? updated : m)));
      toast.success(`${updated.name} updated`);
      setEditing(null);
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not update machine."));
    }
  }

  return (
    <div className="ui-page-enter mx-auto max-w-7xl space-y-5">
      {/* Header Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950/60 border border-blue-800/50 px-2 py-0.5 rounded">
              PLANT ASSETS // FLEET DIRECTORY
            </span>
            <span className="text-slate-600 font-mono">•</span>
            <span className="font-mono text-xs text-slate-300 font-semibold">
              {loading ? "Loading…" : `${filtered.length} of ${machines.length} machines operational`}
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
            Machine Fleet & Workstations
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={reload}
            disabled={loading}
            aria-label="Refresh machines"
            title="Refresh machines"
            className="ui-pressable rounded-lg border border-slate-700 bg-[#121826] p-2.5 text-slate-200 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setAdding(true)}
            className="ui-pressable inline-flex min-h-9.5 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-500 transition"
          >
            <Plus className="h-4 w-4" /> Add Machine
          </button>
        </div>
      </div>

      {/* Unified Fleet Console: Status Pills + Search + Table */}
      <div className="border border-slate-800/90 bg-[#0b101c] rounded-xl overflow-hidden shadow-xl">
        {/* Integrated Command Strip */}
        <div className="p-4 border-b border-slate-800/80 bg-[#080d17] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-lg border border-slate-800 bg-[#06090f]">
            <button
              type="button"
              onClick={() => setStatusFilter("")}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold font-mono transition ${
                statusFilter === ""
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-300 hover:bg-[#121826] hover:text-white"
              }`}
            >
              <span>ALL FLEET</span>
              <span className="rounded bg-black/30 px-1.5 py-0.2 text-[10px] tabular-nums">
                {machines.length}
              </span>
            </button>

            {MACHINE_STATUSES.map((s) => {
              const active = statusFilter === s.value;
              const count = counts[s.value] ?? 0;
              return (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setStatusFilter(active ? "" : s.value)}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                    active
                      ? "bg-[#162238] border border-blue-500/60 text-blue-200"
                      : "text-slate-300 hover:bg-[#121826] hover:text-white border border-transparent"
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${s.dot}`} />
                  <span>{s.label}</span>
                  <span className={`font-mono text-[10px] px-1.5 py-0.2 rounded tabular-nums ${
                    active ? "bg-blue-900/60 text-blue-200" : "bg-slate-800/80 text-slate-400"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="w-full md:w-80">
            <Input
              label=""
              aria-label="Search machines"
              icon={Search}
              placeholder="Search by equipment, station, or bay…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Fleet Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center p-16 text-slate-300">
            <Spinner className="h-7 w-7 text-blue-400" />
            <p className="mt-3 text-xs font-semibold">Querying plant machinery…</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-rose-400">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-slate-400">No plant equipment found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800/80 bg-[#080d17] text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-5">Equipment ID</th>
                  <th className="py-3 px-5">Machine Name</th>
                  <th className="py-3 px-5">Workstation Location</th>
                  <th className="py-3 px-5">Operational Status</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filtered.map((m) => (
                  <tr key={m._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-5 font-bold text-white">
                      {m.code}
                    </td>
                    <td className="py-3.5 px-5 font-sans font-semibold text-slate-100">
                      <Link
                        href={`/machines/details?id=${m._id}`}
                        className="hover:text-blue-400 transition"
                      >
                        {m.name}
                      </Link>
                    </td>
                    <td className="py-3.5 px-5 font-sans text-slate-300">
                      {m.location || "—"}
                    </td>
                    <td className="py-3.5 px-5 font-sans">
                      <MachineStatusBadge status={m.status} />
                    </td>
                    <td className="py-3.5 px-5 text-right font-sans">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/machines/details?id=${m._id}`}
                          className="rounded-lg border border-slate-700 bg-[#121826] px-2.5 py-1 text-xs font-semibold text-blue-400 hover:text-white transition"
                        >
                          Telemetry
                        </Link>
                        <button
                          onClick={() => setEditing(m)}
                          className="rounded-lg border border-slate-700 bg-[#121826] px-2.5 py-1 text-xs font-semibold text-slate-300 hover:text-white transition"
                        >
                          Edit
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

      {/* Add Modal */}
      <Modal open={adding} title="Register Plant Equipment" onClose={() => setAdding(false)}>
        <MachineForm
          submitLabel="Register machine"
          onSubmit={handleCreate}
          onCancel={() => setAdding(false)}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal open={editing !== null} title="Update Equipment Parameters" onClose={() => setEditing(null)}>
        {editing && (
          <MachineForm
            initial={{
              name: editing.name,
              code: editing.code,
              status: editing.status,
              location: editing.location ?? "",
              isActive: editing.isActive,
            }}
            submitLabel="Save changes"
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>
    </div>
  );
}
