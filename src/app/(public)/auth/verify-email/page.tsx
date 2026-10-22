"use client";

import { CircleCheck, CircleX } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import AuthShell from "@/components/layout/AuthShell";
import Spinner from "@/components/ui/Spinner";
import { authService } from "@/services/auth.service";
import { getErrorMessage } from "@/utils/getErrorMessage";

type Status = "loading" | "success" | "error";

function VerifyEmail() {
  const token = useSearchParams().get("token");
  const [status, setStatus] = useState<Status>(token ? "loading" : "error");
  const [message, setMessage] = useState(token ? "" : "Verification token is missing.");
  const started = useRef(false); // StrictMode runs effects twice in dev

  useEffect(() => {
    if (!token || started.current) return;
    started.current = true;

    authService
      .verifyEmail(token)
      .then((res) => {
        // backend answers 200 + success:false when the email was already verified
        setStatus(res.success === false ? "error" : "success");
        setMessage(res.message);
      })
      .catch((err) => {
        setStatus("error");
        setMessage(getErrorMessage(err, "This verification link is invalid or has expired."));
      });
  }, [token]);

  return (
    <AuthShell title="Account Verification">
      <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-8 text-center">
        {status === "loading" && (
          <>
            <Spinner className="mx-auto h-9 w-9 text-blue-400" />
            <h3 className="mt-4 text-sm font-semibold text-slate-100">Verifying Email Address…</h3>
            <p className="mt-1 text-xs text-slate-400">Please wait while we confirm your email</p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
              <CircleCheck className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-slate-100">Email Successfully Verified</h3>
            <p className="mt-1.5 text-xs text-slate-400">{message || "Your email has been verified."}</p>
          </>
        )}
        {status === "error" && (
          <>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 text-red-400">
              <CircleX className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-slate-100">Verification Failed</h3>
            <p className="mt-1.5 text-xs text-slate-400">{message}</p>
          </>
        )}
      </div>

      {status !== "loading" && (
        <Link
          href="/login"
          className="mt-6 block rounded-lg bg-blue-600 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-white shadow-sm shadow-blue-950/30 transition hover:bg-blue-500"
        >
          Proceed to Sign In
        </Link>
      )}
    </AuthShell>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmail />
    </Suspense>
  );
}
