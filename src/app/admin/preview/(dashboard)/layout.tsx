import type { ReactNode } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { AuthProvider } from "@/context/AuthContext";

export default function AdminPreviewLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AdminShell>{children}</AdminShell>
    </AuthProvider>
  );
}
