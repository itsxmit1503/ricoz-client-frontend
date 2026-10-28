"use client";

import { Boxes, PackageOpen, Pencil, Plus, RefreshCw, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import InventoryForm, { emptyInventoryForm, inventoryToForm } from "@/components/inventory/InventoryForm";
import Badge from "@/components/ui/Badge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import StatusFilterCards from "@/components/ui/StatusFilterCards";
import { useList } from "@/hooks/useList";
import { inventoryService } from "@/services/inventory.service";
import { productService } from "@/services/product.service";
import { findMeta } from "@/types/common";
import {
  getAvailable,
  getStockLevel,
  STOCK_LEVELS,
  type InventoryInput,
  type InventoryItem,
} from "@/types/inventory";
import { getErrorMessage } from "@/utils/getErrorMessage";

const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 3 });

export default function StockPage() {
  const stock = useList(inventoryService.list, "Could not load stock.");
  const products = useList(productService.list, "Could not load products.");

  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [modal, setModal] = useState<"new" | InventoryItem | null>(null);
  const [toDelete, setToDelete] = useState<InventoryItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const ready = !stock.loading && !products.loading;

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    stock.items.forEach((i) => {
      const level = getStockLevel(i);
      map[level] = (map[level] ?? 0) + 1;
    });
    return map;
  }, [stock.items]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return stock.items.filter(
      (i) =>
        (!q ||
          (i.product?.name ?? "").toLowerCase().includes(q) ||
          (i.product?.code ?? "").toLowerCase().includes(q)) &&
        (!levelFilter || getStockLevel(i) === levelFilter),
    );
  }, [stock.items, search, levelFilter]);

  const availableProducts = useMemo(() => {
    const used = new Set(stock.items.map((i) => i.product?._id));
    return products.items.filter((p) => p.isActive && !used.has(p._id));
  }, [products.items, stock.items]);

  async function handleSave(values: InventoryInput) {
    const editing = modal !== null && modal !== "new" ? modal : null;
    try {
      if (editing) {
        const { quantity, reservedQuantity, reorderLevel } = values;
        await inventoryService.update(editing._id, { quantity, reservedQuantity, reorderLevel });
        toast.success("Stock updated");
      } else {
        await inventoryService.create(values);
        toast.success("Stock record created");
      }
      setModal(null);
      stock.reload();
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not save stock."));
    }
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await inventoryService.remove(toDelete._id);
      stock.setItems((list) => list.filter((i) => i._id !== toDelete._id));
      toast.success("Stock record deleted");
      setToDelete(null);
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not delete stock record."));
    } finally {
      setDeleting(false);
    }
  }

  const productLabel = (i: InventoryItem) => (i.product ? `${i.product.code} — ${i.product.name}` : "Deleted product");

  return (
    <div className="ui-page-enter mx-auto max-w-7xl space-y-5">
      {/* Header Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950/60 border border-blue-800/50 px-2 py-0.5 rounded">
              SUPPLY // WAREHOUSE INVENTORY
            </span>
            <span className="text-slate-600 font-mono">•</span>
            <span className="font-mono text-xs text-slate-300 font-semibold">
              {stock.loading ? "Loading…" : `${filtered.length} of ${stock.items.length} materials tracked`}
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
            Inventory & Material Stock Balances
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={stock.reload}
            disabled={stock.loading}
            aria-label="Refresh stock"
            title="Refresh stock"
            className="ui-pressable rounded-lg border border-slate-700 bg-[#121826] p-2.5 text-slate-200 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${stock.loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setModal("new")}
            disabled={!ready}
            className="ui-pressable inline-flex min-h-9.5 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-500 transition disabled:opacity-60"
          >
            <Plus className="h-4 w-4" /> Add Stock Item
          </button>
        </div>
      </div>

      {/* Unified Inventory Console */}
      <div className="border border-slate-800/90 bg-[#0b101c] rounded-xl overflow-hidden shadow-xl">
        {/* Integrated Command Strip */}
        <div className="p-4 border-b border-slate-800/80 bg-[#080d17] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <StatusFilterCards options={STOCK_LEVELS} counts={counts} active={levelFilter} onChange={setLevelFilter} />

          <div className="w-full md:w-80">
            <Input
              label=""
              aria-label="Search stock"
              icon={Search}
              placeholder="Search by part name or SKU code…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Data Table */}
        {stock.loading ? (
          <div className="flex flex-col items-center justify-center p-16 text-slate-300">
            <Spinner className="h-7 w-7 text-blue-400" />
            <p className="mt-3 text-xs font-semibold">Querying warehouse balances…</p>
          </div>
        ) : stock.error ? (
          <div className="p-12 text-center text-rose-400">{stock.error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-slate-400">No inventory balances match criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800/80 bg-[#080d17] text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-5">Material / SKU</th>
                  <th className="py-3 px-5 text-right">On Hand</th>
                  <th className="py-3 px-5 text-right">Reserved</th>
                  <th className="py-3 px-5 text-right">Available Buffer</th>
                  <th className="py-3 px-5 text-right">Reorder Threshold</th>
                  <th className="py-3 px-5">Buffer Health</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filtered.map((i) => {
                  const available = getAvailable(i);
                  const unit = i.product?.unit ?? "units";
                  return (
                    <tr key={i._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-5 font-bold text-white font-sans">
                        {i.product ? (
                          <div>
                            <p className="font-semibold text-white">{i.product.name}</p>
                            <p className="font-mono text-xs text-blue-400">{i.product.code}</p>
                          </div>
                        ) : (
                          <span className="text-slate-400">Deleted product</span>
                        )}
                      </td>
                      <td className="py-3.5 px-5 text-right font-mono font-bold text-white">
                        {fmt(i.quantity)} <span className="text-xs font-normal text-slate-300 font-sans">{unit}</span>
                      </td>
                      <td className="py-3.5 px-5 text-right font-mono text-slate-300">
                        {fmt(i.reservedQuantity)}
                      </td>
                      <td className={`py-3.5 px-5 text-right font-mono font-bold ${available <= 0 ? "text-rose-400" : "text-emerald-400"}`}>
                        {fmt(available)}
                      </td>
                      <td className="py-3.5 px-5 text-right font-mono text-slate-300">
                        {fmt(i.reorderLevel)}
                      </td>
                      <td className="py-3.5 px-5 font-sans">
                        <Badge meta={findMeta(STOCK_LEVELS, getStockLevel(i))} />
                      </td>
                      <td className="py-3.5 px-5 text-right font-sans">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => setModal(i)}
                            aria-label="Edit stock"
                            title="Edit stock"
                            className="ui-pressable rounded-lg border border-slate-700 bg-[#121826] p-1.5 text-slate-300 transition hover:border-slate-600 hover:text-white"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setToDelete(i)}
                            aria-label="Delete stock record"
                            title="Delete stock record"
                            className="ui-pressable rounded-lg border border-slate-700 bg-[#121826] p-1.5 text-slate-300 transition hover:border-rose-600 hover:bg-rose-950/40 hover:text-rose-400"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <Modal
          open
          title={modal === "new" ? "Add Stock Record" : `Edit Stock for ${modal.product?.name ?? "Product"}`}
          onClose={() => setModal(null)}
        >
          <InventoryForm
            key={modal === "new" ? "new" : modal._id}
            initial={modal === "new" ? emptyInventoryForm : inventoryToForm(modal)}
            products={modal === "new" ? availableProducts : undefined}
            lockedProduct={modal === "new" ? undefined : productLabel(modal)}
            submitLabel={modal === "new" ? "Create record" : "Save changes"}
            onSubmit={handleSave}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}

      {/* Delete Dialog */}
      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete Stock Record"
        message={`Are you sure you want to remove the inventory balance for ${toDelete?.product?.name ?? "this item"}?`}
        confirmLabel="Confirm Deletion"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
