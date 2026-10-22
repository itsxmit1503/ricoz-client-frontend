import { LoaderCircle } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  variant?: "primary" | "outline" | "danger" | "ghost";
};

const variants = {
  primary:
    "border border-blue-500/80 bg-blue-600 text-white shadow-sm shadow-blue-950/40 hover:bg-blue-500 hover:border-blue-400 focus-visible:ring-blue-400 disabled:hover:bg-blue-600 disabled:hover:border-blue-500/80",
  outline:
    "border border-slate-700/80 bg-slate-900/80 text-slate-200 shadow-sm shadow-black/20 hover:bg-slate-800 hover:border-slate-600 hover:text-white focus-visible:ring-slate-400",
  danger:
    "border border-red-500/70 bg-red-600/90 text-white shadow-sm shadow-red-950/40 hover:bg-red-500 hover:border-red-400 focus-visible:ring-red-400",
  ghost:
    "border border-transparent bg-transparent text-slate-300 hover:bg-slate-800/60 hover:text-white focus-visible:ring-slate-400",
};

export default function Button({
  loading = false,
  variant = "primary",
  className = "",
  children,
  disabled,
  ...rest
}: Props) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium tracking-tight transition-[transform,background-color,border-color,box-shadow] duration-150 ease-out motion-reduce:transition-none hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] disabled:hover:translate-y-0 disabled:active:scale-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...rest}
    >
      {loading && <LoaderCircle className="h-4 w-4 animate-spin shrink-0" />}
      {children}
    </button>
  );
}
