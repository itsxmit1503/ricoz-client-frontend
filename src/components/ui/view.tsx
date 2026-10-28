"use client";

import {
  Boxes,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Spinner from "@/components/ui/Spinner";
import { useProducts } from "@/hooks/useProducts";
import { productService } from "@/services/product.service";
import { PRODUCT_TYPES, productTypeLabel, type Product } from "@/types/product";
import { getErrorMessage } from "@/utils/getErrorMessage";

const typeStyles: Record<Product["type"], { bg: string; text: string; border: string }> = {
  RAW_MATERIAL: { bg: "bg-amber-950/50", text: "text-amber-300", border: "border-amber-800/40" },
  COMPONENT: { bg: "bg-blue-950/50", text: "text-blue-300", border: "border-blue-800/40" },
  FINISHED_GOOD: { bg: "bg-emerald-950/50", text: "text-emerald-300", border: "border-emerald-800/40" },
};

export default function ProductListPage() {
  const { products, setProducts, loading, error, reload } = useProducts();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [toDelete, setToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter(
      (p) =>
        (!q || p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q)) &&
        (!typeFilter || p.type === typeFilter) &&
        (!statusFilter || String(p.isActive) === statusFilter),
    );
  }, [products, search, typeFilter, statusFilter]);

  const hasFilters = Boolean(search.trim() || typeFilter || statusFilter);

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await productService.remove(toDelete._id);
      setProducts((list) => list.filter((p) => p._id !== toDelete._id));
      toast.success(`${toDelete.code} deleted`);
      setToDelete(null);
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not delete product."));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="ui-page-enter mx-auto max-w-7xl space-y-5">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950/60 border border-blue-800/50 px-2 py-0.5 rounded">
              SPEC // PART CATALOG
            </span>
            <span className="text-slate-600 font-mono">•</span>
            <span className="font-mono text-xs text-slate-300 font-semibold">
              {loading ? "Loading…" : `${filtered.length} of ${products.length} registered parts`}
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
            Product & Part Registry
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={reload}
            disabled={loading}
            aria-label="Refresh catalog"
            title="Refresh catalog"
            className="ui-pressable rounded-lg border border-slate-700 bg-[#121826] p-2.5 text-slate-200 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <Link
            href="/products/add"
            className="ui-pressable inline-flex min-h-9.5 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-500 transition"
          >
            <Plus className="h-4 w-4" /> Add Part
          </Link>
        </div>
      </div>

      {/* 2. Unified Data Console: Toolbar + Table integrated into one seamless surface */}
      <div className="border border-slate-800/90 bg-[#0b101c] rounded-xl overflow-hidden shadow-xl">
        {/* Integrated Filter Command Strip */}
        <div className="p-4 border-b border-slate-800/80 bg-[#080d17]">
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px_180px_auto] items-center">
            <Input
              label=""
              aria-label="Search products"
              icon={Search}
              placeholder="Search by part name or SKU code…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <Select
              label=""
              aria-label="Filter by product type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">All Part Categories</option>
              {PRODUCT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </Select>

            <Select
              label=""
              aria-label="Filter by operational status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="true">Active Parts Only</option>
              <option value="false">Inactive / Archived</option>
            </Select>

            {hasFilters && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setTypeFilter("");
                  setStatusFilter("");
                }}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-300 hover:text-white bg-[#121826] border border-slate-700 rounded-lg transition"
              >
                <X className="h-3.5 w-3.5" /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Data Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center p-16 text-slate-300">
            <Spinner className="h-7 w-7 text-blue-400" />
            <p className="mt-3 text-xs font-semibold">Querying part catalog…</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <p className="text-sm font-medium text-rose-400">{error}</p>
            <button
              onClick={reload}
              className="mt-3 text-xs font-semibold text-blue-400 underline hover:text-blue-300"
            >
              Retry loading
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-[#080d17] text-slate-400">
              <Boxes className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-sm font-bold text-white">No matching catalog items</h3>
            <p className="mt-1 text-xs text-slate-300">
              {hasFilters ? "Try adjusting your search query or clear the active filters." : "Start by registering your first catalog part."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800/80 bg-[#080d17] text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-5">Part Code</th>
                  <th className="py-3 px-5">Part Name</th>
                  <th className="py-3 px-5">Classification</th>
                  <th className="py-3 px-5 text-center">Unit</th>
                  <th className="py-3 px-5">Operational State</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filtered.map((p) => {
                  const style = typeStyles[p.type] ?? {
                    bg: "bg-slate-800",
                    text: "text-slate-300",
                    border: "border-slate-700",
                  };
                  return (
                    <tr key={p._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-5 font-bold text-white">
                        {p.code}
                      </td>
                      <td className="py-3.5 px-5 font-sans font-semibold text-slate-100">
                        {p.name}
                      </td>
                      <td className="py-3.5 px-5 font-sans">
                        <span
                          className={`inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-bold ${style.bg} ${style.text} ${style.border}`}
                        >
                          {productTypeLabel(p.type)}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-center font-bold text-slate-200">
                        {p.unit}
                      </td>
                      <td className="py-3.5 px-5 font-sans">
                        {p.isActive ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/80 px-2.5 py-0.5 text-[11px] font-semibold text-slate-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                            Archived
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-5 text-right font-sans">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/products/edit?id=${p._id}`}
                            aria-label={`Edit ${p.code}`}
                            title={`Edit ${p.code}`}
                            className="ui-pressable rounded-lg border border-slate-700 bg-[#121826] p-1.5 text-slate-300 transition hover:border-slate-600 hover:text-white"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Link>
                          <button
                            onClick={() => setToDelete(p)}
                            aria-label={`Delete ${p.code}`}
                            title={`Delete ${p.code}`}
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

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete Catalog Item"
        message={`Are you sure you want to delete ${toDelete?.code} — ${toDelete?.name}? Active BOM recipes or work orders referencing this part may be affected.`}
        confirmLabel="Confirm Deletion"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
