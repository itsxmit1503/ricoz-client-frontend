"use client";

import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Factory,
  Gauge,
  ShieldCheck,
  Wrench,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type CockpitTab = "execution" | "equipment" | "quality";

export default function LandingHero() {
  const [activeTab, setActiveTab] = useState<CockpitTab>("execution");

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-20">
      {/* Precision industrial grid background with clean falloff */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-15"
        style={{
          backgroundImage:
            "linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)",
          backgroundSize: "3rem 3rem",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 0%, #000 70%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 0%, #000 70%, transparent 100%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top: Asymmetric Hero Grid */}
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Column (7 cols): Editorial Manifesto */}
          <div className="lg:col-span-7">
            {/* Live Operational Status Capsule */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-slate-700 bg-[#0d1320] px-3.5 py-1.5 text-xs font-mono text-slate-200 shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
              </span>
              <span className="text-blue-400 font-bold">RCZ-OS //</span>
              <span className="text-slate-200">INDUSTRIAL MANUFACTURING OS</span>
            </div>

            {/* Main Headline */}
            <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl sm:leading-[1.1]">
              The factory floor,{" "}
              <span className="text-blue-400">orchestrated.</span>
            </h1>

            {/* Distinctive Subtitle */}
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg sm:leading-relaxed">
              Ricoz unifies master production plans, workstation routing, machine telemetry,
              quality compliance, and multi-tier bills of materials into a singular industrial cockpit.
            </p>

            {/* Live Telemetry Chips in Text Flow */}
            <div className="mt-6 flex flex-wrap items-center gap-2.5 font-mono text-xs">
              <div className="inline-flex items-center gap-1.5 rounded-md border border-slate-800 bg-[#0c121e] px-2.5 py-1 text-slate-300">
                <Activity className="h-3.5 w-3.5 text-emerald-400" />
                <span>Station Telemetry: <strong className="text-white">12.4k RPM</strong></span>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-md border border-slate-800 bg-[#0c121e] px-2.5 py-1 text-slate-300">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
                <span>Tolerance Spec: <strong className="text-white">±0.005mm</strong></span>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-md border border-slate-800 bg-[#0c121e] px-2.5 py-1 text-slate-300">
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                <span>First-Pass Yield: <strong className="text-white">99.4%</strong></span>
              </div>
            </div>

            {/* Primary Action Array */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/sign-up"
                className="group inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-xs transition duration-150 hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                <span>Launch Ricoz Platform</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
              </Link>

              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-[#121826] px-5 py-3 text-sm font-semibold text-slate-200 transition duration-150 hover:border-slate-600 hover:bg-[#192135] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                <span>Sign In to Console</span>
              </Link>

              <Link
                href="#modules"
                className="inline-flex items-center gap-1.5 rounded-lg px-4 py-3 text-sm font-medium text-slate-300 transition duration-150 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                <span>Explore Capabilities ↓</span>
              </Link>
            </div>
          </div>

          {/* Right Column (5 cols): Cohesive Industrial Telemetry Constellation */}
          <div className="relative lg:col-span-5">
            <div className="relative mx-auto max-w-md space-y-3">
              {/* Card 1: Live Dispatch Card */}
              <div className="rounded-xl border border-slate-700/80 bg-[#0d1320] p-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      <Cpu className="h-3.5 w-3.5" />
                    </span>
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                        DISPATCH BATCH
                      </span>
                      <p className="text-xs font-bold text-white">WO-2026-084 // Housing Cast</p>
                    </div>
                  </div>
                  <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-blue-300">
                    IN PRODUCTION
                  </span>
                </div>

                <div className="mt-3 space-y-1.5">
                  <div className="flex justify-between font-mono text-xs">
                    <span className="text-slate-300">Yield Progress</span>
                    <span className="font-bold text-white">482 / 500 Units (96.4%)</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full rounded-full bg-blue-600" style={{ width: "96.4%" }} />
                  </div>
                  <div className="flex justify-between font-mono text-[11px] text-slate-400">
                    <span>Routing: CNC Station 01 → QC</span>
                    <span>Scrap Count: 3 Units</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Equipment Sensor Card */}
              <div className="rounded-xl border border-slate-700/80 bg-[#0d1320] p-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <Gauge className="h-3.5 w-3.5" />
                    </span>
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                        EQUIPMENT TELEMETRY
                      </span>
                      <p className="text-xs font-bold text-white">CNC Milling Cell 01 [MCH-004]</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse motion-reduce:animate-none" />
                    OPTIMAL
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="rounded-lg border border-slate-800 bg-[#080d17] p-2">
                    <span className="block text-[10px] text-slate-400">Spindle Speed</span>
                    <span className="text-white font-semibold">12,400 RPM</span>
                  </div>
                  <div className="rounded-lg border border-slate-800 bg-[#080d17] p-2">
                    <span className="block text-[10px] text-slate-400">Preventive Maintenance</span>
                    <span className="text-emerald-400 font-semibold">In 42 Run Hours</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Quality Compliance Radar Card */}
              <div className="rounded-xl border border-slate-700/80 bg-[#0d1320] p-4 shadow-xl">
                <div className="flex items-center justify-between font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-blue-400" />
                    <span className="text-slate-200 font-medium">BOM Hierarchy & QA Audit</span>
                  </div>
                  <span className="font-semibold text-emerald-400">0 Critical Defects</span>
                </div>
                <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono text-slate-300 border-t border-slate-800 pt-2">
                  <span>Target Spec: ±0.005mm</span>
                  <span className="text-blue-300 font-medium">18 Sub-Assemblies Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle: Interactive "Factory Twin" Cockpit */}
        <div id="capabilities" className="mt-14 scroll-mt-20 rounded-2xl border border-slate-800 bg-[#0c111e] p-5 sm:p-7 shadow-xl">
          {/* Cockpit Mode Switcher Bar */}
          <div className="flex flex-col gap-4 border-b border-slate-800 pb-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
                <Factory className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold tracking-tight text-white">
                    Ricoz Factory Twin Cockpit
                  </h2>
                  <span className="rounded border border-blue-500/30 bg-blue-500/10 px-1.5 py-0.2 font-mono text-[9px] font-semibold text-blue-300">
                    INTERACTIVE CONTROLLER
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Select an operational mode to inspect real shop-floor parameters.
                </p>
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex flex-wrap gap-1.5 rounded-lg border border-slate-800 bg-[#080d17] p-1 font-mono text-xs">
              <button
                type="button"
                onClick={() => setActiveTab("execution")}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition ${
                  activeTab === "execution"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Cpu className="h-3.5 w-3.5" />
                <span>01 // Execution</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("equipment")}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition ${
                  activeTab === "equipment"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Wrench className="h-3.5 w-3.5" />
                <span>02 // Equipment</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("quality")}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition ${
                  activeTab === "quality"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>03 // Quality</span>
              </button>
            </div>
          </div>

          {/* Dynamic Cockpit Content */}
          <div className="mt-5">
            {activeTab === "execution" && (
              <div className="grid gap-4 lg:grid-cols-3">
                {/* Batch Status */}
                <div className="rounded-xl border border-slate-800 bg-[#080d17] p-4">
                  <span className="font-mono text-[10px] text-blue-400 uppercase tracking-wider font-semibold">
                    Work Order Queue
                  </span>
                  <p className="mt-1 text-sm font-semibold text-white">WO-2026-084 // Housing Assembly</p>
                  <p className="text-xs text-slate-300">Station 01: High-Speed CNC</p>
                  <div className="mt-3 space-y-1 font-mono text-xs">
                    <div className="flex justify-between text-slate-200">
                      <span>Batch Completed</span>
                      <span className="text-white font-bold">482 / 500 (96.4%)</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: "96.4%" }} />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-slate-800 pt-2 text-[11px] font-mono text-slate-300">
                    <span>Target Finish: 17:30</span>
                    <span className="text-emerald-400 font-semibold">On Schedule</span>
                  </div>
                </div>

                {/* Production Plan Dispatch */}
                <div className="rounded-xl border border-slate-800 bg-[#080d17] p-4">
                  <span className="font-mono text-[10px] text-blue-400 uppercase tracking-wider font-semibold">
                    Master Plan Schedule
                  </span>
                  <p className="mt-1 text-sm font-semibold text-white">PLAN-Q4-LINE-02</p>
                  <p className="text-xs text-slate-300">Target Output: 12,000 Units / Week</p>
                  <div className="mt-3 space-y-2 text-xs">
                    <div className="flex items-center justify-between rounded-lg bg-[#0e1422] p-2 border border-slate-800">
                      <span className="text-slate-300">Active Station Work Orders</span>
                      <span className="font-mono font-semibold text-white">6 Released</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-[#0e1422] p-2 border border-slate-800">
                      <span className="text-slate-300">Scrap Variance</span>
                      <span className="font-mono font-semibold text-emerald-400">-0.12% Below Budget</span>
                    </div>
                  </div>
                </div>

                {/* Operation Execution */}
                <div className="rounded-xl border border-slate-800 bg-[#080d17] p-4">
                  <span className="font-mono text-[10px] text-blue-400 uppercase tracking-wider font-semibold">
                    Routing Sequence
                  </span>
                  <p className="mt-1 text-sm font-semibold text-white">Step 03 // Precision Finish</p>
                  <p className="text-xs text-slate-300">Operator: Station Cell Alpha</p>
                  <div className="mt-3 space-y-1.5 text-xs font-mono">
                    <div className="flex items-center gap-2 text-slate-200">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Step 01: Raw Ingot Staging [Complete]</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-200">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Step 02: CNC Primary Face [Complete]</span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-300 font-semibold">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                      <span>Step 03: Optical Inspection [In Progress]</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "equipment" && (
              <div className="grid gap-4 lg:grid-cols-3">
                {/* Machine Diagnostics */}
                <div className="rounded-xl border border-slate-800 bg-[#080d17] p-4">
                  <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-wider font-semibold">
                    Operating State
                  </span>
                  <p className="mt-1 text-sm font-semibold text-white">CNC Milling Cell 01 (MCH-004)</p>
                  <p className="text-xs text-slate-300">Status: Running at full capacity</p>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="rounded-lg bg-[#0e1422] p-2 border border-slate-800">
                      <span className="text-[10px] text-slate-400">Spindle Speed</span>
                      <span className="block font-semibold text-white">12,400 RPM</span>
                    </div>
                    <div className="rounded-lg bg-[#0e1422] p-2 border border-slate-800">
                      <span className="text-[10px] text-slate-400">Bearing Temp</span>
                      <span className="block font-semibold text-emerald-400">42°C Normal</span>
                    </div>
                  </div>
                </div>

                {/* Maintenance Work Orders */}
                <div className="rounded-xl border border-slate-800 bg-[#080d17] p-4">
                  <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-wider font-semibold">
                    Maintenance Queue
                  </span>
                  <p className="mt-1 text-sm font-semibold text-white">MWO-2026-019 // Hydraulic Flush</p>
                  <p className="text-xs text-slate-300">Type: Preventative Maintenance</p>
                  <div className="mt-3 space-y-2 text-xs">
                    <div className="flex items-center justify-between rounded-lg bg-[#0e1422] p-2 border border-slate-800">
                      <span className="text-slate-300">Run Hours Logged</span>
                      <span className="font-mono text-white">1,248 / 1,500 Hrs</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-[#0e1422] p-2 border border-slate-800">
                      <span className="text-slate-300">Scheduled Trigger</span>
                      <span className="font-mono text-blue-300 font-semibold">In 42 Run Hours</span>
                    </div>
                  </div>
                </div>

                {/* Machine Fleet Registry */}
                <div className="rounded-xl border border-slate-800 bg-[#080d17] p-4">
                  <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-wider font-semibold">
                    Fleet Utilization
                  </span>
                  <p className="mt-1 text-sm font-semibold text-white">14 Registered Workstations</p>
                  <p className="text-xs text-slate-300">Active Line Utilization Rate</p>
                  <div className="mt-3 space-y-1.5 font-mono text-xs">
                    <div className="flex justify-between text-slate-200">
                      <span>Overall Equipment Effectiveness</span>
                      <span className="text-emerald-400 font-bold">98.8% OEE</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: "98.8%" }} />
                    </div>
                  </div>
                  <div className="mt-3 border-t border-slate-800 pt-2 text-[11px] font-mono text-slate-300">
                    12 Active • 2 Maintenance Reserved
                  </div>
                </div>
              </div>
            )}

            {activeTab === "quality" && (
              <div className="grid gap-4 lg:grid-cols-3">
                {/* Tolerance & Specifications */}
                <div className="rounded-xl border border-slate-800 bg-[#080d17] p-4">
                  <span className="font-mono text-[10px] text-blue-400 uppercase tracking-wider font-semibold">
                    Inspection Checkpoints
                  </span>
                  <p className="mt-1 text-sm font-semibold text-white">BOM Formulation P-10024</p>
                  <p className="text-xs text-slate-300">Optical CMM Automated Verification</p>
                  <div className="mt-3 space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between rounded-lg bg-[#0e1422] p-2 border border-slate-800">
                      <span className="text-slate-300">Tolerance Window</span>
                      <span className="text-blue-300 font-semibold">±0.005 mm</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-[#0e1422] p-2 border border-slate-800">
                      <span className="text-slate-300">Deviation Mean</span>
                      <span className="text-emerald-400 font-semibold">+0.0008 mm</span>
                    </div>
                  </div>
                </div>

                {/* Quality Defect Log */}
                <div className="rounded-xl border border-slate-800 bg-[#080d17] p-4">
                  <span className="font-mono text-[10px] text-blue-400 uppercase tracking-wider font-semibold">
                    Defect Classification
                  </span>
                  <p className="mt-1 text-sm font-semibold text-white">Zero Critical Defects</p>
                  <p className="text-xs text-slate-300">Audit Pass Rate: 99.4%</p>
                  <div className="mt-3 space-y-2 text-xs">
                    <div className="flex items-center justify-between rounded-lg bg-[#0e1422] p-2 border border-slate-800">
                      <span className="text-slate-300">Critical / Functional</span>
                      <span className="font-mono text-emerald-400 font-bold">0 Logged</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-[#0e1422] p-2 border border-slate-800">
                      <span className="text-slate-300">Minor Surface Blemish</span>
                      <span className="font-mono text-slate-300">3 Flagged & Quarantined</span>
                    </div>
                  </div>
                </div>

                {/* BOM Compliance */}
                <div className="rounded-xl border border-slate-800 bg-[#080d17] p-4">
                  <span className="font-mono text-[10px] text-blue-400 uppercase tracking-wider font-semibold">
                    Multi-Level Traceability
                  </span>
                  <p className="mt-1 text-sm font-semibold text-white">18 Sub-Assemblies Verified</p>
                  <p className="text-xs text-slate-300">Lot & Batch Tracking Active</p>
                  <div className="mt-3 space-y-1.5 text-xs font-mono">
                    <div className="flex items-center gap-2 text-slate-200">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Material Certificate 3.1 Attached</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-200">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Heat Treat Temperature Stamp Valid</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-200">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Supplier Batch Linked [SUP-003]</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Disclosures & Architecture Ribbon */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 pt-4 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
              <span>PLATFORM ARCHITECTURE // INDUSTRIAL GRADE</span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-slate-300">
              <span><strong>4</strong> Domains</span>
              <span>•</span>
              <span><strong>13</strong> Modules</span>
              <span>•</span>
              <span><strong>23</strong> Compiled Routes</span>
              <span>•</span>
              <span><strong>100%</strong> Traceability</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
