"use client";

import { useEffect, useState } from "react";
import { Lockup } from "@/components/brand/Brand";
import type { SiteSections } from "@/lib/content/schema";

/* ---------- links ---------- */

const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

const instagramHref = (v: string) => {
  const s = v.trim();
  if (/^https?:\/\//i.test(s)) return s;
  const handle = s.replace(/^@/, "").replace(/^(www\.)?instagram\.com\//i, "").replace(/\/+$/, "");
  return `https://www.instagram.com/${handle}/`;
};

const instagramLabel = (v: string) => {
  const s = v.trim();
  if (!/^https?:\/\//i.test(s) && !/instagram\.com/i.test(s)) return s.startsWith("@") ? s : `@${s}`;
  const handle = s.replace(/^https?:\/\//i, "").replace(/^(www\.)?instagram\.com\//i, "").replace(/\/.*$/, "");
  return `@${handle}`;
};

/** Google Maps on the server and as fallback; Apple Maps on iPhone/Mac; the default maps app on Android. */
function mapsHref(place: string, platform: "apple" | "android" | "other") {
  const q = encodeURIComponent(/portugal/i.test(place) ? place : `${place}, Portugal`);
  if (platform === "apple") return `https://maps.apple.com/?q=${q}`;
  if (platform === "android") return `geo:0,0?q=${q}`;
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

function usePlatform() {
  const [p, setP] = useState<"apple" | "android" | "other">("other");
  useEffect(() => {
    const ua = navigator.userAgent;
    if (/android/i.test(ua)) setP("android");
    else if (/iphone|ipad|ipod|macintosh/i.test(ua)) setP("apple");
  }, []);
  return p;
}

/* ---------- footer ---------- */

const linkCls =
  "text-inherit hover:text-[#F3F1EC] focus-visible:text-[#F3F1EC] transition-colors underline-offset-4 hover:underline";

export function Footer({ content: c }: { content: SiteSections["footer"] }) {
  const platform = usePlatform();

  const parts: { key: string; label: string; href: string; external?: boolean; aria: string }[] = [];
  if (c.place) {
    const custom = c.mapsUrl?.trim();
    parts.push({
      key: "place",
      label: c.place,
      href: custom || mapsHref(c.place, platform),
      external: !!custom || platform !== "android", // geo: links hand over to the maps app, no new tab
      aria: `Abrir ${c.place} no mapa`,
    });
  }
  if (c.email) parts.push({ key: "email", label: c.email, href: `mailto:${c.email.trim()}`, aria: `Enviar email para ${c.email}` });
  if (c.phone) parts.push({ key: "phone", label: c.phone, href: telHref(c.phone), aria: `Ligar para ${c.phone}` });
  if (c.instagram)
    parts.push({
      key: "instagram",
      label: `Instagram ${instagramLabel(c.instagram)}`,
      href: instagramHref(c.instagram),
      external: true,
      aria: `Instagram da PREAMAR (abre numa nova janela)`,
    });

  return (
    <footer className="bg-pm-ink text-[#C9CDCF] py-20 md:py-28 px-6">
      <div className="max-w-[1320px] mx-auto flex flex-col items-center text-center gap-10">
        <Lockup size={36} color="#F3F1EC" />
        <address className="not-italic font-label font-semibold text-[10px] tracking-[0.15em] uppercase text-[#8B8F91] flex flex-wrap justify-center gap-x-3 gap-y-2">
          {parts.map((p, i) => (
            <span key={p.key} className="flex gap-x-3">
              {i > 0 && <span aria-hidden="true">·</span>}
              <a
                href={p.href}
                className={linkCls}
                aria-label={p.aria}
                {...(p.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {p.label}
              </a>
            </span>
          ))}
        </address>
      </div>
      <div className="max-w-[1320px] mx-auto mt-14 pt-6 border-t border-white/15 font-label text-[10px] tracking-[0.12em] uppercase text-[#6E7275] text-center">
        {c.note}
      </div>
    </footer>
  );
}
