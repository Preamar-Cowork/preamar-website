"use client";

import { BrandSymbol, Lockup } from "@/components/brand/Brand";
import { forwardRef, useState } from "react";
import { Chips } from "@/components/ui/Chips";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Folio } from "@/components/ui/Folio";
import type { SiteSections } from "@/lib/content/schema";

type FormState = {
  nome: string;
  email: string;
  telefone: string;
  profissao: string;
  onde: string | null;
  interesse: string | null;
  gabinete: string | null;
  dias: string | null;
  quando: string | null;
  cacifo: string | null;
  sinalCheck: boolean;
  privacyCheck: boolean;
};

const INITIAL: FormState = {
  nome: "",
  email: "",
  telefone: "",
  profissao: "",
  onde: null,
  interesse: null,
  gabinete: null,
  dias: null,
  quando: null,
  cacifo: null,
  sinalCheck: false,
  privacyCheck: false,
};

const labelClass = "font-label font-bold text-[11px] tracking-[0.15em] uppercase text-pm-concrete mb-3";
const checkboxBase =
  "w-[18px] h-[18px] border border-pm-ink flex-shrink-0 flex items-center justify-center text-[11px] text-pm-ink mt-0.5";

type Props = { content: SiteSections["form"]; n: string };

export const ReservationForm = forwardRef<HTMLDivElement, Props>(function ReservationForm({ content: c, n }, ref) {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const setField = <K extends keyof FormState>(key: K, val: FormState[K]) =>
    setForm((s) => ({ ...s, [key]: val }));

  async function handleSubmit() {
    if (!form.nome || !form.email || !form.telefone) {
      setErrorMsg("Preenche nome, email e telemóvel.");
      return;
    }
    if (!form.privacyCheck) {
      setErrorMsg("Aceita a política de privacidade para continuar.");
      return;
    }
    setErrorMsg("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("request_failed");
      setSubmitted(true);
    } catch {
      setErrorMsg("Não foi possível enviar agora. Tenta de novo em instantes.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="reserva-form" ref={ref} className="bg-pm-bgAlt py-32 md:py-[180px] px-6">
      <div className="max-w-[1180px] mx-auto">
        {!submitted ? (
          <div className="grid grid-cols-1 md:grid-cols-[35%_65%] gap-16">
            <div>
              <div className="md:sticky md:top-24">
                <Folio n={n} />
                <Lockup size={18} className="mb-8" />
                <h2 className="font-display text-[34px] md:text-[42px] leading-[1.05] text-pm-ink mb-6">
                  {c.heading}
                </h2>
                <p className="text-pm-graphite text-base leading-relaxed max-w-[32ch]">
                  {c.text}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-9">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-9">
                <input
                  placeholder={c.phNome}
                  value={form.nome}
                  onChange={(e) => setField("nome", e.target.value)}
                  className="pm-input font-body text-[17px] text-pm-ink w-full"
                />
                <input
                  placeholder={c.phEmail}
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  className="pm-input font-body text-[17px] text-pm-ink w-full"
                />
                <input
                  placeholder={c.phTelefone}
                  value={form.telefone}
                  onChange={(e) => setField("telefone", e.target.value)}
                  className="pm-input font-body text-[17px] text-pm-ink w-full"
                />
                <input
                  placeholder={c.phProfissao}
                  value={form.profissao}
                  onChange={(e) => setField("profissao", e.target.value)}
                  className="pm-input font-body text-[17px] text-pm-ink w-full"
                />
              </div>

              <div>
                <div className={labelClass}>{c.ondeLabel}</div>
                <Chips options={c.onde} value={form.onde} onChange={(v) => setField("onde", v)} light />
              </div>

              <div>
                <div className={labelClass}>{c.interesseLabel}</div>
                <Chips
                  options={c.interesse}
                  value={form.interesse}
                  onChange={(v) => setField("interesse", v)}
                  light
                />
              </div>

              {form.interesse && /gabinete/i.test(form.interesse) && (
                <div>
                  <div className={labelClass}>{c.gabineteLabel}</div>
                  <Chips
                    options={c.gabinete}
                    value={form.gabinete}
                    onChange={(v) => setField("gabinete", v)}
                    light
                  />
                </div>
              )}

              <div>
                <div className={labelClass}>{c.diasLabel}</div>
                <Chips options={c.dias} value={form.dias} onChange={(v) => setField("dias", v)} light />
              </div>

              <div className="max-w-sm">
                <div className={labelClass}>{c.quandoLabel}</div>
                <SegmentedControl options={c.quando} value={form.quando} onChange={(v) => setField("quando", v)} light />
              </div>

              <div className="max-w-xs">
                <div className={labelClass}>{c.cacifoLabel}</div>
                <SegmentedControl options={c.cacifo} value={form.cacifo} onChange={(v) => setField("cacifo", v)} light />
              </div>

              <div
                onClick={() => setField("sinalCheck", !form.sinalCheck)}
                className="flex gap-3.5 items-start cursor-pointer border-t border-pm-line pt-8"
              >
                <div className={checkboxBase}>{form.sinalCheck ? "✓" : ""}</div>
                <span className="text-pm-ink text-[15px] leading-snug">
                  {c.sinalText}
                </span>
              </div>

              <div
                onClick={() => setField("privacyCheck", !form.privacyCheck)}
                className="flex gap-3.5 items-start cursor-pointer"
              >
                <div className={checkboxBase}>{form.privacyCheck ? "✓" : ""}</div>
                <span className="text-pm-ink text-[15px] leading-snug">
                  {c.privacyText}
                </span>
              </div>

              {errorMsg && (
                <div className="font-label text-[13px] tracking-[0.05em] text-pm-sky">{errorMsg}</div>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-pm-ink text-pm-bg border-0 py-[18px] font-label font-bold text-sm tracking-[0.14em] uppercase cursor-pointer disabled:opacity-60 max-w-sm"
              >
                {submitting ? "A enviar…" : c.submitText}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 max-w-[600px] mx-auto">
            <div className="flex justify-center mb-8">
              <BrandSymbol className="h-12 w-auto" />
            </div>
            <h2 className="font-display text-pm-ink text-[36px] mb-5">{c.successTitle}</h2>
            <p className="text-pm-graphite text-lg leading-relaxed">
              {c.successText}
            </p>
          </div>
        )}
      </div>
    </section>
  );
});
