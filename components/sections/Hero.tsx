"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Symbol } from "@/components/ui/Symbol";
import { nextTideLabel } from "@/lib/tide";

const TAGLINE_WORDS = ["ESPAÇOS", "DE", "TRABALHO", "MONTIJO"];

export function Hero({ onReserve }: { onReserve: () => void }) {
  const [tide, setTide] = useState("--:--");

  useEffect(() => {
    setTide(nextTideLabel());
    const id = setInterval(() => setTide(nextTideLabel()), 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative h-[100dvh] min-h-[560px] overflow-hidden flex flex-col justify-between">
      {/* photo placeholder */}
      <div className="absolute inset-0 flex items-end justify-start p-5 bg-[repeating-linear-gradient(115deg,#4A4E51_0,#4A4E51_3px,#3F4346_3px,#3F4346_22px)]">
        <span className="font-mono text-xs text-pm-line/70">
          // fotografia: fachada sobre o estuário, luz da tarde
        </span>
      </div>
      <div className="absolute inset-0 bg-pm-ink/40" />

      <div className="relative z-10 flex justify-between p-8 md:p-16">
        <div className="flex items-center gap-3">
          <Symbol baseWidth={24} restColor="#F3F1EC" />
          <div>
            <div className="font-display text-base tracking-[0.1em] text-pm-bg">PREAMAR</div>
            <div className="flex justify-between gap-1.5 mt-1">
              {TAGLINE_WORDS.map((w) => (
                <span key={w} className="font-label font-semibold text-[9px] tracking-[0.1em] text-pm-bg/80 whitespace-nowrap">
                  {w}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="font-label font-semibold text-xs tracking-[0.14em] text-pm-sky text-right leading-relaxed">
          PRÓXIMA PREAMAR
          <br />
          {tide}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="relative z-10 px-8 md:px-16 pb-16 md:pb-[88px]"
      >
        <div className="font-label font-bold text-xs tracking-[0.16em] uppercase text-pm-sky mb-4">
          PREAMAR · MONTIJO · ESTUÁRIO DO TEJO
        </div>
        <h1 className="font-display text-pm-bg leading-[0.98] mb-7 max-w-3xl text-[clamp(38px,9vw,108px)]">
          Um escritório a sério,
          <br />a cinco minutos de casa.
        </h1>
        <p className="font-body text-pm-bg/90 text-lg md:text-xl leading-relaxed max-w-md mb-10">
          Secretárias, gabinetes e sala de reuniões no Montijo. Sem ponte, sem ruído, sem a mesa
          da cozinha. Estacionamento fácil.
        </p>
        <span
          onClick={onReserve}
          className="inline-block font-label font-bold text-sm tracking-[0.14em] uppercase text-pm-bg pb-2.5 border-b border-pm-sky cursor-pointer transition-all hover:pr-3.5 hover:tracking-[0.2em]"
        >
          Reservar o meu lugar
        </span>
      </motion.div>

      <div className="relative z-10 px-8 md:px-16 pb-7">
        <div className="h-px bg-pm-bg/30 mb-[18px]" />
        <div className="flex gap-2.5 font-label font-semibold text-[11px] tracking-[0.14em] uppercase text-pm-bg/85">
          <span>MONTIJO</span>
          <span className="opacity-50">·</span>
          <span>ESTUÁRIO DO TEJO</span>
          <span className="opacity-50">·</span>
          <span>SEM PONTE</span>
        </div>
      </div>

      <div className="hidden md:block absolute right-16 bottom-24 z-10 w-px h-6">
        <div className="w-px h-full bg-pm-sky animate-[pm-scroll-dot_2.2s_ease-in-out_infinite]" />
      </div>
    </section>
  );
}
