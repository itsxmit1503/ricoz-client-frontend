"use client";

import type { ReactNode } from "react";

export default function ProtectedTemplate({ children }: { children: ReactNode }) {
  return <div className="ui-page-transition">{children}</div>;
}
