"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import toast from "react-hot-toast";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import { lockBodyScroll } from "@/components/ui/focus";

interface Props {
  children: ReactNode;
}

export default function AdminShell({ children }: Props) {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string>("admin@ricoz.mfg");
  const drawerRef = useRef<HTMLDivElement>(null);

  // Fetch admin session details client-side
  useEffect(() => {
    let active = true;
    fetch("/api/admin/session")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthenticated");
        return res.json();
      })
      .then((data) => {
        if (active && data.user?.email) {
          setAdminEmail(data.user.email);
        }
      })
      .catch(() => {
        // Handled server-side by middleware redirect
      });
    return () => {
      active = false;
    };
  }, []);

  // Lock scroll when mobile drawer is open
  useEffect(() => {
    if (!drawerOpen) return;
    const releaseScroll = lockBodyScroll();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      releaseScroll();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [drawerOpen]);

  const handleLogout = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/logout", { method: "POST" });
      if (res.ok) {
        toast.success("Admin session terminated");
        router.push("/admin/login");
        router.refresh();
      } else {
        toast.error("Failed to sign out cleanly");
      }
    } catch {
      toast.error("Network error during sign out");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen bg-[#06090f] text-slate-100">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:shrink-0 md:flex-col">
        <div className="fixed inset-y-0 flex w-64 flex-col">
          <AdminSidebar adminEmail={adminEmail} onLogout={handleLogout} />
        </div>
      </div>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <div
            ref={drawerRef}
            className="fixed inset-y-0 left-0 flex w-64 flex-col shadow-2xl transition-transform"
          >
            <AdminSidebar
              adminEmail={adminEmail}
              onLogout={handleLogout}
              onNavClick={() => setDrawerOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col md:pl-64">
        <AdminHeader
          adminEmail={adminEmail}
          onLogout={handleLogout}
          onMenuToggle={() => setDrawerOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
