"use client";

import { Reveal } from "@/components/ui/Reveal";
import type { SiteSections } from "@/lib/content/schema";

export function About({ content: c }: { content: SiteSections["about"] }) {
  return (
    <section className="bg-pm-bg py-20 md:py-28 px-6">
      <div className="max-w-[680px] mx-auto text-left">
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
