"use client";

import { RevealLines } from "@/components/ui/RevealLines";
import { Folio } from "@/components/ui/Folio";

export function About() {
  return (
    <section className="bg-pm-bg py-32 md:py-[180px] px-6">
      <div className="max-w-[640px] mx-auto text-left">
        <Folio n="01" />
        <div className="font-label font-bold text-[11px] tracking-[0.16em] uppercase text-pm-concrete mb-8">
          O QUE É PREAMAR
        </div>
        <RevealLines
          as="p"
          lines={[
            "Preamar é a maré cheia — o ponto mais alto,",
            "quando a água chega ao máximo e fica parada",
            "uns minutos antes de virar. Acontece duas vezes",
            "por dia no estuário aqui ao lado. É a janela em",
            "que os barcos entram e saem. Pareceu-nos um bom",
            "nome para um sítio onde o trabalho tem",
            "finalmente condições.",
          ]}
          className="font-body text-[26px] md:text-[32px] leading-[1.35] text-pm-ink m-0"
        />
      </div>
    </section>
  );
}
