import { useId, type SelectHTMLAttributes } from "react";

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
};

export default function Select({ label, error, className = "", children, ...rest }: Props) {
  const id = useId();
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-xs font-medium text-slate-300">
          {label}
        </label>
      )}
      <select
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
        className={`h-10 w-full rounded-lg border bg-slate-950/70 px-3 text-sm text-slate-100 transition-colors duration-150 ease-out motion-reduce:transition-none focus:outline-none focus:ring-2 ${
          error
            ? "border-red-500/80 focus:border-red-500 focus:ring-red-500/25"
            : "border-slate-800/90 hover:border-slate-700 focus:border-blue-500 focus:ring-blue-500/25"
        } ${className}`}
        {...rest}
      >
        {children}
      </select>
      {error && <p id={errorId} className="ui-feedback-enter text-xs font-medium text-red-400">{error}</p>}
    </div>
  );
}
