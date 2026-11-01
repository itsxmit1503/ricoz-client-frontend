import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

import "./globals.css";

export const metadata: Metadata = {
  title: "Ricoz | Manufacturing Operations ERP",
  description: "Manufacturing operations management, shop-floor dispatch, and machine telemetry cockpit.",
};

const defaultDevPublishableKey = "pk_test_Y2xlcmsuaHR0cDovL2xvY2FsaG9zdDozMDAwJAA";
const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || defaultDevPublishableKey;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased bg-slate-950 text-slate-100 theme-scrollbar font-sans">
        <ClerkProvider
          publishableKey={clerkPublishableKey}
          appearance={dark as any}
        >
          {children}
        </ClerkProvider>

        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: "#0f172a", color: "#f1f5f9", border: "1px solid #334155" },
          }}
        />
      </body>
    </html>
  );
}
