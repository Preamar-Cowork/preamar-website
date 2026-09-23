import { Lockup } from "@/components/brand/Brand";
import type { ReactNode } from "react";
import { SignOutButton } from "@/components/admin/SignOutButton";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-pm-bgAlt">
      <header className="bg-pm-ink px-6 md:px-10 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Lockup size={17} color="#F3F1EC" />
          <span className="text-pm-sky text-xs font-label tracking-[0.1em]">admin</span>
        </div>
        <SignOutButton />
      </header>
      <main className="max-w-[1320px] mx-auto px-6 py-12">{children}</main>
    </div>
  );
}
