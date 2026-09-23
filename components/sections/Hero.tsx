"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Symbol } from "@/components/ui/Symbol";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { RevealLines } from "@/components/ui/RevealLines";
import { nextTideLabel } from "@/lib/tide";

export function Hero({ onReserve }: { onReserve: () => void }) {
  const [tide, setTide] = useState("--:--");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    setTide(nextTideLabel());
    const id = setInterval(() => setTide(nextTideLabel()), 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.hero_video_url) setVideoUrl(data.hero_video_url);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="relative h-[100dvh] min-h-[560px] overflow-hidden flex flex-col justify-between">
      {/* background: real video once uploaded via /admin, placeholder until then */}
      <div className="absolute inset-0">
        {videoUrl ? (
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src={videoUrl}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <PhotoPlaceholder dark className="absolute inset-0 h-full w-full" />
        )}
      </div>
      <div className="absolute inset-0 bg-pm-ink/55" />

      {/* top row: small lockup + tide clock */}
      <div className="relative z-10 flex justify-between items-start p-6 md:p-10">
        <div className="flex items-center gap-2.5">
          <Symbol baseWidth={17} restColor="#F3F1EC" />
          <div>
            <div className="font-display text-sm tracking-[0.10em] text-pm-bg uppercase">
              PREAMAR
            </div>
            <div className="font-label font-semibold text-[8px] tracking-[0.15em] text-pm-bg/75 uppercase whitespace-nowrap">
              ESPAÇOS DE TRABALHO · MONTIJO
            </div>
          </div>
        </div>
        <div className="font-label font-semibold text-[11px] tracking-[0.15em] uppercase text-pm-sky text-right leading-relaxed">
          PRÓXIMA PREAMAR
          <br />
          {tide}
        </div>
      </div>

      {/* center: PREAMAR + tagline + CTA, all centered */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6">
        <RevealLines
          as="div"
          lines={["PREAMAR"]}
          className="font-display uppercase text-pm-bg leading-none tracking-[0.10em] text-[clamp(64px,14vw,180px)]"
        />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="font-label font-bold text-sm md:text-base tracking-[0.15em] uppercase text-pm-sky mt-5 md:mt-7"
        >
          O teu escritório à beira-rio
        </motion.div>
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          onClick={onReserve}
          className="inline-block font-label font-bold text-sm tracking-[0.14em] uppercase text-pm-bg pb-2.5 border-b border-pm-sky cursor-pointer transition-all hover:pr-3.5 hover:tracking-[0.2em] mt-10 md:mt-12"
        >
          Reservar o meu lugar
        </motion.span>
      </div>

      {/* bottom fact line */}
      <div className="relative z-10 px-6 md:px-10 pb-6 md:pb-8">
        <div className="h-px bg-pm-bg/30 mb-4" />
        <div className="flex justify-center gap-2.5 font-label font-semibold text-[11px] tracking-[0.14em] uppercase text-pm-bg/85">
          <span>MONTIJO</span>
          <span className="opacity-50">·</span>
          <span>ESTUÁRIO DO TEJO</span>
          <span className="opacity-50">·</span>
          <span>SEM PONTE</span>
        </div>
      </div>

      <div className="hidden md:block absolute right-10 bottom-24 z-10 w-px h-6">
        <div className="w-px h-full bg-pm-sky animate-[pm-scroll-dot_2.2s_ease-in-out_infinite]" />
      </div>
    </section>
  );
}
