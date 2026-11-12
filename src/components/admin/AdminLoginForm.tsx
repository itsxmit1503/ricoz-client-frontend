"use client";

import { useState } from "react";
import { KeyRound, Lock, Mail, ShieldAlert, Sparkles } from "lucide-react";
import { SignIn } from "@clerk/nextjs";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function AdminLoginForm() {
  const [tab, setTab] = useState<"direct" | "sso">("direct");
  const [email, setEmail] = useState("admin@ricoz.mfg");
  const [password, setPassword] = useState("Admin#Ricoz2026!");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        throw new Error(data.message || `Authentication failed with status ${res.status}`);
      }

      // Hard redirect to ensure browser registers the newly minted session cookie
      window.location.href = "/admin";
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || "Failed to authenticate administrator credentials.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Tab Switcher */}
      <div className="flex rounded-xl border border-slate-800 bg-[#0a0f1d] p-1 mb-5">
        <button
          type="button"
          onClick={() => {
            setTab("direct");
            setError(null);
          }}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
            tab === "direct"
              ? "bg-purple-600/30 border border-purple-500/50 text-white shadow-sm"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Direct Admin Access
        </button>
        <button
          type="button"
          onClick={() => {
            setTab("sso");
            setError(null);
          }}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
            tab === "sso"
              ? "bg-purple-600/30 border border-purple-500/50 text-white shadow-sm"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Clerk SSO Login
        </button>
      </div>

      {tab === "direct" ? (
        <div className="rounded-2xl border border-slate-800 bg-[#0c111e] p-6 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-start gap-2.5 rounded-lg border border-rose-500/40 bg-rose-950/40 p-3 text-xs text-rose-300">
                <ShieldAlert className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <Input
              label="Administrator Email"
              type="email"
              icon={Mail}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@ricoz.mfg"
            />

            <Input
              label="Cryptographic Password"
              type="password"
              icon={Lock}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                className="w-full min-h-[44px] bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-md"
              >
                <KeyRound className="h-4 w-4 mr-2" />
                Authenticate Admin Session
              </Button>
            </div>
          </form>

          <div className="mt-5 border-t border-slate-800/80 pt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setEmail("admin@ricoz.mfg");
                setPassword("Admin#Ricoz2026!");
              }}
              className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 font-medium transition"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Fill Default Dev Admin Credentials</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <SignIn path="/admin/login" routing="path" forceRedirectUrl="/admin" signUpUrl="/sign-up" />
        </div>
      )}
    </div>
  );
}
