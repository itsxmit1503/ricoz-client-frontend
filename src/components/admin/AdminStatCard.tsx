import type { LucideIcon } from "lucide-react";
import Spinner from "@/components/ui/Spinner";

export default function AdminStatCard({
  title,
  value,
  icon: Icon,
  subtitle,
  badge,
  loading,
  error,
}: {
  title: string;
  value: string | number | null | undefined;
  icon: LucideIcon;
  subtitle?: string;
  badge?: string;
  loading?: boolean;
  error?: string | null;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-[#0c111e] p-5 shadow-sm transition hover:border-slate-700">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs font-bold tracking-wider text-slate-200 uppercase">
          {title}
        </span>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-[#121826] text-purple-400">
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="flex h-9 items-center">
            <Spinner className="h-5 w-5 text-purple-400" />
            <span className="ml-2 font-mono text-xs text-slate-300">Loading data…</span>
          </div>
        ) : error ? (
          <div className="flex flex-col">
            <span className="font-mono text-xs font-bold text-rose-400">Unavailable</span>
            <span className="mt-0.5 text-[11px] text-slate-400 truncate" title={error}>
              {error}
            </span>
          </div>
        ) : value !== undefined && value !== null ? (
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {typeof value === "number" ? value.toLocaleString() : value}
            </span>
            {badge && (
              <span className="rounded border border-purple-500/40 bg-purple-500/15 px-1.5 py-0.5 font-mono text-[10px] font-bold text-purple-300">
                {badge}
              </span>
            )}
          </div>
        ) : (
          <span className="font-mono text-sm text-slate-400">No data available</span>
        )}
      </div>

      {subtitle && (
        <p className="mt-2 text-xs text-slate-300 leading-relaxed truncate">{subtitle}</p>
      )}
    </div>
  );
}
