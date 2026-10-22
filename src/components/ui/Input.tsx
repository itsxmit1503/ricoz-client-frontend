"use client";

import { Eye, EyeOff, type LucideIcon } from "lucide-react";
import { useId, useState, type InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  icon?: LucideIcon;
};

export default function Input({ label, error, icon: Icon, type = "text", className = "", ...rest }: Props) {
  const id = useId();
  const errorId = error ? `${id}-error` : undefined;
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-xs font-medium text-slate-300">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors" />
        )}
        <input
          id={id}
          type={isPassword && show ? "text" : type}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className={`h-10 w-full rounded-lg border bg-slate-950/70 text-sm text-slate-100 placeholder:text-slate-500 transition-colors duration-150 ease-out motion-reduce:transition-none focus:outline-none focus:ring-2 ${
            Icon ? "pl-9" : "pl-3"
          } ${isPassword ? "pr-10" : "pr-3"} ${
            error
              ? "border-red-500/80 focus:border-red-500 focus:ring-red-500/25"
              : "border-slate-800/90 hover:border-slate-700 focus:border-blue-500 focus:ring-blue-500/25"
          } ${className}`}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-500 transition-colors duration-150 ease-out hover:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && <p id={errorId} className="ui-feedback-enter text-xs font-medium text-red-400">{error}</p>}
    </div>
  );
}
