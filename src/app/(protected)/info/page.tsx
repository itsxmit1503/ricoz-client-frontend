"use client";

import {
  ArrowLeft,
  Boxes,
  Code2,
  Cpu,
  Factory,
  FileText,
  Info,
  LayoutDashboard,
  Layers,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Factory,
    title: "Production Execution",
    description:
      "Convert manufacturing plans into shop-floor work orders, track batch cycle progress, and log scrap counts.",
  },
  {
    icon: Cpu,
    title: "Equipment & Telemetry",
    description:
      "Monitor machine availability, fleet status, IoT sensor telemetry, and scheduled preventive maintenance.",
  },
  {
    icon: Layers,
    title: "Multi-tier BOM",
    description:
      "Formulate recursive bills of materials, manage sub-assemblies, track unit consumption, and control revisions.",
  },
  {
    icon: Boxes,
    title: "Warehouse & Inventory",
    description:
      "Track raw materials, component stocks, finished goods, purchase orders, and certified supplier accounts.",
  },
  {
    icon: ShieldCheck,
    title: "Quality Assurance & CAPA",
    description:
      "Log non-conformances, inspect dimensional tolerances, and record audit trails with ISO-grade schemas.",
  },
  {
    icon: LayoutDashboard,
    title: "Industrial Command Center",
    description:
      "Centralized real-time overview of active work orders, plant health, fleet OEE, and live shop-floor priorities.",
  },
];

export default function InfoPage() {
  return (
    <div className="ui-page-enter mx-auto max-w-7xl space-y-6">
      {/* Header Deck */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            href="/dashboard"
            className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-[#121826] text-blue-400">
              <Info className="h-4 w-4" />
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Ricoz System Specifications & Architecture
              </h1>
              <p className="mt-0.5 text-xs sm:text-sm text-slate-300">
                Enterprise manufacturing operations platform overview and technical foundation.
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex min-h-9.5 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Link>
      </div>

      {/* Platform Overview */}
      <section className="rounded-xl border border-slate-800 bg-[#0c111e] p-6 sm:p-7 shadow-sm">
        <span className="font-mono text-xs uppercase tracking-wider text-blue-400 font-semibold">
          Platform Architecture
        </span>
        <h2 className="mt-1 text-lg sm:text-xl font-bold text-white">
          About Ricoz Manufacturing Operating System
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          Ricoz unifies master manufacturing schedules, workstation routing, equipment telemetry,
          quality compliance, and multi-tier bills of materials into a singular industrial cockpit.
          Designed for modern discrete manufacturing plants, the platform bridges the gap between ERP planning
          and physical shop-floor execution with zero lag and complete material traceability.
        </p>
      </section>

      {/* Core Operational Capabilities */}
      <section className="space-y-3.5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
          Core Operational Systems
        </h2>

        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="rounded-xl border border-slate-800 bg-[#0c111e] p-5 shadow-xs transition hover:border-slate-700"
              >
                <div className="mb-3.5 flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-[#121826] text-blue-400">
                  <Icon className="h-4.5 w-4.5" />
                </div>

                <h3 className="text-sm font-bold text-white">
                  {feature.title}
                </h3>

                <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Technology Foundation */}
      <section className="rounded-xl border border-slate-800 bg-[#0c111e] p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-blue-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Technology Foundation
          </h2>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 font-mono text-xs">
          {[
            "Next.js 16 (Turbopack)",
            "React 19",
            "TypeScript 5",
            "Tailwind CSS 4",
            "Clerk Enterprise Auth",
            "Lucide Industrial Icons",
            "Axios REST Client",
            "Strict WCAG Contrast",
          ].map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-slate-700 bg-[#121826] px-3 py-1.5 text-slate-200 font-medium"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 pt-4 text-center text-xs font-mono text-slate-400">
        Ricoz Manufacturing OS // Release 0.1.0 • Enterprise Edition
      </footer>
    </div>
  );
}
