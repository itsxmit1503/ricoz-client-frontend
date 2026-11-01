"use client";

import {
  Boxes,
  Cpu,
  ExternalLink,
  Package,
  RefreshCw,
  Truck,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminStatCard from "@/components/admin/AdminStatCard";
import Button from "@/components/ui/Button";

interface MasterDataRegistry {
  id: string;
  name: string;
  icon: typeof Package;
  description: string;
  route: string;
  endpoint: string;
  count: number;
}

const PREVIEW_REGISTRIES: MasterDataRegistry[] = [
  {
    id: "products",
    name: "Product & Component Catalog",
    icon: Package,
    description: "Master part numbers, bill of material roots, manufacturing revisions, and sellable units.",
    route: "/products",
    endpoint: "/api/v1/products",
    count: 14,
  },
  {
    id: "machines",
    name: "Fleet & Workstation Registry",
    icon: Cpu,
    description: "CNC milling centers, automated workcells, assembly stations, and inspection gantries.",
    route: "/machines",
    endpoint: "/api/v1/machines",
    count: 8,
  },
  {
    id: "inventory",
    name: "Inventory Bins & Stock Ledgers",
    icon: Boxes,
    description: "Warehouse zones, storage bin locations, raw stock allocations, and safety reorder thresholds.",
    route: "/inventory/stock",
    endpoint: "/api/v1/inventory",
    count: 24,
  },
  {
    id: "suppliers",
    name: "Approved Vendor Directory",
    icon: Truck,
    description: "Certified suppliers, contract lead times, procurement terms, and raw material vendor records.",
    route: "/suppliers",
    endpoint: "/api/v1/suppliers",
    count: 6,
  },
];

export default function AdminPreviewMasterDataPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <AdminPageHeader
        badge="PREVIEW MODE // REPOSITORIES"
        title="Master Data Repositories (Preview)"
        description="Centralized administration of authoritative manufacturing definitions, equipment registries, inventory ledgers, and vendor directories."
        breadcrumbs="Console / Preview / Master Data"
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success("Refreshed master data registries")}
            className="border-slate-800 bg-[#0c111e] text-slate-300 hover:text-white"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Refresh Registries
          </Button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PREVIEW_REGISTRIES.map((r) => (
          <AdminStatCard
            key={r.id}
            title={r.name}
            value={r.count}
            icon={r.icon}
            badge="Synthetic"
            subtitle={`${r.count} registered records`}
          />
        ))}
      </div>

      {/* Registries Detailed Directory */}
      <div className="space-y-4">
        <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-amber-400">
          Operational Master Repositories
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {PREVIEW_REGISTRIES.map((r) => {
            const Icon = r.icon;
            return (
              <div
                key={r.id}
                className="flex flex-col justify-between rounded-xl border border-slate-800 bg-[#0c111e] p-5 shadow-sm transition hover:border-slate-700"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-[#121826] text-amber-400">
                        <Icon className="h-4 w-4" />
                      </div>
                      <h3 className="text-sm font-bold text-white tracking-tight">
                        {r.name}
                      </h3>
                    </div>
                    <span className="font-mono text-[10px] text-slate-500">
                      {r.endpoint}
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-slate-400 leading-relaxed">
                    {r.description}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-800/80 pt-3">
                  <span className="font-mono text-xs text-slate-300">
                    {r.count} active entries (Preview)
                  </span>

                  <Link
                    href={r.route}
                    className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-amber-400 hover:text-amber-300"
                  >
                    <span>Open Module</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
