import { Eye, EyeOff, type LucideIcon } from "lucide-react";
import { useId, useState, type InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  helperText?: string;
  icon?: LucideIcon;
};

export default function Input({
  label,
  error,
  helperText,
  icon: Icon,
  type = "text",
  className = "",
  id: explicitId,
  ...rest
}: Props) {
  const generatedId = useId();
  const id = explicitId || generatedId;
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const errorId = error ? `${id}-error` : undefined;
  const helperId = helperText ? `${id}-helper` : undefined;

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        )}
        <input
          id={id}
          type={isPassword && show ? "text" : type}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId || helperId}
          className={`h-9.5 w-full rounded-lg border bg-[#0d131f] text-sm text-slate-100 placeholder:text-slate-400 transition-colors duration-150 ease-out focus:outline-none focus:ring-2 ${
            Icon ? "pl-9" : "pl-3"
          } ${isPassword ? "pr-10" : "pr-3"} ${
            error
              ? "border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/25"
              : "border-slate-700/80 hover:border-slate-600 focus:border-blue-500 focus:ring-blue-500/25"
          } ${className}`}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error ? (
        <p id={errorId} className="ui-feedback-enter text-xs font-medium text-rose-400">
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
