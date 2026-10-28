import { AlertCircle, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export default function AdminEmptyState({
  icon: Icon = AlertCircle,
  title,
  description,
  action,
  className = "",
}: Props) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-[#080d17]/60 p-8 text-center sm:p-12 ${className}`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-[#0d131f] text-slate-400 shadow-sm">
        <Icon className="h-6 w-6 text-slate-300" />
      </div>
      <h3 className="mt-4 text-sm font-semibold tracking-tight text-white">{title}</h3>
      <p className="mt-1 max-w-md text-xs text-slate-400 leading-relaxed">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
