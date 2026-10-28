import type { OptionMeta } from "@/types/common";

interface Props {
  options: readonly OptionMeta[];
  counts: Record<string, number>;
  active: string; // "" = no filter
  onChange: (value: string) => void;
}

/** Integrated industrial filter bar with dot indicators and live counts. */
export default function StatusFilterCards({ options, counts, active, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-lg border border-slate-800 bg-[#080d17]">
      <button
        type="button"
        onClick={() => onChange("")}
        className={`ui-pressable inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold font-mono transition-all duration-150 ${
          active === ""
            ? "bg-blue-600 text-white shadow-xs"
            : "text-slate-300 hover:bg-[#121826] hover:text-white"
        }`}
      >
        <span>ALL</span>
        <span className="rounded bg-black/30 px-1.5 py-0.2 text-[10px] tabular-nums transition-colors">
          {Object.values(counts).reduce((a, b) => a + b, 0)}
        </span>
      </button>

      {options.map((o) => {
        const isActive = active === o.value;
        const count = counts[o.value] ?? 0;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(isActive ? "" : o.value)}
            className={`ui-pressable inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 ${
              isActive
                ? "bg-[#162238] border border-blue-500/60 text-blue-200 shadow-2xs shadow-blue-500/10"
                : "text-slate-300 hover:bg-[#121826] hover:text-white border border-transparent"
            }`}
          >
            <span className={`h-2 w-2 rounded-full transition-transform duration-150 ${o.dot} ${isActive ? "scale-110" : ""}`} />
            <span>{o.label}</span>
            <span className={`font-mono text-[10px] px-1.5 py-0.2 rounded tabular-nums transition-colors duration-150 ${
              isActive ? "bg-blue-900/60 text-blue-200" : "bg-slate-800/80 text-slate-400"
            }`}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
