"use client";

import { LogOut, Menu, ShieldCheck } from "lucide-react";
import Button from "@/components/ui/Button";

interface Props {
  onMenuToggle?: () => void;
  adminEmail?: string;
  onLogout?: () => void;
  breadcrumbs?: string;
}

export default function AdminHeader({
  onMenuToggle,
  adminEmail,
  onLogout,
  breadcrumbs = "Administration Console",
}: Props) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-800 bg-[#080d17]/95 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-3">
        {onMenuToggle && (
          <button
            type="button"
            onClick={onMenuToggle}
            className="ui-pressable flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-[#0d131f] text-slate-300 hover:text-white md:hidden"
            aria-label="Open administrative navigation drawer"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-slate-400 hidden sm:inline">
            {breadcrumbs}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs">
          <ShieldCheck className="h-3.5 w-3.5 text-purple-400" />
          <span className="font-mono text-[11px] text-purple-200 truncate max-w-[180px]">
            {adminEmail || "admin@ricoz.mfg"}
          </span>
        </div>

        {onLogout && (
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            className="border-slate-800 bg-[#0d131f] text-xs text-slate-300 hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-300"
          >
            <LogOut className="h-3.5 w-3.5 mr-1.5" />
            Sign Out
          </Button>
        )}
      </div>
    </header>
  );
}
