"use client";

export function Footer() {
  return (
    <footer className="bg-pm-ink text-[#C9CDCF] py-20 md:py-28 px-6">
      <div className="max-w-[1320px] mx-auto flex flex-col items-center text-center gap-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logos/lockup-preamar-transparente-claro.svg"
          alt="PREAMAR — Espaços de trabalho no Montijo"
          className="w-[240px] md:w-[300px] h-auto"
        />
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
