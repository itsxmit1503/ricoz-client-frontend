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
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface AdminNavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  statusBadge?: string;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/users", label: "User Management", icon: Users },
  { href: "/admin/roles", label: "Roles & Permissions", icon: ShieldCheck },
  { href: "/admin/master-data", label: "Master Data", icon: Database },
  { href: "/admin/audit-logs", label: "Audit Logs", icon: History, statusBadge: "Pipeline" },
  { href: "/admin/settings", label: "System Settings", icon: Settings },
];

interface Props {
  onNavClick?: () => void;
  adminEmail?: string;
  onLogout?: () => void;
}

export default function AdminSidebar({ onNavClick, adminEmail, onLogout }: Props) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-800 bg-[#080d17] text-slate-300">
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-600 text-white shadow-md shadow-purple-600/20">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm tracking-tight text-white">Ricoz MFG</span>
            <span className="rounded border border-purple-500/40 bg-purple-500/15 px-1.5 py-0.2 font-mono text-[9px] font-bold text-purple-300 uppercase">
              ADMIN
            </span>
          </div>
          <p className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
            Private Console
          </p>
        </div>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 theme-scrollbar">
        <div className="mb-2 px-3">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Control Domains
          </p>
        </div>
        <nav className="space-y-1">
          {ADMIN_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavClick}
                className={`ui-pressable group flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? "border border-purple-500/30 bg-purple-500/10 text-white font-semibold shadow-xs"
                    : "text-slate-400 hover:border-slate-800 hover:bg-[#0d131f] hover:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`h-4 w-4 transition-colors ${
                      isActive ? "text-purple-400" : "text-slate-500 group-hover:text-slate-300"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.statusBadge && (
                  <span className="rounded border border-slate-800 bg-[#0c111e] px-1.5 py-0.5 font-mono text-[9px] text-slate-400">
                    {item.statusBadge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* External Jump to Public / Operations */}
        <div className="mt-8 pt-4 border-t border-slate-800/80 px-1">
          <div className="mb-2 px-2">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Operations Navigation
            </p>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center justify-between rounded-lg px-3 py-2 text-xs text-slate-400 hover:bg-[#0d131f] hover:text-slate-200"
          >
            <span>ERP Plant Dashboard</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-slate-500" />
          </Link>
          <Link
            href="/"
            className="flex items-center justify-between rounded-lg px-3 py-2 text-xs text-slate-400 hover:bg-[#0d131f] hover:text-slate-200"
          >
            <span>Public Home</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-slate-500" />
          </Link>
        </div>
      </div>

      {/* Admin Identity & Logout Footer */}
      <div className="border-t border-slate-800 bg-[#060a12] p-3.5">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <span className="block font-mono text-[10px] font-bold uppercase tracking-wider text-purple-400">
              Signed In Admin
            </span>
            <p className="truncate font-mono text-xs text-slate-300" title={adminEmail || "admin@ricoz.mfg"}>
              {adminEmail || "admin@ricoz.mfg"}
            </p>
          </div>
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              title="End Admin Session"
              className="ui-pressable flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-[#0d131f] text-slate-400 hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-300 transition"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
