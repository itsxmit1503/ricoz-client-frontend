import { CheckCircle2, Factory } from "lucide-react";
import type { ReactNode } from "react";

const highlights = [
  "Production plans, work orders and shop-floor execution",
  "Machines, maintenance and quality in one place",
  "Inventory, suppliers, purchasing and BOM tracking",
];

export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2 bg-[#090d16]">
      <aside className="hidden flex-col justify-between border-r border-slate-800/80 bg-[#0c111e] p-12 lg:flex">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 shadow-md shadow-blue-900/30">
            <Factory className="h-5 w-5 text-white" />
          </span>
          <span className="text-xl font-bold tracking-tight text-white">Ricoz</span>
        </div>

        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
            ENTERPRISE MANUFACTURING ERP
          </div>
          <h2 className="max-w-md text-3xl font-bold text-white leading-tight tracking-tight">
            Run your manufacturing floor from one cockpit.
          </h2>
          <ul className="mt-8 space-y-4">
            {highlights.map((h) => (
              <li key={h} className="flex items-start gap-3 text-slate-200">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm font-medium text-slate-400">© Ricoz Inc. All rights reserved.</p>
      </aside>

      <main className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 shadow-md">
              <Factory className="h-4 w-4 text-white" />
            </span>
            <span className="text-lg font-bold text-white">Ricoz</span>
          </div>

          {title && <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>}
          {subtitle && <p className="mt-2 text-sm text-slate-300">{subtitle}</p>}

          <div className={title ? "mt-8" : "flex justify-center"}>{children}</div>

          {footer && <div className="mt-6 text-center text-sm text-slate-400">{footer}</div>}
        </div>
      </main>
    </div>
  );
}
