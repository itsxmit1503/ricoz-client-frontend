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
        <label htmlFor={id} className="block text-sm font-medium text-slate-300">
          {label}
        </label>
      )}
      <select
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
        className={`h-11 w-full rounded-lg border bg-slate-900 px-3 text-sm text-slate-100 transition duration-200 ease-out motion-reduce:transition-none focus:outline-none focus:ring-2 ${
          error
            ? "border-red-500/70 focus:ring-red-500/40"
            : "border-slate-700/90 focus:border-slate-500 focus:ring-slate-500/40"
        } ${className}`}
        {...rest}
      >
        {children}
      </select>
      {error && <p id={errorId} className="ui-feedback-enter text-xs text-red-400">{error}</p>}
    </div>
  );
}