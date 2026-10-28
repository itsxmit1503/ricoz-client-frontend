import { ChevronDown } from "lucide-react";
import { useId, type SelectHTMLAttributes } from "react";

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  helperText?: string;
};

export default function Select({ label, error, helperText, className = "", children, ...rest }: Props) {
  const id = useId();
  const errorId = error ? `${id}-error` : undefined;
  const helperId = helperText ? `${id}-helper` : undefined;

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-xs font-medium text-slate-200">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId || helperId}
          className={`h-9.5 w-full appearance-none rounded-lg border bg-[#0d131f] pl-3 pr-9 text-sm text-slate-100 transition-colors duration-150 ease-out focus:outline-none focus:ring-2 ${
            error
              ? "border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/25"
              : "border-slate-700/80 hover:border-slate-600 focus:border-blue-500 focus:ring-blue-500/25"
          } ${className}`}
          {...rest}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>
      {error ? (
        <p id={errorId} className="text-xs font-medium text-rose-400">
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-xs text-slate-400">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
