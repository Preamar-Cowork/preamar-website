"use client";

import { Symbol } from "@/components/ui/Symbol";

export function Footer() {
  return (
    <footer className="bg-pm-ink text-[#C9CDCF] py-14 px-6">
      <div className="max-w-[1240px] mx-auto flex flex-wrap justify-between items-center gap-8">
        <div className="flex items-center gap-3">
          <Symbol baseWidth={26} restColor="#C9CDCF" />
          <div>
            <div className="font-display text-pm-bg text-base tracking-[0.1em]">PREAMAR</div>
            <div className="font-label text-[10px] tracking-[0.14em] uppercase text-pm-sky mt-1">
              ESPAÇOS DE TRABALHO · MONTIJO
            </div>
          </div>
        </div>
        <div className="font-body text-sm leading-relaxed">
          <div>Praça Municipal, Montijo</div>
          <div>ola@preamar.pt · +351 210 000 000</div>
          <div>Instagram @preamar.montijo</div>
        </div>
      </div>
      <div className="max-w-[1240px] mx-auto mt-8 pt-6 border-t border-white/20 font-label text-[11px] tracking-[0.1em] uppercase text-pm-concrete">
        Espaço em fase de pré-abertura.
      </div>
    </footer>
  );
}
