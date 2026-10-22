
"use client";

import {
  ArrowLeft,
  Boxes,
  Code2,
  Info,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Boxes,
    title: "Business Modules",
    description:
      "Manage BOM, inventory, machines, maintenance, production, products, purchase, quality, and suppliers.",
  },
  {
    icon: ShieldCheck,
    title: "Authentication",
    description:
      "Authenticated access with login, logout, and session management.",
  },
  {
    icon: LayoutDashboard,
    title: "Centralized Dashboard",
    description:
      "Access application modules through a single, organized dashboard.",
  },
];

const technologies = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Lucide Icons",
  "Axios",
  "React Hot Toast",
];

export default function InfoPage() {
  return (
    <div className="ui-page-enter mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link
            href="/dashboard"
            className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-400 shadow-sm shadow-blue-950/20">
              <Info className="h-6 w-6" />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-blue-300/80">System Overview & Documentation</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-100">
                Application Information
              </h1>
              <p className="mt-0.5 text-sm text-slate-400">
                Architecture overview and business module directory
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-950/20 transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Link>
      </div>

      {/* Overview */}
      <section className="ui-section-enter rounded-2xl border border-slate-800/90 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/10 sm:p-8">
        <h2 className="text-lg font-semibold text-slate-100">
          About Our Application
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
          Welcome to our application management platform. It provides a
          centralized dashboard for accessing business modules, managing
          operational workflows, and navigating application features.
          The interface is designed to keep information organized and
          make everyday operations easier.
        </p>
      </section>

      {/* Features */}
      <section className="ui-section-enter">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Key Features
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="rounded-xl border border-slate-800/90 bg-slate-900/80 p-5 shadow-sm shadow-slate-950/10 transition hover:border-slate-700"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="font-medium text-slate-100">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Technology */}
      <section className="ui-section-enter rounded-2xl border border-slate-800/90 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/10 sm:p-7">
        <div className="flex items-center gap-2.5">
          <Code2 className="h-5 w-5 text-blue-400" />
          <h2 className="text-base font-semibold text-slate-100">
            Technology Stack
          </h2>
        </div>
        <p className="mt-1 text-xs text-slate-400">
          Verified client frameworks and dependencies powering the application.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-lg border border-slate-700/80 bg-slate-950/40 px-3 py-1.5 text-xs font-medium text-slate-300"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 pt-6 text-center text-xs text-slate-500">
        Ricoz ERP Platform • Application Information
      </footer>
    </div>
  );
}
