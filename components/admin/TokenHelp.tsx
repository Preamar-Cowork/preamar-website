"use client";

import { useState } from "react";
import type { TokenInfo } from "@/lib/content/tokens";
import { labelCls } from "@/components/admin/ui";

/** Lists the {price} variables with their current values; click one to copy it. */
export function TokenHelp({ tokens }: { tokens: TokenInfo[] }) {
  const [copied, setCopied] = useState<string | null>(null);
  return (
    <details className="border border-pm-line bg-pm-bg p-5 group">
      <summary className={`${labelCls} text-pm-ink cursor-pointer list-none flex justify-between`}>
        <span>Variáveis de preço</span>
        <span className="text-pm-concrete group-open:hidden">mostrar</span>
      </summary>
      <p className="text-[13px] text-pm-graphite mt-4 mb-3">
        Escreve a variável em qualquer texto e o site mostra o preço atual do separador Planos. Se mudares um preço,
        muda em todo o lado. Carrega numa para copiar.
      </p>
      <ul className="m-0 p-0 list-none flex flex-col">
        {tokens.map((t) => (
          <li key={t.token}>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(`{${t.token}}`).catch(() => {});
                setCopied(t.token);
                setTimeout(() => setCopied((c) => (c === t.token ? null : c)), 1200);
              }}
              className="w-full text-left flex justify-between gap-3 py-1.5 border-b border-pm-line/60 text-[13px] hover:bg-pm-bgAlt"
            >
              <code className="text-pm-ink">{`{${t.token}}`}</code>
              <span className="text-pm-concrete whitespace-nowrap">{copied === t.token ? "copiado" : t.value}</span>
            </button>
          </li>
        ))}
      </ul>
    </details>
  );
}
