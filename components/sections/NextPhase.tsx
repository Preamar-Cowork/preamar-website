"use client";

import { RevealLines } from "@/components/ui/RevealLines";
import { Folio } from "@/components/ui/Folio";

export function NextPhase() {
  return (
    <section className="bg-pm-bg py-32 md:py-[180px] px-6">
      <div className="max-w-[640px] mx-auto">
        <Folio n="06" />
        <div className="font-label font-bold text-[11px] tracking-[0.16em] uppercase text-pm-concrete mb-8">
          O QUE VEM A SEGUIR
        </div>
        <RevealLines
          as="p"
          lines={[
            "Este é o primeiro espaço, não o único.",
            "O plano é crescer para um edifício maior,",
            "com salas de conferência e estúdios de",
            "gravação. Quem entra agora entra no início.",
          ]}
          className="font-body text-[24px] md:text-[28px] leading-[1.4] text-pm-ink m-0"
        />
      </div>
    </section>
  );
}
