import type { ReactNode } from "react";

export default function AdminPageHeader({
  badge,
  badgeVariant = "default",
  title,
  description,
  breadcrumbs,
  actions,
  className = "",
}: {
  badge?: string;
  badgeVariant?: "database" | "store" | "default";
  title: string;
  description?: string;
  breadcrumbs?: string;
  actions?: ReactNode;
  className?: string;
}) {
  const badgeClasses =
    badgeVariant === "database"
      ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
      : badgeVariant === "store"
      ? "border-amber-500/40 bg-amber-500/15 text-amber-300"
      : "border-purple-500/30 bg-purple-500/10 text-purple-300";

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
            <span className={`rounded border px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider ${badgeClasses}`}>
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
