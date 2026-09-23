import type { ReactNode } from "react";
import { Lockup } from "@/components/brand/Brand";
import { SignOutButton } from "@/components/admin/SignOutButton";
import { AdminNav } from "@/components/admin/AdminNav";

export default function AdminPanelLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-pm-bgAlt">
      <header className="bg-pm-ink px-6 md:px-10 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Lockup size={17} color="#F3F1EC" />
          <span className="text-pm-sky text-xs font-label tracking-[0.1em]">admin</span>
        </div>
        <SignOutButton />
      </header>
      <div className="max-w-[1480px] mx-auto px-6 py-8 lg:py-12 grid grid-cols-1 lg:grid-cols-[200px_minmax(0,1fr)] gap-6 lg:gap-10">
        <aside className="lg:sticky lg:top-8 self-start">
          <AdminNav />
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
