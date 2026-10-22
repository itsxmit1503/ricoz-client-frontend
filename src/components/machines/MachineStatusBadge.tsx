import { getStatusMeta, type MachineStatus } from "@/types/machine";

export default function MachineStatusBadge({ status }: { status: MachineStatus }) {
  const meta = getStatusMeta(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-tight transition-colors duration-150 ease-out motion-reduce:transition-none shadow-xs ${meta.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ring-2 ring-white/10 ${meta.dot}`} />
      {meta.label}
    </span>
  );
}
