import { ArrowRight, Clock, FileText, Wrench } from "lucide-react";
import Link from "next/link";

export default function MaintenanceWorkOrdersPage() {
  return (
    <div className="ui-page-enter mx-auto max-w-4xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-blue-300/80">Asset Maintenance & Reliability</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-100">Maintenance Work Orders</h1>
          <p className="mt-1 text-sm text-slate-400">Preventative and corrective equipment maintenance scheduling console</p>
        </div>
      </div>

      <div className="ui-section-enter mt-6 rounded-2xl border border-slate-800/90 bg-slate-900/80 p-8 text-center shadow-xl shadow-black/20 sm:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-500/30 bg-blue-500/10 text-blue-400 shadow-lg shadow-blue-950/20">
          <Wrench className="h-7 w-7" />
        </div>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-medium text-amber-300">
          <Clock className="h-3.5 w-3.5" />
          <span>Console Under Construction</span>
        </div>

        <h2 className="mt-4 text-xl font-semibold text-slate-100">Maintenance Work Orders Placeholder</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-slate-400">
          Scheduled preventative maintenance routines, technician work order dispatch, and equipment downtime logs
          have not been implemented in this version. Equipment records, operating statuses, and floor locations
          can be reviewed directly in the Machines module.
        </p>

        <div className="mt-8 grid gap-4 text-left sm:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-5 transition hover:border-slate-700">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                <Wrench className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-slate-200">Machine Directory</h3>
                <p className="text-xs text-slate-500">View equipment records and status</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Review operational statuses (Running, Idle, Maintenance) and location.
            </p>
            <Link
              href="/machines"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-blue-400 transition hover:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              Go to Machines <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-5 transition hover:border-slate-700">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                <FileText className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-slate-200">Machine Details</h3>
                <p className="text-xs text-slate-500">Inspect equipment profile</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Inspect individual equipment profiles and update operational status.
            </p>
            <Link
              href="/machines/details"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-blue-400 transition hover:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              Go to Machine Details <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-5 transition hover:border-slate-700">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                <FileText className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-slate-200">Work Orders</h3>
                <p className="text-xs text-slate-500">Shop-floor production</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Monitor active shop-floor production orders that utilize equipment.
            </p>
            <Link
              href="/production/work-orders"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-blue-400 transition hover:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              Go to Work Orders <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
