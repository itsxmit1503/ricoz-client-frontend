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
  RAW_MATERIAL: { bg: "bg-amber-500/10", text: "text-amber-300", border: "border-amber-500/20" },
  COMPONENT: { bg: "bg-sky-500/10", text: "text-sky-300", border: "border-sky-500/20" },
  FINISHED_GOOD: { bg: "bg-emerald-500/10", text: "text-emerald-300", border: "border-emerald-500/20" },
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
    <div className="ui-page-enter mx-auto max-w-7xl space-y-6">
      {/* Header Deck */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-700/60 bg-slate-800 text-blue-400">
              <Package className="h-4 w-4" />
            </span>
            <p className="text-xs font-medium text-blue-400">
              Products
            </p>
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Product Catalog
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            {loading ? "Loading catalog…" : `${filtered.length} of ${products.length} products`}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={reload}
            disabled={loading}
            aria-label="Refresh catalog"
            title="Refresh catalog"
            className="rounded-lg border border-slate-700/80 bg-slate-900/80 p-2.5 text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <Link
            href="/products/add"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <Plus className="h-4 w-4" /> Add Product
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/70 p-4 shadow-sm sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Filter Catalog Items
            </h2>
            <p className="text-[11px] text-slate-500">Search by item name or unique SKU code</p>
          </div>
          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setTypeFilter("");
                setStatusFilter("");
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 transition hover:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <X className="h-3.5 w-3.5" /> Clear active filters
            </button>
          )}
        </div>

        <div className="mt-3.5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px_180px]">
          <Input
            label=""
            aria-label="Search products"
            icon={Search}
            placeholder="Search by product name or code…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Select
            label=""
            aria-label="Filter by product type"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All Product Types</option>
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
            <option value="true">Active Only</option>
            <option value="false">Inactive Only</option>
          </Select>
        </div>
      </div>

      {/* Products Data Table */}
      <div className="overflow-hidden rounded-xl border border-slate-800/90 bg-slate-900/80 shadow-xl shadow-black/20">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-16 text-slate-400">
            <Spinner className="h-7 w-7 text-blue-400" />
            <p className="mt-3 text-xs font-medium">Loading catalog specifications…</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <p className="text-sm font-medium text-red-400">{error}</p>
            <button
              onClick={reload}
              className="mt-3 text-xs font-semibold text-blue-400 underline hover:text-blue-300"
            >
              Retry loading
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-slate-950/60 text-slate-500">
              <Boxes className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-slate-200">No matching products found</h3>
            <p className="mt-1 text-xs text-slate-400">
              {hasFilters ? "Try adjusting your search query or clear the active filters." : "Start by registering your first catalog item."}
            </p>
            {hasFilters ? (
              <button
                onClick={() => {
                  setSearch("");
                  setTypeFilter("");
                  setStatusFilter("");
                }}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white"
              >
                Reset filters
              </button>
            ) : (
              <Link
                href="/products/add"
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-500"
              >
                <Plus className="h-3.5 w-3.5" /> Add Product
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800/90 bg-slate-950/70 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-3.5">SKU / Code</th>
                  <th className="px-5 py-3.5">Product Name</th>
                  <th className="px-5 py-3.5">Classification</th>
                  <th className="px-5 py-3.5">Unit</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((product) => {
                  const style = typeStyles[product.type] ?? {
                    bg: "bg-slate-800",
                    text: "text-slate-300",
                    border: "border-slate-700",
                  };
                  return (
                    <tr key={product._id} className="ui-table-row">
                      <td className="whitespace-nowrap px-5 py-3.5 font-mono font-semibold text-blue-300">
                        {product.code}
                      </td>
                      <td className="px-5 py-3.5 font-medium text-slate-200">
                        {product.name}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5">
                        <span
                          className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold tracking-wide ${style.bg} ${style.text} ${style.border}`}
                        >
                          {productTypeLabel(product.type)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 font-mono text-slate-400">
                        {product.unit}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5">
                        {product.isActive ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/80 px-2 py-0.5 text-[10px] font-medium text-slate-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/products/edit?id=${product._id}`}
                            title="Edit product"
                            aria-label={`Edit ${product.name}`}
                            className="rounded-lg border border-slate-800 bg-slate-900/80 p-1.5 text-slate-400 transition hover:border-slate-700 hover:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setToDelete(product)}
                            title="Delete product"
                            aria-label={`Delete ${product.name}`}
                            className="rounded-lg border border-slate-800 bg-slate-900/80 p-1.5 text-slate-400 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
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
        message={`Are you sure you want to delete ${toDelete?.name} (${toDelete?.code})? This action cannot be reversed.`}
        confirmLabel="Confirm Deletion"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
