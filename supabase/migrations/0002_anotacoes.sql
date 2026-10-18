-- Anotações dos usuários: um texto livre por tópico.
-- Rode no Supabase em: SQL Editor → New query → cole e execute.

create table if not exists public.anotacoes (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  trilha text not null,
  topico text not null,
  texto text not null check (char_length(texto) between 1 and 10000),
  atualizado_em timestamptz not null default now(),
  primary key (user_id, trilha, topico)
);

alter table public.anotacoes enable row level security;

-- Cada usuário só enxerga e altera as próprias anotações.
create policy "anotacoes: ler as próprias"
  on public.anotacoes for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "anotacoes: inserir as próprias"
  on public.anotacoes for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "anotacoes: atualizar as próprias"
  on public.anotacoes for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "anotacoes: apagar as próprias"
  on public.anotacoes for delete
  to authenticated
  using ((select auth.uid()) = user_id);
