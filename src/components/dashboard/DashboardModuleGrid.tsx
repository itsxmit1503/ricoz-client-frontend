"use client";

import {
  Activity,
  ArrowRight,
  Boxes,
  CheckCircle2,
  Clock,
  Cpu,
  FileSpreadsheet,
  FileText,
  Gauge,
  Layers,
  Package,
  ShieldAlert,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

interface CompactModuleProps {
  title: string;
  tag: string;
  description: string;
  href: string;
  icon: LucideIcon;
  actionText?: string;
}

function CompactModule({
  title,
  tag,
  description,
  href,
  icon: Icon,
  actionText = "Open",
}: CompactModuleProps) {
  return (
    <div className="group relative flex flex-col justify-between rounded-lg border border-slate-800 bg-[#0d1320] p-4 transition-all duration-150 hover:border-blue-500/60 hover:bg-[#12192a]">
      <div>
        <div className="flex items-center justify-between">
          <span className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-700/60 bg-[#151c2d] text-blue-400 group-hover:text-blue-300 transition-colors">
            <Icon className="h-4 w-4" />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
            {tag}
          </span>
        </div>
        <h3 className="mt-3 text-xs sm:text-sm font-semibold text-slate-100 group-hover:text-white transition-colors">
          {title}
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-slate-400">
          {description}
        </p>
      </div>

      <div className="mt-3.5 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-xs font-medium text-blue-400 hover:text-blue-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-400 rounded py-0.5"
        >
          <span>{actionText}</span>
          <ArrowRight className="h-3 w-3 transition-transform duration-150 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}

export default function DashboardModuleGrid() {
  return (
    <div className="space-y-6">
      {/* SECTION 1: Production & Shop-Floor Execution */}
      <div className="rounded-xl border border-slate-800 bg-[#0a0f1c] p-4 sm:p-5">
        <div className="flex flex-col gap-1 border-b border-slate-800 pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200">
              Shop Floor & Production Execution
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Batch routing, manufacturing orders, and workstation operations
          </span>
        </div>

        <div className="mt-4 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          <CompactModule
            title="Production Work Orders"
            tag="WO-MGMT"
            description="Track batch progress, manage order schedules, and log completed parts versus scrap counts."
            href="/production/work-orders"
            icon={FileText}
            actionText="View Work Orders"
          />
          <CompactModule
            title="Production Plans"
            tag="MRP-SCHEDULE"
            description="Establish manufacturing schedules, set target delivery windows, and release work to lines."
            href="/production/plans"
            icon={Clock}
            actionText="View Plans"
          />
          <CompactModule
            title="Operation Execution"
            tag="STATION-EXEC"
            description="Monitor line workstations, advance manufacturing routing steps, and log cycle times."
            href="/production/operations"
            icon={Activity}
            actionText="View Operations"
          />
        </div>
      </div>

      {/* SECTION 2: Equipment & Reliability */}
      <div className="rounded-xl border border-slate-800 bg-[#0a0f1c] p-4 sm:p-5">
        <div className="flex flex-col gap-1 border-b border-slate-800 pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200">
              Equipment Fleet & Maintenance
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Machine telemetry, maintenance work orders, and equipment availability
          </span>
        </div>

        <div className="mt-4 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          <CompactModule
            title="Machine Registry"
            tag="FLEET-STATUS"
            description="Inspect active machines, operational states, rated capacities, and maintenance schedules."
            href="/machines"
            icon={Cpu}
            actionText="Fleet Registry"
          />
          <CompactModule
            title="Equipment Telemetry"
            tag="IOT-METRICS"
            description="Deep-dive machine telemetry, runtime hours, operational logs, and sensor diagnostics."
            href="/machines/details"
            icon={Gauge}
            actionText="Sensor Details"
          />
          <CompactModule
            title="Maintenance Orders"
            tag="PM-REPAIR"
            description="Schedule preventive maintenance, track repair work orders, and avoid downtime."
            href="/maintenance/work-orders"
            icon={Wrench}
            actionText="Work Orders"
          />
        </div>
      </div>

      {/* SECTION 3: Materials, Inventory & Procurement */}
      <div className="rounded-xl border border-slate-800 bg-[#0a0f1c] p-4 sm:p-5">
        <div className="flex flex-col gap-1 border-b border-slate-800 pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200">
              Inventory & Supply Chain
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Warehouse stock levels, supplier accounts, and purchase order tracking
          </span>
        </div>

        <div className="mt-4 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          <CompactModule
            title="Stock Inventory"
            tag="WMS-STOCK"
            description="Manage raw materials, components, finished goods, and monitor reorder thresholds."
            href="/inventory/stock"
            icon={Boxes}
            actionText="Inventory Stock"
          />
          <CompactModule
            title="Purchase Orders"
            tag="PURCH-MGMT"
            description="Track supplier purchase orders, delivery statuses, unit costs, and lot quantities."
            href="/purchase/orders"
            icon={ShoppingCart}
            actionText="Purchase Orders"
          />
          <CompactModule
            title="Supplier Accounts"
            tag="SRM-VENDOR"
            description="Maintain certified supplier directories, lead-time ratings, and vendor agreements."
            href="/suppliers"
            icon={Truck}
            actionText="Supplier List"
          />
        </div>
      </div>

      {/* SECTION 4: Engineering & Quality Assurance */}
      <div className="rounded-xl border border-slate-800 bg-[#0a0f1c] p-4 sm:p-5">
        <div className="flex flex-col gap-1 border-b border-slate-800 pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200">
              Engineering & Quality Assurance
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Multi-level bills of materials, master product catalog, and quality compliance
          </span>
        </div>

        <div className="mt-4 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          <CompactModule
            title="Bills of Materials"
            tag="ENG-BOM"
            description="Multi-tier BOM recipes, component requirements, and revision controls."
            href="/bom"
            icon={Layers}
            actionText="BOM Structures"
          />
          <CompactModule
            title="Product Catalog"
            tag="PLM-PRODUCTS"
            description="Master catalog of manufactured parts, SKUs, specifications, and drawing links."
            href="/products"
            icon={Package}
            actionText="Product Catalog"
          />
          <CompactModule
            title="Quality Issues"
            tag="QA-CAPA"
            description="Log non-conformances, quarantine suspect batches, and record corrective actions."
            href="/quality/issues"
            icon={ShieldAlert}
            actionText="Quality Issues"
          />
          <CompactModule
            title="Inspection Logs"
            tag="QC-INSPECT"
            description="Dimension tolerances, material test certifications, and lot compliance records."
            href="/quality/details"
            icon={ShieldCheck}
            actionText="Inspection Logs"
          />
        </div>
      </div>
    </div>
  );
}
