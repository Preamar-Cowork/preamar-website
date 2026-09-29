"use client";

import { useEffect, useMemo, useState } from "react";
import { labelCls, readJson } from "@/components/admin/ui";

type Reservation = {
  id: string;
  created_at: string;
  nome: string;
  email: string;
  telefone: string;
  profissao: string | null;
  onde: string | null;
  interesse: string | null;
  gabinete: string | null;
  dias: string | null;
  quando: string | null;
  cacifo: string | null;
  sinal_aceite: boolean;
  sinal_valor?: number | null;
  privacy_aceite: boolean;
  read_at?: string | null;
};

type Filter = "todos" | "porler" | "sinal";

const DAY = 86_400_000;
const SOON = ["já", "1-3 meses"];

function when(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const time = d.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Lisbon" });
  const startToday = new Date(now.toLocaleDateString("en-CA", { timeZone: "Europe/Lisbon" })).getTime();
  const t = new Date(d.toLocaleDateString("en-CA", { timeZone: "Europe/Lisbon" })).getTime();
  if (t === startToday) return `hoje, ${time}`;
  if (t === startToday - DAY) return `ontem, ${time}`;
  return d.toLocaleDateString("pt-PT", { day: "numeric", month: "short", timeZone: "Europe/Lisbon" });
}

function countBy(rows: Reservation[], key: keyof Reservation) {
  const m = new Map<string, number>();
  for (const r of rows) {
    const v = (r[key] as string | null) || "—";
    m.set(v, (m.get(v) ?? 0) + 1);
  }
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

function toCsv(rows: Reservation[]) {
  const cols: (keyof Reservation)[] = [
    "created_at", "nome", "email", "telefone", "profissao", "onde", "interesse", "gabinete",
    "dias", "quando", "cacifo", "sinal_aceite", "sinal_valor", "read_at",
  ];
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return "﻿" + [cols.join(";"), ...rows.map((r) => cols.map((c) => esc(r[c])).join(";"))].join("\n");
}

export default function PedidosPage() {
  const [rows, setRows] = useState<Reservation[]>([]);
  const [hasRead, setHasRead] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<Filter>("todos");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/reservations", { cache: "no-store" })
      .then(async (r) => {
        const d = await readJson(r);
        if (!r.ok) throw new Error(d?.error || `erro ${r.status}`);
        setRows(d.rows ?? []);
        setHasRead(d.hasReadColumn !== false);
      })
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, []);

  const isUnread = (r: Reservation) => (hasRead ? !r.read_at : false);

  async function setRead(r: Reservation, read: boolean) {
    if (!hasRead) return;
    const prev = r.read_at ?? null;
    const optimistic = read ? new Date().toISOString() : null;
    setRows((rs) => rs.map((x) => (x.id === r.id ? { ...x, read_at: optimistic } : x)));
    try {
      const res = await fetch("/api/admin/reservations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: r.id, read }),
      });
      const d = await readJson(res);
      if (!res.ok) throw new Error(d?.error || `erro ${res.status}`);
      window.dispatchEvent(new Event("pm-unread-changed"));
    } catch (e) {
      setRows((rs) => rs.map((x) => (x.id === r.id ? { ...x, read_at: prev } : x)));
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  function toggle(r: Reservation) {
    const next = open === r.id ? null : r.id;
    setOpen(next);
    if (next && isUnread(r)) setRead(r, true);
  }

  // ---- KPIs ----
  const kpi = useMemo(() => {
    const now = Date.now();
    const last7 = rows.filter((r) => now - Date.parse(r.created_at) < 7 * DAY).length;
    const sinal = rows.filter((r) => r.sinal_aceite);
    const sinalEur = sinal.reduce((s, r) => s + (Number(r.sinal_valor) || 0), 0);
    const soon = rows.filter((r) => SOON.includes((r.quando ?? "").toLowerCase())).length;
    return {
      total: rows.length,
      last7,
      unread: rows.filter(isUnread).length,
      sinal: sinal.length,
      sinalEur,
      soon,
      soonPct: rows.length ? Math.round((soon / rows.length) * 100) : 0,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, hasRead]);

  const byInteresse = useMemo(() => countBy(rows, "interesse"), [rows]);
  const byOnde = useMemo(() => countBy(rows, "onde"), [rows]);
  const byQuando = useMemo(() => countBy(rows, "quando"), [rows]);

  // ---- inbox: unread first, then by arrival (newest first) ----
  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows
      .filter((r) => (filter === "porler" ? isUnread(r) : filter === "sinal" ? r.sinal_aceite : true))
      .filter((r) =>
        needle
          ? [r.nome, r.email, r.telefone, r.profissao, r.interesse, r.onde].some((v) =>
              (v ?? "").toLowerCase().includes(needle)
            )
          : true
      )
      .sort((a, b) => {
        const ua = isUnread(a) ? 1 : 0;
        const ub = isUnread(b) ? 1 : 0;
        if (ua !== ub) return ub - ua;
        return Date.parse(b.created_at) - Date.parse(a.created_at);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, filter, q, hasRead]);

  function exportCsv() {
    const blob = new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `preamar-pedidos-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div className="pb-24">
      <div className={`${labelCls} mb-3`}>Caixa de entrada</div>
      <h1 className="font-display text-[32px] text-pm-ink mb-2">Pedidos</h1>
      <p className="text-pm-graphite text-[15px] mb-10 max-w-[60ch]">
        Tudo o que chega pelo formulário de reserva. Abrir um pedido marca-o como lido.
      </p>

      {error && <p className="font-label text-[13px] text-[#A0524A] mb-6">{error}</p>}
      {!hasRead && (
        <p className="font-label text-[13px] text-[#A0524A] mb-6">
          Para marcar pedidos como lidos falta correr a migração 007_reservations_read.sql no Supabase.
        </p>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-pm-line border border-pm-line mb-8">
        <Kpi label="Pedidos" value={kpi.total} sub={`${kpi.last7} nos últimos 7 dias`} />
        <Kpi label="Por ler" value={kpi.unread} sub={kpi.unread ? "à tua espera" : "tudo lido"} accent={kpi.unread > 0} />
        <Kpi label="Com sinal" value={kpi.sinal} sub={kpi.sinalEur ? `${kpi.sinalEur} € em sinais` : "aceitaram reservar com sinal"} />
        <Kpi label="Querem começar em ≤ 3 meses" value={kpi.soon} sub={`${kpi.soonPct}% dos pedidos`} />
      </div>

      {rows.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <Breakdown title="O que procuram" data={byInteresse} total={rows.length} />
          <Breakdown title="Quando" data={byQuando} total={rows.length} />
          <Breakdown title="Onde moram" data={byOnde} total={rows.length} />
        </div>
      )}

      {/* toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {(
          [
            ["todos", `Todos (${rows.length})`],
            ["porler", `Por ler (${kpi.unread})`],
            ["sinal", `Com sinal (${kpi.sinal})`],
          ] as [Filter, string][]
        ).map(([f, label]) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`px-3.5 py-2 border font-label font-semibold text-[12px] tracking-[0.08em] uppercase ${
              filter === f ? "bg-pm-ink text-pm-bg border-pm-ink" : "border-pm-line text-pm-ink hover:border-pm-ink"
            }`}
          >
            {label}
          </button>
        ))}
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Procurar nome, email, telefone…"
          className="flex-1 min-w-[200px] bg-transparent border-0 border-b border-pm-line focus:border-pm-ink focus:outline-none py-2 text-[15px] text-pm-ink font-body"
        />
        <button
          type="button"
          onClick={exportCsv}
          disabled={!rows.length}
          className="font-label font-bold text-[12px] tracking-[0.12em] uppercase text-pm-concrete hover:text-pm-ink disabled:opacity-40"
        >
          Exportar CSV
        </button>
      </div>

      {/* inbox */}
      <div className="border border-pm-line bg-pm-bg">
        {loading && <div className="p-6 text-pm-concrete text-[14px]">A carregar…</div>}
        {!loading && list.length === 0 && (
          <div className="p-10 text-center text-pm-concrete text-[15px]">
            {rows.length ? "Nenhum pedido corresponde ao filtro." : "Ainda não chegou nenhum pedido."}
          </div>
        )}
        {list.map((r) => {
          const unread = isUnread(r);
          const isOpen = open === r.id;
          const interesse = [r.interesse, r.gabinete ? `${r.gabinete} pessoas` : null].filter(Boolean).join(" · ");
          return (
            <div key={r.id} className="border-b border-pm-line last:border-b-0">
              <button
                type="button"
                onClick={() => toggle(r)}
                aria-expanded={isOpen}
                className={`w-full text-left grid grid-cols-[14px_minmax(0,1fr)_auto] md:grid-cols-[14px_220px_minmax(0,1fr)_auto_90px] gap-x-4 gap-y-1 items-center px-5 py-4 transition-colors ${
                  isOpen ? "bg-pm-bgAlt" : "hover:bg-pm-bgAlt/60"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${unread ? "bg-pm-sky" : "bg-transparent"}`} aria-label={unread ? "por ler" : undefined} />
                <span className={`truncate text-[15px] text-pm-ink ${unread ? "font-bold" : ""}`}>{r.nome}</span>
                <span className="hidden md:block truncate text-[14px] text-pm-graphite">
                  {interesse || "—"}
                  {r.quando ? <span className="text-pm-concrete"> · {r.quando}</span> : null}
                </span>
                <span className="justify-self-end">
                  {r.sinal_aceite && (
                    <span className="font-label font-bold text-[11px] tracking-[0.08em] uppercase border border-pm-ink px-2 py-0.5 text-pm-ink whitespace-nowrap">
                      sinal{r.sinal_valor ? ` ${r.sinal_valor} €` : ""}
                    </span>
                  )}
                </span>
                <span className={`hidden md:block text-right text-[13px] ${unread ? "text-pm-ink font-bold" : "text-pm-concrete"}`}>
                  {when(r.created_at)}
                </span>
                <span className="md:hidden col-start-2 col-span-2 text-[13px] text-pm-graphite truncate">
                  {interesse || "—"} · {when(r.created_at)}
                </span>
              </button>

              {isOpen && (
                <div className="px-5 md:pl-[54px] pb-6 pt-2 bg-pm-bgAlt">
                  <div className="flex flex-wrap gap-3 mb-5">
                    <a href={`mailto:${r.email}`} className="bg-pm-ink text-pm-bg py-2 px-4 font-label font-bold text-[11px] tracking-[0.12em] uppercase">
                      Email
                    </a>
                    <a href={`tel:${r.telefone.replace(/\s/g, "")}`} className="border border-pm-ink text-pm-ink py-2 px-4 font-label font-bold text-[11px] tracking-[0.12em] uppercase">
                      Ligar
                    </a>
                    <a
                      href={`https://wa.me/${r.telefone.replace(/\D/g, "").replace(/^(?!351)(9\d{8})$/, "351$1")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="border border-pm-ink text-pm-ink py-2 px-4 font-label font-bold text-[11px] tracking-[0.12em] uppercase"
                    >
                      WhatsApp
                    </a>
                    {hasRead && (
                      <button
                        type="button"
                        onClick={() => setRead(r, false)}
                        className="font-label font-bold text-[11px] tracking-[0.12em] uppercase text-pm-concrete hover:text-pm-ink px-2"
                      >
                        Marcar como não lido
                      </button>
                    )}
                  </div>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3 text-[14px]">
                    <Item k="Email" v={r.email} />
                    <Item k="Telemóvel" v={r.telefone} />
                    <Item k="Profissão / empresa" v={r.profissao} />
                    <Item k="Onde mora" v={r.onde} />
                    <Item k="Interesse" v={r.interesse} />
                    {r.gabinete && <Item k="Pessoas no gabinete" v={r.gabinete} />}
                    <Item k="Dias por semana" v={r.dias} />
                    <Item k="Quando" v={r.quando} />
                    <Item k="Cacifo" v={r.cacifo} />
                    <Item k="Sinal" v={r.sinal_aceite ? `Sim${r.sinal_valor ? ` — ${r.sinal_valor} €` : ""}` : "Não"} />
                    <Item
                      k="Recebido"
                      v={new Date(r.created_at).toLocaleString("pt-PT", { dateStyle: "long", timeStyle: "short", timeZone: "Europe/Lisbon" })}
                    />
                  </dl>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Kpi({ label, value, sub, accent = false }: { label: string; value: number; sub: string; accent?: boolean }) {
  return (
    <div className="bg-pm-bg p-5 md:p-6">
      <div className={`${labelCls} mb-3`}>{label}</div>
      <div className="font-display text-[44px] leading-none mb-2 text-pm-ink">
        {value}
        {accent && <span className="inline-block w-2.5 h-2.5 rounded-full bg-pm-sky align-top ml-2 mt-2" />}
      </div>
      <div className="text-[13px] text-pm-concrete">{sub}</div>
    </div>
  );
}

function Breakdown({ title, data, total }: { title: string; data: [string, number][]; total: number }) {
  return (
    <div className="border border-pm-line bg-pm-bg p-5">
      <div className={`${labelCls} mb-4 text-pm-ink`}>{title}</div>
      <ul className="m-0 p-0 list-none flex flex-col gap-2.5">
        {data.slice(0, 7).map(([k, n]) => (
          <li key={k} className="text-[13px]">
            <div className="flex justify-between gap-3 mb-1">
              <span className="text-pm-ink truncate">{k}</span>
              <span className="text-pm-concrete tabular-nums">{n}</span>
            </div>
            <div className="h-[3px] bg-pm-line">
              <div className="h-full bg-pm-ink" style={{ width: `${(n / total) * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Item({ k, v }: { k: string; v: string | null | undefined }) {
  return (
    <div>
      <dt className="font-label font-semibold text-[10px] tracking-[0.14em] uppercase text-pm-concrete mb-0.5">{k}</dt>
      <dd className="m-0 text-pm-ink break-words">{v || "—"}</dd>
    </div>
  );
}
