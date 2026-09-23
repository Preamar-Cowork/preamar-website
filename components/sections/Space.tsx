"use client";

import { Reveal } from "@/components/ui/Reveal";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { Folio } from "@/components/ui/Folio";
import type { SiteSections } from "@/lib/content/schema";

export function Space({ content: c, n }: { content: SiteSections["space"]; n: string }) {
  return (
    <section className="bg-pm-ink">
      <div className="grid grid-cols-1 md:grid-cols-[60%_40%]">
        <PhotoPlaceholder dark src={c.image || undefined} alt={c.label} className="h-[420px] md:h-full md:min-h-[720px]" />
        <div className="py-16 md:py-24 px-8 md:px-14 flex flex-col justify-center">
          <Folio n={n} dark />
          <div className="font-label font-bold text-[11px] tracking-[0.16em] uppercase text-pm-sky mb-6">
            {c.label}
          </div>
          <Reveal>
            <p className="font-body text-lg md:text-[21px] leading-[1.6] text-pm-bg max-w-[440px] mb-12">{c.text}</p>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10">
            {c.amenities.map((a, i) => (
              <div
                key={i}
                className="flex items-baseline gap-2.5 py-3 border-t border-white/15 text-[15px] text-pm-bg"
              >
                <span className="text-pm-sky">—</span>
                <span>{a}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
