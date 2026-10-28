"use client";

import { ArrowRight, Factory, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-[#090d16]/95 backdrop-blur-md">
      <div className="mx-auto flex h-15 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          className="group flex items-center gap-3 rounded-lg p-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          <span className="flex h-8.5 w-8.5 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs transition group-hover:bg-blue-500">
            <Factory className="h-4 w-4" />
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-base font-bold tracking-tight text-white">Ricoz</span>
            <span className="rounded border border-slate-700 bg-slate-800/90 px-1.5 py-0.2 text-[9px] font-mono font-semibold text-slate-200">
              ERP
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-300">
          <Link
            href="#capabilities"
            className="transition hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-400 rounded py-1 px-1.5"
          >
            Capabilities
          </Link>
          <Link
            href="#modules"
            className="transition hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-400 rounded py-1 px-1.5"
          >
            Modules
          </Link>
          <Link
            href="#workflow"
            className="transition hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-400 rounded py-1 px-1.5"
          >
            Operations Workflow
          </Link>
          <Link
            href="/info"
            className="transition hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-400 rounded py-1 px-1.5"
          >
            System Specs
          </Link>
        </nav>

        {/* Desktop Auth CTAs & Status Pill */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-mono font-medium text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>OPS ONLINE</span>
          </div>

          <div className="h-4 w-px bg-slate-800" />

          <Link
            href="/login"
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-[#121826] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition duration-150 hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <span>Launch Platform</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="rounded-lg border border-slate-700 bg-[#121826] p-2 text-slate-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-800 bg-[#090d16] px-4 py-4 md:hidden space-y-3">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-slate-300">
            <Link
              href="#capabilities"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-white"
            >
              Capabilities
            </Link>
            <Link
              href="#modules"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-white"
            >
              Modules
            </Link>
            <Link
              href="#workflow"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-white"
            >
              Operations Workflow
            </Link>
            <Link
              href="/info"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-white"
            >
              System Specs
            </Link>
          </nav>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 text-xs font-medium text-slate-200 border border-slate-700 rounded-lg hover:bg-[#121826]"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500"
            >
              Launch Platform
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
