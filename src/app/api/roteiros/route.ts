import { LIMITE_OBJETIVO } from "@/lib/roteiros";
import { gerarRoteiro, roteiroDemonstracao } from "@/lib/servidor/roteiros";
import {
  erro,
  erroDeSessao,
  erroDoBanco,
  iaDisponivel,
  modoDemonstracao,
  sessaoDaRequisicao,
} from "@/lib/servidor/supabase-usuario";

type Corpo = { objetivo?: string; horasPorSemana?: number; nivel?: string };

/** Gera um roteiro com IA a partir do objetivo e salva na conta. Devolve { id }. */
export async function POST(req: Request) {
  const sessao = await sessaoDaRequisicao(req);
  if (!sessao) return erroDeSessao(sessao);
  if (!iaDisponivel()) return erro(503, "indisponivel", "A geração com IA não está configurada neste servidor.");

  const corpo = (await req.json().catch(() => null)) as Corpo | null;
  const objetivo = corpo?.objetivo?.trim() ?? "";
  if (objetivo.length < 10) return erro(400, "invalido", "Descreva o seu objetivo com um pouco mais de detalhe.");
  if (objetivo.length > LIMITE_OBJETIVO) return erro(400, "longo", `O objetivo passa de ${LIMITE_OBJETIVO} caracteres.`);

  const reserva = await sessao.supabase.rpc("ia_reservar_conteudo", { p_novo_roteiro: true });
  if (reserva.error) return erroDoBanco(reserva.error);

  const detalhes = [
    corpo?.nivel ? `Nível atual do aluno: ${corpo.nivel}.` : "",
    corpo?.horasPorSemana ? `Tempo disponível: cerca de ${corpo.horasPorSemana} horas por semana.` : "",
  ]
    .filter(Boolean)
    .join("\n");

  let roteiro;
  try {
    roteiro = modoDemonstracao() ? roteiroDemonstracao(objetivo) : await gerarRoteiro(objetivo, detalhes);
  } catch (e) {
    console.error("[roteiros] erro na IA", e);
    return erro(502, "ia", "A IA não conseguiu montar o roteiro agora. Tente de novo em instantes.");
  }
  if (!roteiro.etapas.length) return erro(502, "ia", "A IA não encontrou tópicos para esse objetivo. Tente descrevê-lo de outro jeito.");

  const criado = await sessao.supabase.rpc("roteiro_criar", {
    p_titulo: roteiro.titulo,
    p_objetivo: objetivo,
    p_etapas: roteiro.etapas,
    p_ia: true,
  });
  if (criado.error) return erroDoBanco(criado.error);
  return Response.json({ id: criado.data });
}
