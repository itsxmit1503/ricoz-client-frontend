"use client";

import { ArrowLeft, Cpu, MapPin, Pencil, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState, type ReactNode } from "react";
import toast from "react-hot-toast";
import MachineForm from "@/components/machines/MachineForm";
import MachineStatusBadge from "@/components/machines/MachineStatusBadge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Input from "@/components/ui/Input";
import Spinner from "@/components/ui/Spinner";
import { useMachines } from "@/hooks/useMachines";
import { machineService } from "@/services/machine.service";
import { getStatusMeta, MACHINE_STATUSES, type Machine, type MachineInput, type MachineStatus } from "@/types/machine";
import { getErrorMessage } from "@/utils/getErrorMessage";

function MachinePicker() {
  const { machines, loading, error } = useMachines();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return machines.filter((m) => !q || m.name.toLowerCase().includes(q) || m.code.toLowerCase().includes(q));
  }, [machines, search]);

  return (
    <div className="ui-page-enter mx-auto max-w-4xl space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-700 bg-[#121826] text-blue-400">
            <Cpu className="h-4 w-4" />
          </span>
          <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
            Diagnostics Matrix
          </p>
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Workstation & Machine Diagnostics
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-300">
          Select an equipment workstation to inspect operating telemetry, runtime history, and status.
        </p>
      </div>

      <div className="rounded-xl border border-slate-800 bg-[#0c111e] p-4">
        <Input
          label=""
          aria-label="Search machines"
          icon={Search}
          placeholder="Search by equipment name or station code…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0c111e] shadow-xl divide-y divide-slate-800/80">
        {loading ? (
          <div className="flex justify-center p-16 text-slate-300">
            <Spinner className="h-7 w-7 text-blue-400" />
          </div>
        ) : error ? (
          <p className="p-8 text-center text-rose-400">{error}</p>
        ) : filtered.length === 0 ? (
          <p className="p-8 text-center text-slate-300">No equipment found matching your search.</p>
        ) : (
          filtered.map((m) => (
            <Link
              key={m._id}
              href={`/machines/details?id=${m._id}`}
              className="flex items-center justify-between px-5 py-4 transition hover:bg-[#121826]"
            >
              <div>
                <p className="font-semibold text-white">{m.name}</p>
                <p className="font-mono text-xs text-blue-300">{m.code}</p>
              </div>
              <MachineStatusBadge status={m.status} />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-white">{children}</dd>
    </div>
  );
}

function MachineDetails({ id }: { id: string }) {
  const router = useRouter();
  const [machine, setMachine] = useState<Machine | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [savingStatus, setSavingStatus] = useState<MachineStatus | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;
    machineService
      .get(id)
      .then((data) => active && setMachine(data))
      .catch((err) => active && setError(getErrorMessage(err, "Could not load machine.")))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  async function changeStatus(status: MachineStatus) {
    if (!machine || status === machine.status) return;
    setSavingStatus(status);
    try {
      const updated = await machineService.update(id, { status });
      setMachine(updated);
      toast.success(`Status set to ${getStatusMeta(status).label}`);
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not update status."));
    } finally {
      setSavingStatus(null);
    }
  }

  async function handleUpdate(values: MachineInput) {
    try {
      const updated = await machineService.update(id, values);
      setMachine(updated);
      setEditing(false);
      toast.success(`${updated.code} updated`);
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not update machine."));
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await machineService.remove(id);
      toast.success("Machine deleted");
      router.push("/machines");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not delete machine."));
      setDeleting(false);
    }
  }

  return (
    <div className="ui-page-enter mx-auto max-w-4xl space-y-6">
      <Link href="/machines" className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 hover:text-blue-300">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Fleet Registry
      </Link>

      {loading ? (
        <div className="flex justify-center p-16 text-slate-300">
          <Spinner className="h-7 w-7 text-blue-400" />
        </div>
      ) : error || !machine ? (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-6 text-sm text-rose-200">
          {error ?? "Machine not found."}{" "}
          <Link href="/machines/details" className="font-semibold underline ml-2">Select another machine</Link>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-blue-400 font-bold">
                Workstation Telemetry
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{machine.name}</h1>
              <p className="mt-0.5 font-mono text-sm text-blue-300 font-bold">{machine.code}</p>
            </div>
            {!editing && (
              <div className="flex gap-2.5">
                <button
                  onClick={() => setEditing(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-[#121826] px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-[#1a2336] hover:text-white"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit Specs
                </button>
                <button
                  onClick={() => setConfirmOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-rose-700/60 bg-rose-950/40 px-3.5 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-900/50"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Remove
                </button>
              </div>
            )}
          </div>

          {editing ? (
            <div className="rounded-xl border border-slate-800 bg-[#0c111e] p-6 shadow-xl">
              <MachineForm
                submitLabel="Save changes"
                onSubmit={handleUpdate}
                onCancel={() => setEditing(false)}
                initial={{
                  name: machine.name,
                  code: machine.code,
                  status: machine.status,
                  location: machine.location ?? "",
                  isActive: machine.isActive,
                }}
              />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Status Controller Card */}
              <section className="rounded-xl border border-slate-800 bg-[#0c111e] p-5 sm:p-6 shadow-sm">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Real-time Operational State
                </h2>
                <div className="mt-3">
                  <MachineStatusBadge status={machine.status} />
                </div>
                <p className="mb-2.5 mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Override Machine State
                </p>
                <div className="flex flex-wrap gap-2">
                  {MACHINE_STATUSES.map((s) => {
                    const current = s.value === machine.status;
                    return (
                      <button
                        key={s.value}
                        onClick={() => changeStatus(s.value)}
                        disabled={current || savingStatus !== null}
                        className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition disabled:cursor-not-allowed ${
                          current
                            ? "border-blue-500 bg-blue-500/15 text-blue-200 font-bold"
                            : "border-slate-700 bg-[#121826] text-slate-200 hover:border-slate-600 hover:bg-[#1a2336] hover:text-white disabled:opacity-40"
                        }`}
                      >
                        {savingStatus === s.value ? (
                          <Spinner className="h-3 w-3" />
                        ) : (
                          <span className={`h-2 w-2 rounded-full ${s.dot}`} />
                        )}
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Specifications Card */}
              <section className="rounded-xl border border-slate-800 bg-[#0c111e] p-5 sm:p-6 shadow-sm">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
                  Workstation Specifications
                </h2>
                <dl className="grid gap-4 sm:grid-cols-2">
                  <Detail label="Station Identifier">{machine.code}</Detail>
                  <Detail label="Workstation Name">{machine.name}</Detail>
                  <Detail label="Shop Floor Location">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-blue-400" />
                      {machine.location || "Unassigned Zone"}
                    </span>
                  </Detail>
                  <Detail label="Line Availability">
                    <span className={machine.isActive ? "text-emerald-400 font-bold" : "text-slate-400"}>
                      {machine.isActive ? "Active on Production Line" : "Deregistered / Inactive"}
                    </span>
                  </Detail>
                </dl>
              </section>
            </div>
          )}

          <ConfirmDialog
            open={confirmOpen}
            title="Deregister Workstation?"
            message={`Are you sure you want to remove ${machine.name} (${machine.code}) from active monitoring?`}
            confirmLabel="Confirm Removal"
            loading={deleting}
            onConfirm={handleDelete}
            onCancel={() => setConfirmOpen(false)}
          />
        </>
      )}
    </div>
  );
}

export default function MachineDetailsPage() {
  const params = useSearchParams();
  const id = params.get("id");

  return (
    <Suspense fallback={null}>
      {id ? <MachineDetails id={id} /> : <MachinePicker />}
    </Suspense>
  );
}
