"use client";

import {
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Network,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

const stages = [
  {
    step: "01",
    phase: "PHASE 01 // SOURCING",
    title: "BOM Formulation & Sourcing",
    subtitle: "Establish material recipes and component tree",
    icon: Network,
    description:
      "Construct multi-level Bills of Materials (BOM), calculate material ratios, register verified suppliers, and issue automated replenishment purchase orders.",
    deliverable: "Verified BOM & Supplier Contracts",
    badgeColor: "border-blue-500/30 bg-blue-500/10 text-blue-300",
    stats: "18 Sub-Assemblies • 100% Traceability",
  },
  {
    step: "02",
    phase: "PHASE 02 // PLANNING",
    title: "Master Production Planning",
    subtitle: "Allocate station capacity and line targets",
    icon: CalendarClock,
    description:
      "Build high-level production plans, sequence target completion windows, and convert forecasted demands into executable station work orders.",
    deliverable: "Released Work Orders & Line Schedules",
    badgeColor: "border-blue-500/30 bg-blue-500/10 text-blue-300",
    stats: "Capacity Allocated • Batch Priorities Set",
  },
  {
    step: "03",
    phase: "PHASE 03 // EXECUTION",
    title: "Shop-Floor Operation Execution",
    subtitle: "Real-time dispatch and station monitoring",
    icon: ClipboardList,
    description:
      "Route operator jobs through active machine cells. Monitor live cycle telemetry, track completed unit counts, and instantly log scrap variances.",
    deliverable: "Live Batch Yields & Scrap Tally",
    badgeColor: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    stats: "99.4% Batch Yield • 12.4k RPM Monitored",
  },
  {
    step: "04",
    phase: "PHASE 04 // CLOSED-LOOP QA",
    title: "Quality Feedback & Tolerance Audit",
    subtitle: "Automated inspection and closed-loop learning",
    icon: ShieldCheck,
    description:
      "Verify parts against micron-level CMM optical tolerances. Quarantined defect root causes feed back directly into BOM and machine maintenance revisions.",
    deliverable: "ISO-Grade Audit Trail & Yield Feedback",
    badgeColor: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    stats: "±0.005mm Tolerance • Feeds Back to Phase 01",
  },
];

export default function LandingWorkflow() {
  const [activeStage, setActiveStage] = useState(0);

  return (
    <section id="workflow" className="relative py-16 md:py-20 border-t border-slate-800 bg-[#090d16]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-[#0d1320] px-3.5 py-1 text-xs font-mono text-blue-400">
            <RefreshCw className="h-3 w-3 animate-spin motion-reduce:animate-none" />
            <span>CLOSED-LOOP MANUFACTURING PIPELINE</span>
          </div>
          <h2 className="mt-3.5 text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
            From raw ingot to finished delivery.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
            A continuous four-stage operating cycle where quality telemetry feeds directly back
            into BOM formulations and scheduling optimization.
          </p>
        </div>

        {/* Interactive Cycle Stage Selector Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {stages.map((stage, idx) => {
            const Icon = stage.icon;
            const isSelected = activeStage === idx;
            return (
              <button
                key={stage.step}
                type="button"
                onClick={() => setActiveStage(idx)}
                className={`text-left p-4 rounded-xl border transition-all duration-150 ${
                  isSelected
                    ? "border-blue-500 bg-[#162136] shadow-sm"
                    : "border-slate-800 bg-[#0c111e] hover:border-slate-700 hover:bg-[#121826]"
                }`}
              >
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className={isSelected ? "text-blue-300 font-bold" : "text-slate-400"}>
                    {stage.step}
                  </span>
                  <Icon className={`h-4 w-4 ${isSelected ? "text-blue-300" : "text-slate-400"}`} />
                </div>
                <p className="mt-2 text-sm font-bold text-white truncate">
                  {stage.title}
                </p>
                <span className="mt-1 block text-[11px] text-slate-400 truncate">
                  {stage.subtitle}
                </span>
              </button>
            );
          })}
        </div>

        {/* Detailed Stage Deep-Dive Display Card */}
        <div className="rounded-xl border border-slate-800 bg-[#0c111e] p-6 sm:p-8 shadow-xl">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            {/* Left Col (7 cols): Stage Overview & Description */}
            <div className="lg:col-span-7">
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-xs font-mono font-medium ${stages[activeStage].badgeColor}`}>
                {stages[activeStage].phase}
              </span>

              <h3 className="mt-3 text-xl sm:text-2xl font-bold tracking-tight text-white">
                {stages[activeStage].title}
              </h3>

              <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-300">
                {stages[activeStage].description}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300 border-t border-slate-800 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span className="text-white font-medium">{stages[activeStage].deliverable}</span>
                </div>
                <span>•</span>
                <span className="text-blue-300">{stages[activeStage].stats}</span>
              </div>
            </div>

            {/* Right Col (5 cols): Interactive Closed-Loop Visual Matrix */}
            <div className="lg:col-span-5">
              <div className="rounded-xl border border-slate-800 bg-[#080d17] p-5 font-mono text-xs space-y-3">
                <div className="flex items-center justify-between text-slate-300 border-b border-slate-800 pb-2">
                  <span>STAGE TELEMETRY // REAL-TIME SYNC</span>
                  <span className="text-emerald-400 font-bold">ACTIVE</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center rounded-lg bg-[#0e1422] p-2.5 border border-slate-800">
                    <span className="text-slate-300">Current Phase</span>
                    <span className="font-bold text-white">{stages[activeStage].step} of 04</span>
                  </div>
                  <div className="flex justify-between items-center rounded-lg bg-[#0e1422] p-2.5 border border-slate-800">
                    <span className="text-slate-300">Feedback Continuity</span>
                    <span className="text-blue-300 font-bold">Closed-Loop Verified</span>
                  </div>
                  <div className="flex justify-between items-center rounded-lg bg-[#0e1422] p-2.5 border border-slate-800">
                    <span className="text-slate-300">Audit Compliance</span>
                    <span className="text-emerald-400 font-bold">ISO-9001 Schema Ready</span>
                  </div>
                </div>

                {/* Progress bar showing stage position */}
                <div className="pt-2">
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span>Sourcing (01)</span>
                    <span>Planning (02)</span>
                    <span>Execution (03)</span>
                    <span>QA Loop (04)</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-300"
                      style={{ width: `${((activeStage + 1) / 4) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
