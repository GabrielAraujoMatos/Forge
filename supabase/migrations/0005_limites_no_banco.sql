-- Limites dos planos aplicados no banco, por funções que rodam com o login do
-- próprio usuário. Assim o servidor não precisa da chave secreta do Supabase,
-- e ninguém burla os limites: as tabelas de uso continuam sem permissão de escrita.
-- Rode no Supabase em: SQL Editor → New query → cole e execute.

-- Limites de cada plano (null = ilimitado). É a fonte de verdade: o servidor
-- e a interface leem daqui.
create table if not exists public.planos_limites (
  plano text primary key check (plano in ('gratis', 'pro')),
  chats_por_mes integer,
  perguntas_por_chat integer not null,
  perguntas_por_dia integer not null,
  historico_por_topico integer,
  questionarios_por_mes integer
);

insert into public.planos_limites values
  ('gratis', 20, 15, 60, 3, 2),
  ('pro', null, 100, 400, null, null)
on conflict (plano) do nothing;

alter table public.planos_limites enable row level security;
create policy "planos_limites: leitura pública" on public.planos_limites for select to anon, authenticated
  using (true);

-- Resultados dos questionários (o aluno grava os próprios).
create table if not exists public.questionario_resultados (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  trilha text not null,
  topico text not null,
  acertos integer not null check (acertos >= 0),
  total integer not null check (total > 0 and acertos <= total),
  feito_em timestamptz not null default now()
);
create index if not exists questionario_resultados_usuario
  on public.questionario_resultados (user_id, trilha, topico);
alter table public.questionario_resultados enable row level security;
create policy "questionario_resultados: ler os próprios" on public.questionario_resultados for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "questionario_resultados: inserir os próprios" on public.questionario_resultados for insert to authenticated
  with check ((select auth.uid()) = user_id);

-- A versão anterior dependia da chave secreta.
drop function if exists public.incrementar_uso(uuid, text, text);

-- Funções internas (não expostas na API).
create schema if not exists privado;
revoke all on schema privado from public, anon, authenticated;

create or replace function privado.limites_do_usuario(p_user uuid)
returns public.planos_limites
language sql stable security definer set search_path = ''
as $$
  select l.* from public.planos_limites l
  where l.plano = coalesce((select a.plano from public.assinaturas a where a.user_id = p_user), 'gratis');
$$;

create or replace function privado.somar_uso(p_user uuid, p_recurso text, p_periodo text)
returns integer
language sql security definer set search_path = ''
as $$
  insert into public.uso (user_id, recurso, periodo, quantidade) values (p_user, p_recurso, p_periodo, 1)
  on conflict (user_id, recurso, periodo) do update set quantidade = public.uso.quantidade + 1
  returning quantidade;
$$;

-- Reserva uma pergunta ao tutor: aplica os limites e, sem p_conversa, cria a
-- conversa. Devolve o id da conversa. Erros: login, limite_dia, limite_chats,
-- conversa, limite_conversa (a mensagem da exceção é o código).
create or replace function public.tutor_reservar(p_conversa uuid, p_trilha text, p_topico text, p_titulo text)
returns uuid
language plpgsql security definer set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_limites public.planos_limites;
  v_mensagens jsonb;
  v_id uuid;
  v_hoje text := to_char(now() at time zone 'utc', 'YYYY-MM-DD');
  v_mes text := to_char(now() at time zone 'utc', 'YYYY-MM');
begin
  if v_user is null then raise exception 'login'; end if;
  v_limites := privado.limites_do_usuario(v_user);

  -- Se passar do limite, a exceção desfaz a soma.
  if privado.somar_uso(v_user, 'perguntas', v_hoje) > v_limites.perguntas_por_dia then
    raise exception 'limite_dia';
  end if;

  if p_conversa is null then
    if v_limites.chats_por_mes is not null
       and coalesce((select quantidade from public.uso
                     where user_id = v_user and recurso = 'chats' and periodo = v_mes), 0) >= v_limites.chats_por_mes then
      raise exception 'limite_chats';
    end if;
    perform privado.somar_uso(v_user, 'chats', v_mes);
    insert into public.tutor_conversas (user_id, trilha, topico, titulo)
    values (v_user, p_trilha, p_topico, left(p_titulo, 80))
    returning id into v_id;
    return v_id;
  end if;

  select mensagens into v_mensagens from public.tutor_conversas where id = p_conversa and user_id = v_user;
  if not found then raise exception 'conversa'; end if;
  if (select count(*) from jsonb_array_elements(v_mensagens) m where m->>'papel' = 'usuario')
     >= v_limites.perguntas_por_chat then
    raise exception 'limite_conversa';
  end if;
  return p_conversa;
end;
$$;

-- Guarda a pergunta e a resposta no fim da conversa.
create or replace function public.tutor_registrar(p_conversa uuid, p_pergunta text, p_resposta text)
returns void
language sql security definer set search_path = ''
as $$
  update public.tutor_conversas
  set mensagens = mensagens || jsonb_build_array(
        jsonb_build_object('papel', 'usuario', 'texto', p_pergunta),
        jsonb_build_object('papel', 'tutor', 'texto', p_resposta)),
      atualizada_em = now()
  where id = p_conversa and user_id = auth.uid();
$$;

-- Conversas do tópico, até o limite de histórico do plano.
create or replace function public.tutor_listar(p_trilha text, p_topico text)
returns table (id uuid, titulo text, atualizada_em timestamptz)
language sql stable security definer set search_path = ''
as $$
  select c.id, c.titulo, c.atualizada_em from public.tutor_conversas c
  where c.user_id = auth.uid() and c.trilha = p_trilha and c.topico = p_topico
  order by c.atualizada_em desc
  limit (select historico_por_topico from privado.limites_do_usuario(auth.uid()));
$$;

create or replace function public.tutor_abrir(p_conversa uuid)
returns table (id uuid, titulo text, mensagens jsonb)
language sql stable security definer set search_path = ''
as $$
  select c.id, c.titulo, c.mensagens from public.tutor_conversas c
  where c.id = p_conversa and c.user_id = auth.uid();
$$;

create or replace function public.tutor_apagar(p_conversa uuid)
returns void
language sql security definer set search_path = ''
as $$
  delete from public.tutor_conversas where id = p_conversa and user_id = auth.uid();
$$;

-- Reserva um questionário do mês. Erros: login, limite_questionarios.
create or replace function public.questionario_reservar()
returns integer
language plpgsql security definer set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_limite integer;
  v_total integer;
begin
  if v_user is null then raise exception 'login'; end if;
  v_limite := (privado.limites_do_usuario(v_user)).questionarios_por_mes;
  v_total := privado.somar_uso(v_user, 'questionarios', to_char(now() at time zone 'utc', 'YYYY-MM'));
  if v_limite is not null and v_total > v_limite then raise exception 'limite_questionarios'; end if;
  return v_total;
end;
$$;

revoke execute on function public.tutor_reservar(uuid, text, text, text), public.tutor_registrar(uuid, text, text),
  public.tutor_listar(text, text), public.tutor_abrir(uuid), public.tutor_apagar(uuid), public.questionario_reservar()
  from public, anon;
grant execute on function public.tutor_reservar(uuid, text, text, text), public.tutor_registrar(uuid, text, text),
  public.tutor_listar(text, text), public.tutor_abrir(uuid), public.tutor_apagar(uuid), public.questionario_reservar()
  to authenticated;
