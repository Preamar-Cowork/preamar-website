"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/admin/login");
        router.refresh();
      }}
      className="font-label font-semibold text-[11px] tracking-[0.14em] uppercase text-pm-bg/70 hover:text-pm-bg"
    >
      Sair
    </button>
  );
}
