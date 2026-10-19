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
    <nav className="flex h-full w-72 flex-col border-r border-slate-800/90 bg-slate-900/98 shadow-xl shadow-black/10">
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-800/90 px-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600/90 shadow-lg shadow-blue-950/30">
          <Factory className="h-4 w-4 text-white" />
        </span>
        <div>
          <span className="block text-lg font-semibold tracking-tight text-slate-100">Ricoz</span>
          <span className="block text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">Operations</span>
        </div>
      </div>

      <div className="theme-scrollbar flex-1 space-y-2 overflow-y-auto px-2.5 pb-6 pt-3">
        {/* Dashboard row (highlighted, chevron collapses all sections) */}
        <div
          className={`flex items-center rounded-xl border transition-colors duration-200 motion-reduce:transition-none ${
            dashActive ? "border-blue-500/20 bg-blue-500/10 text-slate-100" : "border-transparent text-slate-300 hover:bg-slate-800/60"
          }`}
        >
          <Link
            href={dashboardItem.href}
            onClick={onNavigate}
            className="flex min-h-11 flex-1 items-center gap-3 rounded-xl px-3 py-2.5 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            <DashIcon className="h-5 w-5" />
            {dashboardItem.label}
          </Link>
          <button
            type="button"
            aria-label={hideAll ? "Expand sections" : "Collapse sections"}
            aria-expanded={!hideAll}
            onClick={() => setHideAll((v) => !v)}
            className="rounded-xl px-3 py-2.5 text-slate-400 transition-colors duration-150 hover:text-slate-200 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            <ChevronDown className={`h-4 w-4 transition-transform ${hideAll ? "-rotate-90" : ""}`} />
          </button>
        </div>

        {navGroups.map((group) => {
          const Icon = group.icon;
          const groupActive = group.children.some((child) => child.href === pathname);
          // sections start expanded, like the design
          const isOpen = !hideAll && (openGroups[group.label] ?? true);

          return (
            <div key={group.label} className="border-t border-slate-800/70 pt-2 first:border-t-0">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() =>
                  setOpenGroups((s) => ({ ...s, [group.label]: !(s[group.label] ?? true) }))
                }
                className={`flex min-h-10 w-full items-center gap-3 rounded-xl px-3 py-2 text-left font-medium transition-colors duration-200 hover:bg-slate-800/60 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${
                  groupActive ? "text-slate-100" : "text-slate-200"
                }`}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800/70">
                  <Icon className="h-4 w-4 text-slate-300" />
                </span>
                <span className="flex-1">{group.label}</span>
                <span className="text-[10px] font-medium text-slate-600">{String(group.children.length).padStart(2, "0")}</span>
                <ChevronDown
                  className={`h-4 w-4 text-slate-500 transition-transform ${isOpen ? "" : "-rotate-90"}`}
                />
              </button>

              {isOpen && (
                <ul className="ui-feedback-enter relative mt-1 space-y-1 border-l border-slate-800 pl-3 ml-3">
                  {group.children.map((child) => {
                    const ChildIcon = child.icon;
                    const active = pathname === child.href;
                    return (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          onClick={onNavigate}
                          className={`flex min-h-9 items-center gap-3 rounded-lg border border-transparent px-3 py-1.5 text-sm transition-colors duration-200 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${
                            active
                            ? "border-blue-500/20 bg-blue-500/10 text-blue-200"
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
