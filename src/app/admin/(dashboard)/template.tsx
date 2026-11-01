import type { ReactNode } from "react";
export const instant = false;
export default function AdminTemplate({ children }: { children: ReactNode }) {
  return <div className="ui-page-transition">{children}</div>;
}
