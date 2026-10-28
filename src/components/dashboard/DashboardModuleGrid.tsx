"use client";

import {
  Activity,
  ArrowRight,
  Boxes,
  Cpu,
  FileSpreadsheet,
  FileText,
  Gauge,
  Layers,
  Package,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Wrench,
} from "lucide-react";
import Link from "next/link";

interface DomainRowProps {
  title: string;
  code: string;
  statusBadge: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

function DomainRow({ title, code, statusBadge, description, href, icon: Icon }: DomainRowProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col sm:flex-row sm:items-center justify-between p-3.5 hover:bg-[#121929] transition-colors gap-2"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700/80 bg-[#0d1320] text-blue-400 group-hover:text-white group-hover:border-blue-500/60 transition-colors shrink-0">
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
              {title}
            </span>
            <span className="font-mono text-[10px] text-slate-400 bg-slate-800/80 px-1.5 py-0.2 rounded">
              {code}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 truncate max-w-md mt-0.5">
            {description}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-center font-mono text-xs">
        <span className="text-[11px] text-slate-300 bg-[#090d16] border border-slate-800 px-2 py-0.5 rounded">
          {statusBadge}
        </span>
        <span className="text-blue-400 group-hover:translate-x-0.5 transition-transform">
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}

export default function DashboardModuleGrid() {
  return (
    <div className="border border-slate-800/90 bg-[#0b101c] rounded-xl overflow-hidden shadow-lg">
      <div className="px-5 py-4 border-b border-slate-800/80 bg-[#080d17] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Operations Console Directory (12 Workstations)
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Synchronized manufacturing execution, plant assets, inventory, and engineering specifications.
          </p>
        </div>
        <span className="font-mono text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded-full self-start sm:self-auto">
          ALL 4 DOMAINS ONLINE
        </span>
      </div>

      <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800/80">
        {/* Column 1: Shop Floor & Plant Equipment */}
        <div className="divide-y divide-slate-800/60">
          <div className="bg-[#0e1424] px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-blue-300 flex items-center justify-between">
            <span>Domain 1: Shop Floor Execution</span>
            <span className="font-mono text-[10px] text-slate-400">DISPATCH & WORK ORDERS</span>
          </div>

          <DomainRow
            title="Production Work Orders"
            code="WO-CORE"
            statusBadge="18 Active Orders"
            description="Manage batch runs, schedule line releases, and record completed vs scrap parts."
            href="/production/work-orders"
            icon={FileText}
          />
          <DomainRow
            title="Production Plans"
            code="PLAN-MRP"
            statusBadge="6 Staged Plans"
            description="High-level production schedule, shift targets, and multi-line capacity planning."
            href="/production/plans"
            icon={Layers}
          />
          <DomainRow
            title="Workstation Operations"
            code="OP-EXEC"
            statusBadge="42 Workstations"
            description="Machine-level operation dispatching, cycle timer logs, and operator assignments."
            href="/production/operations"
            icon={Activity}
          />

          <div className="bg-[#0e1424] px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-blue-300 flex items-center justify-between">
            <span>Domain 2: Equipment & Plant Assets</span>
            <span className="font-mono text-[10px] text-slate-400">FLEET TELEMETRY & PM</span>
          </div>

          <DomainRow
            title="Machine Fleet Directory"
            code="FLEET-01"
            statusBadge="15 Machines (93.3% Online)"
            description="Plant equipment registry, capacity limits, power consumption, and location tags."
            href="/machines"
            icon={Cpu}
          />
          <DomainRow
            title="Live Machine Telemetry"
            code="SENS-IO"
            statusBadge="Real-Time Feed"
            description="Spindle speeds, hydraulic pressure curves, temperature telemetry, and vibration."
            href="/machines/details"
            icon={Gauge}
          />
          <DomainRow
            title="Maintenance Work Orders"
            code="MAINT-PM"
            statusBadge="1 Scheduled PM"
            description="Preventive maintenance schedules, breakdown tickets, technician assignments."
            href="/maintenance/work-orders"
            icon={Wrench}
          />
        </div>

        {/* Column 2: Supply Chain & Engineering Specs */}
        <div className="divide-y divide-slate-800/60">
          <div className="bg-[#0e1424] px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-blue-300 flex items-center justify-between">
            <span>Domain 3: Supply Chain & Materials</span>
            <span className="font-mono text-[10px] text-slate-400">WAREHOUSE & REORDERS</span>
          </div>

          <DomainRow
            title="Inventory & Stock Balances"
            code="INV-BAL"
            statusBadge="248 SKUs (3 Low Buffer)"
            description="Warehouse balances, safety stock alerts, location bins, and reserved materials."
            href="/inventory/stock"
            icon={Boxes}
          />
          <DomainRow
            title="Supplier & Vendor Registry"
            code="VEND-MGMT"
            statusBadge="12 Active Suppliers"
            description="Certified vendor contacts, lead times, payment terms, and vendor quality ratings."
            href="/suppliers"
            icon={Truck}
          />
          <DomainRow
            title="Purchase Orders"
            code="PO-TRACK"
            statusBadge="4 Orders Staged"
            description="Raw material purchase orders, expected delivery dates, invoices, and line items."
            href="/purchase/orders"
            icon={ShoppingCart}
          />

          <div className="bg-[#0e1424] px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-blue-300 flex items-center justify-between">
            <span>Domain 4: Engineering & Quality Assurance</span>
            <span className="font-mono text-[10px] text-slate-400">BOM RECIPES & QA LAB</span>
          </div>

          <DomainRow
            title="Product Master Catalog"
            code="PART-CAT"
            statusBadge="36 Catalog Parts"
            description="Finished goods, sub-assemblies, raw stock codes, and engineering specifications."
            href="/products"
            icon={Package}
          />
          <DomainRow
            title="Bills of Materials (BOM)"
            code="BOM-SPEC"
            statusBadge="18 Active Recipes"
            description="Hierarchical part trees, component ratios, and manufacturing assembly steps."
            href="/bom"
            icon={FileSpreadsheet}
          />
          <DomainRow
            title="Quality Control & Incidents"
            code="QA-LAB"
            statusBadge="99.1% Yield (2 Flags)"
            description="Inspection sampling, non-conformance logs, defect types, and corrective actions."
            href="/quality/issues"
            icon={ShieldCheck}
          />
        </div>
      </div>
    </div>
  );
}
