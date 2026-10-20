"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { RevealLines } from "@/components/ui/RevealLines";
import { formatLisbonTime, type HighTide } from "@/lib/tideFormat";
import { BrandIcon, Wordmark } from "@/components/brand/Brand";
import { ScrollCue } from "@/components/ui/ScrollCue";
import { LangSwitch } from "@/components/ui/LangSwitch";
import { useLocale } from "@/lib/i18n";
import {
  FONT_CLASS,
  HERO_DEFAULTS,
  OVERLAY_HEX,
  type HeroSettings,
} from "@/lib/heroSettings";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Hero video files. The site's own video lives in /public/media as
 * hero-1080.mp4 (desktop), hero-720.mp4 (phones / data saver) and
 * hero-poster.jpg (shown while it loads). Any other URL is used as-is.
 */
function videoVariants(url: string) {
  const m = url.match(/^(.*)-1080\.mp4$/);
  return m ? { desktop: url, mobile: `${m[1]}-720.mp4`, poster: `${m[1]}-poster.jpg` } : { desktop: url, mobile: url, poster: undefined };
}
const fmtHeight = (m: number, locale: string) => (locale === "pt" ? m.toFixed(1).replace(".", ",") : m.toFixed(1));
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

  // The browser picks the lighter file on phones (<source media>), straight from the
  // server HTML — so autoplay works exactly like a plain <video autoplay muted>.
  const variants = videoUrl ? videoVariants(videoUrl) : null;
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    // safety net: some browsers only autoplay if "muted" is set on the element itself
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute("muted", "");
    const tryPlay = () => {
      if (v.paused) v.play().catch(() => {});
    };
    tryPlay();
    v.addEventListener("canplay", tryPlay);
    // if the browser blocked it (e.g. battery saver), start on the first touch/scroll
    const opts = { once: true, passive: true } as const;
    window.addEventListener("touchstart", tryPlay, opts);
    window.addEventListener("scroll", tryPlay, opts);
    window.addEventListener("click", tryPlay, opts);
    document.addEventListener("visibilitychange", tryPlay);
    return () => {
      v.removeEventListener("canplay", tryPlay);
      window.removeEventListener("touchstart", tryPlay);
      window.removeEventListener("scroll", tryPlay);
      window.removeEventListener("click", tryPlay);
      document.removeEventListener("visibilitychange", tryPlay);
    };
  }, [videoUrl]);
  const { locale, t } = useLocale();
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
            ref={videoRef}
            key={videoUrl}
            className="absolute inset-0 w-full h-full object-cover"
            poster={variants?.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            tabIndex={-1}
          >
            {variants && variants.mobile !== variants.desktop && (
              <source src={variants.mobile} type="video/mp4" media="(max-width: 900px)" />
            )}
            <source src={variants?.desktop} type={/\.webm$/i.test(videoUrl) ? "video/webm" : "video/mp4"} />
          </video>
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
          <div className="flex items-center gap-5">
            <BrandIcon size={contained ? 36 : 34} color={fg} />
            <LangSwitch disabled={contained} />
          </div>
          <div className="font-label font-semibold text-[9px] md:text-[10px] tracking-[0.18em] uppercase opacity-75 mt-1.5">
            {s.descriptor}
          </div>
        </div>
        {nextTide && (
          <div
            className="font-label font-semibold text-[10px] md:text-[11px] tracking-[0.15em] uppercase text-right leading-relaxed"
            title={t.nextTideTitle}
          >
            <span className="opacity-70">{t.nextTide}</span>
            <br />
            <span className="inline-flex items-center gap-2">
              <span className="inline-block w-4 h-[2px] bg-pm-sky" />
              {formatLisbonTime(nextTide.iso)}
              <span className="opacity-60">· {fmtHeight(nextTide.heightM, locale)} m</span>
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
            className="font-body text-[16px] md:text-[19px] leading-[1.6] max-w-[1000px] mt-5 opacity-90"
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

      {/* bottom: thin line + scroll cue */}
      <div className="relative z-10 px-6 md:px-10 pb-4 md:pb-6">
        <div className="h-px mb-3 opacity-30" style={{ background: fg }} />
        <ScrollCue
          color={fg}
          onClick={
            contained
              ? undefined
              : () => window.scrollBy({ top: window.innerHeight, behavior: reduce ? "auto" : "smooth" })
          }
        />
      </div>
    </section>
  );
}
