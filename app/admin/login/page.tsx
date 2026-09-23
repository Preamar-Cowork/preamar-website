"use client";

import { Lockup } from "@/components/brand/Brand";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const configMissing = searchParams.get("config") === "missing";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("Email ou password incorretos.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm">
      <div className="flex mb-10 justify-center">
        <Lockup size={24} color="#F3F1EC" />
      </div>
      <div className="font-label font-bold text-[11px] tracking-[0.15em] uppercase text-pm-sky mb-8 text-center">
        Admin
      </div>
      {configMissing && (
        <div className="font-label text-[12px] text-pm-sky text-center mb-6 leading-relaxed">
          Falta a NEXT_PUBLIC_SUPABASE_ANON_KEY no .env.local.
        </div>
      )}
      <div className="flex flex-col gap-6">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="pm-input font-body text-[17px] text-pm-bg w-full"
          style={{ borderBottomColor: "#545759" }}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="pm-input font-body text-[17px] text-pm-bg w-full"
          style={{ borderBottomColor: "#545759" }}
          required
        />
        {error && (
          <div className="font-label text-[13px] tracking-[0.05em] text-pm-sky">{error}</div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="bg-pm-bg text-pm-ink border-0 py-4 font-label font-bold text-sm tracking-[0.14em] uppercase cursor-pointer disabled:opacity-60 mt-2"
        >
          {loading ? "A entrar…" : "Entrar"}
        </button>
      </div>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-pm-ink flex items-center justify-center px-6">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
