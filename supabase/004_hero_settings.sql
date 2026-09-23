-- PREAMAR — definições editáveis do hero (filtro, texto, logo), num só campo JSON
alter table site_content
  add column if not exists hero_settings jsonb not null default '{}'::jsonb;
