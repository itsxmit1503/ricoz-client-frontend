"use client";

import {
  CheckCircle2,
  Cpu,
  Factory,
  Layers,
  ShieldCheck,
} from "lucide-react";
import type { ReactNode } from "react";

const capabilities = [
  {
    icon: Layers,
    title: "Production & Work Orders",
    desc: "Track manufacturing orders, monitor batch progress, and record scrap rates.",
  },
  {
    icon: Cpu,
    title: "Equipment Management",
    desc: "Monitor machine operational states, availability, and maintenance logs.",
  },
  {
    icon: ShieldCheck,
    title: "Quality Assurance",
    desc: "Enforce inspection standards, log defect root causes, and maintain audit records.",
  },
];

export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="grid min-h-screen bg-slate-950 lg:grid-cols-12">
      {/* Left enterprise overview panel */}
      <aside className="relative hidden flex-col justify-between overflow-hidden border-r border-slate-800/80 bg-slate-950 p-10 lg:col-span-5 lg:flex xl:col-span-6 xl:p-14">
        {/* Brand header */}
        <div className="relative z-10 flex items-center gap-3.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
            <Factory className="h-5 w-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white">Ricoz</span>
              <span className="rounded border border-slate-700 bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-300">
                ERP
              </span>
            </div>
            <p className="text-xs font-normal text-slate-400">
              Manufacturing Operations
            </p>
          </div>
        </div>

        {/* Hero value statement & features */}
        <div className="relative z-10 my-10 max-w-lg space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-300">
              <span>Operations Platform</span>
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-100 sm:text-4xl">
              Operations management for modern manufacturing.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Coordinate work orders, equipment availability, inventory tracking, and quality assurance in one place.
            </p>
          </div>

          <div className="space-y-3">
            {capabilities.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="group flex items-start gap-3.5 rounded-lg border border-slate-800/80 bg-slate-900/40 p-3.5"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-slate-800 bg-slate-800 text-blue-400">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-slate-200">
                      {item.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-400 leading-normal">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Security & compliance footer */}
        <div className="relative z-10 flex items-center justify-between border-t border-slate-800/80 pt-6 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            Enterprise Security & Compliance
          </span>
          <span>© Ricoz Systems</span>
        </div>
      </aside>

      {/* Right authentication form container */}
      <main className="relative flex min-h-screen items-center justify-center px-4 py-12 sm:px-8 lg:col-span-7 xl:col-span-6">
        <div className="relative z-10 w-full max-w-md">
          {/* Mobile brand header */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
              <Factory className="h-5 w-5" />
            </span>
            <div>
              <span className="text-lg font-bold tracking-tight text-white">Ricoz</span>
              <span className="ml-2 rounded border border-slate-700 bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-300">
                ERP
              </span>
            </div>
          </div>

          {/* Form Card Surface */}
          <div className="ui-page-enter rounded-xl border border-slate-800 bg-slate-900/95 p-6 shadow-xl shadow-black/40 sm:p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-100">
                {title}
              </h1>
              {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
            </div>

            {children}

            {footer && (
              <div className="mt-6 border-t border-slate-800/80 pt-5 text-center text-xs text-slate-400">
                {footer}
              </div>
            )}
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">
            Protected by enterprise session authentication and TLS encryption.
          </p>
        </div>
      </main>
    </div>
  );
}
