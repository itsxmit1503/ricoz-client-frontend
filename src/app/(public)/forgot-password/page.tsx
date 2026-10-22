"use client";

import { ArrowLeft, Mail, MailCheck } from "lucide-react";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import AuthShell from "@/components/layout/AuthShell";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { authService } from "@/services/auth.service";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { isEmail } from "@/utils/validators";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isEmail(email)) {
      setError("Enter a valid email address");
      return;
    }
    setError(undefined);
    setSubmitting(true);
    try {
      await authService.forgotPassword(email.trim().toLowerCase());
      setSent(true);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  const backLink = (
    <Link href="/login" className="inline-flex items-center gap-1.5 font-semibold text-blue-400 hover:text-blue-300">
      <ArrowLeft className="h-4 w-4" /> Back to sign in
    </Link>
  );

  if (sent) {
    return (
      <AuthShell title="Check Your Inbox" footer={backLink}>
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-400">
            <MailCheck className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-base font-semibold text-slate-100">Recovery Instructions Sent</h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-400">
            We sent a password reset token to{" "}
            <span className="font-semibold text-slate-200">{email.trim()}</span>. The link will expire in 15 minutes.
          </p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Reset Password"
      subtitle="Enter your email address to receive password reset instructions"
      footer={backLink}
    >
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          icon={Mail}
          placeholder="name@company.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
        />

        <Button type="submit" loading={submitting} className="mt-2">
          Send Reset Link
        </Button>
      </form>
    </AuthShell>
  );
}
