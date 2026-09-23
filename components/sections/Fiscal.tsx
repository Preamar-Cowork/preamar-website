"use client";

import { RevealLines } from "@/components/ui/RevealLines";
import { Folio } from "@/components/ui/Folio";
import type { SiteSections } from "@/lib/content/schema";

export function Fiscal({ content: c, n }: { content: SiteSections["fiscal"]; n: string }) {
  return (
    <section className="bg-pm-ink py-28 md:py-[160px] px-6">
      <div className="max-w-[760px] mx-auto text-center">
        <Folio n={n} dark />
        <div className="font-label font-bold text-[11px] tracking-[0.16em] uppercase text-pm-sky mb-8">
          {c.label}
        </div>
        <RevealLines
          key={c.headline}
          as="p"
          lines={c.headline.split("\n")}
          className="font-display text-[40px] md:text-[56px] leading-[1.1] text-pm-bg mb-8"
        />
        {c.text && <p className="text-pm-bg/70 text-lg md:text-xl m-0">{c.text}</p>}
      </div>
    </section>
  );
}
