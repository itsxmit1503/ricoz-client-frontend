"use client";

import { BadgeCheck, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import DashboardModuleGrid from "@/components/dashboard/DashboardModuleGrid";
import Spinner from "@/components/ui/Spinner";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const name = user ? user.username || user.email.split("@")[0] : "Guest";

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logout(); // calls POST /auth/logout and clears the user in AuthContext
      toast.success("Logged out");
      router.replace("/login");
    } catch {
      // the user is already cleared locally even if the API call failed
      toast.error("Could not reach the server, but you were logged out here.");
      router.replace("/login");
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
              Operations workspace
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
                Welcome, {name} <span aria-hidden="true">👋</span>
              </h1>
              {user?.isemailVerified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
                  <BadgeCheck className="h-3.5 w-3.5" /> Verified
                </span>
              )}
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:pr-4">
              Keep production, inventory, and quality work moving from one place.
            </p>
          </div>

          {user && (
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="inline-flex min-h-10 shrink-0 items-center gap-2 self-start rounded-lg border border-slate-700/80 bg-slate-900/60 px-4 py-2 text-sm font-medium text-slate-400 transition hover:border-slate-600 hover:bg-slate-800 hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loggingOut ? <Spinner className="h-4 w-4" /> : <LogOut className="h-4 w-4" />}
              Logout
            </button>
          )}
        </div>
      </div>

      <div className="mb-4 mt-7 flex flex-wrap items-end justify-between gap-x-4 gap-y-2 sm:mt-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Workspace modules
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-100">Choose an area to explore</h2>
        </div>
        <p className="hidden text-sm text-slate-500 sm:block">Quick access to your modules</p>
      </div>

      <DashboardModuleGrid />
    </div>
  );
}