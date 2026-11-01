import { Suspense, type ReactNode } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { FullScreenSpinner } from "@/components/ui/Spinner";
import { AuthProvider } from "@/context/AuthContext";

export const instant = false;

export default function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AuthProvider>
      <Suspense fallback={<FullScreenSpinner />}>
        <AdminShell>{children}</AdminShell>
      </Suspense>
    </AuthProvider>
  );
}