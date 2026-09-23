"use client";

import { Reveal } from "@/components/ui/Reveal";
import { Folio } from "@/components/ui/Folio";
import type { SiteSections } from "@/lib/content/schema";

export function About({ content: c, n }: { content: SiteSections["about"]; n: string }) {
  return (
    <section className="bg-pm-bgAlt py-28 md:py-[160px] px-6">
      <div className="max-w-[680px] mx-auto text-left">
        <Folio n={n} />
        <div className="font-label font-bold text-[11px] tracking-[0.16em] uppercase text-pm-concrete mb-8">
          {c.label}
        </div>
        <Reveal>
          <p className="font-body text-[24px] md:text-[32px] leading-[1.45] text-pm-ink m-0 whitespace-pre-line">
            {c.text}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
