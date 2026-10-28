import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Ricoz | Manufacturing Operations ERP",
  description: "Manufacturing operations management, shop-floor dispatch, and machine telemetry cockpit.",
};

const hasClerkKey = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} min-h-screen antialiased bg-slate-950 text-slate-100 theme-scrollbar`}>
        <Suspense fallback={<div>Page is Loading</div>}>
          {hasClerkKey ? (
            <ClerkProvider>{children}</ClerkProvider>
          ) : (
            children
          )}
        </Suspense>

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
