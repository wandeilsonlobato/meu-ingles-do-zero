-- Meu Inglês do Zero — inclui a foto de perfil no ranking semanal
-- Rode este arquivo no SQL Editor do Supabase (depois do 0001 a 0004).

create or replace view public.leaderboard as
  select id, name, avatar_emoji, avatar_photo_url, league, xp_this_week, week_start_date
  from public.profiles;

grant select on public.leaderboard to authenticated;
