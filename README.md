# PREAMAR — website

Landing page de validação para o cowork PREAMAR (Montijo), junto ao estuário do Tejo.

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Supabase · Vercel — mesmo padrão do
`verumforma-website` e do `braosa-tales-website`.

## Getting Started

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Supabase

1. Criar um projeto Supabase dedicado ao PREAMAR.
2. Copiar `.env.local.example` para `.env.local` (já feito) e preencher
   `NEXT_PUBLIC_SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` a partir de
   Project Settings → API.
3. Correr `supabase/001_reservations.sql` no SQL editor do Supabase.

Sem estas variáveis, o formulário continua a funcionar localmente (o pedido só fica registado
nos logs do servidor em vez de gravado na base de dados).

## Estrutura

- `app/page.tsx` — página única, monta as secções por ordem
- `components/sections/` — Hero, About, Problem, Space, Plans, Fiscal, NextPhase, ReservationForm, FAQ
- `components/layout/Footer.tsx`
- `components/ui/` — Symbol (marca marégrafo), Chips, SegmentedControl
- `app/api/reservations/route.ts` — grava o formulário no Supabase
- `supabase/001_reservations.sql` — schema da tabela `reservations`

## Marca

Sistema de marca v2 (5 traços, topo mais grosso em azul-céu #84A6B2). Wordmark Libre Caslon
Display, corpo Libre Caslon Text, legendas Archivo Narrow. Ver `tailwind.config.ts` (paleta `pm.*`).
