-- Meu Inglês do Zero — fila de revisão espaçada
-- Rode este arquivo no SQL Editor do Supabase (depois do 0001_init.sql).

create table public.user_review_items (
  user_id uuid not null references public.profiles (id) on delete cascade,
  exercise_id text not null,
  lesson_id text not null,
  interval_stage integer not null default 0,
  next_review_date date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, exercise_id)
);

alter table public.user_review_items enable row level security;

create policy "review_items_select_own" on public.user_review_items
  for select using (auth.uid() = user_id);

create policy "review_items_insert_own" on public.user_review_items
  for insert with check (auth.uid() = user_id);

create policy "review_items_update_own" on public.user_review_items
  for update using (auth.uid() = user_id);

create policy "review_items_delete_own" on public.user_review_items
  for delete using (auth.uid() = user_id);
