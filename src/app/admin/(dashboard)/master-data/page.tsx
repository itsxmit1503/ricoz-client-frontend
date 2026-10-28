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
import { useEffect, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminStatCard from "@/components/admin/AdminStatCard";
import Button from "@/components/ui/Button";
import { inventoryService } from "@/services/inventory.service";
import { machineService } from "@/services/machine.service";
import { productService } from "@/services/product.service";
import { supplierService } from "@/services/supplier.service";

interface MasterDataRegistry {
  id: string;
  name: string;
  icon: typeof Package;
  description: string;
  route: string;
  endpoint: string;
  count: number | null;
  loading: boolean;
  error: string | null;
}

export default function AdminMasterDataPage() {
  const [registries, setRegistries] = useState<MasterDataRegistry[]>([
    {
      id: "products",
      name: "Product & Component Catalog",
      icon: Package,
      description: "Master part numbers, bill of material roots, manufacturing revisions, and sellable units.",
      route: "/products",
      endpoint: "/api/v1/products",
      count: null,
      loading: true,
      error: null,
    },
    {
      id: "machines",
      name: "Fleet & Workstation Registry",
      icon: Cpu,
      description: "CNC milling centers, automated workcells, assembly stations, and inspection gantries.",
      route: "/machines",
      endpoint: "/api/v1/machines",
      count: null,
      loading: true,
      error: null,
    },
    {
      id: "inventory",
      name: "Inventory Bins & Stock Ledgers",
      icon: Boxes,
      description: "Warehouse zones, storage bin locations, raw stock allocations, and safety reorder thresholds.",
      route: "/inventory/stock",
      endpoint: "/api/v1/inventory",
      count: null,
      loading: true,
      error: null,
    },
    {
      id: "suppliers",
      name: "Approved Vendor Directory",
      icon: Truck,
      description: "Certified suppliers, contract lead times, procurement terms, and raw material vendor records.",
      route: "/suppliers",
      endpoint: "/api/v1/suppliers",
      count: null,
      loading: true,
      error: null,
    },
  ]);

  const loadAllRegistries = async () => {
    // 1. Products
    productService
      .list()
      .then((items) => {
        setRegistries((prev) =>
          prev.map((r) => (r.id === "products" ? { ...r, count: items.length, loading: false, error: null } : r))
        );
      })
      .catch((err: Error) => {
        setRegistries((prev) =>
          prev.map((r) => (r.id === "products" ? { ...r, count: null, loading: false, error: err.message || "Failed" } : r))
        );
      });

    // 2. Machines
    machineService
      .list()
      .then((items) => {
        setRegistries((prev) =>
          prev.map((r) => (r.id === "machines" ? { ...r, count: items.length, loading: false, error: null } : r))
        );
      })
      .catch((err: Error) => {
        setRegistries((prev) =>
          prev.map((r) => (r.id === "machines" ? { ...r, count: null, loading: false, error: err.message || "Failed" } : r))
        );
      });

    // 3. Inventory
    inventoryService
      .list()
      .then((items) => {
        setRegistries((prev) =>
          prev.map((r) => (r.id === "inventory" ? { ...r, count: items.length, loading: false, error: null } : r))
        );
      })
      .catch((err: Error) => {
        setRegistries((prev) =>
          prev.map((r) => (r.id === "inventory" ? { ...r, count: null, loading: false, error: err.message || "Failed" } : r))
        );
      });

    // 4. Suppliers
    supplierService
      .list()
      .then((items) => {
        setRegistries((prev) =>
          prev.map((r) => (r.id === "suppliers" ? { ...r, count: items.length, loading: false, error: null } : r))
        );
      })
      .catch((err: Error) => {
        setRegistries((prev) =>
          prev.map((r) => (r.id === "suppliers" ? { ...r, count: null, loading: false, error: err.message || "Failed" } : r))
        );
      });
  };

  useEffect(() => {
    loadAllRegistries();
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <AdminPageHeader
        title="Master Data Repositories"
        description="Centralized administration of authoritative manufacturing definitions, equipment registries, inventory ledgers, and vendor directories."
        breadcrumbs="Console / Master Data"
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={loadAllRegistries}
            className="border-slate-800 bg-[#0c111e] text-slate-300 hover:text-white"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Refresh Registries
          </Button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {registries.map((r) => (
          <AdminStatCard
            key={r.id}
            title={r.name}
            value={r.count}
            icon={r.icon}
            loading={r.loading}
            error={r.error}
            subtitle={r.count !== null ? `${r.count} registered records` : "Live API connection"}
          />
        ))}
      </div>

      {/* Registries Detailed Directory */}
      <div className="space-y-4">
        <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-purple-400">
          Operational Master Repositories
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {registries.map((r) => {
            const Icon = r.icon;
            return (
              <div
                key={r.id}
                className="flex flex-col justify-between rounded-xl border border-slate-800 bg-[#0c111e] p-5 shadow-sm transition hover:border-slate-700"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-[#121826] text-purple-400">
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
                    {r.loading
                      ? "Querying…"
                      : r.error
                      ? "Service unreachable"
                      : `${r.count} active entries`}
                  </span>

                  <Link
                    href={r.route}
                    className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-purple-400 hover:text-purple-300"
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
