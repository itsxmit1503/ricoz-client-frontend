import type { ReactNode } from "react";

export default function AdminPageHeader({
  badge,
  title,
  description,
  breadcrumbs,
  actions,
  className = "",
}: {
  badge?: string;
  title: string;
  description?: string;
  breadcrumbs?: string;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between ${className}`}>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          {breadcrumbs && (
            <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-purple-300">
              {breadcrumbs}
            </p>
          )}
          {badge && (
            <span className="rounded border border-purple-500/30 bg-purple-500/10 px-2 py-0.2 font-mono text-[9px] font-bold uppercase text-purple-300">
              {badge}
            </span>
          )}
        </div>
        <h1 className="mt-1 text-xl font-bold tracking-tight text-white sm:text-2xl">{title}</h1>
        {description && <p className="mt-1 max-w-3xl text-xs text-slate-200 sm:text-sm">{description}</p>}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
}
