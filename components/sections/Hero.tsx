"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { RevealLines } from "@/components/ui/RevealLines";
import { formatLisbonTime, type HighTide } from "@/lib/tideFormat";
import { Lockup, Wordmark } from "@/components/brand/Brand";
import {
  FONT_CLASS,
  HERO_DEFAULTS,
  OVERLAY_HEX,
  type HeroSettings,
} from "@/lib/heroSettings";

const EASE = [0.22, 1, 0.36, 1] as const;
const INK = "#3F4346";
const OFF = "#F3F1EC";

/**
 * Full-screen hero. `contained` renders it inside a fixed-size frame (the
 * live preview in /admin) instead of the viewport: sizes become exact px.
 */
export function Hero({
  onReserve,
  videoUrl,
  settings = HERO_DEFAULTS,
  tides = [],
  contained = false,
}: {
  onReserve?: () => void;
  videoUrl: string | null;
  settings?: HeroSettings;
  tides?: HighTide[]; // próximas preia-mares no Montijo (dados reais, ver lib/tide.ts)
  contained?: boolean;
}) {
  // no entrance animations in the admin preview (it re-renders on every keystroke)
  const reduce = useReducedMotion() || contained;
  // re-check every minute so the clock rolls over to the next high water
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);
  const nextTide = now === null ? null : tides.find((t) => Date.parse(t.iso) > now) ?? null;

  const s = settings;
  const fg = s.theme === "escuro" ? INK : OFF;
  // wordmark width ≈ 4.93 × font size (Libre Caslon Display, brand tracking — measured)
  const wordmarkSize = contained
    ? `${s.logoWidth / 4.93}px`
    : `min(${(s.logoWidth / 4.93).toFixed(1)}px, 16.5vw)`;

  // Desktop size is the admin value; on small screens it scales with the viewport.
  const taglineSize = contained
    ? `${s.taglineSize}px`
    : `clamp(${Math.min(28, s.taglineSize)}px, ${((s.taglineSize / 1440) * 100 * 1.6).toFixed(2)}vw, ${s.taglineSize}px)`;

  const fadeUp = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, delay, ease: EASE },
        };

  return (
    <section
      className={`relative overflow-hidden flex flex-col justify-between ${
        contained ? "h-full w-full" : "h-[100dvh] min-h-[560px]"
      }`}
      style={{ color: fg }}
    >
      {/* background: video uploaded via /admin, duotone placeholder until then */}
      <div className="absolute inset-0">
        {videoUrl ? (
          <video
            key={videoUrl}
            className="absolute inset-0 w-full h-full object-cover"
            src={videoUrl}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
        ) : (
          <PhotoPlaceholder dark className="absolute inset-0 h-full w-full" />
        )}
      </div>
      {/* filtro — cor e intensidade editáveis no /admin */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: OVERLAY_HEX[s.overlayColor], opacity: s.overlayOpacity / 100 }}
      />

      {/* top row: small lockup + real tide clock */}
      <div className="relative z-10 flex justify-between items-start p-6 md:p-10">
        <div>
          <Lockup size={contained ? 24 : 22} color={fg} />
          <div className="font-label font-semibold text-[9px] md:text-[10px] tracking-[0.18em] uppercase opacity-75 mt-1.5">
            Espaços de trabalho · Montijo
          </div>
        </div>
        {nextTide && (
          <div
            className="font-label font-semibold text-[10px] md:text-[11px] tracking-[0.15em] uppercase text-right leading-relaxed"
            title="Preia-mar no Montijo — previsão FCUL/Lisboa com correção do Instituto Hidrográfico"
          >
            <span className="opacity-70">Próxima preamar</span>
            <br />
            <span className="inline-flex items-center gap-2">
              <span className="inline-block w-4 h-[2px] bg-pm-sky" />
              {formatLisbonTime(nextTide.iso)}
              <span className="opacity-60">· {nextTide.heightM.toFixed(1).replace(".", ",")} m</span>
            </span>
          </div>
        )}
      </div>

      {/* center: logo + tagline + CTA */}
      <div className={`relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 ${contained ? "pb-[8%]" : "pb-[9vh]"}`}>
        <motion.div
          {...(reduce
            ? {}
            : {
                initial: { opacity: 0, y: 24 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 1.2, ease: EASE },
              })}
        >
          <Wordmark as="div" color={fg} style={{ fontSize: wordmarkSize }} />
        </motion.div>

        {s.tagline && contained && (
          <h1
            className={`${FONT_CLASS[s.taglineFont]} leading-[1.1] mt-6 md:mt-8 [text-wrap:balance]`}
            style={{ fontSize: taglineSize }}
          >
            {s.tagline.replace(/-/g, "\u2011")}
          </h1>
        )}
        {s.tagline && !contained && (
          <RevealLines
            key={s.tagline + s.taglineFont}
            as="h1"
            immediate
            delay={0.35}
            lines={[s.tagline.replace(/-/g, "\u2011")]}
            className={`${FONT_CLASS[s.taglineFont]} leading-[1.1] mt-6 md:mt-8 [text-wrap:balance]`}
            style={{ fontSize: taglineSize }}
          />
        )}

        {s.subtitle && (
          <motion.p
            {...fadeUp(0.6)}
            className="font-body text-[16px] md:text-[19px] leading-[1.6] max-w-[520px] mt-5 opacity-90"
          >
            {s.subtitle}
          </motion.p>
        )}

        <motion.button
          type="button"
          {...fadeUp(0.75)}
          onClick={onReserve}
          className="font-label font-bold text-[13px] md:text-sm tracking-[0.16em] uppercase pb-2.5 mt-10 md:mt-12 border-b cursor-pointer transition-[letter-spacing,padding] duration-300 hover:tracking-[0.22em] hover:px-2 bg-transparent"
          style={{ color: fg, borderColor: fg }}
        >
          {s.ctaText}
        </motion.button>
      </div>

      {/* bottom fact line */}
      <div className="relative z-10 px-6 md:px-10 pb-6 md:pb-8">
        <div className="h-px mb-4 opacity-30" style={{ background: fg }} />
        <div className="flex justify-center gap-2.5 font-label font-semibold text-[10px] md:text-[11px] tracking-[0.14em] uppercase opacity-85">
          <span>Montijo</span>
          <span className="opacity-50">·</span>
          <span>Estuário do Tejo</span>
          <span className="opacity-50">·</span>
          <span>Sem ponte</span>
        </div>
      </div>
    </section>
  );
}
