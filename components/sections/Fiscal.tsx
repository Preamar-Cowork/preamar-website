"use client";

import { RevealLines } from "@/components/ui/RevealLines";
import { Folio } from "@/components/ui/Folio";

export function Fiscal() {
  return (
    <section className="bg-pm-ink py-40 md:py-[220px] px-6">
      <div className="max-w-[760px] mx-auto text-center">
        <Folio n="05" dark />
        <div className="font-label font-bold text-[11px] tracking-[0.16em] uppercase text-pm-sky mb-8">
          MORADA FISCAL
        </div>
        <RevealLines
          as="p"
          lines={["Sede da tua empresa a partir", "de 25 €/mês + IVA."]}
          className="font-display text-[40px] md:text-[56px] leading-[1.1] text-pm-bg mb-8"
        />
        <p className="text-pm-bg/70 text-lg md:text-xl m-0">
          Receção de correio e encomendas, digitalização e aviso por email.
        </p>
      </div>
    </section>
  );
}
