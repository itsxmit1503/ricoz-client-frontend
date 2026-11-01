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

  // Profile preferences
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

  const loadSettings = async () => {
    try {
      const st = await adminService.getSettings();
      if (st) {
        if (st.plantName) setPlantName(st.plantName);
        if (st.plantCode) setPlantCode(st.plantCode);
        if (st.contactEmail) setContactEmail(st.contactEmail);
      }
    } catch {
      toast.error("Could not load saved settings from backend");
    }
  };

  useEffect(() => {
    checkConnectivity();
    loadSettings();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const st = await adminService.saveSettings({ plantName, plantCode, contactEmail });
      setPlantName(st.plantName);
      setPlantCode(st.plantCode);
      setContactEmail(st.contactEmail);
      toast.success("Facility profile successfully saved to backend");
    } catch (err: unknown) {
      const er = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error(er.response?.data?.message || er.message || "Save failed");
    } finally {
      setIsSaving(false);
    }
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
        <p className="mt-1 text-xs text-slate-300">
          Environment-level authentication boundaries for the Private Admin Console.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-800 bg-[#080d17] p-3.5">
            <span className="font-mono text-[10px] uppercase text-slate-300 font-bold block">
              Admin Access Gate
            </span>
            <span className="mt-1 block font-mono text-xs font-bold text-emerald-400">
              CLERK + ROLE
            </span>
            <p className="mt-1 text-[11px] text-slate-300">
              Server enforces <code className="text-white font-semibold">role = admin</code>
            </p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-[#080d17] p-3.5">
            <span className="font-mono text-[10px] uppercase text-slate-300 font-bold block">
              Cookie Protection
            </span>
            <span className="mt-1 block font-mono text-xs font-bold text-purple-300">
              MANAGED BY CLERK
            </span>
            <p className="mt-1 text-[11px] text-slate-300">
              Session cookies handled securely
            </p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-[#080d17] p-3.5">
            <span className="font-mono text-[10px] uppercase text-slate-300 font-bold block">
              Session Signature
            </span>
            <span className="mt-1 block font-mono text-xs font-bold text-white">
              CLERK JWT
            </span>
            <p className="mt-1 text-[11px] text-slate-300">
              Short-lived, auto-refreshed token
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
            className="border-slate-700 bg-[#080d17] text-xs font-semibold text-slate-200"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Test Link
          </Button>
        </div>

        <div className="mt-4 rounded-lg border border-slate-800 bg-[#080d17] p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="font-mono text-xs font-semibold text-slate-200">
                NEXT_PUBLIC_BACKEND_URL:
              </span>
              <p className="font-mono text-xs text-purple-300 mt-0.5">
                {health?.url || "http://localhost:5000"}
              </p>
            </div>
            <div>
              <span
                className={`font-mono text-xs font-bold px-2.5 py-1 rounded border ${
                  health?.online
                    ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                    : "border-rose-500/40 bg-rose-500/15 text-rose-300"
                }`}
              >
                {health?.online ? "CONNECTED (200 OK)" : "UNREACHABLE"}
              </span>
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-300 font-mono">
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
        <p className="mt-1 text-xs text-slate-300">
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
              className="bg-purple-600 hover:bg-purple-500 border-purple-500 text-white font-bold"
            >
              <Save className="h-3.5 w-3.5 mr-1.5" />
              Save Facility Profile
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                loadSettings();
                toast("Reverted to saved values", { icon: "↩️" });
              }}
              className="border-slate-700 text-slate-200"
            >
              Reset
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
