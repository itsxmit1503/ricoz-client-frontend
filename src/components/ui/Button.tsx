import { LoaderCircle } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
};

const variants = {
  primary:
    "border border-blue-600 bg-blue-600 text-white shadow-xs hover:bg-blue-500 hover:border-blue-500 hover:shadow-md hover:shadow-blue-500/20 focus-visible:ring-blue-400 active:bg-blue-700",
  secondary:
    "border border-slate-700 bg-slate-800 text-slate-100 shadow-xs hover:bg-slate-700 hover:border-slate-600 hover:text-white focus-visible:ring-slate-400 active:bg-slate-800",
  outline:
    "border border-slate-700/80 bg-slate-900/90 text-slate-200 shadow-xs hover:bg-slate-800 hover:border-slate-600 hover:text-white focus-visible:ring-slate-400 active:bg-slate-900",
  danger:
    "border border-rose-600 bg-rose-600 text-white shadow-xs hover:bg-rose-500 hover:border-rose-500 hover:shadow-md hover:shadow-rose-500/20 focus-visible:ring-rose-400 active:bg-rose-700",
  ghost:
    "border border-transparent bg-transparent text-slate-300 hover:bg-slate-800/70 hover:text-white focus-visible:ring-slate-400 active:bg-slate-800",
};

const sizes = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-9.5 px-4 text-xs sm:text-sm gap-2",
  lg: "h-11 px-5 text-sm sm:text-base gap-2.5",
};

export default function Button({
  loading = false,
  variant = "primary",
  size = "md",
  className = "",
  children,
  disabled,
  ...rest
}: Props) {
  return (
    <button
      disabled={disabled || loading}
      className={`ui-pressable inline-flex items-center justify-center rounded-lg font-medium tracking-tight transition-all duration-150 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06090f] disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {loading && <LoaderCircle className="h-4 w-4 animate-spin shrink-0" />}
      {children}
    </button>
  );
}
