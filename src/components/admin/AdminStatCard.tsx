import { type LucideIcon } from "lucide-react";
import Spinner from "@/components/ui/Spinner";

interface Props {
  title: string;
  value?: number | string | null;
  icon: LucideIcon;
  subtitle?: string;
  loading?: boolean;
  error?: string | null;
  badge?: string;
  className?: string;
}

export default function AdminStatCard({
  title,
  value,
  icon: Icon,
  subtitle,
  loading = false,
  error = null,
  badge,
  className = "",
}: Props) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-slate-800 bg-[#0c111e] p-5 shadow-sm transition hover:border-slate-700/80 ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs font-semibold tracking-wider text-slate-400 uppercase">
          {title}
        </span>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-[#121826] text-blue-400 shadow-inner">
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="flex h-9 items-center">
            <Spinner className="h-5 w-5 text-blue-400" />
            <span className="ml-2 font-mono text-xs text-slate-400">Loading live data…</span>
          </div>
        ) : error ? (
          <div className="flex flex-col">
            <span className="font-mono text-xs font-semibold text-rose-400">Unavailable</span>
            <span className="mt-0.5 text-[11px] text-slate-500 truncate" title={error}>
              {error}
            </span>
          </div>
        ) : value !== undefined && value !== null ? (
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {typeof value === "number" ? value.toLocaleString() : value}
            </span>
            {badge && (
              <span className="rounded border border-blue-500/30 bg-blue-500/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-blue-300">
                {badge}
              </span>
            )}
          </div>
        ) : (
          <span className="font-mono text-sm text-slate-500">No data available</span>
        )}
      </div>

      {subtitle && (
        <p className="mt-2 text-xs text-slate-400 leading-relaxed truncate">{subtitle}</p>
      )}
    </div>
  );
}
