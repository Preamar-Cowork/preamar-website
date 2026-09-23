"use client";

import { motion } from "framer-motion";
import { RevealLines } from "@/components/ui/RevealLines";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { Folio } from "@/components/ui/Folio";
import type { SiteSections } from "@/lib/content/schema";

const OFFSETS = [0, 96, 32]; // asymmetric editorial rhythm

export function Problem({ content: c, n }: { content: SiteSections["problem"]; n: string }) {
  return (
    <section className="max-w-[1320px] mx-auto py-32 md:py-[180px] px-6 md:px-12">
      <Folio n={n} />
      <div className="font-label font-bold text-[11px] tracking-[0.16em] uppercase text-pm-concrete mb-20">
        {c.label}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
        {c.blocks.map((b, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 }}
            className="md:[margin-top:var(--offset)]"
            style={{ ["--offset" as string]: `${OFFSETS[i] ?? 0}px` }}
          >
            <div className="font-label font-bold text-[clamp(88px,10vw,150px)] leading-[0.8] text-pm-line mb-4 select-none">
              {i + 1}
            </div>
            <RevealLines
              key={b.title}
              as="div"
              lines={b.title.split("\n")}
              className="font-body font-bold text-2xl md:text-[26px] leading-[1.15] mb-4 text-pm-ink"
            />
            {b.text && <p className="text-pm-graphite text-base leading-relaxed mb-6 max-w-[38ch]">{b.text}</p>}
            <PhotoPlaceholder src={b.image || undefined} caption={b.caption} className="h-[190px] md:h-[220px]" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
