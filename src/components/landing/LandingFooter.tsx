import {
  ArrowRight,
  CheckCircle2,
  Factory,
} from "lucide-react";
import Link from "next/link";

export default function LandingFooter() {
  return (
    <>
      {/* -------------------------------------------------------------
          PRE-FOOTER COMMAND PORTAL CTA
         ------------------------------------------------------------- */}
      <section className="relative border-t border-slate-800 bg-[#090d16] py-16 sm:py-20 overflow-hidden">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-800 bg-[#0c111e] p-8 sm:p-12 shadow-xl text-center relative overflow-hidden">
            {/* Top Operational Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-[#121826] px-3.5 py-1 text-xs font-mono text-blue-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse motion-reduce:animate-none" />
              <span>SYSTEM READY // ENTERPRISE DEPLOYMENT</span>
            </div>

            {/* Headline */}
            <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
              Take command of your shop floor today.
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-300">
              Step into an industrial manufacturing ERP engineered for cycle speed, material
              traceability, and seamless workstation coordination.
            </p>

            {/* Action Buttons */}
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/sign-up"
                className="group inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-xs transition duration-150 hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                <span>Launch Ricoz Platform</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-[#121826] px-5 py-3 text-sm font-semibold text-slate-200 transition duration-150 hover:border-slate-600 hover:bg-[#182033] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                <span>Access Existing Account</span>
              </Link>
            </div>

            {/* Enterprise Confidence Indicators */}
            <div className="mt-9 flex flex-wrap items-center justify-center gap-6 border-t border-slate-800 pt-5 font-mono text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Zero Hardcoded Secrets</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>ISO-9001 Data Schemas</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>23 Verified Routes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          HIGH-DENSITY INDUSTRIAL FOOTER
         ------------------------------------------------------------- */}
      <footer className="border-t border-slate-800 bg-[#080c14] py-12 text-slate-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {/* Col 1: Brand & Operational Identity */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-3">
                <span className="flex h-8.5 w-8.5 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
                  <Factory className="h-4 w-4" />
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-white tracking-tight">Ricoz</span>
                  <span className="rounded border border-slate-700 bg-slate-800/90 px-1.5 py-0.2 font-mono text-[9px] font-semibold text-slate-200">
                    ERP
                  </span>
                </div>
              </Link>

              <p className="mt-3 text-xs leading-relaxed text-slate-400 max-w-sm">
                Industrial operations platform unifying production plans, work
                orders, machinery health, and bills of materials into a unified shop-floor cockpit.
              </p>

              <div className="mt-4 flex items-center gap-2 font-mono text-[11px] text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>SYSTEM STATUS: OPERATIONAL</span>
              </div>
            </div>

            {/* Col 2: Production & Shop Floor */}
            <div>
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                Production
              </h4>
              <ul className="mt-3 space-y-2 text-xs">
                <li>
                  <Link href="/production/work-orders" className="hover:text-white transition">
                    Work Orders
                  </Link>
                </li>
                <li>
                  <Link href="/production/plans" className="hover:text-white transition">
                    Production Plans
                  </Link>
                </li>
                <li>
                  <Link href="/production/operations" className="hover:text-white transition">
                    Operation Execution
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-white transition">
                    Command Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Assets & Quality */}
            <div>
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                Equipment & QA
              </h4>
              <ul className="mt-3 space-y-2 text-xs">
                <li>
                  <Link href="/machines" className="hover:text-white transition">
                    Machines Registry
                  </Link>
                </li>
                <li>
                  <Link href="/maintenance/work-orders" className="hover:text-white transition">
                    Maintenance Queue
                  </Link>
                </li>
                <li>
                  <Link href="/quality/issues" className="hover:text-white transition">
                    Quality Defect Log
                  </Link>
                </li>
                <li>
                  <Link href="/quality/details" className="hover:text-white transition">
                    Audit Inspection
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Supply Chain & System */}
            <div>
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                Supply Chain & Specs
              </h4>
              <ul className="mt-3 space-y-2 text-xs">
                <li>
                  <Link href="/bom" className="hover:text-white transition">
                    Bills of Materials
                  </Link>
                </li>
                <li>
                  <Link href="/inventory/stock" className="hover:text-white transition">
                    Inventory Stock
                  </Link>
                </li>
                <li>
                  <Link href="/purchase/orders" className="hover:text-white transition">
                    Purchase Orders
                  </Link>
                </li>
                <li>
                  <Link href="/info" className="hover:text-white transition">
                    System Architecture
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Legal Statement */}
          <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-slate-800 pt-6 text-[11px] font-mono text-slate-400">
            <div>
              © {new Date().getFullYear()} Ricoz Technologies. Industrial ERP Systems. All rights reserved.
            </div>

            <div className="rounded border border-slate-800 bg-[#0f1524] px-3 py-1 text-slate-400">
              Platform preview displays simulated schema telemetry for demonstration purposes.
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
