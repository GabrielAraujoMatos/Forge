import "server-only";
import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";

export type Sessao = { supabase: SupabaseClient; usuario: User };

/**
 * Cliente do Supabase em nome do usuário da requisição (token em
 * "Authorization: Bearer"). Tudo passa pelo RLS e pelas funções do banco que
 * aplicam os limites do plano, então o servidor não precisa da chave secreta.
 * Retorna null sem token válido e undefined se o Supabase não estiver configurado.
 */
export async function sessaoDaRequisicao(req: Request): Promise<Sessao | null | undefined> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const chave = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !chave) return undefined;

  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return null;
  const supabase = createClient(url, chave, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data, error } = await supabase.auth.getUser(token);
  return error ? null : { supabase, usuario: data.user };
}

/** Respostas de erro da API: { erro: código, mensagem } — o painel mostra a mensagem. */
export function erro(status: number, codigo: string, mensagem: string) {
  return Response.json({ erro: codigo, mensagem }, { status });
}

export function erroDeSessao(sessao: null | undefined) {
  return sessao === undefined
    ? erro(503, "indisponivel", "Este recurso não está configurado neste servidor.")
    : erro(401, "login", "Entre na sua conta para usar este recurso.");
}

/** Mensagens das exceções levantadas pelas funções do banco (a mensagem é o código). */
const LIMITES: Record<string, [number, string]> = {
  login: [401, "Entre na sua conta para usar este recurso."],
  limite_dia: [429, "Você chegou ao limite de perguntas de hoje. Volte amanhã."],
  limite_chats: [402, "Você usou todos os chats do mês no plano grátis."],
  limite_conversa: [429, "Esta conversa chegou ao limite de perguntas. Comece uma nova."],
  limite_questionarios: [402, "Você usou todos os questionários do mês no plano grátis."],
  conversa: [404, "Conversa não encontrada."],
  limite_roteiros: [402, "Você chegou ao limite de roteiros salvos do seu plano. Apague um para criar outro."],
  limite_conteudos_ia: [402, "Você usou as gerações com IA do mês no plano grátis."],
  somente_pro: [402, "O editor com IA é do plano Pro."],
};

export function erroDoBanco(e: { message: string }) {
  const conhecido = LIMITES[e.message];
  if (conhecido) return erro(conhecido[0], e.message, conhecido[1]);
  console.error("[forge] erro no banco", e);
  return erro(500, "interno", "Algo deu errado. Tente de novo.");
}

/**
 * Sem ANTHROPIC_API_KEY, o desenvolvimento local usa respostas simuladas para
 * testar a interface e os limites; em produção o recurso fica indisponível.
 */
export const modoDemonstracao = () => !process.env.ANTHROPIC_API_KEY && process.env.NODE_ENV === "development";
export const iaDisponivel = () => Boolean(process.env.ANTHROPIC_API_KEY) || modoDemonstracao();
