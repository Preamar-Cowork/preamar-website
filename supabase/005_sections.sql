-- PREAMAR — textos e imagens de todas as secções, editáveis no /admin (um só campo JSON)
alter table site_content
  add column if not exists sections jsonb not null default '{}'::jsonb;
