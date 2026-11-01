import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export default function AdminEmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-[#0c111e] px-6 py-12 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-[#121826] text-slate-400">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-3 text-sm font-bold text-slate-200">{title}</h3>
      {description && <p className="mt-1 max-w-md text-xs text-slate-400">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
