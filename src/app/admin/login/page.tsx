"use client";

import { ArrowRight, Lock, Mail, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    setFormError("");

    let valid = true;
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      setEmailError("Administrator email is required");
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setEmailError("Please enter a valid email address");
      valid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      valid = false;
    }

    if (!valid) return;

    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        const errorMsg = data.message || "Invalid administrator credentials.";
        setFormError(errorMsg);
        toast.error(errorMsg);
        setLoading(false);
        return;
      }

      toast.success("Administrator session authorized");
      router.push("/admin");
      router.refresh();
    } catch {
      const networkMsg = "Network error connecting to administrative authorization service.";
      setFormError(networkMsg);
      toast.error(networkMsg);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-[#06090f] px-4 py-12 sm:px-6 lg:px-8">
      {/* Background Ambience */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center opacity-30">
        <div className="h-[480px] w-[480px] rounded-full bg-purple-600/10 blur-[120px]" />
      </div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand & Title */}
        <div className="text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600/15 border border-purple-500/30 text-purple-400 shadow-lg shadow-purple-900/20">
            <ShieldAlert className="h-6 w-6" />
          </div>

          <div className="mt-4 flex items-center justify-center gap-1.5">
            <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-0.5 font-mono text-[10px] font-bold tracking-wider text-purple-300 uppercase">
              PRIVATE ADMINISTRATION
            </span>
          </div>

          <h1 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">
            Admin Console
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-400">
            Secure access to Ricoz MFG administration.
          </p>
        </div>

        {/* Card Container */}
        <div className="ui-page-transition mt-8 rounded-2xl border border-slate-800 bg-[#0c111e]/90 p-6 shadow-2xl backdrop-blur-md sm:p-8">
          {formError && (
            <div className="mb-5 rounded-lg border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-300">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4.5" noValidate>
            <div>
              <Input
                label="Administrator Email"
                type="email"
                icon={Mail}
                autoComplete="email"
                placeholder="admin@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError("");
                }}
                error={emailError}
                disabled={loading}
              />
            </div>

            <div>
              <Input
                label="Password"
                type="password"
                icon={Lock}
                autoComplete="current-password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError("");
                }}
                error={passwordError}
                disabled={loading}
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                loading={loading}
                className="w-full bg-purple-600 hover:bg-purple-500 border-purple-500 focus-visible:ring-purple-400 shadow-md shadow-purple-600/20 text-white font-semibold"
              >
                <span>Sign In to Console</span>
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </div>
          </form>

          {/* Development Security Notice */}
          <div className="mt-6 rounded-lg border border-slate-800/80 bg-[#080d17] p-3 text-center">
            <p className="font-mono text-[11px] text-slate-400">
              <span className="text-purple-400 font-semibold">Dev Note:</span> Configured via{" "}
              <code className="text-slate-300">ADMIN_DEV_EMAIL</code> &amp;{" "}
              <code className="text-slate-300">ADMIN_DEV_PASSWORD</code>.
            </p>
          </div>
        </div>

        {/* Public Return Link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            ← Return to Ricoz Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
