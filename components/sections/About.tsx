"use client";

import { Reveal } from "@/components/ui/Reveal";
import { Folio } from "@/components/ui/Folio";

export function About() {
  return (
    <section className="bg-pm-bgAlt py-28 md:py-[160px] px-6">
      <div className="max-w-[680px] mx-auto text-left">
        <Folio n="05" />
        <div className="font-label font-bold text-[11px] tracking-[0.16em] uppercase text-pm-concrete mb-8">
          O que é Preamar
        </div>
        <Reveal>
          <p className="font-body text-[24px] md:text-[32px] leading-[1.45] text-pm-ink m-0">
            Preamar é a maré cheia — o ponto mais alto, quando a água chega ao máximo e fica
            parada uns minutos antes de virar. Acontece duas vezes por dia no estuário aqui ao
            lado. É a janela em que os barcos entram e saem. Pareceu-nos um bom nome para um
            sítio onde o trabalho tem finalmente condições.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
