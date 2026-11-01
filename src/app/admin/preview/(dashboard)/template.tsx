import type { ReactNode } from "react";

export default function AdminPreviewTemplate({ children }: { children: ReactNode }) {
  return <div className="ui-page-transition">{children}</div>;
}
