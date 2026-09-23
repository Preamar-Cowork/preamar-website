"use client";

import { Symbol } from "@/components/ui/Symbol";

export function Footer() {
  return (
    <footer className="bg-pm-ink text-[#C9CDCF] py-20 md:py-28 px-6">
      <div className="max-w-[1320px] mx-auto flex flex-col items-center text-center gap-10">
        <div className="flex items-center gap-4">
          <Symbol baseWidth={38} restColor="#C9CDCF" />
          <div className="font-display text-pm-bg text-3xl md:text-4xl tracking-[0.10em]">PREAMAR</div>
        </div>
        <div className="font-label font-semibold text-[10px] tracking-[0.15em] uppercase text-[#8B8F91] flex flex-wrap justify-center gap-x-3 gap-y-2">
          <span>Montijo</span>
          <span>·</span>
          <span>ola@preamar.pt</span>
          <span>·</span>
          <span>+351 210 000 000</span>
          <span>·</span>
          <span>Instagram @preamar.montijo</span>
        </div>
      </div>
      <div className="max-w-[1320px] mx-auto mt-14 pt-6 border-t border-white/15 font-label text-[10px] tracking-[0.12em] uppercase text-[#6E7275] text-center">
        Espaço em fase de pré-abertura.
      </div>
    </footer>
  );
}
