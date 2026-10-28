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
    <nav className="flex h-full w-72 flex-col border-r border-slate-800/80 bg-[#0b0f1a] shadow-xl select-none">
      {/* Brand Header */}
      <div className="flex h-15 shrink-0 items-center justify-between border-b border-slate-800/80 px-4">
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className="group flex items-center gap-3 rounded-lg p-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <span className="flex h-8.5 w-8.5 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs transition group-hover:bg-blue-500">
            <Factory className="h-4 w-4" />
          </span>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold tracking-tight text-white">Ricoz</span>
              <span className="rounded border border-slate-700 bg-slate-800/90 px-1.5 py-0.2 text-[9px] font-semibold text-slate-200">
                ERP
              </span>
            </div>
            <span className="block text-[11px] font-medium text-slate-400">
              Manufacturing OS
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Scrollable Body */}
      <div className="theme-scrollbar flex-1 space-y-1.5 overflow-y-auto px-3 py-3">
        {/* Dashboard Command Link */}
        <div
          className={`flex items-center rounded-lg border transition-colors duration-150 ${
            dashActive
              ? "border-blue-500/50 bg-[#162136] text-blue-200 shadow-2xs font-medium"
              : "border-transparent text-slate-300 hover:border-slate-800 hover:bg-[#121826] hover:text-white"
          }`}
        >
          <Link
            href={dashboardItem.href}
            onClick={onNavigate}
            className="flex min-h-9.5 flex-1 items-center gap-3 rounded-lg px-3 py-2 text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <DashIcon className={`h-4 w-4 shrink-0 ${dashActive ? "text-blue-400" : "text-slate-400"}`} />
            <span className="truncate">{dashboardItem.label}</span>
          </Link>
          <button
            type="button"
            aria-label={hideAll ? "Expand all modules" : "Collapse all modules"}
            aria-expanded={!hideAll}
            onClick={() => setHideAll((v) => !v)}
            title={hideAll ? "Expand all modules" : "Collapse all modules"}
            className="mr-1 rounded p-1.5 text-slate-400 transition-colors hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform duration-200 ease-out ${
                hideAll ? "-rotate-90" : ""
              }`}
            />
          </button>
        </div>

        {/* Section Divider */}
        <div className="pt-3 pb-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Operational Modules
          </p>
        </div>

        {/* Nav Groups */}
        {navGroups.map((group) => {
          const Icon = group.icon;
          const groupActive = group.children.some((child) => child.href === pathname);
          const isOpen = !hideAll && (openGroups[group.label] ?? true);

          return (
            <div key={group.label} className="space-y-0.5">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() =>
                  setOpenGroups((s) => ({ ...s, [group.label]: !(s[group.label] ?? true) }))
                }
                className={`flex min-h-8.5 w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-xs font-semibold tracking-wide transition-colors duration-150 hover:bg-[#121826] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                  groupActive ? "text-white" : "text-slate-300"
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${groupActive ? "text-blue-400" : "text-slate-400"}`} />
                <span className="flex-1 truncate">{group.label}</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform duration-200 ${
                    isOpen ? "" : "-rotate-90"
                  }`}
                />
              </button>

              {isOpen && (
                <div className="ml-3.5 space-y-0.5 border-l border-slate-800 pl-2.5">
                  {group.children.map((child) => {
                    const active = pathname === child.href;
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={onNavigate}
                        className={`flex min-h-8 items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                          active
                            ? "bg-[#162136] text-blue-300 font-semibold border-l-2 border-blue-500"
                            : "text-slate-300 hover:bg-[#121826] hover:text-white"
                        }`}
                      >
                        <span className="truncate">{child.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Info & Build Tag */}
      <div className="border-t border-slate-800/80 p-3">
        <Link
          href="/info"
          onClick={onNavigate}
          className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-slate-400 hover:bg-[#121826] hover:text-slate-200"
        >
          <span>System Information</span>
          <span className="font-mono text-[10px] text-slate-400">v0.1.0</span>
        </Link>
      </div>
    </nav>
  );
}
