import type { OptionMeta } from "@/types/common";

export default function Badge({ meta }: { meta: OptionMeta }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2 py-0.5 text-[11px] font-medium tracking-tight shadow-2xs ${meta.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      <span>{meta.label}</span>
    </span>
  );
}
