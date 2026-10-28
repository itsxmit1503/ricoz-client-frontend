"use client";

import { ChevronRight, Network, Pencil, Plus, RefreshCw, Search, Trash2 } from "lucide-react";
import { Fragment, useMemo, useState } from "react";
import toast from "react-hot-toast";
import BomForm, { bomToForm, emptyBomForm } from "@/components/bom/BomForm";
import Badge from "@/components/ui/Badge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import StatusFilterCards from "@/components/ui/StatusFilterCards";
import { useList } from "@/hooks/useList";
import { bomService } from "@/services/bom.service";
import { productService } from "@/services/product.service";
import { BOM_STATES, type Bom, type BomInput } from "@/types/bom";
import { findMeta } from "@/types/common";
import { getErrorMessage } from "@/utils/getErrorMessage";

export default function BomPage() {
  const boms = useList(bomService.list, "Could not load bills of materials.");
  const products = useList(productService.list, "Could not load products.");

  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [modal, setModal] = useState<"new" | Bom | null>(null);
  const [toDelete, setToDelete] = useState<Bom | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const ready = !boms.loading && !products.loading;

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    boms.items.forEach((b) => (map[String(b.isActive)] = (map[String(b.isActive)] ?? 0) + 1));
    return map;
  }, [boms.items]);

  const takenProductIds = useMemo(
    () => boms.items.map((b) => b.product?._id).filter((id): id is string => Boolean(id)),
    [boms.items],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return boms.items.filter(
      (b) =>
        (!q ||
          (b.product?.name ?? "").toLowerCase().includes(q) ||
          (b.product?.code ?? "").toLowerCase().includes(q) ||
          b.items.some((i) => (i.product?.name ?? "").toLowerCase().includes(q))) &&
        (!stateFilter || String(b.isActive) === stateFilter),
    );
  }, [boms.items, search, stateFilter]);

  async function handleSave(values: BomInput) {
    const editing = modal !== null && modal !== "new" ? modal : null;
    try {
      if (editing) {
        await bomService.update(editing._id, values);
        toast.success("BOM updated");
      } else {
        await bomService.create(values);
        toast.success("BOM created");
      }
      setModal(null);
      boms.reload();
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not save BOM."));
    }
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await bomService.remove(toDelete._id);
      boms.setItems((list) => list.filter((b) => b._id !== toDelete._id));
      toast.success("BOM deleted");
      setToDelete(null);
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not delete BOM."));
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
              <Network className="h-4 w-4" />
            </span>
            <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              Engineering Specs
            </p>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Bills of Materials (BOM)
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            {boms.loading ? "Loading specifications…" : `${filtered.length} of ${boms.items.length} recipes registered`}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={boms.reload}
            disabled={boms.loading}
            aria-label="Refresh BOM list"
            title="Refresh BOM list"
            className="rounded-lg border border-slate-700 bg-[#121826] p-2.5 text-slate-200 transition hover:border-slate-600 hover:bg-[#192235] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${boms.loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setModal("new")}
            disabled={!ready}
            className="inline-flex min-h-9.5 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:opacity-60"
          >
            <Plus className="h-4 w-4" /> New BOM
          </button>
        </div>
      </div>

      {/* Filter Cards */}
      <StatusFilterCards options={BOM_STATES} counts={counts} active={stateFilter} onChange={setStateFilter} />

      {/* Search Input */}
      <div className="rounded-xl border border-slate-800 bg-[#0c111e] p-4">
        <Input
          label=""
          aria-label="Search BOMs"
          icon={Search}
          placeholder="Search by product name, component SKU, or code…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Main BOM Data Table */}
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0c111e] shadow-xl">
        {boms.loading ? (
          <div className="flex flex-col items-center justify-center p-16 text-slate-300">
            <Spinner className="h-7 w-7 text-blue-400" />
            <p className="mt-3 text-xs font-medium">Loading BOM structures…</p>
          </div>
        ) : boms.error ? (
          <div className="p-12 text-center">
            <p className="text-sm font-medium text-rose-400">{boms.error}</p>
            <button
              onClick={boms.reload}
              className="mt-3 text-xs font-semibold text-blue-400 underline hover:text-blue-300"
            >
              Retry loading
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center p-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-[#080d17] text-slate-400">
              <Network className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-white">No bills of materials found</h3>
            <p className="mt-1 text-xs text-slate-300">
              {boms.items.length ? "No BOMs match your search or status filter." : "Get started by building your first product assembly structure."}
            </p>
            {!boms.items.length && ready && (
              <button
                onClick={() => setModal("new")}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-500"
              >
                <Plus className="h-3.5 w-3.5" /> Create first BOM
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-[#080d17] text-xs font-semibold uppercase tracking-wider text-slate-300">
                <tr>
                  <th className="w-10 px-3 py-3.5" />
                  <th className="px-5 py-3.5">Finished Product</th>
                  <th className="px-5 py-3.5 text-right">Component Count</th>
                  <th className="px-5 py-3.5">Lifecycle Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filtered.map((b) => {
                  const open = expanded === b._id;
                  return (
                    <Fragment key={b._id}>
                      <tr className="ui-table-row">
                        <td className="px-3 py-3.5">
                          <button
                            onClick={() => setExpanded(open ? null : b._id)}
                            aria-label={open ? "Hide components" : "Show components"}
                            aria-expanded={open}
                            className="rounded p-1 text-slate-400 hover:bg-[#151c2d] hover:text-white"
                          >
                            <ChevronRight className={`h-4 w-4 transition-transform ${open ? "rotate-90" : ""}`} />
                          </button>
                        </td>
                        <td className="px-5 py-3.5">
                          {b.product ? (
                            <>
                              <p className="font-semibold text-white">{b.product.name}</p>
                              <p className="font-mono text-xs text-blue-300">{b.product.code}</p>
                            </>
                          ) : (
                            <span className="text-slate-400 font-medium">Deleted product reference</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-right font-mono font-bold text-slate-100">
                          {b.items.length}
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge meta={findMeta(BOM_STATES, String(b.isActive))} />
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => setModal(b)}
                              aria-label="Edit BOM"
                              title="Edit BOM"
                              className="rounded-lg border border-slate-700 bg-[#121826] p-1.5 text-slate-300 transition hover:border-slate-600 hover:text-white"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => setToDelete(b)}
                              aria-label="Delete BOM"
                              title="Delete BOM"
                              className="rounded-lg border border-slate-700 bg-[#121826] p-1.5 text-slate-300 transition hover:border-rose-600 hover:bg-rose-950/40 hover:text-rose-400"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {open && (
                        <tr className="bg-[#080d17]">
                          <td />
                          <td colSpan={4} className="px-5 py-4">
                            <div className="rounded-lg border border-slate-800 bg-[#0e1422] p-4 max-w-2xl">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-2">
                                Sub-Component Breakdown ({b.items.length} items)
                              </h4>
                              <table className="w-full text-xs">
                                <thead className="border-b border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                  <tr>
                                    <th className="pb-2 text-left">Component Part</th>
                                    <th className="pb-2 text-right">Required Quantity</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60 font-mono">
                                  {b.items.map((i, idx) => (
                                    <tr key={i._id ?? idx}>
                                      <td className="py-2 text-slate-200 font-sans">
                                        {i.product ? (
                                          <div className="flex items-center gap-2">
                                            <span className="font-semibold text-white">{i.product.name}</span>
                                            <span className="font-mono text-xs text-blue-300">[{i.product.code}]</span>
                                          </div>
                                        ) : (
                                          <span className="text-slate-400">Deleted component</span>
                                        )}
                                      </td>
                                      <td className="py-2 text-right text-slate-100 font-bold">
                                        {i.quantity.toLocaleString()} <span className="text-xs font-normal text-slate-300 font-sans">{i.unit}</span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* BOM Edit/New Modal */}
      {modal && (
        <Modal
          open
          title={modal === "new" ? "Create Bill of Materials" : "Edit Bill of Materials"}
          onClose={() => setModal(null)}
        >
          <BomForm
            key={modal === "new" ? "new" : modal._id}
            initial={modal === "new" ? emptyBomForm() : bomToForm(modal)}
            products={products.items}
            takenProductIds={takenProductIds}
            submitLabel={modal === "new" ? "Create BOM" : "Save changes"}
            onSubmit={handleSave}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete Bill of Materials"
        message={`Are you sure you want to delete the BOM for ${toDelete?.product?.name ?? "this product"}? Any production work orders referencing this recipe may be affected.`}
        confirmLabel="Confirm Deletion"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
