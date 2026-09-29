-- PREAMAR — caixa de pedidos no /admin: marca de "lido"
alter table reservations
  add column if not exists read_at timestamptz;
