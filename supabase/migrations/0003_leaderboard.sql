-- Meu Inglês do Zero — ranking real (só alunos de verdade)
-- Rode este arquivo no SQL Editor do Supabase (depois do 0001 e 0002).
--
-- profiles tem RLS restrita (cada aluno só vê a própria linha). Para a liga
-- funcionar, todo aluno autenticado precisa ver nome/avatar/XP da semana/liga
-- dos OUTROS alunos — nunca e-mail ou qualquer outro dado sensível. Esta view
-- expõe só essas colunas; como é criada pelo dono do schema (que ignora RLS
-- de profiles), ela consegue ler todas as linhas, e o GRANT abaixo controla
-- quem pode consultar a view em si.

create view public.leaderboard as
  select id, name, avatar_emoji, league, xp_this_week, week_start_date
  from public.profiles;

grant select on public.leaderboard to authenticated;
