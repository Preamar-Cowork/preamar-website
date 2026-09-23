"use client";

import { Reveal } from "@/components/ui/Reveal";
import { Folio } from "@/components/ui/Folio";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import type { SiteSections } from "@/lib/content/schema";

export function NextPhase({ content: c, n }: { content: SiteSections["next"]; n: string }) {
  return (
    <section className="bg-pm-bg py-28 md:py-[160px] px-6 md:px-12">
      <div className="max-w-[1240px] mx-auto grid grid-cols-1 md:grid-cols-[60%_40%] gap-12 md:gap-16 items-center">
        <div>
          <Folio n={n} />
          <div className="font-label font-bold text-[11px] tracking-[0.16em] uppercase text-pm-concrete mb-8">
            {c.label}
          </div>
          <Reveal>
            <p className="font-body text-[22px] md:text-[28px] leading-[1.5] text-pm-ink m-0 max-w-[560px] whitespace-pre-line">
              {c.text}
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.15}>
          <PhotoPlaceholder src={c.image || undefined} caption={c.caption} className="h-[260px] md:h-[360px]" />
        </Reveal>
      </div>
    </section>
  );
}
