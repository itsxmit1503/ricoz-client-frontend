"use client";

import {
  ArrowRight,
  ClipboardCheck,
  Clock,
  Cpu,
  FileText,
  Forklift,
  Handshake,
  Layers,
  Network,
  Package,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Wrench,
} from "lucide-react";
import Link from "next/link";

export default function DashboardModuleGrid() {
  return (
    <div className="space-y-8">
      {/* SECTION 1: Production */}
      <section className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-blue-400" />
            <h2 className="text-sm font-semibold text-slate-200">
              Production
            </h2>
          </div>
          <span className="text-xs text-slate-400">Plans, work orders, and shop-floor execution</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Work Orders */}
          <div className="ui-card-interactive group flex flex-col justify-between rounded-lg p-5">
            <div>
              <div className="flex items-start justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700/60 bg-slate-800/80 text-blue-400">
                  <FileText className="h-4 w-4" />
                </span>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-slate-100 group-hover:text-blue-300 transition-colors">
                Production Work Orders
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">
                Track job batches, monitor status progression, and record completed output and scrap counts.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80">
              <Link
                href="/production/work-orders"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                View work orders <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Production Plans */}
          <div className="ui-card-interactive group flex flex-col justify-between rounded-lg p-5">
            <div>
              <div className="flex items-start justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700/60 bg-slate-800/80 text-blue-400">
                  <ClipboardCheck className="h-4 w-4" />
                </span>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-slate-100 group-hover:text-blue-300 transition-colors">
                Production Plans
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">
                Establish high-level manufacturing schedules, set target dates, assign priorities, and generate orders.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80">
              <Link
                href="/production/plans"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                View production plans <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Operation Execution */}
          <div className="ui-card-interactive group flex flex-col justify-between rounded-lg p-5 border-dashed">
            <div>
              <div className="flex items-start justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700/60 bg-slate-800/80 text-amber-400">
                  <Layers className="h-4 w-4" />
                </span>
                <span className="inline-flex items-center gap-1 rounded border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-300">
                  <Clock className="h-3 w-3" /> Under Construction
                </span>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-slate-100">
                Operation Execution
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">
                Workstation routing and step-by-step operation execution console planned for future release.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80">
              <Link
                href="/production/operations"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400 hover:text-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                View status <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Equipment & Quality */}
      <section className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-blue-400" />
            <h2 className="text-sm font-semibold text-slate-200">
              Equipment & Quality
            </h2>
          </div>
          <span className="text-xs text-slate-400">Machines, inspections, and maintenance</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Machines */}
          <div className="ui-card-interactive group flex flex-col justify-between rounded-lg p-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-700/60 bg-slate-800/80 text-blue-400">
                  <Cpu className="h-4 w-4" />
                </span>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-slate-100 group-hover:text-blue-300 transition-colors">
                Machines
              </h3>
              <p className="mt-1 text-xs text-slate-400 leading-normal">
                Manage equipment directory, operational states, and shop floor locations.
              </p>
            </div>
            <Link
              href="/machines"
              className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-blue-400 hover:text-blue-300"
            >
              View machines <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Machine Details */}
          <div className="ui-card-interactive group flex flex-col justify-between rounded-lg p-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-700/60 bg-slate-800/80 text-blue-400">
                  <Wrench className="h-4 w-4" />
                </span>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-slate-100 group-hover:text-blue-300 transition-colors">
                Machine Details
              </h3>
              <p className="mt-1 text-xs text-slate-400 leading-normal">
                Inspect equipment profiles, update operating status, and manage configuration.
              </p>
            </div>
            <Link
              href="/machines/details"
              className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-blue-400 hover:text-blue-300"
            >
              View details <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Quality Issues */}
          <div className="ui-card-interactive group flex flex-col justify-between rounded-lg p-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-700/60 bg-slate-800/80 text-blue-400">
                  <ShieldCheck className="h-4 w-4" />
                </span>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-slate-100 group-hover:text-blue-300 transition-colors">
                Quality Issues
              </h3>
              <p className="mt-1 text-xs text-slate-400 leading-normal">
                Log inspections, track defect severity, and manage corrective resolution actions.
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <Link
                href="/quality/issues"
                className="inline-flex items-center gap-1 text-xs font-medium text-blue-400 hover:text-blue-300"
              >
                View issues <ArrowRight className="h-3 w-3" />
              </Link>
              <Link
                href="/quality/details"
                className="text-[11px] text-slate-400 hover:text-slate-300"
              >
                Details
              </Link>
            </div>
          </div>

          {/* Maintenance Work Orders */}
          <div className="ui-card-interactive group flex flex-col justify-between rounded-lg p-4 border-dashed">
            <div>
              <div className="flex items-center justify-between">
                <span className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-700/60 bg-slate-800/80 text-amber-400">
                  <Wrench className="h-4 w-4" />
                </span>
                <span className="rounded border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-300">
                  Planned
                </span>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-slate-100">
                Maintenance Orders
              </h3>
              <p className="mt-1 text-xs text-slate-400 leading-normal">
                Preventative maintenance routines and repair work order scheduling.
              </p>
            </div>
            <Link
              href="/maintenance/work-orders"
              className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-amber-400 hover:text-amber-300"
            >
              View status <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 3: Inventory & Purchasing */}
      <section className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <Forklift className="h-4 w-4 text-blue-400" />
            <h2 className="text-sm font-semibold text-slate-200">
              Inventory & Purchasing
            </h2>
          </div>
          <span className="text-xs text-slate-400">Products, stock, suppliers, and purchase orders</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {/* Inventory Stock */}
          <div className="ui-card-interactive group flex flex-col justify-between rounded-lg p-4">
            <div>
              <span className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-700/60 bg-slate-800/80 text-blue-400">
                <Forklift className="h-4 w-4" />
              </span>
              <h3 className="mt-3 text-sm font-semibold text-slate-100 group-hover:text-blue-300 transition-colors">
                Inventory Stock
              </h3>
              <p className="mt-1 text-xs text-slate-400 leading-normal">
                Monitor on-hand inventory quantities, reservations, and reorder levels.
              </p>
            </div>
            <Link
              href="/inventory/stock"
              className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-blue-400 hover:text-blue-300"
            >
              View stock <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Products */}
          <div className="ui-card-interactive group flex flex-col justify-between rounded-lg p-4">
            <div>
              <span className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-700/60 bg-slate-800/80 text-blue-400">
                <Package className="h-4 w-4" />
              </span>
              <h3 className="mt-3 text-sm font-semibold text-slate-100 group-hover:text-blue-300 transition-colors">
                Products
              </h3>
              <p className="mt-1 text-xs text-slate-400 leading-normal">
                Product definitions, classifications, SKUs, and default units of measure.
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <Link
                href="/products"
                className="inline-flex items-center gap-1 text-xs font-medium text-blue-400 hover:text-blue-300"
              >
                View catalog <ArrowRight className="h-3 w-3" />
              </Link>
              <Link href="/products/add" className="text-[11px] text-slate-400 hover:text-slate-300">
                + Add
              </Link>
            </div>
          </div>

          {/* Purchase Orders */}
          <div className="ui-card-interactive group flex flex-col justify-between rounded-lg p-4">
            <div>
              <span className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-700/60 bg-slate-800/80 text-blue-400">
                <ShoppingCart className="h-4 w-4" />
              </span>
              <h3 className="mt-3 text-sm font-semibold text-slate-100 group-hover:text-blue-300 transition-colors">
                Purchase Orders
              </h3>
              <p className="mt-1 text-xs text-slate-400 leading-normal">
                Create purchase orders, track vendor deliveries, and manage replenishment.
              </p>
            </div>
            <Link
              href="/purchase/orders"
              className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-blue-400 hover:text-blue-300"
            >
              View orders <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Suppliers */}
          <div className="ui-card-interactive group flex flex-col justify-between rounded-lg p-4">
            <div>
              <span className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-700/60 bg-slate-800/80 text-blue-400">
                <Handshake className="h-4 w-4" />
              </span>
              <h3 className="mt-3 text-sm font-semibold text-slate-100 group-hover:text-blue-300 transition-colors">
                Suppliers
              </h3>
              <p className="mt-1 text-xs text-slate-400 leading-normal">
                Supplier directory, vendor contacts, payment terms, and addresses.
              </p>
            </div>
            <Link
              href="/suppliers"
              className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-blue-400 hover:text-blue-300"
            >
              View suppliers <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Bill of Materials */}
          <div className="ui-card-interactive group flex flex-col justify-between rounded-lg p-4 border-dashed">
            <div>
              <div className="flex items-center justify-between">
                <span className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-700/60 bg-slate-800/80 text-amber-400">
                  <Network className="h-4 w-4" />
                </span>
                <span className="rounded border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-300">
                  Planned
                </span>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-slate-100">
                Bill of Materials
              </h3>
              <p className="mt-1 text-xs text-slate-400 leading-normal">
                Multi-level component hierarchies and product formulation structures.
              </p>
            </div>
            <Link
              href="/bom"
              className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-amber-400 hover:text-amber-300"
            >
              View status <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
