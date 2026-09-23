"use client";

import { useState } from "react";
import { Folio } from "@/components/ui/Folio";

const ITEMS = [
  { q: "Onde fica exatamente?", a: "No centro do Montijo, junto ao estuário do Tejo." },
  { q: "Quanto tempo demoro de carro?", a: "Do centro de Lisboa, cerca de 20 minutos sem ponte — pela A12 ou de barco até ao Barreiro/Montijo. De Alcochete ou Moita, menos de 15." },
  { q: "Tem estacionamento?", a: "Sim, estacionamento fácil junto ao edifício." },
  { q: "Quando abre?", a: "Estamos em fase de pré-abertura — as reservas agora garantem lugar desde o primeiro dia." },
  { q: "Posso visitar antes?", a: "Sim, marcamos uma visita ao espaço antes de decidires." },
  { q: "O sinal é mesmo reembolsável?", a: "Sim. Os 20 € de sinal são totalmente reembolsáveis se decidires não avançar." },
  { q: "Posso mudar de plano?", a: "Sim, os planos podem ser ajustados às tuas necessidades." },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-32 md:py-[180px] px-6">
      <div className="max-w-[720px] mx-auto">
        <Folio n="08" />
        <div className="font-label font-bold text-[11px] tracking-[0.16em] uppercase text-pm-concrete mb-10">
          PERGUNTAS FREQUENTES
        </div>
        <div className="flex flex-col">
          {ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className="border-b border-pm-line">
                <div
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex justify-between items-center gap-6 py-7 cursor-pointer"
                >
                  <span className="font-body font-bold text-xl md:text-2xl text-pm-ink">{item.q}</span>
                  <span className="font-label text-pm-sky text-2xl leading-none">{isOpen ? "–" : "+"}</span>
                </div>
                <div
                  className="overflow-hidden transition-[max-height] duration-500 ease-[cubic-bezier(.22,1,.36,1)] text-pm-graphite text-base leading-relaxed max-w-[62ch]"
                  style={{ maxHeight: isOpen ? 200 : 0, paddingBottom: isOpen ? 24 : 0 }}
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
