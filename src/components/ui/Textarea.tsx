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
      <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
        className={`w-full rounded-lg border bg-[#0d131f] px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-400 transition-colors duration-150 ease-out motion-reduce:transition-none focus:outline-none focus:ring-2 ${
          error
            ? "border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/25"
            : "border-slate-700/80 hover:border-slate-600 focus:border-blue-500 focus:ring-blue-500/25"
        } ${className}`}
        {...rest}
      />
      {error && <p id={errorId} className="ui-feedback-enter text-xs font-medium text-rose-400">{error}</p>}
    </div>
  );
}
