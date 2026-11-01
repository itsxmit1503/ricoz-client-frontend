import { AlertTriangle } from "lucide-react";
import Button from "@/components/ui/Button";

export default function AdminErrorState({
  title,
  message,
  technicalDetails,
  onRetry,
}: {
  title: string;
  message: string;
  technicalDetails?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-5">
      <div className="flex items-start gap-3.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-rose-500/30 bg-rose-500/15 text-rose-400">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-rose-200">{title}</h3>
          <p className="mt-1 text-xs text-slate-300">{message}</p>
          {technicalDetails && <p className="mt-2 font-mono text-[11px] text-slate-500">{technicalDetails}</p>}
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry} className="mt-3 border-slate-700">
              Retry
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
