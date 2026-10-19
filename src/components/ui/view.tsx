"use client";

import { Package, Pencil, Plus, RefreshCw, Search, Trash2, X } from "lucide-react";
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

const typeStyles: Record<Product["type"], string> = {
  RAW_MATERIAL: "bg-amber-500/10 text-amber-300",
  COMPONENT: "bg-sky-500/10 text-sky-300",
  FINISHED_GOOD: "bg-emerald-500/10 text-emerald-300",
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
    <div className="ui-page-enter mx-auto max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">Catalog</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-50">Products</h1>
          <p className="mt-1 text-sm text-slate-400">
            {loading ? "Loading…" : `${filtered.length} of ${products.length} products`}
          </p>
        </div>
        <div className="flex w-full gap-2 sm:w-auto sm:gap-3">
          <button onClick={reload} aria-label="Refresh products" title="Refresh products"
            className="rounded-lg border border-slate-700/90 bg-slate-900/60 p-2.5 text-slate-300 transition duration-150 hover:border-slate-600 hover:bg-slate-800 hover:text-white motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <Link href="/products/add"
            className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition duration-150 hover:bg-blue-500 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 sm:flex-none">
            <Plus className="h-4 w-4" /> Add Product
          </Link>
        </div>
      </div>

      <div className="mt-7 rounded-xl border border-slate-800/90 bg-slate-900/60 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-medium text-slate-200">Find a product</p>
            <p className="mt-0.5 text-xs text-slate-500">Search by name or code, then narrow by type or status.</p>
          </div>
          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setTypeFilter("");
                setStatusFilter("");
              }}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-400 transition hover:text-blue-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
            >
              <X className="h-3.5 w-3.5" /> Clear filters
            </button>
          )}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_200px_160px]">
          <Input label="" aria-label="Search products" icon={Search} placeholder="Search by name or code…"
            value={search} onChange={(e) => setSearch(e.target.value)} className="mt-0" />
          <Select aria-label="Filter by type" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="">All types</option>
            {PRODUCT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </Select>
          <Select aria-label="Filter by status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </Select>
        </div>
        {hasFilters && (
          <p className="mt-3 text-xs text-slate-500" role="status">
            Showing {filtered.length} matching {filtered.length === 1 ? "product" : "products"}.
          </p>
        )}
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-slate-800/90 bg-slate-900/80 shadow-lg shadow-black/10 sm:mt-6">
        {loading ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3 p-8 text-center sm:p-16">
            <Spinner className="h-7 w-7" />
            <p className="text-sm text-slate-400">Loading products…</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center sm:p-12">
            <p className="font-medium text-red-300">Could not load products</p>
            <p className="mt-1 text-sm text-red-400/90">{error}</p>
            <button onClick={reload} className="mt-4 rounded-lg border border-red-500/30 px-3 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400">Try again</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center p-8 text-center sm:p-16">
            <Package className="h-10 w-10 text-slate-600" />
            <p className="mt-4 text-slate-300">{products.length ? "No products match your filters." : "No products yet."}</p>
            {!products.length && (
              <Link href="/products/add" className="mt-3 text-sm font-medium text-blue-400 hover:text-blue-300">
                Add your first product
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <p className="border-b border-slate-800 px-5 py-2 text-xs text-slate-500 sm:hidden">
              Swipe horizontally to see all product details.
            </p>
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-slate-800 bg-slate-950/30 text-xs uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="whitespace-nowrap px-5 py-3 font-medium">Code</th>
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="whitespace-nowrap px-5 py-3 font-medium">Type</th>
                  <th className="whitespace-nowrap px-5 py-3 font-medium">Unit</th>
                  <th className="whitespace-nowrap px-5 py-3 font-medium">Status</th>
                  <th className="whitespace-nowrap px-5 py-3 font-medium">Created</th>
                  <th className="whitespace-nowrap px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map((p) => (
                  <tr key={p._id} className="transition-colors duration-150 hover:bg-slate-800/40 motion-reduce:transition-none">
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-300">{p.code}</td>
                    <td className="px-5 py-3.5 font-medium text-slate-100">{p.name}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${typeStyles[p.type]}`}>
                        {productTypeLabel(p.type)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-300">{p.unit}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 text-xs ${p.isActive ? "text-emerald-400" : "text-slate-500"}`}>
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {p.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-1">
                        <Link href={`/products/edit?id=${p._id}`} aria-label={`Edit ${p.code}`}
                          title={`Edit ${p.code}`}
                          className="rounded-lg p-2 text-slate-400 transition duration-150 hover:bg-slate-800 hover:text-white motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400">
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button onClick={() => setToDelete(p)} aria-label={`Delete ${p.code}`} title={`Delete ${p.code}`}
                          className="rounded-lg p-2 text-slate-400 transition duration-150 hover:bg-red-500/10 hover:text-red-400 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400">
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

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete product?"
        message={`“${toDelete?.name}” (${toDelete?.code}) will be permanently removed. This can't be undone.`}
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}