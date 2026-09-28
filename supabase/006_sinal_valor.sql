-- PREAMAR — guarda o valor do sinal aceite (20 € secretárias / 100 € gabinetes)
alter table reservations
  add column if not exists sinal_valor numeric;
