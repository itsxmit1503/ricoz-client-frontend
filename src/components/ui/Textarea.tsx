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
      <label htmlFor={id} className="block text-xs font-medium text-slate-300">
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
        className={`w-full rounded-lg border bg-slate-950/70 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 transition-colors duration-150 ease-out motion-reduce:transition-none focus:outline-none focus:ring-2 ${
          error
            ? "border-red-500/80 focus:border-red-500 focus:ring-red-500/25"
            : "border-slate-800/90 hover:border-slate-700 focus:border-blue-500 focus:ring-blue-500/25"
        } ${className}`}
        {...rest}
      />
      {error && <p id={errorId} className="ui-feedback-enter text-xs font-medium text-red-400">{error}</p>}
    </div>
  );
}
