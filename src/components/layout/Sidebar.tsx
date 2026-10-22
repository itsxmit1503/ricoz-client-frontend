"use client";

import {
  ChevronDown,
  Factory,
  Info,
} from "lucide-react";
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
    <nav className="flex h-full w-72 flex-col border-r border-slate-800/80 bg-slate-950 shadow-2xl shadow-black/40">
      {/* Brand Header */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800/80 px-4">
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className="group flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-1"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm transition group-hover:bg-blue-500">
            <Factory className="h-4 w-4" />
          </span>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-semibold tracking-tight text-slate-100">Ricoz</span>
              <span className="rounded border border-slate-700 bg-slate-800 px-1.5 py-0.2 text-[9px] font-medium text-slate-300">
                ERP
              </span>
            </div>
            <span className="block text-[11px] font-normal text-slate-400">
              Manufacturing
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Scrollable Body */}
      <div className="theme-scrollbar flex-1 space-y-1.5 overflow-y-auto px-3 py-3">
        {/* Dashboard Command Link */}
        <div
          className={`flex items-center rounded-xl border transition-colors duration-150 motion-reduce:transition-none ${
            dashActive
              ? "border-blue-500/40 bg-blue-600/15 text-blue-200 shadow-xs"
              : "border-transparent text-slate-300 hover:border-slate-800 hover:bg-slate-900/60"
          }`}
        >
          <Link
            href={dashboardItem.href}
            onClick={onNavigate}
            className="flex min-h-10 flex-1 items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <DashIcon className={`h-4 w-4 ${dashActive ? "text-blue-400" : "text-slate-400"}`} />
            <span>{dashboardItem.label}</span>
          </Link>
          <button
            type="button"
            aria-label={hideAll ? "Expand all modules" : "Collapse all modules"}
            aria-expanded={!hideAll}
            onClick={() => setHideAll((v) => !v)}
            title={hideAll ? "Expand all" : "Collapse all"}
            className="rounded-lg p-2 text-slate-500 transition-colors hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 mr-1"
          >
            <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ease-out ${hideAll ? "-rotate-90" : ""}`} />
          </button>
        </div>

        {/* Section Divider */}
        <div className="pt-2 pb-1">
          <p className="px-3 text-[11px] font-medium text-slate-400">
            Modules
          </p>
        </div>

        {/* Nav Groups */}
        {navGroups.map((group) => {
          const Icon = group.icon;
          const groupActive = group.children.some((child) => child.href === pathname);
          const isOpen = !hideAll && (openGroups[group.label] ?? true);

          return (
            <div key={group.label} className="space-y-1">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() =>
                  setOpenGroups((s) => ({ ...s, [group.label]: !(s[group.label] ?? true) }))
                }
                className={`flex min-h-9 w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-xs font-semibold tracking-wide transition-colors duration-150 hover:bg-slate-900/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                  groupActive ? "text-slate-100" : "text-slate-300"
                }`}
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-md border border-slate-800 bg-slate-900/80">
                  <Icon className={`h-3.5 w-3.5 ${groupActive ? "text-blue-400" : "text-slate-400"}`} />
                </span>
                <span className="flex-1 truncate">{group.label}</span>
                <span className="font-mono text-[10px] text-slate-400">
                  {String(group.children.length).padStart(2, "0")}
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-slate-500 transition-transform duration-200 ease-out ${
                    isOpen ? "" : "-rotate-90"
                  }`}
                />
              </button>

              {isOpen && (
                <ul className="ui-subnav-enter relative ml-3.5 space-y-0.5 border-l border-slate-800/80 pl-2.5">
                  {group.children.map((child) => {
                    const ChildIcon = child.icon;
                    const active = pathname === child.href;
                    return (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          onClick={onNavigate}
                          className={`group flex min-h-8 items-center gap-2.5 rounded-md px-2.5 py-1 text-xs transition duration-150 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                            active
                              ? "border-l-2 border-blue-400 bg-blue-600/15 font-semibold text-blue-200"
                              : "text-slate-400 hover:bg-slate-900/60 hover:text-slate-200"
                          }`}
                        >
                          {ChildIcon ? (
                            <ChildIcon
                              className={`h-3.5 w-3.5 shrink-0 ${
                                active ? "text-blue-400" : "text-slate-500 group-hover:text-slate-400"
                              }`}
                            />
                          ) : (
                            <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center">
                              <span
                                className={`h-1 w-1 rounded-full ${
                                  active ? "bg-blue-400 ring-2 ring-blue-400/30" : "bg-slate-600"
                                }`}
                              />
                            </span>
                          )}
                          <span className="truncate">{child.label}</span>
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

      {/* Sidebar Footer */}
      <div className="border-t border-slate-800/80 p-3 bg-slate-950/70">
        <Link
          href="/info"
          onClick={onNavigate}
          className={`flex items-center gap-2.5 rounded-lg border px-3 py-2 text-xs font-medium transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
            pathname === "/info"
              ? "border-blue-500/40 bg-blue-600/15 text-blue-300"
              : "border-slate-800/80 bg-slate-900/50 text-slate-400 hover:border-slate-700 hover:bg-slate-900 hover:text-slate-200"
          }`}
        >
          <Info className="h-4 w-4 text-blue-400 shrink-0" />
          <div className="flex-1 truncate">
            <span className="block font-semibold text-slate-200 truncate">System Information</span>
            <span className="block text-[10px] text-slate-500">Architecture & Specs</span>
          </div>
        </Link>
      </div>
    </nav>
  );
}
