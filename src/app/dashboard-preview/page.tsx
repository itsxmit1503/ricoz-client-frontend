import { notFound } from "next/navigation";
import { FlaskConical, FilePlus2, PackagePlus, Info } from "lucide-react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import DashboardModuleGrid from "@/components/dashboard/DashboardModuleGrid";

const mockUser = {
  username: "Preview User",
  email: "preview@example.invalid",
};

export default function DashboardPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <AppShell>
      <div className="ui-page-enter mx-auto max-w-7xl space-y-6">
        <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3.5 text-amber-200">
          <FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
          <div>
            <p className="font-medium text-xs">Development Preview Sandbox</p>
            <p className="mt-0.5 text-xs text-amber-200/80 leading-relaxed">
              This sandbox preview allows reviewing layout and component compositions without active authentication.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Dashboard
              </h1>
              <p className="text-sm text-slate-400">
                Welcome back, {mockUser.username}. Overview of production plans, equipment, inventory, and quality assurance.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href="/production/work-orders"
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-blue-500"
              >
                <FilePlus2 className="h-3.5 w-3.5" />
                <span>Work Orders</span>
              </Link>
              <Link
                href="/products/add"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-medium text-slate-200 transition hover:bg-slate-700"
              >
                <PackagePlus className="h-3.5 w-3.5 text-blue-400" />
                <span>New Product</span>
              </Link>
              <Link
                href="/info"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
              >
                <Info className="h-3.5 w-3.5" />
                <span>Info</span>
              </Link>
            </div>
          </div>
        </div>

        <DashboardModuleGrid />
      </div>
    </AppShell>
  );
}
