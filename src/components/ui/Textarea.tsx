import { useId, type TextareaHTMLAttributes } from "react";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
};

export default function Textarea({ label, error, className = "", rows = 3, ...rest }: Props) {
  const id = useId();
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-slate-300">
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
        className={`w-full rounded-lg border bg-slate-900 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 transition focus:outline-none focus:ring-2 ${
          error
            ? "border-red-500/70 focus:ring-red-500/40"
            : "border-slate-700/90 focus:border-slate-500 focus:ring-slate-500/40"
        } ${className}`}
        {...rest}
      />
      {error && <p id={errorId} className="text-xs text-red-400">{error}</p>}
    </div>
  );
}