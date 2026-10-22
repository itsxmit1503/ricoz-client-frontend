import { ArrowRight, Clock, Forklift, Network, Package, ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function BillOfMaterialsPage() {
  return (
    <div className="ui-page-enter mx-auto max-w-4xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-blue-300/80">Engineering & Product Structure</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-100">Bill of Materials</h1>
          <p className="mt-1 text-sm text-slate-400">Hierarchical multi-level parts list and recipe management</p>
        </div>
      </div>

      <div className="ui-section-enter mt-6 rounded-2xl border border-slate-800/90 bg-slate-900/80 p-8 text-center shadow-xl shadow-black/20 sm:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-500/30 bg-blue-500/10 text-blue-400 shadow-lg shadow-blue-950/20">
          <Network className="h-7 w-7" />
        </div>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-medium text-amber-300">
          <Clock className="h-3.5 w-3.5" />
          <span>Console Under Construction</span>
        </div>

        <h2 className="mt-4 text-xl font-semibold text-slate-100">Bill of Materials Placeholder</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-slate-400">
          Multi-level component hierarchies, recipe formulas, and part explosion matrices
          have not been implemented in this version. Finished goods, component inventory,
          and purchasing orders can be reviewed across their respective modules.
        </p>

        <div className="mt-8 grid gap-4 text-left sm:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-5 transition hover:border-slate-700">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                <Package className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-slate-200">Product Catalog</h3>
                <p className="text-xs text-slate-500">Finished goods</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Explore finished goods, SKU codes, and manufactured products.
            </p>
            <Link
              href="/products"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-blue-400 transition hover:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              Go to Products <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-5 transition hover:border-slate-700">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                <Forklift className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-slate-200">Inventory Stock</h3>
                <p className="text-xs text-slate-500">Warehouse stock</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Monitor on-hand component stock levels and storage locations.
            </p>
            <Link
              href="/inventory/stock"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-blue-400 transition hover:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              Go to Stock <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-5 transition hover:border-slate-700">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                <ShoppingCart className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-slate-200">Purchase Orders</h3>
                <p className="text-xs text-slate-500">Procurement</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Track supplier purchase orders and raw material replenishments.
            </p>
            <Link
              href="/purchase/orders"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-blue-400 transition hover:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              Go to Purchase Orders <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
