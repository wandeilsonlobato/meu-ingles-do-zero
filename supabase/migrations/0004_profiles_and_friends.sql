-- Meu Inglês do Zero — bio/nome editável, foto de perfil, sistema de amigos
-- Rode este arquivo no SQL Editor do Supabase (depois dos 0001, 0002 e 0003).

-- ---------------------------------------------------------------------------
-- Perfil: bio e foto (nome já existia e já era editável no banco, só faltava UI)
-- ---------------------------------------------------------------------------
alter table public.profiles add column if not exists bio text;
alter table public.profiles add column if not exists avatar_photo_url text;

-- ---------------------------------------------------------------------------
-- Storage: bucket público para as fotos de perfil, uma pasta por usuário
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "avatar_photos_public_read" on storage.objects
  for select using (bucket_id = 'avatars');

create policy "avatar_photos_insert_own" on storage.objects
  for insert with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "avatar_photos_update_own" on storage.objects
  for update using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "avatar_photos_delete_own" on storage.objects
  for delete using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- ---------------------------------------------------------------------------
-- Perfis públicos: para busca de pessoas e visualização de perfil de outros
-- alunos. Só dados que fazem sentido mostrar publicamente dentro do app.
-- ---------------------------------------------------------------------------
create view public.public_profiles as
  select id, name, avatar_emoji, avatar_photo_url, bio, streak_current, league, created_at
  from public.profiles;

grant select on public.public_profiles to authenticated;

-- Conquistas passam a ser visíveis para qualquer aluno logado (são "medalhas
-- para mostrar", não dado sensível) — necessário para o perfil público exibir
-- as conquistas de outra pessoa.
drop policy if exists "achievements_select_own_or_admin" on public.user_achievements;
create policy "achievements_select_authenticated" on public.user_achievements
  for select using (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- Amizades: pedido -> aceito, com lista de amigos
-- ---------------------------------------------------------------------------
create table public.friendships (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles (id) on delete cascade,
  addressee_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  constraint friendships_no_self_request check (requester_id <> addressee_id),
  constraint friendships_unique_pair unique (requester_id, addressee_id)
);

alter table public.friendships enable row level security;

create policy "friendships_select_involved" on public.friendships
  for select using (auth.uid() = requester_id or auth.uid() = addressee_id);

create policy "friendships_insert_own_request" on public.friendships
  for insert with check (auth.uid() = requester_id);

create policy "friendships_update_involved" on public.friendships
  for update using (auth.uid() = requester_id or auth.uid() = addressee_id);

create policy "friendships_delete_involved" on public.friendships
  for delete using (auth.uid() = requester_id or auth.uid() = addressee_id);

-- ---------------------------------------------------------------------------
-- Idioma da interface (pt/en), guardado no perfil para sincronizar entre aparelhos
-- ---------------------------------------------------------------------------
alter table public.profiles add column if not exists interface_locale text not null default 'pt';
