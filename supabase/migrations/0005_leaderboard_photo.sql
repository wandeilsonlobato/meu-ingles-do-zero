-- Meu Inglês do Zero — inclui a foto de perfil no ranking semanal
-- Rode este arquivo no SQL Editor do Supabase (depois do 0001 a 0004).
--
-- Postgres só deixa CREATE OR REPLACE VIEW adicionar coluna no FINAL da
-- lista (não pode inserir no meio nem renomear) — por isso avatar_photo_url
-- vai depois das colunas originais, na mesma ordem de antes.

create or replace view public.leaderboard as
  select id, name, avatar_emoji, league, xp_this_week, week_start_date, avatar_photo_url
  from public.profiles;

grant select on public.leaderboard to authenticated;
