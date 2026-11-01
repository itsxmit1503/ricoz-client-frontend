"use client";

import {
  Database,
  History,
  LayoutDashboard,
  ShieldAlert,
  ShieldCheck,
  Settings,
  Users,
  LogOut,
  ArrowUpRight,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface AdminNavItem {
  segment: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  statusBadge?: string;
}

export const ADMIN_NAV_SEGMENTS: AdminNavItem[] = [
  { segment: "", label: "Overview", icon: LayoutDashboard, exact: true },
  { segment: "/users", label: "User Management", icon: Users },
  { segment: "/roles", label: "Roles & Permissions", icon: ShieldCheck },
  { segment: "/master-data", label: "Master Data", icon: Database },
  { segment: "/audit-logs", label: "Audit Logs", icon: History },
  { segment: "/settings", label: "System Settings", icon: Settings },
];

interface Props {
  onNavClick?: () => void;
  adminEmail?: string;
  onLogout?: () => void;
}

export default function AdminSidebar({ onNavClick, adminEmail, onLogout }: Props) {
  const pathname = usePathname();
  const isPreview = pathname.startsWith("/admin/preview");
  const basePath = isPreview ? "/admin/preview" : "/admin";

  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-800 bg-[#080d17] text-slate-200">
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-5">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg text-white shadow-md ${
            isPreview
              ? "bg-amber-600 shadow-amber-600/20"
              : "bg-purple-600 shadow-purple-600/20"
          }`}
        >
          {isPreview ? <Eye className="h-5 w-5" /> : <ShieldAlert className="h-5 w-5" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm tracking-tight text-white">Ricoz MFG</span>
            <span
              className={`rounded border px-1.5 py-0.2 font-mono text-[9px] font-bold uppercase ${
                isPreview
                  ? "border-amber-500/40 bg-amber-500/20 text-amber-300"
                  : "border-purple-500/40 bg-purple-500/20 text-purple-200 font-bold"
              }`}
            >
              {isPreview ? "PREVIEW" : "ADMIN"}
            </span>
          </div>
          <p className="font-mono text-[10px] text-slate-300 uppercase tracking-wider font-semibold">
            {isPreview ? "UI Design Mode" : "Private Console"}
          </p>
        </div>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 theme-scrollbar">
        <div className="mb-2 px-3">
          <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-200">
            Control Domains
          </p>
        </div>
        <nav className="space-y-1">
          {ADMIN_NAV_SEGMENTS.map((item) => {
            const Icon = item.icon;
            const targetHref = `${basePath}${item.segment}`;
            const isActive = item.exact
              ? pathname === targetHref
              : pathname.startsWith(targetHref);

            return (
              <Link
                key={item.segment}
                href={targetHref}
                onClick={onNavClick}
                className={`ui-pressable group flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? isPreview
                      ? "border border-amber-500/50 bg-amber-500/15 text-white font-bold shadow-sm"
                      : "border border-purple-500/40 bg-purple-500/15 text-white font-bold shadow-sm"
                    : "text-slate-300 hover:border-slate-700 hover:bg-[#121927] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`h-4 w-4 transition-colors ${
                      isActive
                        ? isPreview
                          ? "text-amber-400"
                          : "text-purple-300"
                        : "text-slate-400 group-hover:text-white"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.statusBadge && (
                  <span className="rounded border border-slate-700 bg-[#0e1524] px-1.5 py-0.5 font-mono text-[9px] text-slate-300 font-medium">
                    {item.statusBadge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* External Jump to Public / Operations */}
        <div className="mt-8 pt-4 border-t border-slate-800 px-1">
          <div className="mb-2 px-2">
            <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-200">
              Operations Navigation
            </p>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-slate-300 hover:bg-[#121927] hover:text-white transition"
          >
            <span>ERP Plant Dashboard</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
          </Link>
          <Link
            href="/"
            className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-slate-300 hover:bg-[#121927] hover:text-white transition"
          >
            <span>Public Home</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
          </Link>
        </div>
      </div>

      {/* Admin Identity & Logout Footer - High Contrast */}
      <div className="border-t border-slate-800 bg-[#070b14] p-3.5">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <span
              className={`block font-mono text-[10px] font-bold uppercase tracking-wider ${
                isPreview ? "text-amber-400" : "text-purple-300"
              }`}
            >
              {isPreview ? "Preview Session" : "Signed In Admin"}
            </span>
            <p
              className="truncate font-mono text-xs font-bold text-white"
              title={adminEmail || (isPreview ? "read-only-preview@ricoz.mfg" : "admin@ricoz.mfg")}
            >
              {isPreview ? "preview@ricoz.mfg" : (adminEmail || "admin@ricoz.mfg")}
            </p>
          </div>
          {isPreview ? (
            <Link
              href="/admin/login"
              title="Exit Preview Mode"
              className="ui-pressable flex h-8 px-2 items-center gap-1 text-[11px] font-mono font-bold rounded-lg border border-amber-500/50 bg-amber-500/15 text-amber-200 hover:bg-amber-500/25 transition"
            >
              Exit
            </Link>
          ) : onLogout ? (
            <button
              type="button"
              onClick={onLogout}
              title="End Admin Session"
              className="ui-pressable flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-[#0e1524] text-slate-200 hover:border-rose-500/50 hover:bg-rose-500/15 hover:text-rose-200 transition"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
