-- PREAMAR — validation landing page reservations
create table if not exists reservations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nome text not null,
  email text not null,
  telefone text not null,
  profissao text,
  onde text,
  interesse text,
  gabinete text,
  dias text,
  quando text,
  cacifo text,
  sinal_aceite boolean not null default false,
  privacy_aceite boolean not null default false
);

alter table reservations enable row level security;

-- Only the service role (used server-side from the API route) can write.
-- No public policies are created, so anon/browser clients get no access.
