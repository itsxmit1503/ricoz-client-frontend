import { AlertTriangle, RefreshCw } from "lucide-react";
import Button from "@/components/ui/Button";

interface Props {
  title?: string;
  message: string;
  onRetry?: () => void;
  technicalDetails?: string;
  className?: string;
}

export default function AdminErrorState({
  title = "Failed to load administrative data",
  message,
  onRetry,
  technicalDetails,
  className = "",
}: Props) {
  return (
    <div
      className={`rounded-xl border border-rose-500/30 bg-rose-500/5 p-5 text-rose-200 sm:p-6 ${className}`}
    >
      <div className="flex items-start gap-3.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-400">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-semibold tracking-tight text-rose-100">{title}</h4>
          <p className="mt-1 text-xs text-rose-300/90 leading-relaxed">{message}</p>
          {technicalDetails && (
            <div className="mt-3 rounded-lg border border-rose-500/20 bg-rose-950/40 p-2.5 font-mono text-[11px] text-rose-300">
              {technicalDetails}
            </div>
          )}
          {onRetry && (
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="border-rose-500/40 bg-rose-950/30 text-rose-200 hover:bg-rose-900/40"
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                Retry Request
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
