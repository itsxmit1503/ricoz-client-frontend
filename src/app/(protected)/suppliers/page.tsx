"use client";

import { Mail, Pencil, Phone, Plus, RefreshCw, Search, Trash2, Handshake } from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import SupplierForm, { emptySupplierForm, supplierToForm } from "@/components/suppliers/SupplierForm";
import Badge from "@/components/ui/Badge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import StatusFilterCards from "@/components/ui/StatusFilterCards";
import { useList } from "@/hooks/useList";
import { supplierService } from "@/services/supplier.service";
import { findMeta } from "@/types/common";
import { SUPPLIER_STATES, type Supplier, type SupplierInput } from "@/types/supplier";
import { getErrorMessage } from "@/utils/getErrorMessage";

export default function SupplierListPage() {
  const suppliers = useList(supplierService.list, "Could not load suppliers.");

  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [modal, setModal] = useState<"new" | Supplier | null>(null);
  const [toDelete, setToDelete] = useState<Supplier | null>(null);
  const [deleting, setDeleting] = useState(false);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    suppliers.items.forEach((s) => (map[String(s.isActive)] = (map[String(s.isActive)] ?? 0) + 1));
    return map;
  }, [suppliers.items]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return suppliers.items.filter(
      (s) =>
        (!q ||
          s.name.toLowerCase().includes(q) ||
          s.code.toLowerCase().includes(q) ||
          (s.email ?? "").toLowerCase().includes(q) ||
          (s.phone ?? "").toLowerCase().includes(q)) &&
        (!stateFilter || String(s.isActive) === stateFilter),
    );
  }, [suppliers.items, search, stateFilter]);

  async function handleSave(values: SupplierInput) {
    const editing = modal !== null && modal !== "new" ? modal : null;
    try {
      if (editing) {
        await supplierService.update(editing._id, values);
        toast.success(`${values.code} updated`);
      } else {
        await supplierService.create(values);
        toast.success(`${values.code} created`);
      }
      setModal(null);
      suppliers.reload();
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not save supplier."));
    }
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await supplierService.remove(toDelete._id);
      suppliers.setItems((list) => list.filter((s) => s._id !== toDelete._id));
      toast.success(`${toDelete.code} deleted`);
      setToDelete(null);
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not delete supplier."));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="ui-page-enter mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-blue-300/80">Procurement directory</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-100">Suppliers</h1>
          <p className="mt-1 text-sm text-slate-400">
            {suppliers.loading ? "Loading…" : `${filtered.length} of ${suppliers.items.length} suppliers`}
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={suppliers.reload} aria-label="Refresh"
            className="rounded-lg border border-slate-700/90 bg-slate-900/70 p-2.5 text-slate-300 transition hover:border-slate-600 hover:bg-slate-800">
            <RefreshCw className={`h-4 w-4 ${suppliers.loading ? "animate-spin" : ""}`} />
          </button>
          <button onClick={() => setModal("new")}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-950/20 transition hover:bg-blue-500">
            <Plus className="h-4 w-4" /> Add Supplier
          </button>
        </div>
      </div>

      <div className="ui-section-enter mt-7">
        <StatusFilterCards options={SUPPLIER_STATES} counts={counts} active={stateFilter} onChange={setStateFilter} />
      </div>

      <div className="ui-surface mt-4 rounded-xl p-3 sm:p-4">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Find a supplier</p>
          {stateFilter && <p className="text-xs text-blue-300">Filtered by status</p>}
        </div>
        <Input label="" aria-label="Search suppliers" icon={Search} placeholder="Search by name, code, email or phone…"
          value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="ui-section-enter mt-4 overflow-hidden rounded-xl border border-slate-800/90 bg-slate-900/80 shadow-lg shadow-slate-950/10">
        {suppliers.loading ? (
          <div className="flex justify-center p-16"><Spinner className="h-7 w-7" /></div>
        ) : suppliers.error ? (
          <div className="p-12 text-center">
            <p className="text-red-400">{suppliers.error}</p>
            <button onClick={suppliers.reload} className="mt-3 text-sm font-medium text-blue-400 hover:text-blue-300">Try again</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center p-16 text-center">
            <Handshake className="h-10 w-10 text-slate-600" />
            <p className="mt-4 text-slate-300">{suppliers.items.length ? "No suppliers match your filters." : "No suppliers yet."}</p>
            {!suppliers.items.length && (
              <button onClick={() => setModal("new")} className="mt-3 text-sm font-medium text-blue-400 hover:text-blue-300">
                Add your first supplier
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-3 font-medium">Code</th>
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Contact</th>
                  <th className="px-5 py-3 font-medium">Address</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map((s) => (
                  <tr key={s._id} className="ui-table-row hover:bg-slate-800/40">
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-300">{s.code}</td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-slate-100">{s.name}</p>
                      <p className="mt-0.5 text-xs text-slate-500">Supplier profile</p>
                    </td>
                    <td className="px-5 py-3.5">
                      {s.email || s.phone ? (
                        <div className="space-y-1 text-slate-300">
                          {s.email && (
                            <a href={`mailto:${s.email}`} className="flex items-center gap-2 hover:text-blue-300">
                              <Mail className="h-3.5 w-3.5 text-slate-500" /> {s.email}
                            </a>
                          )}
                          {s.phone && (
                            <a href={`tel:${s.phone}`} className="flex items-center gap-2 hover:text-blue-300">
                              <Phone className="h-3.5 w-3.5 text-slate-500" /> {s.phone}
                            </a>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                    <td className="max-w-[220px] truncate px-5 py-3.5 text-slate-400" title={s.address}>{s.address || "—"}</td>
                    <td className="px-5 py-3.5"><Badge meta={findMeta(SUPPLIER_STATES, String(s.isActive))} /></td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => setModal(s)} aria-label={`Edit ${s.code}`}
                          className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => setToDelete(s)} aria-label={`Delete ${s.code}`}
                          className="rounded-lg p-2 text-slate-400 hover:bg-red-500/10 hover:text-red-400">
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

      <Modal open={modal !== null} wide title={modal === "new" ? "Add Supplier" : "Edit Supplier"} onClose={() => setModal(null)}>
        {modal !== null && (
          <SupplierForm
            key={modal === "new" ? "new" : modal._id}
            initial={modal === "new" ? emptySupplierForm : supplierToForm(modal)}
            submitLabel={modal === "new" ? "Create supplier" : "Save changes"}
            onSubmit={handleSave}
            onCancel={() => setModal(null)}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete supplier?"
        message={`“${toDelete?.name}” (${toDelete?.code}) will be permanently removed. Consider marking it inactive instead if it has purchase orders.`}
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}