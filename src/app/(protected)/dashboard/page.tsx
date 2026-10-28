"use client";

import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Boxes,
  CheckCircle2,
  ChevronRight,
  Clock,
  Cpu,
  Factory,
  FileCheck2,
  FilePlus2,
  Gauge,
  Layers,
  LogOut,
  PackagePlus,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Truck,
  Wrench,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import DashboardModuleGrid from "@/components/dashboard/DashboardModuleGrid";
import Spinner from "@/components/ui/Spinner";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedStage, setSelectedStage] = useState<number>(2);
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const name = user ? user.username || user.email.split("@")[0] : "Floor Supervisor";

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logout();
    } finally {
      setLoggingOut(false);
    }
  }

  function handleRefresh() {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  }

  function toggleAlertAck(id: string) {
    setAcknowledgedAlerts((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* 1. Integrated Plant Line Status Header */}
      <div className="ui-stagger-1 border border-slate-800/90 bg-[#0b101c] rounded-xl overflow-hidden shadow-lg transition-all duration-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between p-5 sm:p-6 border-b border-slate-800/70 gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950/60 border border-blue-800/50 px-2 py-0.5 rounded transition-colors">
                PLANT 01 // SECTOR A
              </span>
              <span className="text-slate-600 font-mono">•</span>
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold text-emerald-400 bg-emerald-950/50 border border-emerald-800/40 px-2.5 py-0.5 rounded-full">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                CONTINUOUS RUNNING • SHIFT 1
              </span>
              <span className="text-slate-600 font-mono hidden sm:inline">•</span>
              <span className="font-mono text-xs text-slate-400 hidden sm:inline">
                06:00 – 14:00 UTC
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Operations Command Cockpit
              </h1>
              <span className="text-xs font-mono text-slate-400 hidden md:inline">
                Operator: <span className="text-slate-200 font-semibold">{name}</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
              Live shop-floor dispatch, automated machine telemetry, quality gates, and inventory safety stock monitoring.
            </p>
          </div>

          {/* Quick Action Header Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Poll Sensor Network"
              className="ui-pressable inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-[#121826] px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 transition-transform duration-300 ${isRefreshing ? "animate-spin text-blue-400" : ""}`} />
              <span className="hidden sm:inline">Sync Floor</span>
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
              <span>Catalog Part</span>
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

        {/* Integrated Plant Telemetry Strip (4 Essential Operational Ratios) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-slate-800/80 bg-[#080d17]">
          {/* Gauge 1: Floor Throughput */}
          <div className="p-4 sm:p-5 space-y-1.5 hover:bg-[#0c1220]/60 transition-colors duration-150">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
              <span className="flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-blue-400" />
                Shift Throughput
              </span>
              <span className="font-mono text-emerald-400 font-semibold">+4.2% pace</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black font-mono text-white tracking-tight">1,840</span>
              <span className="text-xs font-mono text-slate-400">/ 2,000 units</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-700 ease-out"
                style={{ width: mounted ? "92%" : "0%" }}
              />
            </div>
            <p className="text-[11px] text-slate-400 font-mono">Cycle pace: 42s per part</p>
          </div>

          {/* Gauge 2: Equipment OEE */}
          <div className="p-4 sm:p-5 space-y-1.5 hover:bg-[#0c1220]/60 transition-colors duration-150">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
              <span className="flex items-center gap-1.5">
                <Gauge className="h-3.5 w-3.5 text-emerald-400" />
                Fleet OEE / Health
              </span>
              <span className="font-mono text-emerald-400 font-semibold">14/15 Live</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black font-mono text-white tracking-tight">92.8%</span>
              <span className="text-xs font-mono text-emerald-300">Optimal Range</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-700 ease-out"
                style={{ width: mounted ? "92.8%" : "0%" }}
              />
            </div>
            <p className="text-[11px] text-slate-400 font-mono">1 machine in planned calibration</p>
          </div>

          {/* Gauge 3: Quality Yield */}
          <div className="p-4 sm:p-5 space-y-1.5 hover:bg-[#0c1220]/60 transition-colors duration-150">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                First-Pass Yield
              </span>
              <span className="font-mono text-slate-300 font-semibold">±0.005mm</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black font-mono text-white tracking-tight">99.1%</span>
              <span className="text-xs font-mono text-slate-300">2 flagged</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-700 ease-out"
                style={{ width: mounted ? "99.1%" : "0%" }}
              />
            </div>
            <p className="text-[11px] text-slate-400 font-mono">High precision tolerance intact</p>
          </div>

          {/* Gauge 4: Inventory Safety Buffers */}
          <div className="p-4 sm:p-5 space-y-1.5 hover:bg-[#0c1220]/60 transition-colors duration-150">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
              <span className="flex items-center gap-1.5">
                <Boxes className="h-3.5 w-3.5 text-rose-400" />
                Material Stock
              </span>
              <span className="font-mono text-rose-300 font-semibold">3 Low Buffer</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black font-mono text-white tracking-tight">248</span>
              <span className="text-xs font-mono text-slate-400">SKUs Tracked</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-500 rounded-full transition-all duration-700 ease-out"
                style={{ width: mounted ? "35%" : "0%" }}
              />
            </div>
            <p className="text-[11px] text-slate-400 font-mono">PO-9042 submitted for reorder</p>
          </div>
        </div>
      </div>

      {/* 2. Asymmetric 2-Column Operational Cockpit Grid */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left Column (8 cols): Work Order Stage Dispatch & Fleet Telemetry */}
        <div className="lg:col-span-8 space-y-6">
          {/* Panel 1: Live Multi-Stage Work Order Pipeline */}
          <div className="ui-stagger-2 border border-slate-800/90 bg-[#0b101c] rounded-xl overflow-hidden shadow-md">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800/80 bg-[#080d17]">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-blue-400" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Active Work Order Pipeline & Stage Dispatch
                </h2>
              </div>
              <Link
                href="/production/work-orders"
                className="ui-pressable text-xs font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
              >
                <span>View All 18 Orders</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-800/60">
              {/* Order Item 1 - Interactive Stage Pipeline */}
              <div className="p-4 sm:p-5 hover:bg-slate-800/20 transition-colors duration-150 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
                        WO-8821
                      </span>
                      <h3 className="text-sm font-bold text-white">Turbine Impeller B7 (Inconel 718)</h3>
                    </div>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      Batch: 1,200 Units • Target Deadline: Today 17:00 • Assigned: 5-Axis Mill 01
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded border border-blue-500/40 bg-blue-500/10 px-2.5 py-1 text-xs font-bold text-blue-300 shadow-2xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                    STAGE {selectedStage}: {selectedStage === 1 ? "MATERIAL PREP" : selectedStage === 2 ? "CNC MILLING (78%)" : selectedStage === 3 ? "CMM SCAN QUEUE" : "FINAL PACK"}
                  </span>
                </div>

                {/* Visual Multi-Station Progress Pipeline (Interactive) */}
                <div className="grid grid-cols-4 gap-2 pt-1 text-[11px] font-mono select-none">
                  <button
                    type="button"
                    onClick={() => setSelectedStage(1)}
                    className={`ui-pressable rounded p-2 text-center transition-all duration-150 ${
                      selectedStage === 1
                        ? "bg-emerald-900/90 border border-emerald-400 text-white ring-2 ring-emerald-500/30"
                        : "bg-emerald-950/60 border border-emerald-800/50 text-emerald-300 hover:bg-emerald-900/40"
                    }`}
                  >
                    <span className="block font-bold">1. Material Staged</span>
                    <span className="text-[10px] text-emerald-400">PASSED 06:15</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedStage(2)}
                    className={`ui-pressable rounded p-2 text-center transition-all duration-150 ${
                      selectedStage === 2
                        ? "bg-blue-900/90 border border-blue-400 text-white ring-2 ring-blue-500/30"
                        : "bg-blue-950/80 border border-blue-500/60 text-blue-200 hover:bg-blue-900/40"
                    }`}
                  >
                    <span className="block font-bold">2. 5-Axis Milling</span>
                    <span className="text-[10px] text-blue-300 animate-pulse">CYCLE: 840/1200</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedStage(3)}
                    className={`ui-pressable rounded p-2 text-center transition-all duration-150 ${
                      selectedStage === 3
                        ? "bg-slate-800 border border-slate-600 text-white ring-2 ring-slate-500/30"
                        : "bg-[#0e1422] border border-slate-800 text-slate-400 hover:bg-slate-800/40"
                    }`}
                  >
                    <span className="block font-bold">3. CMM Scan</span>
                    <span className="text-[10px] text-slate-400">PENDING QUEUE</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedStage(4)}
                    className={`ui-pressable rounded p-2 text-center transition-all duration-150 ${
                      selectedStage === 4
                        ? "bg-slate-800 border border-slate-600 text-white ring-2 ring-slate-500/30"
                        : "bg-[#0e1422] border border-slate-800 text-slate-400 hover:bg-slate-800/40"
                    }`}
                  >
                    <span className="block font-bold">4. Final Pack</span>
                    <span className="text-[10px] text-slate-400">PENDING</span>
                  </button>
                </div>
              </div>

              {/* Order Item 2 */}
              <div className="p-4 sm:p-5 hover:bg-slate-800/20 transition-colors duration-150 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
                        WO-8824
                      </span>
                      <h3 className="text-sm font-bold text-white">Hydraulic Manifold Block (Alloy 6061)</h3>
                    </div>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      Batch: 450 Units • Target Deadline: Today 19:30 • Assigned: Robotic Cell A
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-300">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    STAGE 3: CMM INSPECT (95%)
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 pt-1 text-[11px] font-mono">
                  <div className="rounded bg-emerald-950/60 border border-emerald-800/50 p-2 text-center text-emerald-300">
                    <span className="block font-bold">1. Material Staged</span>
                    <span className="text-[10px] text-emerald-400">PASSED</span>
                  </div>
                  <div className="rounded bg-emerald-950/60 border border-emerald-800/50 p-2 text-center text-emerald-300">
                    <span className="block font-bold">2. CNC & Welding</span>
                    <span className="text-[10px] text-emerald-400">PASSED</span>
                  </div>
                  <div className="rounded bg-emerald-950/80 border border-emerald-500/60 p-2 text-center text-emerald-200 ring-1 ring-emerald-500/30">
                    <span className="block font-bold">3. CMM Scan</span>
                    <span className="text-[10px] text-emerald-300">428/450 VERIFIED</span>
                  </div>
                  <div className="rounded bg-[#0e1422] border border-slate-800 p-2 text-center text-slate-400">
                    <span className="block font-bold">4. Final Pack</span>
                    <span className="text-[10px] text-slate-400">STAGED</span>
                  </div>
                </div>
              </div>

              {/* Order Item 3 */}
              <div className="p-4 sm:p-5 hover:bg-slate-800/20 transition-colors duration-150 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
                        WO-8829
                      </span>
                      <h3 className="text-sm font-bold text-white">Titanium Flange Housing (Grade 5)</h3>
                    </div>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      Batch: 800 Units • Target Deadline: Tomorrow 08:00 • Assigned: Stamping Press 04
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-300">
                    <Clock className="h-3.5 w-3.5 text-amber-400" />
                    STAGE 1: MATERIAL STAGED
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 pt-1 text-[11px] font-mono">
                  <div className="rounded bg-amber-950/80 border border-amber-500/60 p-2 text-center text-amber-200 ring-1 ring-amber-500/30">
                    <span className="block font-bold">1. Material Staged</span>
                    <span className="text-[10px] text-amber-300">LOAD CONFIRMED</span>
                  </div>
                  <div className="rounded bg-[#0e1422] border border-slate-800 p-2 text-center text-slate-400">
                    <span className="block font-bold">2. Stamping</span>
                    <span className="text-[10px] text-slate-400">QUEUED 14:15</span>
                  </div>
                  <div className="rounded bg-[#0e1422] border border-slate-800 p-2 text-center text-slate-400">
                    <span className="block font-bold">3. QA Inspect</span>
                    <span className="text-[10px] text-slate-400">PENDING</span>
                  </div>
                  <div className="rounded bg-[#0e1422] border border-slate-800 p-2 text-center text-slate-400">
                    <span className="block font-bold">4. Final Pack</span>
                    <span className="text-[10px] text-slate-400">PENDING</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Panel 2: Shop Floor Equipment Telemetry Matrix */}
          <div className="ui-stagger-3 border border-slate-800/90 bg-[#0b101c] rounded-xl overflow-hidden shadow-md">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800/80 bg-[#080d17]">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-emerald-400" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Shop Floor Machine Telemetry & Real-Time Sensors
                </h2>
              </div>
              <Link
                href="/machines"
                className="ui-pressable text-xs font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
              >
                <span>View Complete Fleet (15)</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="p-4 sm:p-5 space-y-3">
              {/* Machine Row 1 */}
              <div className="ui-hover-card flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-lg border border-slate-800 bg-[#080d17] gap-3">
                <div className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white">CNC-MILL-01</span>
                      <span className="text-xs font-bold text-slate-200">5-Axis Vertical Milling Center</span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-400">Workstation: Sector A • Part: WO-8821</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="text-right">
                    <span className="text-slate-400 text-[10px] block">SPINDLE LOAD</span>
                    <span className="text-emerald-400 font-bold">12,400 RPM (84%)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 text-[10px] block">TEMP</span>
                    <span className="text-slate-200 font-bold">48.2°C</span>
                  </div>
                  <span className="rounded bg-emerald-950/60 border border-emerald-800/50 px-2 py-1 text-[10px] font-bold text-emerald-300">
                    OPTIMAL
                  </span>
                </div>
              </div>

              {/* Machine Row 2 */}
              <div className="ui-hover-card flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-lg border border-slate-800 bg-[#080d17] gap-3">
                <div className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white">ROBOT-CELL-A</span>
                      <span className="text-xs font-bold text-slate-200">6-Axis Robotic TIG Welding Cell</span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-400">Workstation: Sector B • Part: WO-8824</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="text-right">
                    <span className="text-slate-400 text-[10px] block">ARC TIME</span>
                    <span className="text-emerald-400 font-bold">184h (Feed 12m/m)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 text-[10px] block">TEMP</span>
                    <span className="text-slate-200 font-bold">68.5°C</span>
                  </div>
                  <span className="rounded bg-emerald-950/60 border border-emerald-800/50 px-2 py-1 text-[10px] font-bold text-emerald-300">
                    OPTIMAL
                  </span>
                </div>
              </div>

              {/* Machine Row 3 */}
              <div className="ui-hover-card flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-lg border border-slate-800 bg-[#080d17] gap-3">
                <div className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400 shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white">SCAN-CMM-01</span>
                      <span className="text-xs font-bold text-slate-200">Automated Coordinate Optical Scanner</span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-400">Workstation: QA Lab • Calibrating Optics</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="text-right">
                    <span className="text-slate-400 text-[10px] block">PROBE DEV</span>
                    <span className="text-amber-300 font-bold">±0.0008mm</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 text-[10px] block">LASER</span>
                    <span className="text-slate-200 font-bold">READY</span>
                  </div>
                  <span className="rounded bg-amber-950/60 border border-amber-800/50 px-2 py-1 text-[10px] font-bold text-amber-300">
                    CALIBRATING
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Floor Triage & Quick Routing Matrix */}
        <div className="lg:col-span-4 space-y-6">
          {/* Panel 3: Floor Exceptions & Action Triage */}
          <div className="ui-stagger-3 border border-slate-800/90 bg-[#0b101c] rounded-xl overflow-hidden shadow-md">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800/80 bg-[#080d17]">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-rose-400" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Floor Action Triage (3 Alerts)
                </h2>
              </div>
            </div>

            <div className="p-4 space-y-3">
              {/* Alert 1 */}
              <div className={`ui-hover-card rounded-lg border p-3.5 space-y-1.5 transition-all duration-200 ${
                acknowledgedAlerts["alert-1"]
                  ? "border-slate-800 bg-[#090d16] opacity-60"
                  : "border-rose-900/60 bg-rose-950/20"
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-rose-900/60 text-rose-200 border border-rose-700/50">
                    LOW BUFFER • REORDER
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleAlertAck("alert-1")}
                    className="ui-pressable text-[10px] font-mono text-slate-400 hover:text-white"
                  >
                    {acknowledgedAlerts["alert-1"] ? "Acknowledged ✓" : "Mark read"}
                  </button>
                </div>
                <p className="text-xs font-bold text-slate-100">
                  Titanium Alloy Rods (10mm) at 12 PCS
                </p>
                <p className="text-[11px] text-slate-300">
                  Reorder trigger is 25 PCS. 3 scheduled work orders require this material by end of week.
                </p>
                <Link
                  href="/purchase/orders"
                  className="ui-pressable inline-flex items-center gap-1 text-xs font-semibold text-rose-300 hover:text-white pt-1"
                >
                  <span>Review Purchase Orders</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              {/* Alert 2 */}
              <div className={`ui-hover-card rounded-lg border p-3.5 space-y-1.5 transition-all duration-200 ${
                acknowledgedAlerts["alert-2"]
                  ? "border-slate-800 bg-[#090d16] opacity-60"
                  : "border-amber-900/60 bg-amber-950/20"
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-900/60 text-amber-200 border border-amber-700/50">
                    QA DEVIATION • REVIEW
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleAlertAck("alert-2")}
                    className="ui-pressable text-[10px] font-mono text-slate-400 hover:text-white"
                  >
                    {acknowledgedAlerts["alert-2"] ? "Acknowledged ✓" : "Mark read"}
                  </button>
                </div>
                <p className="text-xs font-bold text-slate-100">
                  Inspection Non-Conformance QI-0038
                </p>
                <p className="text-[11px] text-slate-300">
                  Flange bore dimension measured +0.008mm above specification on initial sample pass.
                </p>
                <Link
                  href="/quality/issues"
                  className="ui-pressable inline-flex items-center gap-1 text-xs font-semibold text-amber-300 hover:text-white pt-1"
                >
                  <span>Open Quality Incident</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              {/* Alert 3 */}
              <div className={`ui-hover-card rounded-lg border p-3.5 space-y-1.5 transition-all duration-200 ${
                acknowledgedAlerts["alert-3"]
                  ? "border-slate-800 bg-[#090d16] opacity-60"
                  : "border-blue-900/60 bg-blue-950/20"
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-200 border border-blue-700/50">
                    PLANNED PM DUE • 48H
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleAlertAck("alert-3")}
                    className="ui-pressable text-[10px] font-mono text-slate-400 hover:text-white"
                  >
                    {acknowledgedAlerts["alert-3"] ? "Acknowledged ✓" : "Mark read"}
                  </button>
                </div>
                <p className="text-xs font-bold text-slate-100">
                  Hydraulic Fluid & Filter Flush on Press 04
                </p>
                <p className="text-[11px] text-slate-300">
                  Standard 250-hour operational service window reached. Parts in stock.
                </p>
                <Link
                  href="/maintenance/work-orders"
                  className="ui-pressable inline-flex items-center gap-1 text-xs font-semibold text-blue-300 hover:text-white pt-1"
                >
                  <span>Dispatch Maintenance WO</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Panel 4: Active Crew & Shift Handover */}
          <div className="ui-stagger-4 border border-slate-800/90 bg-[#0b101c] rounded-xl overflow-hidden shadow-md p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Shift 1 Handover Log
              </span>
              <span className="font-mono text-[11px] text-emerald-400">ACTIVE</span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400">Supervisor:</span>
                <span className="text-white font-semibold">J. Smith (Machining)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400">Active Operators:</span>
                <span className="text-white font-semibold">18 on floor</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400">Target Shift Output:</span>
                <span className="text-emerald-400 font-semibold">2,000 units</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Next Shift Briefing:</span>
                <span className="text-slate-200">13:45 UTC</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. High-Density Operations Console Directory */}
      <DashboardModuleGrid />
    </div>
  );
}
