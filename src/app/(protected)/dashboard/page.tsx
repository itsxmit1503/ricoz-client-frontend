"use client";

import {
  Boxes,
  Cpu,
  FilePlus2,
  FileText,
  LogOut,
  Package,
  PackagePlus,
  Plus,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import DashboardModuleGrid from "@/components/dashboard/DashboardModuleGrid";
import Badge from "@/components/ui/Badge";
import Spinner from "@/components/ui/Spinner";
import { useAuth } from "@/hooks/useAuth";
import { useList } from "@/hooks/useList";
import { inventoryService } from "@/services/inventory.service";
import { machineService } from "@/services/machine.service";
import { productService } from "@/services/product.service";
import { workOrderService } from "@/services/workOrder.service";
import { findMeta } from "@/types/common";
import { PRIORITIES, WORK_ORDER_STATUSES } from "@/types/production";
import { formatDate } from "@/utils/format";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const workOrders = useList(workOrderService.list, "Could not load work orders.");
  const machines = useList(machineService.list, "Could not load machines.");
  const stock = useList(inventoryService.list, "Could not load stock.");
  const products = useList(productService.list, "Could not load products.");

  const isRefreshing = workOrders.loading || machines.loading || stock.loading || products.loading;

  const name = user ? user.username || user.email.split("@")[0] : "Supervisor";

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logout();
    } finally {
      setLoggingOut(false);
    }
  }

  function handleRefresh() {
    workOrders.reload();
    machines.reload();
    stock.reload();
    products.reload();
  }

  const runningWorkOrders = workOrders.items.filter((o) => o.status === "IN_PROGRESS");
  const lowStockItems = stock.items.filter(
    (i) => i.quantity - i.reservedQuantity <= (i.reorderLevel || 0) && (i.reorderLevel || 0) > 0,
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950/60 border border-blue-800/50 px-2 py-0.5 rounded">
              OPERATIONS // COMMAND DECK
            </span>
            <span className="text-slate-600 font-mono">•</span>
            <span className="font-mono text-xs text-slate-400">
              User: <span className="text-slate-200 font-semibold">{name}</span>
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Operations Dashboard
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Real-time overview of manufacturing orders, machinery registry, warehouse stock, and catalog specifications.
          </p>
        </div>

        {/* Quick Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            title="Refresh dashboard data"
            className="ui-pressable inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-[#121826] px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 transition-transform duration-300 ${isRefreshing ? "animate-spin text-blue-400" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <Link
            href="/production/work-orders"
            className="ui-pressable inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-500 hover:shadow-md hover:shadow-blue-500/20 transition"
          >
            <FilePlus2 className="h-3.5 w-3.5" />
            <span>Dispatch Order</span>
          </Link>

          <Link
            href="/products/add"
            className="ui-pressable inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-[#141b2a] px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition"
          >
            <PackagePlus className="h-3.5 w-3.5 text-blue-400" />
            <span>Add Part</span>
          </Link>

          {user && (
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              title="Sign out"
              className="ui-pressable inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-[#0d1320] px-3 py-2 text-xs font-medium text-slate-300 hover:border-rose-900 hover:bg-rose-950/40 hover:text-rose-400 transition disabled:opacity-50"
            >
              {loggingOut ? <Spinner className="h-3.5 w-3.5" /> : <LogOut className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">Logout</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Four Genuine Operational Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Work Orders */}
        <Link
          href="/production/work-orders"
          className="ui-hover-card ui-pressable border border-slate-800/90 bg-[#0b101c] rounded-xl p-4 sm:p-5 space-y-2 block"
        >
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            <span className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-blue-400" />
              Work Orders
            </span>
            <span className="font-mono text-[11px] text-blue-400 font-semibold">Production</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-white tracking-tight">
              {workOrders.loading ? "..." : workOrders.items.length}
            </span>
            <span className="text-xs font-mono text-slate-400">orders logged</span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            {workOrders.loading
              ? "Checking orders..."
              : workOrders.items.length === 0
              ? "No active work orders"
              : `${runningWorkOrders.length} in progress on floor`}
          </p>
        </Link>

        {/* Card 2: Plant Machinery */}
        <Link
          href="/machines"
          className="ui-hover-card ui-pressable border border-slate-800/90 bg-[#0b101c] rounded-xl p-4 sm:p-5 space-y-2 block"
        >
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            <span className="flex items-center gap-1.5">
              <Cpu className="h-3.5 w-3.5 text-emerald-400" />
              Plant Machinery
            </span>
            <span className="font-mono text-[11px] text-emerald-400 font-semibold">Equipment</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-white tracking-tight">
              {machines.loading ? "..." : machines.items.length}
            </span>
            <span className="text-xs font-mono text-slate-400">units registered</span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            {machines.loading
              ? "Querying fleet..."
              : machines.items.length === 0
              ? "No machines registered"
              : `${machines.items.filter((m) => m.isActive).length} active in plant`}
          </p>
        </Link>

        {/* Card 3: Inventory Balances */}
        <Link
          href="/inventory/stock"
          className="ui-hover-card ui-pressable border border-slate-800/90 bg-[#0b101c] rounded-xl p-4 sm:p-5 space-y-2 block"
        >
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            <span className="flex items-center gap-1.5">
              <Boxes className="h-3.5 w-3.5 text-amber-400" />
              Stock Balances
            </span>
            <span className="font-mono text-[11px] text-amber-400 font-semibold">Warehouse</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-white tracking-tight">
              {stock.loading ? "..." : stock.items.length}
            </span>
            <span className="text-xs font-mono text-slate-400">material SKUs</span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            {stock.loading
              ? "Checking warehouse..."
              : stock.items.length === 0
              ? "Stock ledger empty"
              : lowStockItems.length > 0
              ? `${lowStockItems.length} low buffer items`
              : "Inventory levels optimal"}
          </p>
        </Link>

        {/* Card 4: Product Master Catalog */}
        <Link
          href="/products"
          className="ui-hover-card ui-pressable border border-slate-800/90 bg-[#0b101c] rounded-xl p-4 sm:p-5 space-y-2 block"
        >
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            <span className="flex items-center gap-1.5">
              <Package className="h-3.5 w-3.5 text-purple-400" />
              Product Catalog
            </span>
            <span className="font-mono text-[11px] text-purple-400 font-semibold">Master Data</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-white tracking-tight">
              {products.loading ? "..." : products.items.length}
            </span>
            <span className="text-xs font-mono text-slate-400">catalog items</span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            {products.loading
              ? "Loading catalog..."
              : products.items.length === 0
              ? "No catalog items"
              : "Active engineering specs"}
          </p>
        </Link>
      </div>

      {/* 3. Real Floor Work Orders Section (Truthful data & clean empty states) */}
      <div className="border border-slate-800/90 bg-[#0b101c] rounded-xl overflow-hidden shadow-lg">
        <div className="px-5 py-4 border-b border-slate-800/80 bg-[#080d17] flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Active Floor Work Orders
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Current production batch runs dispatched to plant workstations.
            </p>
          </div>
          <Link
            href="/production/work-orders"
            className="ui-pressable text-xs font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
          >
            <span>Manage All Orders</span>
          </Link>
        </div>

        {workOrders.loading ? (
          <div className="flex flex-col items-center justify-center p-14 text-slate-300">
            <Spinner className="h-7 w-7 text-blue-400" />
            <p className="mt-3 text-xs font-semibold">Querying production work orders…</p>
          </div>
        ) : workOrders.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-[#080d17] text-slate-400">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-sm font-bold text-white">No work orders dispatched yet</h3>
            <p className="mt-1 text-xs text-slate-400 max-w-sm">
              Work orders link products to production lines and track completed units and scrap rates.
            </p>
            <Link
              href="/production/work-orders"
              className="ui-pressable mt-4 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-500 transition"
            >
              <Plus className="h-3.5 w-3.5" /> Dispatch First Work Order
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800/80 bg-[#080d17] text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-5">Order #</th>
                  <th className="py-3 px-5">Target Product</th>
                  <th className="py-3 px-5 text-right">Planned Qty</th>
                  <th className="py-3 px-5">Priority</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {workOrders.items.slice(0, 5).map((o) => (
                  <tr key={o._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-5 font-bold text-white">
                      <Link href="/production/work-orders" className="hover:text-blue-400 transition">
                        {o.workOrderNumber}
                      </Link>
                    </td>
                    <td className="py-3.5 px-5 font-sans font-semibold text-slate-100">
                      {o.product ? o.product.name : <span className="text-slate-400">Unspecified</span>}
                    </td>
                    <td className="py-3.5 px-5 text-right font-bold text-white">
                      {o.plannedQuantity.toLocaleString()}{" "}
                      <span className="text-xs font-normal text-slate-300 font-sans">
                        {o.product?.unit ?? "units"}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 font-sans">
                      <Badge meta={findMeta(PRIORITIES, o.priority)} />
                    </td>
                    <td className="py-3.5 px-5 font-sans">
                      <Badge meta={findMeta(WORK_ORDER_STATUSES, o.status)} />
                    </td>
                    <td className="py-3.5 px-5 text-slate-300">
                      {formatDate(o.dueDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. Complete Operations Console Directory (12 Workspaces) */}
      <DashboardModuleGrid />
    </div>
  );
}
