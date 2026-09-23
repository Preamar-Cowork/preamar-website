"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

export type SaveState = { kind: "idle" | "busy" | "done" | "error"; msg?: string };

export const labelCls = "font-label font-bold text-[11px] tracking-[0.15em] uppercase text-pm-concrete";
export const inputCls =
  "w-full bg-transparent border-0 border-b border-pm-line focus:border-pm-ink focus:outline-none py-2.5 text-[16px] text-pm-ink font-body";

export async function readJson(res: Response) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`resposta inesperada do servidor (${res.status}): ${text.slice(0, 160)}`);
  }
}

/**
 * Renders children at a real 1440px desktop width, scaled to fit the column.
 * With `height` it's a fixed frame (hero); without, it follows the content.
 */
export function ScaledPreview({ children, height }: { children: ReactNode; height?: number }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const [contentH, setContentH] = useState(height ?? 800);
  useLayoutEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;
    const ro = new ResizeObserver(() => {
      setScale(o.clientWidth / 1440);
      if (!height) setContentH(i.scrollHeight);
    });
    ro.observe(o);
    ro.observe(i);
    return () => ro.disconnect();
  }, [height]);
  const h = height ?? contentH;
  return (
    <div
      ref={outer}
      className="relative w-full border border-pm-line bg-pm-bg overflow-hidden"
      style={{ height: h * scale }}
    >
      <div
        ref={inner}
        className="absolute top-0 left-0 origin-top-left"
        style={{ width: 1440, height: height, transform: `scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  );
}

export function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border border-pm-line bg-pm-bg p-6">
      <div className={`${labelCls} mb-6 text-pm-ink`}>{title}</div>
      <div className="flex flex-col gap-6">{children}</div>
    </section>
  );
}

export function Field({ label, help, children }: { label: string; help?: string; children: ReactNode }) {
  return (
    <div>
      <div className={`${labelCls} mb-2.5`}>{label}</div>
      {children}
      {help && <p className="text-pm-concrete text-[12px] mt-1.5">{help}</p>}
    </div>
  );
}

export function Choice({
  active,
  onClick,
  children,
  wide = false,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${wide ? "w-full text-left" : ""} whitespace-nowrap px-3.5 py-2.5 border font-label font-semibold text-[12px] tracking-[0.08em] uppercase transition-colors ${
        active ? "bg-pm-ink text-pm-bg border-pm-ink" : "bg-transparent text-pm-ink border-pm-line hover:border-pm-ink"
      }`}
    >
      {children}
    </button>
  );
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1">
        <span className={labelCls}>{label}</span>
        <span className="font-label font-bold text-[13px] text-pm-ink tabular-nums">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        className="pm-range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

/** Save / undo / reset row, shared by every editor page. */
export function SaveBar({
  dirty,
  save,
  onSave,
  onUndo,
  onReset,
}: {
  dirty: boolean;
  save: SaveState;
  onSave: () => void;
  onUndo: () => void;
  onReset: () => void;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={onSave}
          disabled={!dirty || save.kind === "busy"}
          className="bg-pm-ink text-pm-bg py-3 px-6 font-label font-bold text-sm tracking-[0.14em] uppercase disabled:opacity-40"
        >
          {save.kind === "busy" ? "A guardar…" : "Guardar alterações"}
        </button>
        <button
          onClick={onUndo}
          disabled={!dirty}
          className="font-label font-bold text-[12px] tracking-[0.14em] uppercase text-pm-concrete disabled:opacity-40"
        >
          Desfazer
        </button>
        <button
          onClick={onReset}
          className="font-label font-bold text-[12px] tracking-[0.14em] uppercase text-pm-concrete"
        >
          Repor predefinições
        </button>
      </div>
      {save.msg && (
        <p className={`mt-4 font-label text-[13px] ${save.kind === "error" ? "text-[#A0524A]" : "text-pm-graphite"}`}>
          {save.msg}
        </p>
      )}
    </div>
  );
}
