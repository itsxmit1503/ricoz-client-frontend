"use client";

import {
  Activity,
  ArrowRight,
  Boxes,
  CheckCircle2,
  Clock,
  Cpu,
  FilePlus2,
  Gauge,
  Info,
  LogOut,
  Package,
  PackagePlus,
  ShieldAlert,
  ShieldCheck,
  Wrench,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import DashboardModuleGrid from "@/components/dashboard/DashboardModuleGrid";
import Spinner from "@/components/ui/Spinner";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const name = user ? user.username || user.email.split("@")[0] : "Operations Lead";

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logout();
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* 1. Command Header Bar */}
      <div className="rounded-xl border border-slate-800 bg-[#0c111e] p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-xs uppercase tracking-wider text-blue-400">
                Facility // Sector 01
              </span>
              <span className="text-slate-600">•</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Floor Telemetry Online
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Manufacturing Operations Control, {name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Synchronized production scheduling, line execution, equipment health, and quality assurance.
            </p>
          </div>

          {/* Direct Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/production/work-orders"
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <FilePlus2 className="h-3.5 w-3.5" />
              <span>New Work Order</span>
            </Link>

            <Link
              href="/products/add"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-[#141b2a] px-3.5 py-2 text-xs font-medium text-slate-200 transition hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              <PackagePlus className="h-3.5 w-3.5 text-blue-400" />
              <span>Catalog Part</span>
            </Link>

            <Link
              href="/info"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-[#0d1320] px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white"
              title="System Documentation"
            >
              <Info className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Info</span>
            </Link>

            {user && (
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                title="Sign out"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-[#0d1320] px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-rose-900 hover:bg-rose-950/40 hover:text-rose-400 focus-visible:outline-none disabled:opacity-50"
              >
                {loggingOut ? <Spinner className="h-3.5 w-3.5" /> : <LogOut className="h-3.5 w-3.5" />}
                <span className="hidden sm:inline">Sign out</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Live Operational KPI Deck (4 Metric Cards) */}
      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1 */}
        <div className="rounded-xl border border-slate-800 bg-[#0c111e] p-4 transition hover:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Active Orders
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Activity className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-white font-mono">18</span>
            <span className="text-xs font-medium text-emerald-400">94.2% on target</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            12 in active cycle, 6 staged for line release
          </p>
          <div className="mt-3 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full rounded-full bg-blue-500" style={{ width: "75%" }} />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="rounded-xl border border-slate-800 bg-[#0c111e] p-4 transition hover:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Fleet OEE / Availability
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Gauge className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-white font-mono">92.8%</span>
            <span className="text-xs font-medium text-emerald-400">+1.4% vs target</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            14 machines online, 1 scheduled maintenance
          </p>
          <div className="mt-3 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: "92.8%" }} />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="rounded-xl border border-slate-800 bg-[#0c111e] p-4 transition hover:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              First-Pass Yield (FPY)
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <ShieldCheck className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-white font-mono">99.1%</span>
            <span className="text-xs font-medium text-slate-300">Tolerance ±0.005mm</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            2 minor non-conformances logged today
          </p>
          <div className="mt-3 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full rounded-full bg-amber-500" style={{ width: "99.1%" }} />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="rounded-xl border border-slate-800 bg-[#0c111e] p-4 transition hover:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Inventory & Reorders
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Boxes className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-white font-mono">248</span>
            <span className="text-xs font-medium text-rose-300">3 SKUs low</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Safety stock buffers intact across active BOMs
          </p>
          <div className="mt-3 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full rounded-full bg-rose-500" style={{ width: "45%" }} />
          </div>
        </div>
      </div>

      {/* 3. Live Floor Work Order Queue & Machine Health Split */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column (7 cols): Priority Work Order Queue */}
        <div className="lg:col-span-7 rounded-xl border border-slate-800 bg-[#0c111e] p-4 sm:p-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-400" />
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200">
                Priority Production Queue
              </h3>
            </div>
            <Link
              href="/production/work-orders"
              className="text-xs font-medium text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
            >
              <span>All Orders</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <th className="py-2.5 pr-3">Batch Order</th>
                  <th className="py-2.5 px-3">Part Name</th>
                  <th className="py-2.5 px-3 text-right">Units</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 pl-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                <tr className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-2.5 pr-3 font-semibold text-slate-200">WO-8821</td>
                  <td className="py-2.5 px-3 font-sans text-slate-300">Turbine Impeller B7</td>
                  <td className="py-2.5 px-3 text-right text-slate-200">1,200</td>
                  <td className="py-2.5 px-3 font-sans">
                    <span className="inline-flex items-center gap-1 rounded bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-300 border border-blue-500/30">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                      In Cycle
                    </span>
                  </td>
                  <td className="py-2.5 pl-3 text-right font-sans">
                    <Link href="/production/work-orders" className="text-blue-400 hover:text-blue-300 font-medium">
                      Inspect
                    </Link>
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-2.5 pr-3 font-semibold text-slate-200">WO-8824</td>
                  <td className="py-2.5 px-3 font-sans text-slate-300">Hydraulic Manifold Block</td>
                  <td className="py-2.5 px-3 text-right text-slate-200">450</td>
                  <td className="py-2.5 px-3 font-sans">
                    <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 border border-emerald-500/30">
                      <CheckCircle2 className="h-3 w-3" />
                      Final Q/A
                    </span>
                  </td>
                  <td className="py-2.5 pl-3 text-right font-sans">
                    <Link href="/production/work-orders" className="text-blue-400 hover:text-blue-300 font-medium">
                      Inspect
                    </Link>
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-2.5 pr-3 font-semibold text-slate-200">WO-8829</td>
                  <td className="py-2.5 px-3 font-sans text-slate-300">Titanium Flange Housing</td>
                  <td className="py-2.5 px-3 text-right text-slate-200">800</td>
                  <td className="py-2.5 px-3 font-sans">
                    <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-300 border border-amber-500/30">
                      <Clock className="h-3 w-3" />
                      Scheduled
                    </span>
                  </td>
                  <td className="py-2.5 pl-3 text-right font-sans">
                    <Link href="/production/work-orders" className="text-blue-400 hover:text-blue-300 font-medium">
                      Inspect
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column (5 cols): Live Machine Floor Strip */}
        <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-[#0c111e] p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-emerald-400" />
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200">
                  Shop Floor Fleet State
                </h3>
              </div>
              <Link
                href="/machines"
                className="text-xs font-medium text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
              >
                <span>View All Fleet</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="mt-3 space-y-2.5">
              <div className="flex items-center justify-between rounded-lg border border-slate-800/80 bg-[#101625] px-3 py-2 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <div>
                    <p className="font-semibold text-slate-200">5-Axis CNC Mill #01</p>
                    <p className="font-mono text-[11px] text-slate-400">12,400 RPM • Load 84%</p>
                  </div>
                </div>
                <span className="font-mono text-xs font-semibold text-emerald-400">RUNNING</span>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-slate-800/80 bg-[#101625] px-3 py-2 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <div>
                    <p className="font-semibold text-slate-200">Robotic Welding Cell A</p>
                    <p className="font-mono text-[11px] text-slate-400">Cycle: 42s • Temp 68°C</p>
                  </div>
                </div>
                <span className="font-mono text-xs font-semibold text-emerald-400">RUNNING</span>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-slate-800/80 bg-[#101625] px-3 py-2 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  <div>
                    <p className="font-semibold text-slate-200">Automated CMM Scanner</p>
                    <p className="font-mono text-[11px] text-slate-400">Calibrating optics</p>
                  </div>
                </div>
                <span className="font-mono text-xs font-semibold text-amber-400">STANDBY</span>
              </div>
            </div>
          </div>

          <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Overall Telemetry Health: <strong className="text-slate-200 font-mono">Normal</strong></span>
            <Link href="/machines/details" className="text-blue-400 hover:text-blue-300 font-medium">
              Sensor Matrix →
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Categorized Industrial Module Grid */}
      <DashboardModuleGrid />
    </div>
  );
}
