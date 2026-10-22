import type { OptionMeta } from "@/types/common";

interface Props {
  options: readonly OptionMeta[];
  counts: Record<string, number>;
  active: string; // "" = no filter
  onChange: (value: string) => void;
}

/** Row of count cards; clicking one filters the list, clicking again clears it. */
export default function StatusFilterCards({ options, counts, active, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-6">
      {options.map((o) => {
        const isActive = active === o.value;
        const count = counts[o.value] ?? 0;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(isActive ? "" : o.value)}
            className={`group relative rounded-xl border p-3 text-left transition-[transform,background-color,border-color,box-shadow] duration-150 ease-out motion-reduce:transition-none hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
              isActive
                ? "border-blue-500/80 bg-blue-600/15 shadow-sm shadow-blue-950/40"
                : "border-slate-800/80 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/90"
            }`}
          >
            <div className="flex items-center justify-between gap-1.5">
              <span className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
                <span className={`h-2 w-2 rounded-full ${o.dot}`} />
                <span className="truncate">{o.label}</span>
              </span>
              {isActive && (
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 ring-2 ring-blue-400/30" />
              )}
            </div>
            <div className="mt-2.5 flex items-baseline justify-between">
              <span className={`text-xl font-semibold tabular-nums tracking-tight ${isActive ? "text-blue-200" : "text-slate-100"}`}>
                {count}
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500 group-hover:text-slate-400">
                Filter
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
