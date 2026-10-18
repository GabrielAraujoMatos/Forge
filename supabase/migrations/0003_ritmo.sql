-- Ritmo de estudo: atividade por dia (sequência e calendário) e a meta semanal.
-- Rode no Supabase em: SQL Editor → New query → cole e execute.

create table if not exists public.atividade (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  -- Dia no fuso do usuário, calculado no navegador.
  dia date not null,
  forjados integer not null default 0 check (forjados >= 0),
  anotou boolean not null default false,
  primary key (user_id, dia)
);

create table if not exists public.preferencias (
  user_id uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  meta_semanal integer not null default 3 check (meta_semanal between 1 and 10)
);

alter table public.atividade enable row level security;
alter table public.preferencias enable row level security;

-- Cada usuário só enxerga e altera os próprios dados.
create policy "atividade: ler a própria" on public.atividade for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "atividade: inserir a própria" on public.atividade for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "atividade: atualizar a própria" on public.atividade for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "preferencias: ler as próprias" on public.preferencias for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "preferencias: inserir as próprias" on public.preferencias for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "preferencias: atualizar as próprias" on public.preferencias for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
