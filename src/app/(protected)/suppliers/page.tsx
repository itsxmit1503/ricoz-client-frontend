"use client";

import { Handshake, Pencil, Plus, RefreshCw, Search, Trash2, Truck } from "lucide-react";
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

export default function SuppliersPage() {
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
        toast.success(`${values.name} updated`);
      } else {
        await supplierService.create(values);
        toast.success(`${values.name} created`);
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
      toast.success(`${toDelete.name} deleted`);
      setToDelete(null);
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not delete supplier."));
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
              SUPPLY CHAIN // VENDOR DIRECTORY
            </span>
            <span className="text-slate-600 font-mono">•</span>
            <span className="font-mono text-xs text-slate-300 font-semibold">
              {suppliers.loading ? "Loading…" : `${filtered.length} of ${suppliers.items.length} certified vendors`}
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
            Supplier & Vendor Network
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={suppliers.reload}
            disabled={suppliers.loading}
            aria-label="Refresh suppliers"
            title="Refresh suppliers"
            className="rounded-lg border border-slate-700 bg-[#121826] p-2.5 text-slate-200 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${suppliers.loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setModal("new")}
            className="inline-flex min-h-9.5 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-500 transition"
          >
            <Plus className="h-4 w-4" /> Add Supplier
          </button>
        </div>
      </div>

      {/* Unified Supplier Console */}
      <div className="border border-slate-800/90 bg-[#0b101c] rounded-xl overflow-hidden shadow-xl">
        {/* Integrated Command Strip: Filter pills + Search */}
        <div className="p-4 border-b border-slate-800/80 bg-[#080d17] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <StatusFilterCards options={SUPPLIER_STATES} counts={counts} active={stateFilter} onChange={setStateFilter} />

          <div className="w-full md:w-80">
            <Input
              label=""
              aria-label="Search suppliers"
              icon={Search}
              placeholder="Search vendor, code, email, phone…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Data Table */}
        {suppliers.loading ? (
          <div className="flex flex-col items-center justify-center p-16 text-slate-300">
            <Spinner className="h-7 w-7 text-blue-400" />
            <p className="mt-3 text-xs font-semibold">Querying supplier directory…</p>
          </div>
        ) : suppliers.error ? (
          <div className="p-12 text-center text-rose-400">{suppliers.error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-slate-400">No certified suppliers match criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800/80 bg-[#080d17] text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-5">Vendor Code</th>
                  <th className="py-3 px-5">Supplier Organization</th>
                  <th className="py-3 px-5">Direct Contact</th>
                  <th className="py-3 px-5">Facility Address</th>
                  <th className="py-3 px-5">Certification State</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filtered.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-5 font-bold text-white">
                      {s.code}
                    </td>
                    <td className="py-3.5 px-5 font-sans font-semibold text-slate-100">
                      {s.name}
                    </td>
                    <td className="py-3.5 px-5 font-sans text-slate-300">
                      <div>
                        <p className="font-semibold text-slate-200">{s.email || "—"}</p>
                        <p className="font-mono text-xs text-slate-400">{s.phone || "—"}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 font-sans text-slate-300 truncate max-w-xs">
                      {s.address || "—"}
                    </td>
                    <td className="py-3.5 px-5 font-sans">
                      <Badge meta={findMeta(SUPPLIER_STATES, String(s.isActive))} />
                    </td>
                    <td className="py-3.5 px-5 text-right font-sans">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => setModal(s)}
                          aria-label={`Edit ${s.name}`}
                          title={`Edit ${s.name}`}
                          className="rounded-lg border border-slate-700 bg-[#121826] p-1.5 text-slate-300 transition hover:border-slate-600 hover:text-white"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setToDelete(s)}
                          aria-label={`Delete ${s.name}`}
                          title={`Delete ${s.name}`}
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

      {/* Modal */}
      {modal && (
        <Modal
          open
          wide
          title={modal === "new" ? "Register Certified Supplier" : `Edit ${modal.name}`}
          onClose={() => setModal(null)}
        >
          <SupplierForm
            initial={modal === "new" ? emptySupplierForm : supplierToForm(modal)}
            submitLabel={modal === "new" ? "Create supplier" : "Save changes"}
            onSubmit={handleSave}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}

      {/* Delete Dialog */}
      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete Supplier"
        message={`Are you sure you want to delete ${toDelete?.name}? Purchase order history associated with this vendor may be affected.`}
        confirmLabel="Confirm Deletion"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
