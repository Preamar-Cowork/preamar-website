-- PREAMAR — preços como variáveis ({fixo}, {morada-fiscal}, …) no conteúdo já guardado.
-- Seguro correr mais do que uma vez.

-- Morada fiscal: guarda o preço como número e usa a variável na frase grande
update site_content
set sections = jsonb_set(
  jsonb_set(
    sections,
    '{fiscal,price}',
    to_jsonb(coalesce((regexp_match(sections -> 'fiscal' ->> 'headline', '(\d+)\s?€'))[1]::numeric, 30))
  ),
  '{fiscal,headline}',
  to_jsonb(regexp_replace(sections -> 'fiscal' ->> 'headline', '\d+\s?€', '{morada-fiscal}'))
)
where id = 1 and sections ? 'fiscal' and sections -> 'fiscal' ->> 'headline' ~ '\d+\s?€';

-- Perguntas frequentes com preços → variáveis
update site_content
set sections = jsonb_set(
  sections,
  '{faq,items}',
  (
    select jsonb_agg(
      case item ->> 'q'
        when 'Quanto custa um cowork no Montijo?' then jsonb_set(item, '{a}', to_jsonb(
          'Na PREAMAR, uma secretária flexível custa {flexivel-dia} por dia, {flexivel-semana} por semana ou {flexivel-mes} por mês; uma secretária fixa {fixo} por mês; e um gabinete privado desde {gabinete-2} por mês para 2 pessoas. Todos os preços têm IVA incluído.'::text))
        when 'Posso usar a PREAMAR como sede da minha empresa?' then jsonb_set(item, '{a}', to_jsonb(
          'Sim. A morada fiscal custa {morada-fiscal} por mês, IVA incluído, e já vem incluída nos gabinetes. Inclui receção de correio e encomendas, digitalização e aviso por email.'::text))
        when 'O sinal é mesmo reembolsável?' then jsonb_set(item, '{a}', to_jsonb(
          'Sim. O sinal — {sinal} para secretárias, {sinal-gabinete} para gabinetes — é totalmente reembolsável se decidires não avançar.'::text))
        else item
      end
      order by ord
    )
    from jsonb_array_elements(sections -> 'faq' -> 'items') with ordinality as t(item, ord)
  )
)
where id = 1 and jsonb_typeof(sections -> 'faq' -> 'items') = 'array';
