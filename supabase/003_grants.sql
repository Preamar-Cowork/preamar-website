-- PREAMAR — explicit table grants
-- service_role bypasses RLS, but still needs standard Postgres table
-- grants — this project's public schema didn't have them pre-applied for
-- these two tables, causing "permission denied for table X" on the
-- service-role client even though RLS/policies were correct.

grant usage on schema public to anon, authenticated, service_role;

grant select, insert, update, delete on site_content to service_role;
grant select on site_content to anon, authenticated;

grant select, insert, update, delete on reservations to service_role;
