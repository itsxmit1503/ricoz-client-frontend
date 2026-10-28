import {
  ArrowRight,
  Boxes,
  Cpu,
  Layers,
  Network,
  ShieldCheck,
  Truck,
  Wrench,
} from "lucide-react";
import Link from "next/link";

export default function LandingModules() {
  return (
    <section id="modules" className="relative py-16 md:py-20 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-[#0d1320] px-3 py-1 text-xs font-mono text-blue-400">
              <span>DOMAIN ARCHITECTURE // 04 PILLARS</span>
            </div>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
              Engineered for the physical factory.
            </h2>
          </div>
          <p className="max-w-md text-sm text-slate-300 leading-relaxed">
            Every module is purpose-built around real shop-floor constraints: machine cycle times,
            scrap tracking, material lot traceability, and ISO-grade audit trails.
          </p>
        </div>

        {/* Asymmetric Bento Grid (8+4 on row 1, 4+8 on row 2) */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* -------------------------------------------------------------
              BENTO 01 (8 cols): Production & Shop-Floor Execution
             ------------------------------------------------------------- */}
          <div className="rounded-xl border border-slate-800 bg-[#0c111e] p-6 sm:p-7 lg:col-span-8 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Cpu className="h-5 w-5" />
                  </span>
                  <div>
                    <span className="font-mono text-xs uppercase tracking-wider text-blue-400 font-semibold">
                      DOMAIN 01 // PRODUCTION
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      Shop-Floor & Work Order Execution
                    </h3>
                  </div>
                </div>
                <span className="rounded border border-slate-700 bg-[#121826] px-2.5 py-1 font-mono text-xs text-slate-300">
                  3 Modules
                </span>
              </div>

              <p className="mt-3.5 text-sm leading-relaxed text-slate-300 max-w-2xl">
                Convert master manufacturing schedules into releaseable production batches.
                Track station-level operator jobs, live completed output, and scrap counts with zero delay.
              </p>

              {/* Interactive Module Micro-Preview */}
              <div className="mt-5 rounded-lg border border-slate-800 bg-[#080d17] p-3.5 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-300 border-b border-slate-800 pb-2">
                  <span>DISPATCH QUEUE // ACTIVE WORK ORDERS</span>
                  <span className="text-emerald-400 font-semibold">● 14 Lines Online</span>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between rounded-md bg-[#0f1524] p-2.5 border border-slate-800">
                    <div>
                      <span className="font-semibold text-white">WO-2026-084</span>
                      <span className="ml-2 text-[11px] text-slate-300">Housing Casting</span>
                    </div>
                    <span className="text-blue-300 font-semibold">Routing: Station 01 → QC</span>
                  </div>
                  <div className="flex items-center justify-between rounded-md bg-[#0f1524] p-2.5 border border-slate-800">
                    <div>
                      <span className="font-semibold text-white">WO-2026-085</span>
                      <span className="ml-2 text-[11px] text-slate-300">Flange Joint Batch</span>
                    </div>
                    <span className="text-slate-300">Scheduled: 18:00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Module Links */}
            <div className="mt-6 flex flex-wrap items-center gap-2.5 border-t border-slate-800 pt-4">
              <Link
                href="/production/work-orders"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-[#121826] px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-blue-500 hover:text-white transition"
              >
                <span>Work Orders</span>
                <ArrowRight className="h-3.5 w-3.5 text-blue-400" />
              </Link>
              <Link
                href="/production/plans"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-[#121826] px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-blue-500 hover:text-white transition"
              >
                <span>Production Plans</span>
                <ArrowRight className="h-3.5 w-3.5 text-blue-400" />
              </Link>
              <Link
                href="/production/operations"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-[#121826] px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-blue-500 hover:text-white transition"
              >
                <span>Operation Execution</span>
                <ArrowRight className="h-3.5 w-3.5 text-blue-400" />
              </Link>
            </div>
          </div>

          {/* -------------------------------------------------------------
              BENTO 02 (4 cols): Equipment & Maintenance
             ------------------------------------------------------------- */}
          <div className="rounded-xl border border-slate-800 bg-[#0c111e] p-6 sm:p-7 lg:col-span-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Wrench className="h-5 w-5" />
                </span>
                <div>
                  <span className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-semibold">
                    DOMAIN 02 // ASSETS
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    Equipment Fleet
                  </h3>
                </div>
              </div>

              <p className="mt-3.5 text-sm leading-relaxed text-slate-300">
                Centralized machinery fleet registry with runtime telemetry and automated preventative
                maintenance work orders.
              </p>

              {/* Machine Health Micro-Metrics */}
              <div className="mt-5 rounded-lg border border-slate-800 bg-[#080d17] p-3.5 font-mono text-xs space-y-2">
                <div className="flex justify-between items-center text-slate-200">
                  <span>Fleet Uptime OEE</span>
                  <span className="font-bold text-emerald-400">98.8%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "98.8%" }} />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                  <span>14 Units Logged</span>
                  <span>0 Emergency Stops</span>
                </div>
              </div>
            </div>

            {/* Direct Module Links */}
            <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-slate-800 pt-4">
              <Link
                href="/machines"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-[#121826] px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-emerald-500 hover:text-white transition"
              >
                <span>Machines Directory</span>
                <ArrowRight className="h-3.5 w-3.5 text-emerald-400" />
              </Link>
              <Link
                href="/maintenance/work-orders"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-[#121826] px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-emerald-500 hover:text-white transition"
              >
                <span>Maintenance Orders</span>
                <ArrowRight className="h-3.5 w-3.5 text-emerald-400" />
              </Link>
            </div>
          </div>

          {/* -------------------------------------------------------------
              BENTO 03 (4 cols): Quality Assurance & Compliance
             ------------------------------------------------------------- */}
          <div className="rounded-xl border border-slate-800 bg-[#0c111e] p-6 sm:p-7 lg:col-span-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <div>
                  <span className="font-mono text-xs uppercase tracking-wider text-blue-400 font-semibold">
                    DOMAIN 03 // QUALITY
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    Quality Compliance
                  </h3>
                </div>
              </div>

              <p className="mt-3.5 text-sm leading-relaxed text-slate-300">
                Log dimensional defects, track root-cause corrective actions, and quarantine
                non-compliant lots with audit-ready traceability.
              </p>

              {/* Quality Radar Micro-Metrics */}
              <div className="mt-5 rounded-lg border border-slate-800 bg-[#080d17] p-3.5 font-mono text-xs space-y-2">
                <div className="flex justify-between items-center text-slate-200">
                  <span>Batch Scrap Rate</span>
                  <span className="font-bold text-blue-400">0.04%</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-300 pt-1">
                  <span>Audit Pass Rate</span>
                  <span className="text-emerald-400 font-semibold">99.4% Verified</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-300">
                  <span>Critical Defect Tally</span>
                  <span className="text-white font-bold">0 Active</span>
                </div>
              </div>
            </div>

            {/* Direct Module Links */}
            <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-slate-800 pt-4">
              <Link
                href="/quality/issues"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-[#121826] px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-blue-500 hover:text-white transition"
              >
                <span>Quality Issues Log</span>
                <ArrowRight className="h-3.5 w-3.5 text-blue-400" />
              </Link>
              <Link
                href="/quality/details"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-[#121826] px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-blue-500 hover:text-white transition"
              >
                <span>Audit Details</span>
                <ArrowRight className="h-3.5 w-3.5 text-blue-400" />
              </Link>
            </div>
          </div>

          {/* -------------------------------------------------------------
              BENTO 04 (8 cols): Supply Chain & Multi-Level BOM
             ------------------------------------------------------------- */}
          <div className="rounded-xl border border-slate-800 bg-[#0c111e] p-6 sm:p-7 lg:col-span-8 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Layers className="h-5 w-5" />
                  </span>
                  <div>
                    <span className="font-mono text-xs uppercase tracking-wider text-amber-400 font-semibold">
                      DOMAIN 04 // SUPPLY CHAIN
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      BOM Hierarchy & Material Logistics
                    </h3>
                  </div>
                </div>
                <span className="rounded border border-slate-700 bg-[#121826] px-2.5 py-1 font-mono text-xs text-slate-300">
                  4 Modules
                </span>
              </div>

              <p className="mt-3.5 text-sm leading-relaxed text-slate-300 max-w-2xl">
                Define recursive multi-tier bills of materials with fractional consumption rates.
                Connect purchase orders directly with certified suppliers and automated inventory stock receipts.
              </p>

              {/* BOM Spec Micro-Preview */}
              <div className="mt-5 rounded-lg border border-slate-800 bg-[#080d17] p-3.5 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-300 border-b border-slate-800 pb-2">
                  <span>BILL OF MATERIALS SPEC // BOM-TURB-09</span>
                  <span className="text-emerald-400 font-semibold">Active Revision 2.4</span>
                </div>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="rounded-md bg-[#0f1524] p-2 border border-slate-800">
                    <span className="text-[10px] text-slate-400">Total Components</span>
                    <span className="block text-white font-bold">14 Child Items</span>
                  </div>
                  <div className="rounded-md bg-[#0f1524] p-2 border border-slate-800">
                    <span className="text-[10px] text-slate-400">Active Suppliers</span>
                    <span className="block text-white font-bold">3 Certified Vendors</span>
                  </div>
                  <div className="rounded-md bg-[#0f1524] p-2 border border-slate-800">
                    <span className="text-[10px] text-slate-400">Inventory Status</span>
                    <span className="block text-emerald-400 font-bold">All Stocked</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Module Links */}
            <div className="mt-6 flex flex-wrap items-center gap-2.5 border-t border-slate-800 pt-4">
              <Link
                href="/bom"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-[#121826] px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-amber-500 hover:text-white transition"
              >
                <span>BOM Recipes</span>
                <ArrowRight className="h-3.5 w-3.5 text-amber-400" />
              </Link>
              <Link
                href="/inventory/stock"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-[#121826] px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-amber-500 hover:text-white transition"
              >
                <span>Stock Inventory</span>
                <ArrowRight className="h-3.5 w-3.5 text-amber-400" />
              </Link>
              <Link
                href="/purchase/orders"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-[#121826] px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-amber-500 hover:text-white transition"
              >
                <span>Purchase Orders</span>
                <ArrowRight className="h-3.5 w-3.5 text-amber-400" />
              </Link>
              <Link
                href="/suppliers"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-[#121826] px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-amber-500 hover:text-white transition"
              >
                <span>Suppliers</span>
                <ArrowRight className="h-3.5 w-3.5 text-amber-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
