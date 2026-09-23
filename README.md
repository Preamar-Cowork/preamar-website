# PREAMAR — website

Site da marca PREAMAR — espaços de trabalho no Montijo, junto ao estuário do Tejo. Redesign v2:
hero em vídeo/foto de página inteira, ritmo editorial assimétrico, marégrafo como fio condutor.

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion · Supabase (Auth + DB + Storage) —
mesmo padrão do `verumforma-website`.

## Getting Started

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Supabase

1. Copiar `.env.local.example` para `.env.local` e preencher a partir de Project Settings → API Keys:
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
2. Correr no SQL Editor, por ordem: `supabase/001_reservations.sql`, `supabase/002_site_content.sql`
   (cria também o bucket de Storage `media`, público para leitura).
3. Criar o utilizador admin: Authentication → Users → Add user (email + password). É esse login que
   dá acesso a `/admin`.

## /admin

`/admin/login` — autenticação Supabase (email + password do utilizador criado acima).
`/admin` — upload do vídeo do hero (grava em Storage `media/hero/…` e liga automaticamente ao hero
da página pública via `site_content.hero_video_url`). Sem vídeo carregado, o hero mostra uma
composição de reserva (placeholder) em vez de vídeo.

## Estrutura

- `app/page.tsx` — página única, monta as secções por ordem
- `components/sections/` — Hero, About, Problem, Space, Plans, Fiscal, NextPhase, ReservationForm, FAQ
- `components/layout/Footer.tsx`
- `components/ui/` — Symbol (marégrafo), Chips, SegmentedControl, PhotoPlaceholder, RevealLines,
  TideProgressLine, Folio
- `components/admin/` — SignOutButton
- `app/admin/` — login + painel de conteúdo (protegidos por `middleware.ts`)
- `app/api/reservations/route.ts` — grava o formulário no Supabase
- `app/api/content/route.ts` — leitura pública do conteúdo editável (vídeo do hero)
- `app/api/admin/content/route.ts` — upload do vídeo (autenticado)
- `lib/supabase/` — clientes Supabase (browser/server/middleware), padrão `@supabase/ssr`
- `supabase/` — migrações SQL (reservas, conteúdo + bucket de media)

## Marca

Libre Caslon Display (wordmark/display) · Libre Caslon Text (corpo) · Archivo Narrow (etiquetas).
Paleta `pm.*` em `tailwind.config.ts`: ardósia `#3F4346` (texto/botões), azul-maré `#84A6B2`
(acento gráfico apenas — nunca texto corrido nem fundo de botão), off-white `#F3F1EC` /
`#EAE7DF`, linha `#DAD5CB`, cinzentos `#6E7275` / `#7B8083`.

Zero cantos arredondados, zero sombras, zero gradientes decorativos, zero ícones genéricos.
Movimento respeita `prefers-reduced-motion`.
