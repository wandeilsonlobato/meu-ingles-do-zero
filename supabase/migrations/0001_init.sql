-- Meu Inglês do Zero — schema inicial
-- Rode este arquivo inteiro no SQL Editor do seu projeto Supabase
-- (Dashboard > SQL Editor > New query > cole e clique em Run).

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- profiles: 1 linha por usuário autenticado, espelha o tipo `User` do frontend
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  email text not null,
  avatar_emoji text not null default '🙂',
  is_admin boolean not null default false,
  onboarded boolean not null default false,
  reason_to_learn text,
  daily_goal text not null default 'regular',
  xp_total integer not null default 0,
  coins integer not null default 50,
  streak_current integer not null default 0,
  streak_record integer not null default 0,
  last_study_date date,
  streak_freeze_count integer not null default 1,
  lives_current integer not null default 5,
  lives_max integer not null default 5,
  lives_last_refill_at timestamptz,
  league text not null default 'Bronze',
  xp_this_week integer not null default 0,
  week_start_date date not null default date_trunc('week', now())::date,
  owned_cosmetics text[] not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- helper usado pelas policies para checar se o usuário logado é admin,
-- sem cair em recursão infinita de RLS ao consultar a própria tabela profiles
create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select is_admin from public.profiles where id = uid), false)
$$;

create policy "profiles_select_own_or_admin" on public.profiles
  for select using (auth.uid() = id or public.is_admin(auth.uid()));

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- cria a linha em profiles automaticamente quando alguém se cadastra
-- (e-mail/senha ou Google) — pega nome do metadata do provedor OAuth quando existir
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.email
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- user_progress: 1 linha por (usuário, lição)
-- ---------------------------------------------------------------------------
create table public.user_progress (
  user_id uuid not null references public.profiles (id) on delete cascade,
  lesson_id text not null,
  status text not null,
  attempts integer not null default 0,
  correct integer not null default 0,
  best_accuracy integer not null default 0,
  completed_at timestamptz,
  primary key (user_id, lesson_id)
);

alter table public.user_progress enable row level security;

create policy "progress_select_own_or_admin" on public.user_progress
  for select using (auth.uid() = user_id or public.is_admin(auth.uid()));

create policy "progress_insert_own" on public.user_progress
  for insert with check (auth.uid() = user_id);

create policy "progress_update_own" on public.user_progress
  for update using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- user_achievements: 1 linha por conquista desbloqueada
-- ---------------------------------------------------------------------------
create table public.user_achievements (
  user_id uuid not null references public.profiles (id) on delete cascade,
  achievement_id text not null,
  earned_at timestamptz not null default now(),
  primary key (user_id, achievement_id)
);

alter table public.user_achievements enable row level security;

create policy "achievements_select_own_or_admin" on public.user_achievements
  for select using (auth.uid() = user_id or public.is_admin(auth.uid()));

create policy "achievements_insert_own" on public.user_achievements
  for insert with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- custom_lesson_drafts: rascunhos de lição criados no painel admin
-- ---------------------------------------------------------------------------
create table public.custom_lesson_drafts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  unit_title text not null,
  exercises jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.custom_lesson_drafts enable row level security;

create policy "drafts_select_authenticated" on public.custom_lesson_drafts
  for select using (auth.role() = 'authenticated');

create policy "drafts_insert_own" on public.custom_lesson_drafts
  for insert with check (auth.uid() = author_id);

create policy "drafts_delete_own_or_admin" on public.custom_lesson_drafts
  for delete using (auth.uid() = author_id or public.is_admin(auth.uid()));

-- ---------------------------------------------------------------------------
-- Para virar admin (necessário para acessar /admin), rode manualmente:
-- update public.profiles set is_admin = true where email = 'seu-email@exemplo.com';
-- ---------------------------------------------------------------------------
