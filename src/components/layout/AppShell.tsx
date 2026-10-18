"use client";

import { Menu, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  focusWithoutScroll,
  getFocusableElements,
  isTopmostLayer,
  lockBodyScroll,
} from "@/components/ui/focus";
import Sidebar from "./Sidebar";

export default function AppShell({ children }: { children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, []);

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

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      {/* desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* mobile drawer */}
      {drawerOpen && (
        <div
          ref={drawerRef}
          className="fixed inset-0 z-40 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className="absolute inset-0 bg-black/60" onClick={() => setDrawerOpen(false)} />
          <div className="relative h-full w-72">
            <Sidebar onNavigate={closeDrawer} />
            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Close menu"
              onClick={closeDrawer}
              className="absolute -right-12 top-4 rounded-lg bg-slate-900 p-2 text-slate-300 transition hover:bg-slate-800 hover:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center border-b border-slate-800 bg-slate-900/60 px-4 backdrop-blur sm:px-6 lg:hidden">
          <button
            ref={menuButtonRef}
            type="button"
            aria-label="Open menu"
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen(true)}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            <Menu className="h-5 w-5" />
          </button>
        </header>

        <main className="theme-scrollbar flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}