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
      <label htmlFor={id} className="block text-sm font-medium text-slate-300">
        {label}
      </label>
      <div className="relative">
        {Icon && <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />}
        <input
          id={id}
          type={isPassword && show ? "text" : type}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className={`h-11 w-full rounded-lg border bg-slate-900 text-sm text-slate-100 placeholder:text-slate-500 transition focus:outline-none focus:ring-2 ${
            Icon ? "pl-10" : "pl-3"
          } ${isPassword ? "pr-10" : "pr-3"} ${
            error
              ? "border-red-500/70 focus:ring-red-500/40"
              : "border-slate-700/90 focus:border-slate-500 focus:ring-slate-500/40"
          } ${className}`}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded text-slate-500 hover:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && <p id={errorId} className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
