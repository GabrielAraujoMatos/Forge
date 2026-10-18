import type { Roteiro } from "@/lib/roteiros";
import { editarRoteiro } from "@/lib/servidor/roteiros";
import {
  erro,
  erroDeSessao,
  erroDoBanco,
  iaDisponivel,
  modoDemonstracao,
  sessaoDaRequisicao,
} from "@/lib/servidor/supabase-usuario";

/** Editor com IA (Pro): aplica um pedido em linguagem natural ao roteiro { id, instrucao }. */
export async function POST(req: Request) {
  const sessao = await sessaoDaRequisicao(req);
  if (!sessao) return erroDeSessao(sessao);
  if (!iaDisponivel()) return erro(503, "indisponivel", "O editor com IA não está configurado neste servidor.");

  const corpo = (await req.json().catch(() => null)) as { id?: string; instrucao?: string } | null;
  const instrucao = corpo?.instrucao?.trim() ?? "";
  if (!corpo?.id || instrucao.length < 3) return erro(400, "invalido", "Escreva o que quer mudar no roteiro.");
  if (instrucao.length > 1000) return erro(400, "longo", "O pedido passa de 1000 caracteres.");

  const { data: roteiro } = await sessao.supabase
    .from("roteiros")
    .select("id, titulo, etapas")
    .eq("id", corpo.id)
    .maybeSingle<Pick<Roteiro, "id" | "titulo" | "etapas">>();
  if (!roteiro) return erro(404, "roteiro", "Roteiro não encontrado.");

  const reserva = await sessao.supabase.rpc("ia_reservar_edicao");
  if (reserva.error) return erroDoBanco(reserva.error);

  let novo;
  try {
    // A demonstração só inverte a ordem dos tópicos de cada etapa, para mostrar a mudança.
    novo = modoDemonstracao()
      ? { titulo: roteiro.titulo, etapas: roteiro.etapas.map((e) => ({ ...e, topicos: [...e.topicos].reverse() })) }
      : await editarRoteiro(roteiro.titulo, roteiro.etapas, instrucao);
  } catch (e) {
    console.error("[roteiros] erro na IA", e);
    return erro(502, "ia", "A IA não conseguiu editar o roteiro agora. Tente de novo em instantes.");
  }
  if (!novo.etapas.length) return erro(502, "ia", "A IA devolveu um roteiro vazio. Tente reformular o pedido.");

  const { data, error } = await sessao.supabase
    .from("roteiros")
    .update({ titulo: novo.titulo, etapas: novo.etapas, atualizado_em: new Date().toISOString() })
    .eq("id", roteiro.id)
    .select("id, titulo, objetivo, etapas, gerado_por_ia, atualizado_em")
    .single();
  if (error) return erroDoBanco(error);
  return Response.json(data);
}
