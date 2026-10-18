-- Tutor de IA e planos. Só o servidor (chave secreta, que ignora o RLS) grava
-- nestas tabelas; assim ninguém zera o próprio uso nem se dá o plano pago.
-- Rode no Supabase em: SQL Editor → New query → cole e execute.

-- Plano de cada usuário. Sem linha = plano grátis. Quem grava é o servidor
-- (no futuro, o webhook do pagamento).
create table if not exists public.assinaturas (
  user_id uuid primary key references auth.users (id) on delete cascade,
  plano text not null default 'gratis' check (plano in ('gratis', 'pro')),
  atualizado_em timestamptz not null default now()
);

-- Contadores de uso. periodo é "AAAA-MM" (mensal) ou "AAAA-MM-DD" (diário).
create table if not exists public.uso (
  user_id uuid not null references auth.users (id) on delete cascade,
  recurso text not null,
  periodo text not null,
  quantidade integer not null default 0,
  primary key (user_id, recurso, periodo)
);

create table if not exists public.tutor_conversas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  trilha text not null,
  topico text not null,
  titulo text not null,
  -- [{ "papel": "usuario" | "tutor", "texto": "..." }]
  mensagens jsonb not null default '[]',
  criada_em timestamptz not null default now(),
  atualizada_em timestamptz not null default now()
);

create index if not exists tutor_conversas_usuario_topico
  on public.tutor_conversas (user_id, trilha, topico, atualizada_em desc);

alter table public.assinaturas enable row level security;
alter table public.uso enable row level security;
alter table public.tutor_conversas enable row level security;

-- Leitura do próprio plano e uso. As conversas são lidas pela API do app, que
-- aplica o limite de histórico do plano, então não há política para elas.
create policy "assinaturas: ler a própria" on public.assinaturas for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "uso: ler o próprio" on public.uso for select to authenticated
  using ((select auth.uid()) = user_id);

-- Soma ao contador e devolve o novo valor, sem corrida entre duas requisições.
create or replace function public.incrementar_uso(p_user uuid, p_recurso text, p_periodo text)
returns integer
language sql
security invoker
set search_path = ''
as $$
  insert into public.uso (user_id, recurso, periodo, quantidade)
  values (p_user, p_recurso, p_periodo, 1)
  on conflict (user_id, recurso, periodo)
  do update set quantidade = public.uso.quantidade + 1
  returning quantidade;
$$;

revoke execute on function public.incrementar_uso(uuid, text, text) from public, anon, authenticated;
grant execute on function public.incrementar_uso(uuid, text, text) to service_role;
