"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SECTION_DEFS } from "@/lib/content/schema";

const PAGE_ITEMS = [
  { href: "/admin/hero", title: "Hero" },
  ...SECTION_DEFS.map((d) => ({ href: `/admin/${d.key}`, title: d.title })),
  { href: "/admin/fotografias", title: "Fotografias" },
];

const linkCls = (active: boolean) =>
  `whitespace-nowrap flex items-center justify-between gap-3 px-3 py-2 font-label font-semibold text-[12px] tracking-[0.1em] uppercase border-l-2 transition-colors ${
    active ? "border-pm-ink text-pm-ink bg-pm-bg" : "border-transparent text-pm-concrete hover:text-pm-ink"
  }`;

/** Admin menu — the inbox first, then one entry per part of the page. */
export function AdminNav() {
  const path = usePathname();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const load = () =>
      fetch("/api/admin/reservations?summary=1", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => setUnread(d?.unread ?? 0))
        .catch(() => {});
    load();
    const id = setInterval(load, 60_000);
    window.addEventListener("pm-unread-changed", load);
    return () => {
      clearInterval(id);
      window.removeEventListener("pm-unread-changed", load);
    };
  }, []);

  return (
    <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible -mx-6 px-6 lg:mx-0 lg:px-0 pb-2 lg:pb-0">
      <Link href="/admin/pedidos" className={linkCls(path === "/admin/pedidos")}>
        <span>Pedidos</span>
        {unread > 0 && (
          <span className="bg-pm-sky text-pm-bg rounded-full min-w-[20px] h-5 px-1.5 inline-flex items-center justify-center text-[11px] tracking-normal">
            {unread}
          </span>
        )}
      </Link>

      <div className="hidden lg:block font-label font-bold text-[10px] tracking-[0.16em] uppercase text-pm-concrete mt-6 mb-2 px-3">
        Página inicial
      </div>
      {PAGE_ITEMS.map((it) => (
        <Link key={it.href} href={it.href} className={linkCls(path === it.href)}>
          {it.title}
        </Link>
      ))}
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
