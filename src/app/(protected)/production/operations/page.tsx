import { ArrowRight, Clock, FileText, Layers, Settings } from "lucide-react";
import Link from "next/link";

export default function OperationExecutionPage() {
  return (
    <div className="ui-page-enter mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-700/60 bg-slate-800 text-blue-400">
              <Layers className="h-4 w-4" />
            </span>
            <p className="text-xs font-medium text-blue-400">
              Production
            </p>
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Operation Execution
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Workstation routing, operation stepping, and live task execution tracking
          </p>
        </div>
      </div>

      <div className="ui-section-enter rounded-xl border border-slate-800 bg-slate-900/95 p-8 text-center sm:p-12">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg border border-slate-700/60 bg-slate-800 text-blue-400">
          <Layers className="h-6 w-6" />
        </div>

        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300">
          <Clock className="h-3.5 w-3.5" />
          <span>Under Construction</span>
        </div>

        <h2 className="mt-4 text-lg font-semibold text-slate-100">
          Workstation Execution Console
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm leading-relaxed text-slate-400">
          Workstation-level routing, operation stepping, and live machine execution tracking have not been implemented in this version. Production activity is coordinated via Production Plans and Work Orders.
        </p>

        <div className="mt-8 grid gap-4 text-left sm:grid-cols-2">
          <div className="ui-card-interactive group rounded-xl p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10 text-blue-400">
                <FileText className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-slate-200 group-hover:text-blue-300 transition-colors">
                  Production Work Orders
                </h3>
                <p className="text-[11px] text-slate-400">Track batch quantities, release stages, and scrap</p>
              </div>
            </div>
            <Link
              href="/production/work-orders"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 transition hover:text-blue-300"
            >
              Open Work Orders Console <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="ui-card-interactive group rounded-xl p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10 text-blue-400">
                <Settings className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-slate-200 group-hover:text-blue-300 transition-colors">
                  Production Plans
                </h3>
                <p className="text-[11px] text-slate-400">Schedule manufacturing runs and target dates</p>
              </div>
            </div>
            <Link
              href="/production/plans"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 transition hover:text-blue-300"
            >
              Open Plans Console <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
