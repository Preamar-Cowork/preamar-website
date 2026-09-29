-- PREAMAR — textos para SEO (aprovados a 29 set. 2026) aplicados ao conteúdo já guardado no /admin.
-- Seguro correr mais do que uma vez. Secções nunca guardadas usam já os novos textos por omissão.

-- 1) Subtítulo do hero
update site_content
set hero_settings = jsonb_set(coalesce(hero_settings, '{}'::jsonb), '{subtitle}',
      to_jsonb('Cowork no Montijo — secretárias, gabinetes privados e morada fiscal.'::text), true)
where id = 1;

-- 2) "incluido" → "incluído" em todos os textos
update site_content
set sections = replace(replace(sections::text, 'ncluido', 'ncluído'), 'NCLUIDO', 'NCLUÍDO')::jsonb
where id = 1;

-- 3) Títulos das secções
update site_content
set sections = jsonb_set(sections, '{plans,label}', to_jsonb('Planos e preços'::text))
where id = 1 and sections ? 'plans';

update site_content
set sections = jsonb_set(sections, '{fiscal,label}', to_jsonb('Morada fiscal e domiciliação de empresas'::text))
where id = 1 and sections ? 'fiscal';

-- 4) Duas perguntas novas nas perguntas frequentes
update site_content
set sections = jsonb_set(
  sections,
  '{faq,items}',
  coalesce(sections -> 'faq' -> 'items', '[]'::jsonb) || jsonb_build_array(
    jsonb_build_object(
      'q', 'Posso usar a PREAMAR como sede da minha empresa?',
      'a', 'Sim. A morada fiscal custa 30 € por mês, IVA incluído, e já vem incluída nos gabinetes. Inclui receção de correio e encomendas, digitalização e aviso por email.'
    ),
    jsonb_build_object(
      'q', 'Quanto custa um cowork no Montijo?',
      'a', 'Na PREAMAR, uma secretária flexível custa 12 € por dia, 45 € por semana ou 90 € por mês; uma secretária fixa 150 € por mês; e um gabinete privado desde 400 € por mês para 2 pessoas. Todos os preços têm IVA incluído.'
    )
  )
)
where id = 1
  and sections ? 'faq'
  and not coalesce(sections -> 'faq' -> 'items', '[]'::jsonb) @> '[{"q": "Posso usar a PREAMAR como sede da minha empresa?"}]'::jsonb;
