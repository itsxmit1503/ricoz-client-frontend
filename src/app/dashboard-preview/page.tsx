import { notFound } from "next/navigation";
import { BadgeCheck, FlaskConical } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import DashboardModuleGrid from "@/components/dashboard/DashboardModuleGrid";

const mockUser = {
  username: "Development Preview User",
  email: "preview@example.invalid",
};

export default function DashboardPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-200">
          <FlaskConical className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-semibold">Development Preview - Mock Data</p>
            <p className="mt-1 text-sm text-amber-200/80">
              This isolated preview does not authenticate, create a session, or call protected APIs.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
            Operations workspace
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
              Welcome, {mockUser.username} <span aria-hidden="true">👋</span>
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-300">
              <BadgeCheck className="h-3.5 w-3.5" /> Preview user
            </span>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Explore the Ricoz workspace layout and module entry points.
          </p>
          <p className="mt-3 text-sm text-slate-500">
            {mockUser.email}
          </p>
        </div>

        <div className="mb-4 mt-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Workspace modules
            </p>
            <h2 className="mt-1 text-lg font-semibold text-slate-100">Choose an area to explore</h2>
          </div>
          <p className="hidden text-sm text-slate-500 sm:block">Preview navigation</p>
        </div>

        <DashboardModuleGrid />
      </div>
    </AppShell>
  );
}
