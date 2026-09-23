"use client";

import { useState } from "react";

const ITEMS = [
  { q: "Onde fica exatamente?", a: "No centro do Montijo, junto ao estuário do Tejo." },
  { q: "Preciso de atravessar a ponte?", a: "Não. É essa a ideia: trabalhar perto de casa, sem a ponte." },
  { q: "Tem estacionamento?", a: "Sim, estacionamento fácil junto ao edifício." },
  {
    q: "Quando abre?",
    a: "Estamos em fase de pré-abertura — as reservas agora garantem lugar desde o primeiro dia.",
  },
  { q: "Posso visitar antes?", a: "Sim, marcamos uma visita ao espaço antes de decidires." },
  { q: "O sinal é reembolsável?", a: "Sim, os 20 € de sinal são totalmente reembolsáveis." },
  { q: "Posso mudar de plano?", a: "Sim, os planos podem ser ajustados às tuas necessidades." },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-24 md:py-[120px] px-6">
      <div className="max-w-[600px] mx-auto">
        <div className="font-label font-bold text-xs tracking-[0.16em] uppercase text-pm-concrete mb-9">
          PERGUNTAS FREQUENTES
        </div>
        <div className="flex flex-col">
          {ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className="border-b border-pm-line">
                <div
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex justify-between items-center gap-4 py-5 cursor-pointer"
                >
                  <span className="font-body font-bold text-lg text-pm-ink">{item.q}</span>
                  <span className="font-label text-pm-sky text-xl">{isOpen ? "–" : "+"}</span>
                </div>
                <div
                  className="overflow-hidden transition-[max-height] duration-500 ease-[cubic-bezier(.16,1,.3,1)] text-pm-graphite text-[15px] leading-relaxed"
                  style={{ maxHeight: isOpen ? 200 : 0, paddingBottom: isOpen ? 20 : 0 }}
                >
                  {item.a}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
