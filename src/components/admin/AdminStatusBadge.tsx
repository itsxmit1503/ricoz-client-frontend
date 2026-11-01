import type { ReactNode } from "react";

const styles = {
  admin: "border-purple-500/30 bg-purple-500/10 text-purple-300",
  user: "border-slate-700 bg-slate-800/60 text-slate-300",
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  warning: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  danger: "border-rose-500/30 bg-rose-500/10 text-rose-300",
  neutral: "border-slate-700 bg-[#0d131f] text-slate-300",
};

export default function AdminStatusBadge({
  variant = "user",
  children,
}: {
  variant?: keyof typeof styles;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full border px-2 py-0.5 font-mono text-[10px] font-bold tracking-wide ${styles[variant]}`}
    >
      {children}
    </span>
  );
}
