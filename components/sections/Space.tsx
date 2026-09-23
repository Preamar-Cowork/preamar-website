"use client";

import { Reveal } from "@/components/ui/Reveal";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { Folio } from "@/components/ui/Folio";

const AMENITIES = [
  "Secretárias fixas e flexíveis",
  "Gabinetes privados",
  "Sala de reuniões",
  "Cabine insonorizada para chamadas",
  "Copa",
  "Cacifos",
  "Morada fiscal",
  "Internet dedicada",
  "Muita luz natural",
  "Estacionamento fácil",
];

export function Space() {
  return (
    <section className="bg-pm-ink">
      <div className="grid grid-cols-1 md:grid-cols-[60%_40%]">
        <PhotoPlaceholder
          dark
          caption=""
          className="h-[420px] md:h-[720px] [&_figcaption]:hidden"
        />
        <div className="py-16 md:py-24 px-8 md:px-14 flex flex-col justify-center">
          <Folio n="03" dark />
          <div className="font-label font-bold text-[11px] tracking-[0.16em] uppercase text-pm-sky mb-6">
            O ESPAÇO
          </div>
          <Reveal>
            <p className="font-body text-lg md:text-[21px] leading-[1.6] text-pm-bg max-w-[440px] mb-12">
              Um espaço no Montijo pensado para trabalhar bem: luz natural em todas as salas, e a
              maré do estuário a dois passos da porta.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10">
            {AMENITIES.map((a) => (
              <div
                key={a}
                className="flex items-baseline gap-2.5 py-3 border-t border-white/15 text-[15px] text-pm-bg"
              >
                <span className="text-pm-sky">—</span>
                <span>{a}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
