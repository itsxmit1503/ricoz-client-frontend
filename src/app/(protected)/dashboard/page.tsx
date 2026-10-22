"use client";

import {
  FilePlus2,
  Info,
  LogOut,
  PackagePlus,
} from "lucide-react";
import Link from "next/link";
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

  const name = user ? user.username || user.email.split("@")[0] : "User";

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logout();
      toast.success("Signed out successfully");
      router.replace("/login");
    } catch {
      toast.error("Could not reach server, session cleared locally.");
      router.replace("/login");
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <div className="ui-page-enter mx-auto max-w-7xl space-y-6">
      {/* Dashboard Header */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Dashboard
            </h1>
            <p className="text-sm text-slate-400">
              Welcome back, {name}. Overview of production plans, equipment, inventory, and quality assurance.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/production/work-orders"
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <FilePlus2 className="h-3.5 w-3.5" />
              <span>Work Orders</span>
            </Link>

            <Link
              href="/products/add"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-medium text-slate-200 transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              <PackagePlus className="h-3.5 w-3.5 text-blue-400" />
              <span>New Product</span>
            </Link>

            <Link
              href="/info"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-400 transition hover:bg-slate-800 hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              title="System Documentation"
            >
              <Info className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Info</span>
            </Link>

            {user && (
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                title="Sign out"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-400 transition hover:bg-slate-800 hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:opacity-50"
              >
                {loggingOut ? <Spinner className="h-3.5 w-3.5" /> : <LogOut className="h-3.5 w-3.5" />}
                <span className="hidden sm:inline">Sign out</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Module Grid */}
      <DashboardModuleGrid />
    </div>
  );
}
