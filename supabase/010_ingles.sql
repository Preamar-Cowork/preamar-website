-- PREAMAR — versão inglesa do site (preamar.pt/en)
-- Seguro correr mais do que uma vez.

-- Textos em inglês editados no /admin (separador "English").
-- Enquanto estiver vazio, o site usa os rascunhos em inglês do código.
alter table site_content
  add column if not exists sections_en jsonb not null default '{}'::jsonb;

-- Língua em que o pedido de reserva foi feito ("pt" ou "en")
alter table reservations
  add column if not exists idioma text;

-- atualiza a cache da API do Supabase
notify pgrst, 'reload schema';
