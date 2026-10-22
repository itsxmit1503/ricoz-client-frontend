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

/** /machines/details -> pick a machine.   /machines/details?id=<id> -> view / edit it. */
function MachinePicker() {
  const { machines, loading, error } = useMachines();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return machines.filter((m) => !q || m.name.toLowerCase().includes(q) || m.code.toLowerCase().includes(q));
  }, [machines, search]);

  return (
    <div className="ui-page-enter mx-auto max-w-3xl space-y-5">
      <div>
        <Link
          href="/machines"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Equipment Fleet
        </Link>
        <div className="mt-3 flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700/60 bg-slate-800 text-blue-400">
            <Cpu className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs font-medium text-blue-400">Equipment</p>
            <h1 className="text-2xl font-semibold tracking-tight text-white">Select Machine</h1>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4">
        <Input
          label=""
          aria-label="Search machines"
          icon={Search}
          placeholder="Search by equipment name or code…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="divide-y divide-slate-800/80 overflow-hidden rounded-xl border border-slate-800/90 bg-slate-900/80 shadow-lg shadow-black/20">
        {loading ? (
          <div className="flex justify-center p-12"><Spinner className="h-6 w-6 text-blue-400" /></div>
        ) : error ? (
          <p className="p-8 text-center text-xs text-red-400">{error}</p>
        ) : filtered.length === 0 ? (
          <p className="p-8 text-center text-xs text-slate-400">No equipment found matching your search.</p>
        ) : (
          filtered.map((m) => (
            <Link
              key={m._id}
              href={`/machines/details?id=${m._id}`}
              className="ui-table-row flex items-center justify-between gap-4 px-5 py-3.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <div>
                <p className="font-semibold text-sm text-slate-200">{m.name}</p>
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
      <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</dt>
      <dd className="mt-1 text-xs font-medium text-slate-200">{children}</dd>
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
      toast.success(`Operational status set to ${getStatusMeta(status).label}`);
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
      toast.success(`${updated.code} profile updated`);
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not update machine."));
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await machineService.remove(id);
      toast.success("Equipment decommissioned");
      router.push("/machines");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not delete machine."));
      setDeleting(false);
    }
  }

  return (
    <div className="ui-page-enter mx-auto max-w-3xl space-y-6">
      <Link
        href="/machines"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Machines
      </Link>

      {loading ? (
        <div className="flex justify-center p-16"><Spinner className="h-7 w-7 text-blue-400" /></div>
      ) : error || !machine ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-xs text-red-200">
          {error ?? "Equipment profile not found."}{" "}
          <Link href="/machines/details" className="font-semibold underline ml-1 text-red-300">
            Select another machine
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-slate-800/80 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-700/60 bg-slate-800 text-blue-400">
                  <Cpu className="h-4 w-4" />
                </span>
                <p className="text-xs font-medium text-blue-400">
                  Equipment
                </p>
              </div>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white">{machine.name}</h1>
              <p className="mt-1 font-mono text-xs text-slate-400">Code: {machine.code}</p>
            </div>

            {!editing && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditing(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-900/80 px-3.5 py-2 text-xs font-medium text-slate-200 transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit Machine
                </button>
                <button
                  onClick={() => setConfirmOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Decommission
                </button>
              </div>
            )}
          </div>

          {editing ? (
            <div className="rounded-2xl border border-slate-800/90 bg-slate-900/80 p-6 shadow-xl shadow-black/20">
              <MachineForm
                submitLabel="Save Changes"
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
              {/* Operating Status Control Section */}
              <section className="rounded-2xl border border-slate-800/90 bg-slate-900/80 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Live Operating State
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Update operational availability for plant floor coordination
                    </p>
                  </div>
                  <MachineStatusBadge status={machine.status} />
                </div>

                <div className="mt-5 border-t border-slate-800/80 pt-4">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Switch Machine State:
                  </p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {MACHINE_STATUSES.map((s) => {
                      const current = s.value === machine.status;
                      return (
                        <button
                          key={s.value}
                          onClick={() => changeStatus(s.value)}
                          disabled={current || savingStatus !== null}
                          className={`inline-flex items-center justify-between rounded-lg border px-3 py-2 text-xs font-semibold transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:cursor-not-allowed ${
                            current
                              ? "border-blue-500/80 bg-blue-600/15 text-blue-200 shadow-xs"
                              : "border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:bg-slate-900 hover:text-white disabled:opacity-40"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className={`h-2 w-2 rounded-full ${s.dot}`} />
                            {s.label}
                          </span>
                          {savingStatus === s.value && <Spinner className="h-3 w-3 text-blue-400" />}
                          {current && (
                            <span className="text-[10px] uppercase font-bold text-blue-400">Current</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* Physical & Technical Specs Card */}
              <section className="rounded-2xl border border-slate-800/90 bg-slate-900/80 p-6 shadow-sm">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4 pb-2 border-b border-slate-800/80">
                  Deployment Specifications
                </h2>
                <dl className="grid gap-5 sm:grid-cols-2">
                  <Detail label="Plant Location / Bay">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-500" />
                      {machine.location || "Unassigned"}
                    </span>
                  </Detail>
                  <Detail label="Commissioning State">
                    {machine.isActive ? (
                      <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Commissioned for Service
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-slate-500">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                        Decommissioned / Standby
                      </span>
                    )}
                  </Detail>
                  <Detail label="Commission Date">
                    <span className="font-mono text-slate-300">
                      {new Date(machine.createdAt).toLocaleString()}
                    </span>
                  </Detail>
                  <Detail label="Last Telemetry Update">
                    <span className="font-mono text-slate-300">
                      {new Date(machine.updatedAt).toLocaleString()}
                    </span>
                  </Detail>
                </dl>
              </section>
            </div>
          )}

          <ConfirmDialog
            open={confirmOpen}
            title="Decommission Machine"
            message={`Are you sure you want to decommission and permanently remove “${machine.name}” (${machine.code})? This action cannot be reversed.`}
            loading={deleting}
            confirmLabel="Confirm Decommission"
            onConfirm={handleDelete}
            onCancel={() => setConfirmOpen(false)}
          />
        </>
      )}
    </div>
  );
}

function DetailsRouter() {
  const id = useSearchParams().get("id");
  return id ? <MachineDetails key={id} id={id} /> : <MachinePicker />;
}

export default function MachineDetailsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-16"><Spinner className="h-7 w-7 text-blue-400" /></div>}>
      <DetailsRouter />
    </Suspense>
  );
}
