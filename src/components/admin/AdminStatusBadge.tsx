import type { ReactNode } from "react";

export type AdminStatusVariant =
  | "admin"
  | "user"
  | "verified"
  | "pending"
  | "active"
  | "inactive"
  | "warning"
  | "neutral";

interface Props {
  variant?: AdminStatusVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<AdminStatusVariant, string> = {
  admin: "border-purple-500/30 bg-purple-500/10 text-purple-300 font-semibold",
  user: "border-blue-500/30 bg-blue-500/10 text-blue-300 font-medium",
  verified: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 font-semibold",
  pending: "border-amber-500/30 bg-amber-500/10 text-amber-300 font-medium",
  active: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 font-medium",
  inactive: "border-slate-700 bg-slate-800 text-slate-400 font-medium",
  warning: "border-amber-500/30 bg-amber-500/10 text-amber-300 font-medium",
  neutral: "border-slate-800 bg-[#0d131f] text-slate-300 font-medium",
};

export default function AdminStatusBadge({ variant = "neutral", children, className = "" }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-mono text-[11px] tracking-tight ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
