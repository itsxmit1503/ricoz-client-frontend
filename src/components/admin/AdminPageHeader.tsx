import { ShieldAlert } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  badge?: string;
  title: string;
  description: string;
  breadcrumbs?: string;
  actions?: ReactNode;
  className?: string;
}

export default function AdminPageHeader({
  badge = "PRIVATE ADMINISTRATION",
  title,
  description,
  breadcrumbs,
  actions,
  className = "",
}: Props) {
  return (
    <div className={`space-y-3 pb-2 ${className}`}>
      {breadcrumbs && (
        <p className="font-mono text-xs text-slate-500 tracking-wide">
          {breadcrumbs}
        </p>
      )}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-5 items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 font-mono text-[10px] font-bold tracking-wider text-purple-300 uppercase">
              <ShieldAlert className="h-3 w-3" />
              {badge}
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {title}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-2xl">
            {description}
          </p>
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2.5">{actions}</div>}
      </div>
    </div>
  );
}
