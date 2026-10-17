-- Progresso dos usuários: um registro por tópico concluído ("forjado").
-- Rode no Supabase em: SQL Editor → New query → cole e execute.

create table if not exists public.progresso (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  trilha text not null,
  topico text not null,
  concluido_em timestamptz not null default now(),
  primary key (user_id, trilha, topico)
);

alter table public.progresso enable row level security;

-- Cada usuário só enxerga e altera o próprio progresso.
create policy "progresso: ler o próprio"
  on public.progresso for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "progresso: inserir o próprio"
  on public.progresso for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "progresso: atualizar o próprio"
  on public.progresso for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "progresso: apagar o próprio"
  on public.progresso for delete
  to authenticated
  using ((select auth.uid()) = user_id);
