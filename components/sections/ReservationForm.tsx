"use client";

import { forwardRef, useMemo, useState } from "react";
import { Symbol } from "@/components/ui/Symbol";
import { Chips } from "@/components/ui/Chips";
import { SegmentedControl } from "@/components/ui/SegmentedControl";

const LOCATIONS = [
  "Montijo",
  "Alcochete",
  "Samouco",
  "Moita",
  "Sarilhos Grandes",
  "Barreiro",
  "Pinhal Novo",
  "Coina",
  "Alhos Vedros",
];

const DIAS_LABELS = ["Ocasionalmente", "1", "2", "3", "4", "5", "6"];
const INTERESSE_OPTIONS = [
  "Secretária flexível",
  "Secretária fixa",
  "Gabinete privado",
  "Só morada fiscal",
  "Sala de reuniões pontual",
  "Ainda não sei",
];
const GABINETE_OPTIONS = ["2-3", "4-5", "6"];
const QUANDO_OPTIONS = ["Já", "1-3 meses", "3-6 meses", "Só a explorar"];
const CACIFO_OPTIONS = ["Sim", "Talvez", "Não"];

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

const inputClass =
  "bg-transparent border-0 border-b border-[#7B8083] text-pm-bg py-3 font-body text-[17px] w-full outline-none focus:border-pm-sky transition-colors";
const labelClass =
  "font-label font-bold text-xs tracking-[0.14em] uppercase text-[#C9CDCF] mb-3";
const checkboxBase =
  "w-[18px] h-[18px] border border-pm-sky flex-shrink-0 flex items-center justify-center text-[11px] text-pm-sky mt-0.5";

export const ReservationForm = forwardRef<HTMLDivElement>(function ReservationForm(_, ref) {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [ondeQuery, setOndeQuery] = useState("");
  const [ondeOpen, setOndeOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const setField = <K extends keyof FormState>(key: K, val: FormState[K]) =>
    setForm((s) => ({ ...s, [key]: val }));

  const ondeMatches = useMemo(() => {
    const base = ondeQuery
      ? LOCATIONS.filter((l) => l.toLowerCase().includes(ondeQuery.toLowerCase()))
      : ["Montijo", "Alcochete", "Samouco"];
    return base;
  }, [ondeQuery]);

  const diasIndex = form.dias ? DIAS_LABELS.indexOf(form.dias) : 0;
  const diasLabel = form.dias
    ? form.dias === "Ocasionalmente"
      ? "Ocasionalmente"
      : `${form.dias} dia${form.dias === "1" ? "" : "s"} por semana`
    : "Arrasta para escolher";

  const sinalTitle =
    form.interesse === "Gabinete privado"
      ? "Reservar com sinal de 100 € — garante já o teu gabinete"
      : "Reservar com sinal de 20 € — garante já o teu lugar";
  const sinalDesc =
    form.interesse === "Gabinete privado"
      ? "Gabinetes privados pedem um sinal de 100 €, totalmente reembolsável se decidires não avançar."
      : "O sinal é totalmente reembolsável se decidires não avançar.";

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
    <section id="reserva-form" ref={ref} className="bg-pm-ink py-24 md:py-[120px] px-6">
      <div className="max-w-[600px] mx-auto">
        {!submitted ? (
          <div>
            <div className="font-label font-bold text-xs tracking-[0.16em] uppercase text-pm-sky mb-4">
              RESERVAR LUGAR
            </div>
            <h2 className="font-display text-pm-bg text-[34px] mb-11">Diz-nos o que precisas.</h2>

            <div className="flex flex-col gap-5">
              <input
                placeholder="Nome"
                value={form.nome}
                onChange={(e) => setField("nome", e.target.value)}
                className={inputClass}
              />
              <input
                placeholder="Email"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                className={inputClass}
              />
              <input
                placeholder="Telemóvel"
                value={form.telefone}
                onChange={(e) => setField("telefone", e.target.value)}
                className={inputClass}
              />
              <input
                placeholder="Profissão ou empresa"
                value={form.profissao}
                onChange={(e) => setField("profissao", e.target.value)}
                className={inputClass}
              />

              <div className="relative">
                <div className={labelClass}>Onde moras</div>
                <input
                  placeholder="Escreve ou escolhe a tua zona"
                  value={ondeQuery}
                  onChange={(e) => {
                    setOndeQuery(e.target.value);
                    setOndeOpen(true);
                  }}
                  onFocus={() => setOndeOpen(true)}
                  onBlur={() => setTimeout(() => setOndeOpen(false), 150)}
                  className={inputClass}
                />
                {ondeOpen && (
                  <div className="absolute top-full left-0 right-0 bg-pm-ink border border-[#545759] z-20 mt-1 max-h-[220px] overflow-y-auto">
                    {ondeMatches.map((loc) => (
                      <div
                        key={loc}
                        onMouseDown={() => {
                          setOndeQuery(loc);
                          setOndeOpen(false);
                          setField("onde", loc);
                        }}
                        className="px-3.5 py-3 text-pm-bg text-[15px] cursor-pointer border-b border-[#545759]"
                      >
                        {loc}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className={labelClass}>O que te interessa</div>
                <Chips
                  options={INTERESSE_OPTIONS}
                  value={form.interesse}
                  onChange={(v) => setField("interesse", v)}
                />
              </div>

              {form.interesse === "Gabinete privado" && (
                <div>
                  <div className={labelClass}>Para quantas pessoas</div>
                  <Chips
                    options={GABINETE_OPTIONS}
                    value={form.gabinete}
                    onChange={(v) => setField("gabinete", v)}
                  />
                </div>
              )}

              <div>
                <div className={labelClass}>Quantos dias por semana</div>
                <div
                  className="font-body font-bold text-base mb-2.5"
                  style={{ color: form.dias ? "#84A6B2" : "#C9CDCF" }}
                >
                  {diasLabel}
                </div>
                <input
                  type="range"
                  className="pm-range"
                  min={0}
                  max={6}
                  step={1}
                  value={diasIndex}
                  onChange={(e) => setField("dias", DIAS_LABELS[parseInt(e.target.value, 10)])}
                />
                <div className="flex justify-between mt-1.5">
                  {DIAS_LABELS.map((label) => (
                    <span
                      key={label}
                      className="font-label text-[11px] tracking-[0.06em] uppercase"
                      style={{
                        color: form.dias === label ? "#84A6B2" : "#7B8083",
                        fontWeight: form.dias === label ? 700 : 500,
                      }}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className={labelClass}>Quando precisarias</div>
                <SegmentedControl
                  options={QUANDO_OPTIONS}
                  value={form.quando}
                  onChange={(v) => setField("quando", v)}
                />
              </div>

              <div>
                <div className={labelClass}>Precisas de cacifo?</div>
                <SegmentedControl
                  options={CACIFO_OPTIONS}
                  value={form.cacifo}
                  onChange={(v) => setField("cacifo", v)}
                />
              </div>

              <div
                onClick={() => setField("sinalCheck", !form.sinalCheck)}
                className="p-5 mt-2 cursor-pointer transition-all"
                style={{
                  border: `1px solid ${form.sinalCheck ? "#84A6B2" : "#545759"}`,
                  background: form.sinalCheck ? "rgba(132,166,178,0.12)" : "transparent",
                }}
              >
                <div className="flex gap-3.5 items-start">
                  <div className={checkboxBase}>{form.sinalCheck ? "✓" : ""}</div>
                  <div>
                    <div className="font-body font-bold text-[17px] text-pm-bg mb-1.5">
                      {sinalTitle}
                    </div>
                    <div className="text-[#C9CDCF] text-sm leading-relaxed">{sinalDesc}</div>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setField("privacyCheck", !form.privacyCheck)}
                className="flex gap-3 items-start cursor-pointer mt-1"
              >
                <div className={checkboxBase}>{form.privacyCheck ? "✓" : ""}</div>
                <span className="text-pm-bg text-[15px] leading-snug">
                  Aceito a política de privacidade
                </span>
              </div>

              {errorMsg && (
                <div className="font-label text-[13px] tracking-[0.05em] text-pm-sky">
                  {errorMsg}
                </div>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-pm-bg text-pm-ink border-0 py-[18px] font-label font-bold text-sm tracking-[0.12em] uppercase cursor-pointer mt-3.5 disabled:opacity-60"
              >
                {submitting ? "A enviar…" : "Reservar o meu lugar"}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="flex justify-center mb-7">
              <Symbol baseWidth={36} restColor="#F3F1EC" />
            </div>
            <h2 className="font-display text-pm-bg text-[30px] mb-[18px]">
              Recebemos o teu pedido.
            </h2>
            <p className="text-[#C9CDCF] text-[17px] leading-relaxed">
              Entramos em contacto brevemente para tratar do resto. Até já.
            </p>
          </div>
        )}
      </div>
    </section>
  );
});
