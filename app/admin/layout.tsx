import type { Metadata } from "next";
import type { ReactNode } from "react";

// The admin must never show up in search results.
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return children;
}
