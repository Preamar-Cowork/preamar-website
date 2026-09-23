"use client";

import { useState } from "react";
import type { Field as FieldDef } from "@/lib/content/schema";
import { Field, inputCls, labelCls, readJson } from "@/components/admin/ui";

type Val = unknown;
type Obj = Record<string, unknown>;

const smallBtn =
  "font-label font-bold text-[11px] tracking-[0.12em] uppercase text-pm-concrete hover:text-pm-ink disabled:opacity-30";

/** One field of a section, rendered according to its schema type. */
export function FieldEditor({ def, value, onChange }: { def: FieldDef; value: Val; onChange: (v: Val) => void }) {
  switch (def.type) {
    case "text":
      return (
        <Field label={def.label} help={def.help}>
          <input className={inputCls} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />
        </Field>
      );
    case "textarea":
    case "lines":
      return (
        <Field label={def.label} help={def.help}>
          <textarea
            className={`${inputCls} resize-y`}
            rows={def.type === "textarea" ? def.rows ?? 3 : Math.max(2, String(value ?? "").split("\n").length)}
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
          />
        </Field>
      );
    case "number":
      return (
        <Field label={def.label} help={def.help}>
          <input
            type="number"
            className={`${inputCls} max-w-[160px]`}
            min={def.min}
            max={def.max}
            value={Number(value ?? 0)}
            onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
          />
        </Field>
      );
    case "bool":
      return (
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input type="checkbox" className="w-4 h-4 accent-[#3F4346]" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
          <span className={labelCls}>{def.label}</span>
        </label>
      );
    case "image":
      return <ImageField label={def.label} help={def.help} value={String(value ?? "")} onChange={onChange} />;
    case "strings": {
      const list = Array.isArray(value) ? (value as string[]) : [];
      const max = def.max ?? 50;
      return (
        <Field label={def.label} help={def.help}>
          <div className="flex flex-col gap-1">
            {list.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  className={inputCls}
                  value={item}
                  onChange={(e) => onChange(list.map((x, j) => (j === i ? e.target.value : x)))}
                />
                <ItemControls
                  index={i}
                  length={list.length}
                  onMove={(to) => onChange(move(list, i, to))}
                  onRemove={() => onChange(list.filter((_, j) => j !== i))}
                />
              </div>
            ))}
            {list.length < max && (
              <button type="button" className={`${smallBtn} self-start mt-2`} onClick={() => onChange([...list, ""])}>
                + {def.itemLabel}
              </button>
            )}
          </div>
        </Field>
      );
    }
    case "items": {
      const list = Array.isArray(value) ? (value as Obj[]) : [];
      const max = def.max ?? 50;
      const blank = () => Object.fromEntries(def.fields.map((f) => [f.key, emptyValue(f)]));
      return (
        <div>
          <div className={`${labelCls} mb-3`}>{def.label}</div>
          <div className="flex flex-col gap-4">
            {list.map((item, i) => (
              <div key={i} className="border border-pm-line p-4 flex flex-col gap-5 bg-pm-bgAlt/40">
                <div className="flex justify-between items-center">
                  <span className={`${labelCls} text-pm-ink`}>
                    {def.itemLabel} {i + 1}
                  </span>
                  {!def.fixed && (
                    <ItemControls
                      index={i}
                      length={list.length}
                      onMove={(to) => onChange(move(list, i, to))}
                      onRemove={() => onChange(list.filter((_, j) => j !== i))}
                    />
                  )}
                </div>
                {def.fields.map((sub) => (
                  <FieldEditor
                    key={sub.key}
                    def={sub}
                    value={item[sub.key]}
                    onChange={(v) => onChange(list.map((x, j) => (j === i ? { ...x, [sub.key]: v } : x)))}
                  />
                ))}
              </div>
            ))}
            {!def.fixed && list.length < max && (
              <button type="button" className={`${smallBtn} self-start`} onClick={() => onChange([...list, blank()])}>
                + {def.itemLabel}
              </button>
            )}
          </div>
        </div>
      );
    }
  }
}

function emptyValue(f: FieldDef): Val {
  if (f.type === "number") return 0;
  if (f.type === "bool") return false;
  if (f.type === "strings" || f.type === "items") return [];
  return "";
}

function move<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length) return list;
  const copy = [...list];
  const [x] = copy.splice(from, 1);
  copy.splice(to, 0, x);
  return copy;
}

function ItemControls({
  index,
  length,
  onMove,
  onRemove,
}: {
  index: number;
  length: number;
  onMove: (to: number) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-3 shrink-0">
      <button type="button" className={smallBtn} disabled={index === 0} onClick={() => onMove(index - 1)} aria-label="Subir">
        ↑
      </button>
      <button
        type="button"
        className={smallBtn}
        disabled={index === length - 1}
        onClick={() => onMove(index + 1)}
        aria-label="Descer"
      >
        ↓
      </button>
      <button type="button" className={`${smallBtn} hover:text-[#A0524A]`} onClick={onRemove} aria-label="Remover">
        ✕
      </button>
    </div>
  );
}

function ImageField({
  label,
  help,
  value,
  onChange,
}: {
  label: string;
  help?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function upload(file: File) {
    setBusy(true);
    setError("");
    try {
      const body = new FormData();
      body.append("image", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await readJson(res);
      if (!res.ok) throw new Error(data?.error || `erro ${res.status}`);
      onChange(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Field label={label} help={help}>
      <div className="flex gap-4 items-start">
        <div className="w-40 h-24 shrink-0 border border-pm-line bg-pm-bgAlt overflow-hidden flex items-center justify-center">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="font-label text-[10px] tracking-[0.1em] uppercase text-pm-concrete">sem imagem</span>
          )}
        </div>
        <div className="flex flex-col gap-2 items-start">
          <label className="bg-pm-ink text-pm-bg py-2 px-4 font-label font-bold text-[11px] tracking-[0.14em] uppercase cursor-pointer">
            {busy ? "A carregar…" : value ? "Trocar imagem" : "Carregar imagem"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="hidden"
              disabled={busy}
              onChange={(e) => {
                const f = e.target.files?.[0];
                e.target.value = "";
                if (f) upload(f);
              }}
            />
          </label>
          {value && (
            <button type="button" className={smallBtn} onClick={() => onChange("")}>
              Remover imagem
            </button>
          )}
          {error && <span className="font-label text-[12px] text-[#A0524A]">{error}</span>}
        </div>
      </div>
    </Field>
  );
}
