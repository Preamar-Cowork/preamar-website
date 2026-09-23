import type { ReactNode } from "react";
import { SignOutButton } from "@/components/admin/SignOutButton";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-pm-bgAlt">
      <header className="bg-pm-ink px-6 md:px-10 py-5 flex items-center justify-between">
        <div className="font-display text-pm-bg text-base tracking-[0.10em] uppercase">
          PREAMAR <span className="text-pm-sky text-xs align-middle ml-2 font-label tracking-[0.1em] normal-case">admin</span>
        </div>
        <SignOutButton />
      </header>
      <main className="max-w-[720px] mx-auto px-6 py-16">{children}</main>
    </div>
  );
}
