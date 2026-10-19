import { getStatusMeta, type MachineStatus } from "@/types/machine";

export default function MachineStatusBadge({ status }: { status: MachineStatus }) {
  const meta = getStatusMeta(status);
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border border-white/5 px-2.5 py-1 text-xs font-medium transition-colors duration-150 ease-out motion-reduce:transition-none ${meta.badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}