-- Roteiros personalizados: sequências de tópicos das trilhas montadas para um
-- objetivo, com ou sem IA. Rode no Supabase em: SQL Editor → New query.

alter table public.planos_limites
  add column if not exists roteiros_max integer not null default 3,
  add column if not exists conteudos_ia_por_mes integer,
  add column if not exists editor_ia boolean not null default false;

update public.planos_limites set roteiros_max = 3, conteudos_ia_por_mes = 2, editor_ia = false where plano = 'gratis';
update public.planos_limites set roteiros_max = 100, conteudos_ia_por_mes = null, editor_ia = true where plano = 'pro';

create table if not exists public.roteiros (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  titulo text not null check (char_length(titulo) between 1 and 120),
  objetivo text not null default '' check (char_length(objetivo) <= 1000),
  -- [{ "id", "titulo", "descricao", "topicos": ["trilha/topico", ...] }]
  etapas jsonb not null default '[]' check (jsonb_typeof(etapas) = 'array'),
  gerado_por_ia boolean not null default false,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);
create index if not exists roteiros_usuario on public.roteiros (user_id, atualizado_em desc);

alter table public.roteiros enable row level security;

-- Ler, editar e apagar direto pelo app; criar só pela função, que aplica o
-- limite de roteiros do plano.
create policy "roteiros: ler os próprios" on public.roteiros for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "roteiros: atualizar os próprios" on public.roteiros for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "roteiros: apagar os próprios" on public.roteiros for delete to authenticated
  using ((select auth.uid()) = user_id);

-- Cria um roteiro se o plano permitir. Erros: login, limite_roteiros.
create or replace function public.roteiro_criar(p_titulo text, p_objetivo text, p_etapas jsonb, p_ia boolean)
returns uuid
language plpgsql security definer set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_id uuid;
begin
  if v_user is null then raise exception 'login'; end if;
  if (select count(*) from public.roteiros where user_id = v_user)
     >= (privado.limites_do_usuario(v_user)).roteiros_max then
    raise exception 'limite_roteiros';
  end if;
  insert into public.roteiros (user_id, titulo, objetivo, etapas, gerado_por_ia)
  values (v_user, left(p_titulo, 120), left(coalesce(p_objetivo, ''), 1000), p_etapas, p_ia)
  returning id into v_id;
  return v_id;
end;
$$;

-- Reserva uma geração com IA (roteiro, curso ou guia). Para um roteiro novo,
-- confere antes se ainda cabe mais um, para não gastar a cota à toa.
-- Erros: login, limite_roteiros, limite_conteudos_ia.
create or replace function public.ia_reservar_conteudo(p_novo_roteiro boolean)
returns integer
language plpgsql security definer set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_limites public.planos_limites;
  v_total integer;
begin
  if v_user is null then raise exception 'login'; end if;
  v_limites := privado.limites_do_usuario(v_user);
  if p_novo_roteiro and (select count(*) from public.roteiros where user_id = v_user) >= v_limites.roteiros_max then
    raise exception 'limite_roteiros';
  end if;
  v_total := privado.somar_uso(v_user, 'conteudos_ia', to_char(now() at time zone 'utc', 'YYYY-MM'));
  if v_limites.conteudos_ia_por_mes is not null and v_total > v_limites.conteudos_ia_por_mes then
    raise exception 'limite_conteudos_ia';
  end if;
  return v_total;
end;
$$;

-- O editor com IA é do plano Pro; conta no teto diário de perguntas (uso justo).
-- Erros: login, somente_pro, limite_dia.
create or replace function public.ia_reservar_edicao()
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_limites public.planos_limites;
begin
  if v_user is null then raise exception 'login'; end if;
  v_limites := privado.limites_do_usuario(v_user);
  if not v_limites.editor_ia then raise exception 'somente_pro'; end if;
  if privado.somar_uso(v_user, 'perguntas', to_char(now() at time zone 'utc', 'YYYY-MM-DD')) > v_limites.perguntas_por_dia then
    raise exception 'limite_dia';
  end if;
end;
$$;

revoke execute on function public.roteiro_criar(text, text, jsonb, boolean), public.ia_reservar_conteudo(boolean),
  public.ia_reservar_edicao() from public, anon;
grant execute on function public.roteiro_criar(text, text, jsonb, boolean), public.ia_reservar_conteudo(boolean),
  public.ia_reservar_edicao() to authenticated;
