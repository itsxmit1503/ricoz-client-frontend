"use client";

import { ChevronDown, Factory } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { dashboardItem, navGroups } from "./nav-config";

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [hideAll, setHideAll] = useState(false);

  const DashIcon = dashboardItem.icon;
  const dashActive = pathname === dashboardItem.href;

  return (
    <nav className="flex h-full w-72 flex-col border-r border-slate-800 bg-slate-900/95">
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-800/80 px-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600/80">
          <Factory className="h-4 w-4 text-white" />
        </span>
        <span className="text-lg font-semibold tracking-tight">Ricoz</span>
      </div>

      <div className="theme-scrollbar flex-1 space-y-1 overflow-y-auto px-3 pb-6">
        {/* Dashboard row (highlighted, chevron collapses all sections) */}
        <div
          className={`flex items-center rounded-lg transition-colors ${
            dashActive ? "bg-slate-800/80 text-slate-100" : "text-slate-300 hover:bg-slate-800/60"
          }`}
        >
          <Link
            href={dashboardItem.href}
            onClick={onNavigate}
            className="flex min-h-11 flex-1 items-center gap-3 rounded-lg px-3 py-2.5 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            <DashIcon className="h-5 w-5" />
            {dashboardItem.label}
          </Link>
          <button
            type="button"
            aria-label={hideAll ? "Expand sections" : "Collapse sections"}
            aria-expanded={!hideAll}
            onClick={() => setHideAll((v) => !v)}
            className="rounded-lg px-3 py-2.5 text-slate-400 transition hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            <ChevronDown className={`h-4 w-4 transition-transform ${hideAll ? "-rotate-90" : ""}`} />
          </button>
        </div>

        {navGroups.map((group) => {
          const Icon = group.icon;
          // sections start expanded, like the design
          const isOpen = !hideAll && (openGroups[group.label] ?? true);

          return (
            <div key={group.label} className="border-t border-slate-800/60 pt-2 first:border-t-0">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() =>
                  setOpenGroups((s) => ({ ...s, [group.label]: !(s[group.label] ?? true) }))
                }
                className="flex min-h-10 w-full items-center gap-3 rounded-lg px-3 py-2 text-left font-medium text-slate-200 transition hover:bg-slate-800/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              >
                <Icon className="h-5 w-5 text-slate-300" />
                <span className="flex-1">{group.label}</span>
                <ChevronDown
                  className={`h-4 w-4 text-slate-500 transition-transform ${isOpen ? "" : "-rotate-90"}`}
                />
              </button>

              {isOpen && (
                <ul className="mt-0.5 space-y-0.5 pl-4">
                  {group.children.map((child) => {
                    const ChildIcon = child.icon;
                    const active = pathname === child.href;
                    return (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          onClick={onNavigate}
                          className={`flex min-h-9 items-center gap-3 rounded-lg px-3 py-1.5 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${
                            active
                              ? "bg-blue-500/10 text-blue-200"
                              : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                          }`}
                        >
                          {ChildIcon ? (
                            <ChildIcon className="h-4 w-4 shrink-0" />
                          ) : (
                            <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                              <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                            </span>
                          )}
                          {child.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
