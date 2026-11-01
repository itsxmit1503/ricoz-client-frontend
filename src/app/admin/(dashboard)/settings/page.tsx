"use client";

import {
  CheckCircle2,
  Globe,
  RefreshCw,
  Save,
  Server,
  Shield,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Spinner from "@/components/ui/Spinner";
import { adminService, type BackendHealthStatus, type SystemSettings } from "@/services/admin.service";

export default function AdminSettingsPage() {
  const [health, setHealth] = useState<BackendHealthStatus | null>(null);
  const [checkingHealth, setCheckingHealth] = useState(false);

  // Settings form state
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [plantName, setPlantName] = useState("Ricoz Manufacturing Facility #1");
  const [plantCode, setPlantCode] = useState("RICOZ-PLANT-01");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [contactEmail, setContactEmail] = useState("operations@ricoz.mfg");
  const [maintenanceWindow, setMaintenanceWindow] = useState("Sunday 02:00 - 06:00 IST");
  const [autoBackups, setAutoBackups] = useState(true);
  const [mfaEnforced, setMfaEnforced] = useState(false);
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState(60);

  const [isSaving, setIsSaving] = useState(false);

  const loadSettingsAndHealth = async () => {
    setLoadingSettings(true);
    setCheckingHealth(true);
    try {
      const [settingsData, healthData] = await Promise.allSettled([
        adminService.getSettings(),
        adminService.checkHealth(),
      ]);

      if (settingsData.status === "fulfilled" && settingsData.value) {
        const s = settingsData.value;
        if (s.plantName) setPlantName(s.plantName);
        if (s.plantCode) setPlantCode(s.plantCode);
        if (s.timezone) setTimezone(s.timezone);
        if (s.contactEmail) setContactEmail(s.contactEmail);
        if (s.maintenanceWindow) setMaintenanceWindow(s.maintenanceWindow);
        if (typeof s.autoBackups === "boolean") setAutoBackups(s.autoBackups);
        if (typeof s.mfaEnforced === "boolean") setMfaEnforced(s.mfaEnforced);
        if (s.sessionTimeoutMinutes) setSessionTimeoutMinutes(s.sessionTimeoutMinutes);
      }

      if (healthData.status === "fulfilled") {
        setHealth(healthData.value);
      }
    } finally {
      setLoadingSettings(false);
      setCheckingHealth(false);
    }
  };

  useEffect(() => {
    loadSettingsAndHealth();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await adminService.updateSettings({
        plantName,
        plantCode,
        timezone,
        contactEmail,
        maintenanceWindow,
        autoBackups,
        mfaEnforced,
        sessionTimeoutMinutes: Number(sessionTimeoutMinutes) || 60,
      });

      toast.success("System configurations saved to Ricoz backend successfully!");
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Failed to persist settings.");
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
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={loadSettingsAndHealth}
            loading={loadingSettings || checkingHealth}
            className="border-slate-700 bg-[#0c111e] text-slate-200 hover:text-white"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Reload Config
          </Button>
        }
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
              DEVELOPMENT ISOLATED
            </span>
            <p className="mt-1 text-[11px] text-slate-300">
              Controlled by <code className="text-white font-semibold">ADMIN_DEV_ENABLED</code>
            </p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-[#080d17] p-3.5">
            <span className="font-mono text-[10px] uppercase text-slate-300 font-bold block">
              Cookie Protection
            </span>
            <span className="mt-1 block font-mono text-xs font-bold text-purple-300">
              HTTPONLY // SAME-SITE LAX
            </span>
            <p className="mt-1 text-[11px] text-slate-300">
              Inaccessible to client JavaScript
            </p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-[#080d17] p-3.5">
            <span className="font-mono text-[10px] uppercase text-slate-300 font-bold block">
              Target Environment
            </span>
            <span className="mt-1 block font-mono text-xs font-bold text-blue-400">
              LOCAL INTEGRATION
            </span>
            <p className="mt-1 text-[11px] text-slate-300">
              Backend on <code className="text-white font-semibold">http://localhost:5000</code>
            </p>
          </div>
        </div>
      </div>

      {/* Organizational Metadata Configuration Form */}
      <div className="rounded-xl border border-slate-800 bg-[#0c111e] p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-blue-400" />
              <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-blue-300">
                Plant Profile &amp; Facility Metadata
              </h2>
            </div>
            <p className="mt-1 text-xs text-slate-300">
              Live facility attributes persisted to the Ricoz backend configuration registry.
            </p>
          </div>
        </div>

        {loadingSettings ? (
          <div className="flex items-center justify-center p-12">
            <Spinner className="h-6 w-6 text-purple-400" />
            <span className="ml-2 font-mono text-xs text-slate-300">Loading settings…</span>
          </div>
        ) : (
          <form onSubmit={handleSaveSettings} className="mt-6 space-y-4 max-w-2xl">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Manufacturing Facility Name"
                value={plantName}
                onChange={(e) => setPlantName(e.target.value)}
                required
              />
              <Input
                label="Facility Code"
                value={plantCode}
                onChange={(e) => setPlantCode(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Administrative Contact Email"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                required
              />
              <Input
                label="Primary Timezone"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                required
              />
            </div>

            <Input
              label="Standard Maintenance Window"
              value={maintenanceWindow}
              onChange={(e) => setMaintenanceWindow(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
              <label className="flex items-center gap-3 rounded-lg border border-slate-800 bg-[#080d17] p-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoBackups}
                  onChange={(e) => setAutoBackups(e.target.checked)}
                  className="rounded border-slate-700 text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <span className="block text-xs font-bold text-white">Automated Database Backups</span>
                  <span className="text-[10px] text-slate-300">Scheduled snapshots every 24h</span>
                </div>
              </label>

              <label className="flex items-center gap-3 rounded-lg border border-slate-800 bg-[#080d17] p-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={mfaEnforced}
                  onChange={(e) => setMfaEnforced(e.target.checked)}
                  className="rounded border-slate-700 text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <span className="block text-xs font-bold text-white">Enforce MFA for Admins</span>
                  <span className="text-[10px] text-slate-300">Mandate two-factor verification</span>
                </div>
              </label>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="sm"
                loading={isSaving}
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4"
              >
                <Save className="h-3.5 w-3.5 mr-1.5" />
                Save Facility Settings
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Backend Connectivity Status */}
      <div className="rounded-xl border border-slate-800 bg-[#0c111e] p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4 text-emerald-400" />
            <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-300">
              Live Backend Endpoint Telemetry
            </h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadSettingsAndHealth}
            loading={checkingHealth}
            className="border-slate-700 bg-[#080d17] text-xs font-semibold text-slate-200"
          >
            Ping Status
          </Button>
        </div>

        <div className="mt-4 rounded-lg border border-slate-800 bg-[#080d17] p-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-slate-200 font-semibold">
              {health?.url || "http://localhost:5000"}
            </span>
            {health?.online ? (
              <span className="inline-flex items-center gap-1 font-mono text-xs font-bold text-emerald-400">
                <CheckCircle2 className="h-4 w-4" /> ONLINE
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 font-mono text-xs font-bold text-rose-400">
                <XCircle className="h-4 w-4" /> UNREACHABLE
              </span>
            )}
          </div>
          <p className="mt-2 text-xs text-slate-300 font-mono">
            {health?.statusText || "Verifying connectivity…"}
          </p>
        </div>
      </div>
    </div>
  );
}
