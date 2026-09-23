"use client";

import { forwardRef, useState } from "react";
import { Symbol } from "@/components/ui/Symbol";
import { Chips } from "@/components/ui/Chips";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Folio } from "@/components/ui/Folio";

const ONDE_OPTIONS = ["Montijo", "Alcochete", "Outro"];
const INTERESSE_OPTIONS = [
  "Secretária flexível",
  "Secretária fixa",
  "Gabinete privado",
  "Só morada fiscal",
  "Sala de reuniões pontual",
  "Ainda não sei",
];
const GABINETE_OPTIONS = ["1-2", "3-4", "5-6", "Mais"];
const DIAS_OPTIONS = ["1-2", "3-4", "5", "Ocasionalmente"];
const QUANDO_OPTIONS = ["Já", "1-3 meses", "3-6 meses", "Só a explorar"];
const CACIFO_OPTIONS = ["Sim", "Não", "Talvez"];

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

export const ReservationForm = forwardRef<HTMLDivElement>(function ReservationForm(_, ref) {
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
    <section id="reserva-form" ref={ref} className="bg-pm-bg py-32 md:py-[180px] px-6">
      <div className="max-w-[1180px] mx-auto">
        {!submitted ? (
          <div className="grid grid-cols-1 md:grid-cols-[35%_65%] gap-16">
            <div>
              <div className="md:sticky md:top-24">
                <Folio n="07" />
                <div className="flex items-center gap-3 mb-8">
                  <Symbol baseWidth={22} restColor="#3F4346" />
                  <div className="font-display text-base tracking-[0.10em] text-pm-ink uppercase">
                    PREAMAR
                  </div>
                </div>
                <h2 className="font-display text-[34px] md:text-[42px] leading-[1.05] text-pm-ink mb-6">
                  Diz-nos o que precisas.
                </h2>
                <p className="text-pm-graphite text-base leading-relaxed max-w-[32ch]">
                  Respondemos em menos de 24 horas úteis e combinamos uma visita ao espaço.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-9">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-9">
                <input
                  placeholder="Nome"
                  value={form.nome}
                  onChange={(e) => setField("nome", e.target.value)}
                  className="pm-input font-body text-[17px] text-pm-ink w-full"
                />
                <input
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  className="pm-input font-body text-[17px] text-pm-ink w-full"
                />
                <input
                  placeholder="Telemóvel"
                  value={form.telefone}
                  onChange={(e) => setField("telefone", e.target.value)}
                  className="pm-input font-body text-[17px] text-pm-ink w-full"
                />
                <input
                  placeholder="Profissão ou empresa"
                  value={form.profissao}
                  onChange={(e) => setField("profissao", e.target.value)}
                  className="pm-input font-body text-[17px] text-pm-ink w-full"
                />
              </div>

              <div>
                <div className={labelClass}>Onde moras</div>
                <Chips options={ONDE_OPTIONS} value={form.onde} onChange={(v) => setField("onde", v)} light />
              </div>

              <div>
                <div className={labelClass}>O que te interessa</div>
                <Chips
                  options={INTERESSE_OPTIONS}
                  value={form.interesse}
                  onChange={(v) => setField("interesse", v)}
                  light
                />
              </div>

              {form.interesse === "Gabinete privado" && (
                <div>
                  <div className={labelClass}>Para quantas pessoas</div>
                  <Chips
                    options={GABINETE_OPTIONS}
                    value={form.gabinete}
                    onChange={(v) => setField("gabinete", v)}
                    light
                  />
                </div>
              )}

              <div>
                <div className={labelClass}>Quantos dias por semana</div>
                <Chips options={DIAS_OPTIONS} value={form.dias} onChange={(v) => setField("dias", v)} light />
              </div>

              <div className="max-w-sm">
                <div className={labelClass}>Quando precisarias</div>
                <SegmentedControl options={QUANDO_OPTIONS} value={form.quando} onChange={(v) => setField("quando", v)} light />
              </div>

              <div className="max-w-xs">
                <div className={labelClass}>Precisas de cacifo?</div>
                <SegmentedControl options={CACIFO_OPTIONS} value={form.cacifo} onChange={(v) => setField("cacifo", v)} light />
              </div>

              <div
                onClick={() => setField("sinalCheck", !form.sinalCheck)}
                className="flex gap-3.5 items-start cursor-pointer border-t border-pm-line pt-8"
              >
                <div className={checkboxBase}>{form.sinalCheck ? "✓" : ""}</div>
                <span className="text-pm-ink text-[15px] leading-snug">
                  Quero reservar lugar com um sinal reembolsável de 20 €
                </span>
              </div>

              <div
                onClick={() => setField("privacyCheck", !form.privacyCheck)}
                className="flex gap-3.5 items-start cursor-pointer"
              >
                <div className={checkboxBase}>{form.privacyCheck ? "✓" : ""}</div>
                <span className="text-pm-ink text-[15px] leading-snug">
                  Aceito a política de privacidade
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
                {submitting ? "A enviar…" : "Reservar o meu lugar"}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 max-w-[600px] mx-auto">
            <div className="flex justify-center mb-8">
              <Symbol baseWidth={36} restColor="#3F4346" />
            </div>
            <h2 className="font-display text-pm-ink text-[36px] mb-5">Recebemos o teu pedido.</h2>
            <p className="text-pm-graphite text-lg leading-relaxed">
              Entramos em contacto brevemente para tratar do resto. Até já.
            </p>
          </div>
        )}
      </div>
    </section>
  );
});
