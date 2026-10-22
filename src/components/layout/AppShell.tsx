"use client";

import {
  Factory,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import toast from "react-hot-toast";
import {
  focusWithoutScroll,
  getFocusableElements,
  isTopmostLayer,
  lockBodyScroll,
} from "@/components/ui/focus";
import { useAuth } from "@/hooks/useAuth";
import { findNavItem } from "./nav-config";
import Sidebar from "./Sidebar";

export default function AppShell({ children }: { children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const navItem = findNavItem(pathname);
  const breadcrumb = navItem
    ? `${navItem.group} / ${navItem.label}`
    : pathname === "/dashboard"
    ? "Operations / Command Dashboard"
    : pathname === "/info"
    ? "System / Architecture & Specs"
    : "Operations";

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  async function handleQuickLogout() {
    setLoggingOut(true);
    try {
      await logout();
      toast.success("Session closed");
      router.replace("/login");
    } catch {
      router.replace("/login");
    } finally {
      setLoggingOut(false);
    }
  }

  useEffect(() => {
    if (!drawerOpen) return;

    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const menuButton = menuButtonRef.current;
    const releaseBodyScroll = lockBodyScroll();

    const onKeyDown = (event: KeyboardEvent) => {
      const drawer = drawerRef.current;
      if (!drawer || !isTopmostLayer(drawer)) return;

      if (event.key === "Escape") {
        event.preventDefault();
        closeDrawer();
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = getFocusableElements(drawer);
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || !drawer.contains(document.activeElement))) {
        event.preventDefault();
        focusWithoutScroll(last);
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        focusWithoutScroll(first);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    requestAnimationFrame(() => focusWithoutScroll(closeButtonRef.current));

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      releaseBodyScroll();
      requestAnimationFrame(() => {
        if (previouslyFocused?.isConnected) {
          focusWithoutScroll(previouslyFocused);
        } else {
          focusWithoutScroll(menuButton);
        }
      });
    };
  }, [closeDrawer, drawerOpen]);

  const displayName = user ? user.username || user.email.split("@")[0] : "User";

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:block shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div
          ref={drawerRef}
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation drawer"
        >
          <div
            className="absolute inset-0 bg-slate-950/80 transition-opacity"
            onClick={closeDrawer}
          />
          <div className="relative h-full w-72 max-w-[85vw] shadow-2xl">
            <Sidebar onNavigate={closeDrawer} />
            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Close navigation"
              onClick={closeDrawer}
              className="absolute -right-12 top-4 rounded-lg border border-slate-700/80 bg-slate-900 p-2 text-slate-300 transition hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Workspace Column */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Unified Top Command Header */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-800/80 bg-slate-950/95 px-4 sm:px-6">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile hamburger button */}
            <button
              ref={menuButtonRef}
              type="button"
              aria-label="Open menu"
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen(true)}
              className="rounded-lg border border-slate-800 bg-slate-900/80 p-2 text-slate-400 transition hover:border-slate-700 hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>

            {/* Mobile Brand indicator */}
            <div className="flex items-center gap-2 lg:hidden">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Factory className="h-3.5 w-3.5" />
              </span>
              <span className="font-bold text-sm tracking-tight text-white">Ricoz</span>
            </div>

            {/* Desktop Breadcrumb Navigation */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-400">
              <span className="text-slate-500">Ricoz</span>
              <span className="text-slate-600">/</span>
              <span className="text-slate-200 font-medium truncate">{breadcrumb}</span>
            </div>
          </div>

          {/* Right Header User Profile */}
          <div className="flex items-center gap-3">
            {/* User Profile */}
            {user && (
              <div className="flex items-center gap-2.5 pl-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-700 bg-slate-800 text-xs font-medium text-slate-200">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <span className="block text-xs font-medium text-slate-200 truncate max-w-[140px]">
                    {displayName}
                  </span>
                  <span className="block text-[10px] text-slate-400 truncate max-w-[140px]">
                    {user.email || "User"}
                  </span>
                </div>

                {/* Logout Action */}
                <button
                  type="button"
                  onClick={handleQuickLogout}
                  disabled={loggingOut}
                  title="Sign out"
                  aria-label="Sign out"
                  className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:opacity-50"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Scrollable Page Body */}
        <main className="theme-scrollbar flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div key={pathname} className="ui-page-enter">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
