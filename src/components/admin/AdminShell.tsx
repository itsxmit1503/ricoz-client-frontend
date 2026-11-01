"use client";

import { UserButton } from "@clerk/nextjs";
import { Eye, Menu, ShieldAlert, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { FullScreenSpinner } from "@/components/ui/Spinner";
import { useAuth } from "@/hooks/useAuth";
import { adminNav } from "./nav-config";

function Nav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const isPreview = pathname.startsWith("/admin/preview");

  return (
    <nav className="flex h-full w-64 flex-col border-r border-slate-800 bg-[#080d17]">
      <div className="flex h-16 shrink-0 items-center gap-3 px-5 border-b border-slate-800">
        <span className={`flex h-9 w-9 items-center justify-center rounded-lg border ${
          isPreview
            ? "border-amber-500/40 bg-amber-500/15 text-amber-300"
            : "border-purple-500/30 bg-purple-600/15 text-purple-300"
        }`}>
          {isPreview ? <Eye className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
        </span>
        <div className="leading-tight">
          <span className="block text-sm font-bold text-white">Ricoz Admin</span>
          <span className={`block font-mono text-[10px] font-bold uppercase ${
            isPreview ? "text-amber-400" : "text-purple-300"
          }`}>
            {isPreview ? "UI PREVIEW" : "CONSOLE"}
          </span>
        </div>
      </div>

      <ul className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {adminNav.map(({ href, label, icon: Icon }) => {
          const targetHref = isPreview ? href.replace("/admin", "/admin/preview") : href;
          const active = href === "/admin" ? pathname === targetHref : pathname.startsWith(targetHref);
          return (
            <li key={href}>
              <Link
                href={targetHref}
                onClick={onNavigate}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                  active
                    ? isPreview
                      ? "border border-amber-500/40 bg-amber-500/15 text-amber-200 shadow-sm"
                      : "border border-purple-500/40 bg-purple-600/20 text-purple-200 font-bold shadow-sm"
                    : "text-slate-200 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${active ? (isPreview ? "text-amber-400" : "text-purple-300") : "text-slate-400"}`} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="space-y-3 border-t border-slate-800 px-5 py-4 bg-[#060a12]">
        <Link href="/dashboard" className="block text-xs font-medium text-slate-300 hover:text-white transition">
          ← Back to Ricoz ERP
        </Link>
        {!isPreview && (
          <div className="flex items-center gap-2 pt-1">
            <UserButton showName />
          </div>
        )}
      </div>
    </nav>
  );
}

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isPreview = pathname.startsWith("/admin/preview");
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);

  // Allow preview routes without authentication block
  if (!isPreview) {
    if (loading) return <FullScreenSpinner />;

    if (user?.role !== "admin") {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#06090f] px-4 text-center">
          <ShieldAlert className="h-10 w-10 text-rose-400" />
          <h1 className="mt-4 text-xl font-bold text-white">Administrator Access Required</h1>
          <p className="mt-1 max-w-sm text-sm text-slate-300">
            {user
              ? `${user.email} does not possess the administrator role in the active database.`
              : "Unable to retrieve employee profile from the server."}
          </p>
          <div className="mt-5 flex items-center gap-3">
            <Link href="/admin/preview" className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition">
              Explore Design Preview →
            </Link>
            <Link href="/dashboard" className="rounded-lg border border-slate-800 bg-[#0d131f] px-4 py-2 text-xs font-semibold text-purple-300 hover:text-white transition">
              Return to Dashboard
            </Link>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#06090f] text-slate-100">
      <div className="hidden lg:block">
        <Nav />
      </div>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />
          <div className="relative h-full w-64">
            <Nav onNavigate={() => setOpen(false)} />
            <button
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="absolute -right-12 top-4 rounded-lg bg-slate-900 p-2 text-slate-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {isPreview && (
          <div className="flex items-center justify-between border-b border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs text-amber-300 font-mono">
            <span>PREVIEW MODE // Non-persistent Demonstration Sandbox</span>
            <Link href="/admin/login" className="underline hover:text-white">
              Exit Preview
            </Link>
          </div>
        )}

        <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-800 px-4 lg:hidden">
          <button
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="rounded-lg p-2 text-slate-300 hover:bg-slate-800"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-mono text-xs font-bold text-white">Ricoz Admin</span>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8 theme-scrollbar">{children}</main>
      </div>
    </div>
  );
}
