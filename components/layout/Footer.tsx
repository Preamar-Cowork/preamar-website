"use client";

import { Lockup } from "@/components/brand/Brand";
import type { SiteSections } from "@/lib/content/schema";

export function Footer({ content: c }: { content: SiteSections["footer"] }) {
  const parts = [c.place, c.email, c.phone, c.instagram && `Instagram ${c.instagram}`].filter(Boolean);
  return (
    <footer className="bg-pm-ink text-[#C9CDCF] py-20 md:py-28 px-6">
      <div className="max-w-[1320px] mx-auto flex flex-col items-center text-center gap-10">
        <Lockup size={36} color="#F3F1EC" />
        <div className="font-label font-semibold text-[10px] tracking-[0.15em] uppercase text-[#8B8F91] flex flex-wrap justify-center gap-x-3 gap-y-2">
          {parts.map((p, i) => (
            <span key={i} className="flex gap-x-3">
              {i > 0 && <span aria-hidden="true">·</span>}
              <span>{p}</span>
            </span>
          ))}
        </div>
      </div>
      <div className="max-w-[1320px] mx-auto mt-14 pt-6 border-t border-white/15 font-label text-[10px] tracking-[0.12em] uppercase text-[#6E7275] text-center">
        {c.note}
      </div>
    </footer>
  );
}
