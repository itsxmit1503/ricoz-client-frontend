import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { navGroups } from "@/components/layout/nav-config";

export default function DashboardModuleGrid() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
      {navGroups.map((group) => {
        const Icon = group.icon;

        return (
          <section
            key={group.label}
            className="group flex min-h-48 flex-col rounded-xl border border-slate-800/80 bg-slate-900/70 p-4 transition duration-200 hover:border-slate-700 hover:bg-slate-900/90 focus-within:border-slate-700 focus-within:ring-1 focus-within:ring-slate-700 sm:p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h2 className="truncate font-semibold text-slate-200">{group.label}</h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {group.children.length} {group.children.length === 1 ? "area" : "areas"}
                  </p>
                </div>
              </div>
              <span className="shrink-0 rounded-full bg-slate-800/70 px-2.5 py-1 text-xs font-medium text-slate-400">
                {String(group.children.length).padStart(2, "0")}
              </span>
            </div>

            <ul className="mt-4 space-y-1 border-t border-slate-800/80 pt-3 sm:mt-5">
              {group.children.map((child) => (
                <li key={child.href}>
                  <Link
                    href={child.href}
                    className="flex min-h-9 items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-sm text-slate-400 transition-colors hover:bg-slate-800/70 hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                  >
                    <span className="truncate">{child.label}</span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-slate-600 transition-colors group-hover:text-slate-400" />
                  </Link>
                </li>
              ))}
            </ul>

          </section>
        );
      })}
    </div>
  );
}
