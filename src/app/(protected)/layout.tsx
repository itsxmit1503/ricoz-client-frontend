

import { Suspense } from "react";
import { FullScreenSpinner } from "@/components/ui/Spinner";
import AppShell from "@/components/layout/AppShell";
import { AuthProvider } from "@/context/AuthContext";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<FullScreenSpinner />}>
      <AuthProvider>
        <AppShell>{children}</AppShell>
      </AuthProvider>
    </Suspense>
  );
}