"use client";

import {
  Globe,
  RefreshCw,
  Save,
  Server,
  Shield,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { adminService, type BackendHealthStatus } from "@/services/admin.service";

export default function AdminSettingsPage() {
  const [health, setHealth] = useState<BackendHealthStatus | null>(null);
  const [checkingHealth, setCheckingHealth] = useState(false);

  // Profile preferences (Local form state with honest persistence notice)
  const [plantName, setPlantName] = useState("Ricoz Manufacturing Facility #1");
  const [plantCode, setPlantCode] = useState("MFG-US-EAST");
  const [contactEmail, setContactEmail] = useState("ops@ricoz.mfg");
  const [isSaving, setIsSaving] = useState(false);

  const checkConnectivity = async () => {
    setCheckingHealth(true);
    try {
      const res = await adminService.checkHealth();
      setHealth(res);
    } finally {
      setCheckingHealth(false);
    }
  };

  useEffect(() => {
    checkConnectivity();
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Honest notice: System settings persistence requires backend settings model
    setTimeout(() => {
      setIsSaving(false);
      toast.error(
        "Settings persistence API (`PUT /api/v1/settings/organization`) is not implemented on the backend. Changes held in local session only.",
        { duration: 5000 }
      );
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <AdminPageHeader
        title="System & Security Settings"
        description="Inspect environmental variables, security gate parameters, active connectivity status, and organizational metadata."
        breadcrumbs="Console / Settings"
      />

      {/* Security Architecture & Gate Parameters */}
      <div className="rounded-xl border border-slate-800 bg-[#0c111e] p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-purple-400" />
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-purple-300">
            Security &amp; Session Configuration
          </h2>
        </div>
        <p className="mt-1 text-xs text-slate-400">
          Environment-level authentication boundaries for the Private Admin Console.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-800/80 bg-[#080d17] p-3.5">
            <span className="font-mono text-[10px] uppercase text-slate-500 font-semibold block">
              Admin Access Gate
            </span>
            <span className="mt-1 block font-mono text-xs font-bold text-emerald-400">
              DEVELOPMENT ISOLATED
            </span>
            <p className="mt-1 text-[11px] text-slate-400">
              Controlled by <code className="text-slate-300">ADMIN_DEV_ENABLED</code>
            </p>
          </div>

          <div className="rounded-lg border border-slate-800/80 bg-[#080d17] p-3.5">
            <span className="font-mono text-[10px] uppercase text-slate-500 font-semibold block">
              Cookie Protection
            </span>
            <span className="mt-1 block font-mono text-xs font-bold text-purple-300">
              HTTPONLY // SAME-SITE LAX
            </span>
            <p className="mt-1 text-[11px] text-slate-400">
              Inaccessible to client JavaScript
            </p>
          </div>

          <div className="rounded-lg border border-slate-800/80 bg-[#080d17] p-3.5">
            <span className="font-mono text-[10px] uppercase text-slate-500 font-semibold block">
              Session Signature
            </span>
            <span className="mt-1 block font-mono text-xs font-bold text-white">
              HMAC-SHA256
            </span>
            <p className="mt-1 text-[11px] text-slate-400">
              8-hour cryptographic lifespan
            </p>
          </div>
        </div>
      </div>

      {/* Backend Link Status */}
      <div className="rounded-xl border border-slate-800 bg-[#0c111e] p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4 text-purple-400" />
            <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-purple-300">
              Backend REST API Connectivity
            </h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={checkConnectivity}
            loading={checkingHealth}
            className="border-slate-800 bg-[#080d17] text-xs text-slate-300"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Test Link
          </Button>
        </div>

        <div className="mt-4 rounded-lg border border-slate-800/80 bg-[#080d17] p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="font-mono text-xs font-semibold text-slate-300">
                NEXT_PUBLIC_BACKEND_URL:
              </span>
              <p className="font-mono text-xs text-purple-300 mt-0.5">
                {health?.url || "Not set"}
              </p>
            </div>
            <div>
              <span
                className={`font-mono text-xs font-bold px-2.5 py-1 rounded border ${
                  health?.online
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                    : "border-rose-500/30 bg-rose-500/10 text-rose-300"
                }`}
              >
                {health?.online ? "CONNECTED (200 OK)" : "UNREACHABLE"}
              </span>
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Diagnostics response: {health?.statusText || "Pending verification"}
          </p>
        </div>
      </div>

      {/* Organization Metadata Form */}
      <div className="rounded-xl border border-slate-800 bg-[#0c111e] p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-purple-400" />
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-purple-300">
            Plant &amp; Facility Metadata
          </h2>
        </div>
        <p className="mt-1 text-xs text-slate-400">
          Manufacturing organization identity and dispatch contact endpoints.
        </p>

        <form onSubmit={handleSaveProfile} className="mt-5 space-y-4 max-w-xl">
          <Input
            label="Manufacturing Facility Name"
            value={plantName}
            onChange={(e) => setPlantName(e.target.value)}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Plant Facility Code"
              value={plantCode}
              onChange={(e) => setPlantCode(e.target.value)}
            />
            <Input
              label="Operations Contact Email"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
            />
          </div>

          <div className="pt-2 flex items-center gap-3">
            <Button
              type="submit"
              loading={isSaving}
              className="bg-purple-600 hover:bg-purple-500 border-purple-500 text-white"
            >
              <Save className="h-3.5 w-3.5 mr-1.5" />
              Save Facility Profile
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setPlantName("Ricoz Manufacturing Facility #1");
                setPlantCode("MFG-US-EAST");
                setContactEmail("ops@ricoz.mfg");
                toast("Reset to defaults", { icon: "↩️" });
              }}
            >
              Reset
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
