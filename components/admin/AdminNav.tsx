"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SECTION_DEFS, folioOf } from "@/lib/content/schema";

const ITEMS = [
  { href: "/admin/hero", title: "Hero", n: "" },
  ...SECTION_DEFS.map((d) => ({
    href: `/admin/${d.key}`,
    title: d.title,
    n: d.key === "footer" ? "" : folioOf(d.key),
  })),
];

/** Admin menu — one entry per part of the page, in site order. */
export function AdminNav() {
  const path = usePathname();
  return (
    <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible -mx-6 px-6 lg:mx-0 lg:px-0 pb-2 lg:pb-0">
      <div className="hidden lg:block font-label font-bold text-[10px] tracking-[0.16em] uppercase text-pm-concrete mb-3">
        Página inicial
      </div>
      {ITEMS.map((it) => {
        const active = path === it.href;
        return (
          <Link
            key={it.href}
            href={it.href}
            className={`whitespace-nowrap flex items-baseline gap-3 px-3 py-2 font-label font-semibold text-[12px] tracking-[0.1em] uppercase border-l-2 transition-colors ${
              active
                ? "border-pm-ink text-pm-ink bg-pm-bg"
                : "border-transparent text-pm-concrete hover:text-pm-ink"
            }`}
          >
            <span className="w-4 text-[10px] opacity-60 tabular-nums">{it.n}</span>
            {it.title}
          </Link>
        );
      })}
      <a
        href="/"
        target="_blank"
        className="whitespace-nowrap hidden lg:block mt-6 px-3 font-label font-semibold text-[11px] tracking-[0.1em] uppercase text-pm-sky hover:text-pm-ink"
      >
        Ver o site ↗
      </a>
    </nav>
  );
}
