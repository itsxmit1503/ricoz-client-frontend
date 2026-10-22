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
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {options.map((o) => {
        const isActive = active === o.value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(isActive ? "" : o.value)}
            className={`status-filter-card rounded-xl border p-3.5 text-left transition duration-200 ease-out motion-reduce:transition-none active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
              isActive
                ? "border-blue-400/70 bg-blue-500/10 shadow-[0_0_0_1px_rgba(96,165,250,0.08)]"
                : "border-slate-800/90 bg-slate-900/80 hover:-translate-y-0.5 hover:border-slate-700 hover:bg-slate-900"
            }`}
          >
            <span className="flex items-center justify-between gap-2 text-xs text-slate-400">
              <span className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${o.dot}`} /> {o.label}
              </span>
              {isActive && <span className="text-[10px] font-medium uppercase tracking-wider text-blue-300">Active</span>}
            </span>
            <span className="mt-2 block text-2xl font-semibold tabular-nums text-slate-100">{counts[o.value] ?? 0}</span>
          </button>
        );
      })}
    </div>
  );
}