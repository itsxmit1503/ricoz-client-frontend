"use client";

import { Handshake, Mail, Pencil, Phone, Plus, RefreshCw, Search, Trash2, Truck } from "lucide-react";
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
    <div className="ui-page-enter mx-auto max-w-7xl space-y-6">
      {/* Header Deck */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-700 bg-[#121826] text-blue-400">
              <Truck className="h-4 w-4" />
            </span>
            <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              Procurement & SRM
            </p>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Certified Suppliers & Vendors
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            {suppliers.loading ? "Loading vendor directory…" : `${filtered.length} of ${suppliers.items.length} suppliers registered`}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={suppliers.reload}
            disabled={suppliers.loading}
            aria-label="Refresh suppliers"
            title="Refresh suppliers"
            className="rounded-lg border border-slate-700 bg-[#121826] p-2.5 text-slate-200 transition hover:border-slate-600 hover:bg-[#192235] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${suppliers.loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setModal("new")}
            className="inline-flex min-h-9.5 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <Plus className="h-4 w-4" /> Add Supplier
          </button>
        </div>
      </div>

      {/* Filter Cards */}
      <StatusFilterCards options={SUPPLIER_STATES} counts={counts} active={stateFilter} onChange={setStateFilter} />

      {/* Search Bar */}
      <div className="rounded-xl border border-slate-800 bg-[#0c111e] p-4">
        <Input
          label=""
          aria-label="Search suppliers"
          icon={Search}
          placeholder="Search by vendor name, supplier code, email, or telephone…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Suppliers Data Table */}
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0c111e] shadow-xl">
        {suppliers.loading ? (
          <div className="flex flex-col items-center justify-center p-16 text-slate-300">
            <Spinner className="h-7 w-7 text-blue-400" />
            <p className="mt-3 text-xs font-medium">Loading supplier directory…</p>
          </div>
        ) : suppliers.error ? (
          <div className="p-12 text-center">
            <p className="text-sm font-medium text-rose-400">{suppliers.error}</p>
            <button
              onClick={suppliers.reload}
              className="mt-3 text-xs font-semibold text-blue-400 underline hover:text-blue-300"
            >
              Retry loading
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center p-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-[#080d17] text-slate-400">
              <Handshake className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-white">No suppliers found</h3>
            <p className="mt-1 text-xs text-slate-300">
              {suppliers.items.length ? "No vendors match your search criteria." : "Register certified suppliers to issue purchase orders."}
            </p>
            {!suppliers.items.length && (
              <button
                onClick={() => setModal("new")}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-500"
              >
                <Plus className="h-3.5 w-3.5" /> Add Supplier
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-[#080d17] text-xs font-semibold uppercase tracking-wider text-slate-300">
                <tr>
                  <th className="px-5 py-3.5">Vendor Code</th>
                  <th className="px-5 py-3.5">Supplier Name</th>
                  <th className="px-5 py-3.5">Direct Contact</th>
                  <th className="px-5 py-3.5">Registered Facility</th>
                  <th className="px-5 py-3.5">Account Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filtered.map((s) => (
                  <tr key={s._id} className="ui-table-row">
                    <td className="px-5 py-3.5 font-mono font-bold text-blue-300">
                      {s.code}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-white">
                      {s.name}
                    </td>
                    <td className="px-5 py-3.5">
                      {s.email || s.phone ? (
                        <div className="space-y-1 text-slate-300">
                          {s.email && (
                            <a href={`mailto:${s.email}`} className="flex items-center gap-1.5 hover:text-blue-300 transition-colors">
                              <Mail className="h-3.5 w-3.5 text-blue-400" />
                              <span>{s.email}</span>
                            </a>
                          )}
                          {s.phone && (
                            <a href={`tel:${s.phone}`} className="flex items-center gap-1.5 hover:text-blue-300 transition-colors">
                              <Phone className="h-3.5 w-3.5 text-blue-400" />
                              <span>{s.phone}</span>
                            </a>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="max-w-[240px] truncate px-5 py-3.5 text-slate-300" title={s.address}>
                      {s.address || "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge meta={findMeta(SUPPLIER_STATES, String(s.isActive))} />
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => setModal(s)}
                          aria-label={`Edit ${s.code}`}
                          title="Edit supplier"
                          className="rounded-lg border border-slate-700 bg-[#121826] p-1.5 text-slate-300 transition hover:border-slate-600 hover:text-white"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setToDelete(s)}
                          aria-label={`Delete ${s.code}`}
                          title="Delete supplier"
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

      <Modal open={modal !== null} title={modal === "new" ? "Add Certified Supplier" : "Edit Supplier Account"} onClose={() => setModal(null)}>
        {modal !== null && (
          <SupplierForm
            initial={modal === "new" ? emptySupplierForm : supplierToForm(modal)}
            submitLabel={modal === "new" ? "Create supplier" : "Save changes"}
            onSubmit={handleSave}
            onCancel={() => setModal(null)}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Deregister Supplier?"
        message={`Are you sure you want to remove "${toDelete?.name}" (${toDelete?.code})? Existing purchase orders referencing this supplier will be preserved.`}
        confirmLabel="Confirm Removal"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
