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
            className={`group relative rounded-xl border p-3 text-left transition-all duration-150 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
              isActive
                ? "border-blue-500/80 bg-blue-600/15 shadow-xs"
                : "border-slate-800 bg-[#0d131f] hover:border-slate-700 hover:bg-[#131b2c]"
            }`}
          >
            <div className="flex items-center justify-between gap-1.5">
              <span className="flex items-center gap-1.5 text-xs font-medium text-slate-200">
                <span className={`h-2 w-2 rounded-full ${o.dot}`} />
                <span className="truncate">{o.label}</span>
              </span>
              {isActive && (
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 ring-2 ring-blue-400/30" />
              )}
            </div>
            <div className="mt-2.5 flex items-baseline justify-between">
              <span className={`text-xl font-semibold tabular-nums tracking-tight ${isActive ? "text-blue-200" : "text-white"}`}>
                {count}
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 group-hover:text-slate-300">
                Filter
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
