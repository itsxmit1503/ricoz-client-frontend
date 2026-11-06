"use client";

import { UserButton } from "@clerk/nextjs";
import { ArrowUpRight, Eye, Menu, ShieldAlert, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, type ReactNode } from "react";
import { FullScreenSpinner } from "@/components/ui/Spinner";
import { useAuth } from "@/hooks/useAuth";
import { adminService } from "@/services/admin.service";
import { adminNav } from "./nav-config";

const hasClerkKey = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("localhost")
);

function Nav({ onNavigate, adminUser }: { onNavigate?: () => void; adminUser?: { email: string; role: string; name?: string } | null }) {
  const pathname = usePathname();
  const isPreview = pathname.startsWith("/admin/preview");
  const { user } = useAuth();

  // Resolve display identity with guaranteed high contrast
  const displayEmail =
    adminUser?.email ||
    user?.email ||
    (isPreview ? "preview@ricoz.mfg" : "admin@ricoz.mfg");

  const displayName =
    adminUser?.name ||
    user?.name ||
    user?.username ||
    "System Administrator";

  const initials = (displayName || "Admin")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <nav className="flex h-full w-64 flex-col border-r border-slate-800 bg-[#080d17] text-slate-100">
      {/* Brand Header */}
      <div className="flex h-16 shrink-0 items-center gap-3 px-5 border-b border-slate-800">
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-lg border ${
            isPreview
              ? "border-amber-500/40 bg-amber-500/15 text-amber-300"
              : "border-purple-500/40 bg-purple-600/20 text-purple-300"
          }`}
        >
          {isPreview ? <Eye className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
        </span>
        <div className="leading-tight">
          <span className="block text-sm font-bold text-white">Ricoz Admin</span>
          <span
            className={`block font-mono text-[10px] font-bold uppercase ${
              isPreview ? "text-amber-400" : "text-purple-300"
            }`}
          >
            {isPreview ? "UI PREVIEW" : "CONSOLE"}
          </span>
        </div>
      </div>

      {/* Nav Link Items */}
      <ul className="flex-1 space-y-1 overflow-y-auto px-3 py-4 theme-scrollbar">
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
                <Icon
                  className={`h-4 w-4 shrink-0 ${
                    active
                      ? isPreview
                        ? "text-amber-400"
                        : "text-purple-300"
                      : "text-slate-400"
                  }`}
                />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Bottom Profile & Navigation Section - High Contrast Guarantee */}
      <div className="border-t border-slate-800/90 bg-[#070b14] p-3.5 space-y-3">
        {/* Navigation link: Back to Ricoz ERP */}
        <Link
          href="/dashboard"
          className="flex items-center justify-between rounded-lg border border-slate-800 bg-[#0e1524] px-3 py-2 text-xs font-semibold text-slate-200 hover:border-slate-700 hover:bg-[#162035] hover:text-white transition group"
        >
          <span className="flex items-center gap-2">
            <span className="text-slate-400 group-hover:text-purple-300 transition-colors">←</span>
            <span>Back to Ricoz ERP</span>
          </span>
          <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-white transition-colors" />
        </Link>

        {/* Profile Card with High-Contrast Typography */}
        <div className="rounded-xl border border-slate-800/80 bg-[#0c1222] p-3 shadow-md">
          <div className="flex items-center gap-3">
            {/* Avatar or Clerk UserButton */}
            <div className="relative shrink-0">
              {!isPreview && hasClerkKey ? (
                <UserButton
                  appearance={{
                    elements: {
                      rootBox: "flex items-center justify-center",
                      userButtonAvatarBox: "h-10 w-10 rounded-lg border border-purple-500/40 shadow-sm",
                      userButtonTrigger: "focus:outline-none focus:ring-2 focus:ring-purple-500/50 rounded-lg",
                      userPreviewSecondaryIdentifier: "!text-slate-300 !text-xs !font-mono",
                      userPreviewMainIdentifier: "!text-white !text-sm !font-bold",
                    },
                  }}
                />
              ) : (
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg border text-xs font-bold font-mono shadow-sm ${
                    isPreview
                      ? "border-amber-500/50 bg-amber-500/20 text-amber-200"
                      : "border-purple-500/50 bg-purple-600/20 text-purple-200"
                  }`}
                >
                  {initials || "AD"}
                </div>
              )}
              {/* Online indicator dot */}
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0c1222] bg-emerald-400 shadow-xs" />
            </div>

            {/* User Identity Details */}
            <div className="min-w-0 flex-1 overflow-hidden">
              <div className="flex items-center justify-between gap-1.5">
                <span className="truncate text-xs font-bold text-white tracking-tight" title={displayName}>
                  {displayName}
                </span>
                <span
                  className={`shrink-0 rounded border px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider ${
                    isPreview
                      ? "border-amber-500/50 bg-amber-500/20 text-amber-300"
                      : "border-purple-500/50 bg-purple-500/20 text-purple-300"
                  }`}
                >
                  {isPreview ? "PREVIEW" : "ADMIN"}
                </span>
              </div>
              <p
                className="truncate font-mono text-[11px] font-bold text-slate-100 tracking-tight mt-1"
                title={displayEmail}
              >
                {displayEmail}
              </p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isPreview = pathname.startsWith("/admin/preview");
  const { user, loading } = useAuth();
  const [adminSession, setAdminSession] = useState<{ authenticated: boolean; user?: { email: string; role: string; name?: string } } | null>(null);
  const [healthStatus, setHealthStatus] = useState<{ online: boolean; dataSource?: string; databaseStatus?: string } | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let active = true;
    if (isPreview) {
      setCheckingSession(false);
      return;
    }
    Promise.allSettled([adminService.checkSession(), adminService.checkHealth()])
      .then(([sessionResult, healthResult]) => {
        if (!active) return;
        if (sessionResult.status === "fulfilled") {
          setAdminSession(sessionResult.value);
        } else {
          setAdminSession({ authenticated: false });
        }
        if (healthResult.status === "fulfilled") {
          setHealthStatus(healthResult.value);
        }
      })
      .finally(() => {
        if (active) setCheckingSession(false);
      });
    return () => {
      active = false;
    };
  }, [isPreview]);

  // Allow preview routes without authentication block
  if (!isPreview) {
    if ((loading || checkingSession) && !adminSession?.authenticated && user?.role !== "admin") {
      return <FullScreenSpinner />;
    }

    const isClerkAdmin = user?.role === "admin";
    const isSessionAdmin = Boolean(adminSession?.authenticated && adminSession?.user?.role === "admin");
    const hasAdminPrivilege = isClerkAdmin || isSessionAdmin;

    if (!hasAdminPrivilege && !loading && !checkingSession) {
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
            <Link
              href="/admin/preview"
              className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition"
            >
              Explore Design Preview →
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg border border-slate-800 bg-[#0d131f] px-4 py-2 text-xs font-semibold text-purple-300 hover:text-white transition"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      );
    }
  }

  const activeAdminUser = adminSession?.user || (user?.role === "admin" ? { email: user.email, role: user.role, name: user.name || user.username } : null);

  return (
    <div className="flex h-screen overflow-hidden bg-[#06090f] text-slate-100">
      <div className="hidden lg:block">
        <Nav adminUser={activeAdminUser} />
      </div>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />
          <div className="relative h-full w-64">
            <Nav onNavigate={() => setOpen(false)} adminUser={activeAdminUser} />
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

        {!isPreview && healthStatus?.online === false && (
          <div className="flex items-center justify-between border-b border-rose-500/40 bg-rose-950/60 px-4 py-1.5 text-xs text-rose-300 font-mono">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              <span>BACKEND SERVICE UNREACHABLE: Ensure Ricoz MFG Express server is running on port 5000.</span>
            </span>
            <span className="rounded bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-200">
              OFFLINE
            </span>
          </div>
        )}

        {!isPreview && healthStatus?.online && healthStatus?.dataSource === "store" && (
          <div className="flex items-center justify-between border-b border-amber-500/30 bg-amber-950/40 px-4 py-1.5 text-xs text-amber-300 font-mono">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <span>STANDBY MODE: Primary database is offline. In-memory data store active; writes will not survive server restart.</span>
            </span>
            <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-200">
              STANDBY MEMORY
            </span>
          </div>
        )}

        {!isPreview && healthStatus?.online && healthStatus?.dataSource === "database" && (
          <div className="flex items-center justify-between border-b border-emerald-500/30 bg-emerald-950/30 px-4 py-1 text-xs text-emerald-300 font-mono">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>LIVE DATABASE: Primary MongoDB connected. Persistent storage verified.</span>
            </span>
            <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
              LIVE MONGO
            </span>
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
