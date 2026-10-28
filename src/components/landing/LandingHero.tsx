"use client";

import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Factory,
  Gauge,
  Layers,
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
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-20 bg-[#06090f]">
      {/* Precision industrial technical grid background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)",
          backgroundSize: "3rem 3rem",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 0%, #000 70%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 0%, #000 70%, transparent 100%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top: Asymmetric Hero Grid */}
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Column (7 cols): Editorial Manufacturing Manifesto */}
          <div className="lg:col-span-7 space-y-6">
            {/* Live Operational Status Capsule */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-slate-700/80 bg-[#0b101c] px-3.5 py-1.5 text-xs font-mono text-slate-200 shadow-sm transition-all duration-150">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
              </span>
              <span className="text-blue-400 font-bold">RCZ-OS //</span>
              <span className="text-slate-100 font-semibold">ENTERPRISE MANUFACTURING OPERATING SYSTEM</span>
            </div>

            {/* Main Headline with High Visual Contrast */}
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl sm:leading-[1.1]">
              The factory floor,{" "}
              <span className="text-blue-400 underline decoration-blue-500/40 underline-offset-8">orchestrated.</span>
            </h1>

            {/* Distinctive Subtitle */}
            <p className="max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg sm:leading-relaxed">
              Ricoz unifies multi-line production scheduling, live machine telemetry, sub-millimeter quality control, and hierarchical bills of materials into a singular operational cockpit.
            </p>

            {/* Technical Manufacturing Credential Chips */}
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <div className="ui-pressable inline-flex items-center gap-1.5 rounded border border-slate-800 bg-[#0e1424] px-2.5 py-1 text-slate-300 hover:border-slate-700">
                <Activity className="h-3.5 w-3.5 text-emerald-400" />
                <span>Line Pace: <strong className="text-white">42s / Unit</strong></span>
              </div>
              <div className="ui-pressable inline-flex items-center gap-1.5 rounded border border-slate-800 bg-[#0e1424] px-2.5 py-1 text-slate-300 hover:border-slate-700">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
                <span>Tolerance: <strong className="text-white">±0.005mm</strong></span>
              </div>
              <div className="ui-pressable inline-flex items-center gap-1.5 rounded border border-slate-800 bg-[#0e1424] px-2.5 py-1 text-slate-300 hover:border-slate-700">
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                <span>Benchmark OEE: <strong className="text-white">92.8%</strong></span>
              </div>
            </div>

            {/* Primary Action Button Array */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/sign-up"
                className="ui-pressable group inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-blue-500 hover:shadow-blue-500/25 transition duration-150"
              >
                <span>Launch Ricoz Platform</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-1.5" />
              </Link>

              <Link
                href="/dashboard"
                className="ui-pressable inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-[#121826] px-5 py-3.5 text-sm font-semibold text-slate-200 shadow-xs hover:border-slate-600 hover:bg-slate-800 hover:text-white transition duration-150"
              >
                <span>Live Factory Cockpit</span>
              </Link>

              <a
                href="#capabilities"
                className="ui-pressable inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-slate-100 px-3 py-2 transition"
              >
                <span>Explore Workstations</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Right Column (5 cols): Live Machine Sensory Console Widget */}
          <div className="lg:col-span-5">
            <div className="ui-hover-card rounded-xl border border-slate-800 bg-[#0b101c] shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 bg-[#080d17] px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                    Workcell Telemetry Console
                  </span>
                </div>
                <span className="font-mono text-[10px] text-blue-400 bg-blue-950/60 border border-blue-800/50 px-2 py-0.5 rounded">
                  DEMO WORKCELL // SIMULATED
                </span>
              </div>

              <div className="p-4 space-y-3.5">
                {/* Active Batch Order Status */}
                <div className="p-3.5 rounded-lg border border-slate-800 bg-[#080d17] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-white">WO-8821 // Impeller B7</span>
                    <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded">
                      IN CYCLE (78%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full transition-all duration-700" style={{ width: "78%" }} />
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>Target: 1,200 Units</span>
                    <span className="text-slate-300">Scrap Rate: 0.08%</span>
                  </div>
                </div>

                {/* Spindle Load & Temperature Telemetry Strip */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="rounded-lg border border-slate-800 bg-[#080d17] p-3 hover:bg-[#0c1322] transition-colors">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Spindle RPM</span>
                    <span className="text-white text-base font-black">12,400</span>
                    <span className="text-[10px] text-emerald-400 block mt-0.5">84% rated load</span>
                  </div>
                  <div className="rounded-lg border border-slate-800 bg-[#080d17] p-3 hover:bg-[#0c1322] transition-colors">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Thermal Index</span>
                    <span className="text-white text-base font-black">48.2°C</span>
                    <span className="text-[10px] text-emerald-400 block mt-0.5">Within ±2°C envelope</span>
                  </div>
                </div>

                {/* Real-Time Machine Sensory Readout */}
                <div className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-[#080d17] text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-blue-400" />
                    <span className="text-slate-300">Hydraulic Pressure</span>
                  </div>
                  <span className="text-white font-bold">210.4 Bar</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle: Interactive "Factory Twin" Cockpit Section */}
        <div id="capabilities" className="mt-16 scroll-mt-20 border border-slate-800/90 bg-[#0b101c] rounded-xl overflow-hidden shadow-2xl">
          {/* Cockpit Mode Switcher Bar */}
          <div className="flex flex-col gap-4 border-b border-slate-800/80 bg-[#080d17] p-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
                <Factory className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold tracking-tight text-white uppercase">
                    Ricoz Factory Digital Twin Cockpit
                  </h2>
                  <span className="rounded border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-blue-300">
                    SIMULATOR ACTIVE
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Select an operational mode to inspect real-time shop-floor parameters.
                </p>
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex flex-wrap gap-1.5 rounded-lg border border-slate-800 bg-[#06090f] p-1 font-mono text-xs">
              <button
                type="button"
                onClick={() => setActiveTab("execution")}
                className={`ui-pressable flex items-center gap-1.5 rounded-md px-3.5 py-1.5 font-bold transition-all duration-150 ${
                  activeTab === "execution"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <Cpu className="h-3.5 w-3.5" />
                <span>01 // Floor Execution</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("equipment")}
                className={`ui-pressable flex items-center gap-1.5 rounded-md px-3.5 py-1.5 font-bold transition-all duration-150 ${
                  activeTab === "equipment"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <Wrench className="h-3.5 w-3.5" />
                <span>02 // Plant Equipment</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("quality")}
                className={`ui-pressable flex items-center gap-1.5 rounded-md px-3.5 py-1.5 font-bold transition-all duration-150 ${
                  activeTab === "quality"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>03 // Metrology & QA</span>
              </button>
            </div>
          </div>

          {/* Dynamic Cockpit Content with Smooth Tab Transitions */}
          <div className="p-5 sm:p-6 min-h-[220px]">
            {activeTab === "execution" && (
              <div key="execution" className="ui-tab-fade grid gap-4 lg:grid-cols-3">
                {/* Batch Status */}
                <div className="ui-hover-card rounded-lg border border-slate-800 bg-[#080d17] p-4 space-y-2">
                  <span className="font-mono text-[10px] text-blue-400 uppercase tracking-wider font-bold">
                    Work Order Queue
                  </span>
                  <p className="text-sm font-bold text-white">WO-8821 // Turbine Impeller B7</p>
                  <p className="text-xs text-slate-300">Station 01: 5-Axis Vertical Milling Center</p>
                  <div className="space-y-1.5 text-xs font-mono pt-1">
                    <div className="flex justify-between text-slate-300">
                      <span>Batch Completed</span>
                      <span className="font-bold text-blue-400">936 / 1,200 Units (78%)</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: "78%" }} />
                    </div>
                  </div>
                </div>

                {/* Material Stock */}
                <div className="ui-hover-card rounded-lg border border-slate-800 bg-[#080d17] p-4 space-y-2">
                  <span className="font-mono text-[10px] text-blue-400 uppercase tracking-wider font-bold">
                    BOM Allocation
                  </span>
                  <p className="text-sm font-bold text-white">Inconel 718 Round Bar (60mm)</p>
                  <p className="text-xs text-slate-300">Lot: LOT-2026-X12 • Bin: A3-04</p>
                  <div className="space-y-2 text-xs font-mono pt-1">
                    <div className="flex items-center justify-between rounded bg-[#0e1422] p-2 border border-slate-800">
                      <span className="text-slate-300">Reserved For Order</span>
                      <span className="font-bold text-white">480 kg</span>
                    </div>
                    <div className="flex items-center justify-between rounded bg-[#0e1422] p-2 border border-slate-800">
                      <span className="text-slate-300">Warehouse Balance</span>
                      <span className="font-bold text-emerald-400">1,240 kg (Sufficient)</span>
                    </div>
                  </div>
                </div>

                {/* Real-time Operation Step */}
                <div className="ui-hover-card rounded-lg border border-slate-800 bg-[#080d17] p-4 space-y-2">
                  <span className="font-mono text-[10px] text-blue-400 uppercase tracking-wider font-bold">
                    Routing Stage
                  </span>
                  <p className="text-sm font-bold text-white">Step 03 // Precision Finish</p>
                  <p className="text-xs text-slate-300">Operator: Station Cell Alpha</p>
                  <div className="space-y-1.5 text-xs font-mono pt-1">
                    <div className="flex items-center gap-2 text-slate-200">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Step 01: Raw Ingot Staging [Passed]</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-200">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Step 02: CNC Primary Face [Passed]</span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-300 font-bold">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                      <span>Step 03: Optical Inspection [Active]</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "equipment" && (
              <div key="equipment" className="ui-tab-fade grid gap-4 lg:grid-cols-3">
                {/* Machine Diagnostics */}
                <div className="ui-hover-card rounded-lg border border-slate-800 bg-[#080d17] p-4 space-y-2">
                  <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-wider font-bold">
                    Operating State
                  </span>
                  <p className="text-sm font-bold text-white">CNC Milling Cell 01 (MCH-004)</p>
                  <p className="text-xs text-slate-300">Status: Running at full capacity</p>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                    <div className="rounded bg-[#0e1422] p-2 border border-slate-800">
                      <span className="text-[10px] text-slate-400">Spindle Speed</span>
                      <span className="block font-bold text-white">12,400 RPM</span>
                    </div>
                    <div className="rounded bg-[#0e1422] p-2 border border-slate-800">
                      <span className="text-[10px] text-slate-400">Bearing Temp</span>
                      <span className="block font-bold text-emerald-400">42°C Normal</span>
                    </div>
                  </div>
                </div>

                {/* Maintenance Work Orders */}
                <div className="ui-hover-card rounded-lg border border-slate-800 bg-[#080d17] p-4 space-y-2">
                  <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-wider font-bold">
                    Maintenance Queue
                  </span>
                  <p className="text-sm font-bold text-white">MWO-2026-019 // Hydraulic Flush</p>
                  <p className="text-xs text-slate-300">Type: Preventative Maintenance</p>
                  <div className="space-y-2 text-xs pt-1">
                    <div className="flex items-center justify-between rounded bg-[#0e1422] p-2 border border-slate-800">
                      <span className="text-slate-300">Run Hours Logged</span>
                      <span className="font-mono text-white font-bold">1,248 / 1,500 Hrs</span>
                    </div>
                    <div className="flex items-center justify-between rounded bg-[#0e1422] p-2 border border-slate-800">
                      <span className="text-slate-300">Scheduled Trigger</span>
                      <span className="font-mono text-blue-300 font-bold">In 42 Run Hours</span>
                    </div>
                  </div>
                </div>

                {/* Machine Fleet Registry */}
                <div className="ui-hover-card rounded-lg border border-slate-800 bg-[#080d17] p-4 space-y-2">
                  <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-wider font-bold">
                    Fleet Utilization
                  </span>
                  <p className="text-sm font-bold text-white">15 Registered Workstations</p>
                  <p className="text-xs text-slate-300">Plant Line Utilization Rate</p>
                  <div className="space-y-1.5 font-mono text-xs pt-1">
                    <div className="flex justify-between text-slate-200">
                      <span>Overall Equipment Effectiveness</span>
                      <span className="text-emerald-400 font-bold">92.8% OEE</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: "92.8%" }} />
                    </div>
                  </div>
                  <div className="border-t border-slate-800 pt-2 text-[11px] font-mono text-slate-300">
                    14 Active • 1 Calibration Staged
                  </div>
                </div>
              </div>
            )}

            {activeTab === "quality" && (
              <div key="quality" className="ui-tab-fade grid gap-4 lg:grid-cols-3">
                {/* Tolerance & Specifications */}
                <div className="ui-hover-card rounded-lg border border-slate-800 bg-[#080d17] p-4 space-y-2">
                  <span className="font-mono text-[10px] text-blue-400 uppercase tracking-wider font-bold">
                    Inspection Checkpoints
                  </span>
                  <p className="text-sm font-bold text-white">BOM Formulation P-10024</p>
                  <p className="text-xs text-slate-300">Optical CMM Automated Verification</p>
                  <div className="space-y-2 text-xs font-mono pt-1">
                    <div className="flex items-center justify-between rounded bg-[#0e1422] p-2 border border-slate-800">
                      <span className="text-slate-300">Tolerance Window</span>
                      <span className="text-blue-300 font-bold">±0.005 mm</span>
                    </div>
                    <div className="flex items-center justify-between rounded bg-[#0e1422] p-2 border border-slate-800">
                      <span className="text-slate-300">Deviation Mean</span>
                      <span className="text-emerald-400 font-bold">+0.0008 mm</span>
                    </div>
                  </div>
                </div>

                {/* Quality Defect Log */}
                <div className="ui-hover-card rounded-lg border border-slate-800 bg-[#080d17] p-4 space-y-2">
                  <span className="font-mono text-[10px] text-blue-400 uppercase tracking-wider font-bold">
                    Defect Classification
                  </span>
                  <p className="text-sm font-bold text-white">Zero Critical Defects</p>
                  <p className="text-xs text-slate-300">Audit Pass Rate: 99.1%</p>
                  <div className="space-y-2 text-xs pt-1">
                    <div className="flex items-center justify-between rounded bg-[#0e1422] p-2 border border-slate-800">
                      <span className="text-slate-300">Critical / Functional</span>
                      <span className="font-mono text-emerald-400 font-bold">0 Logged</span>
                    </div>
                    <div className="flex items-center justify-between rounded bg-[#0e1422] p-2 border border-slate-800">
                      <span className="text-slate-300">Minor Surface Blemish</span>
                      <span className="font-mono text-slate-300">2 Flagged & Quarantined</span>
                    </div>
                  </div>
                </div>

                {/* BOM Compliance */}
                <div className="ui-hover-card rounded-lg border border-slate-800 bg-[#080d17] p-4 space-y-2">
                  <span className="font-mono text-[10px] text-blue-400 uppercase tracking-wider font-bold">
                    Multi-Level Traceability
                  </span>
                  <p className="text-sm font-bold text-white">18 Sub-Assemblies Verified</p>
                  <p className="text-xs text-slate-300">Lot & Batch Tracking Active</p>
                  <div className="space-y-1.5 text-xs font-mono pt-1">
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
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/80 bg-[#080d17] px-5 py-3.5 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
              <span className="text-slate-300 font-bold">PLATFORM ARCHITECTURE // INDUSTRIAL GRADE</span>
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
