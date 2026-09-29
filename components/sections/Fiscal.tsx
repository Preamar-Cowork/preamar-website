"use client";

import { RevealLines } from "@/components/ui/RevealLines";
import type { SiteSections } from "@/lib/content/schema";

export function Fiscal({ content: c }: { content: SiteSections["fiscal"] }) {
  return (
    <section className="bg-pm-ink py-20 md:py-28 px-6">
      <div className="max-w-[760px] mx-auto text-center">
        <h2 className="font-label font-bold text-[11px] tracking-[0.16em] uppercase text-pm-sky mb-8 mt-0">
          {c.label}
        </h2>
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
