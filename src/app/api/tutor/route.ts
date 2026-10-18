import Anthropic from "@anthropic-ai/sdk";
import { getTrilha } from "@/content";
import {
  erro,
  erroDeSessao,
  erroDoBanco,
  iaDisponivel,
  modoDemonstracao,
  sessaoDaRequisicao,
} from "@/lib/servidor/supabase-usuario";
import {
  LIMITE_PERGUNTA,
  MODELO,
  montarSistema,
  paraMensagensApi,
  respostaDemonstracao,
  type MensagemTutor,
} from "@/lib/servidor/tutor";

type Corpo = { conversaId?: string | null; trilha: string; topico: string; pergunta: string; incluirNotas?: boolean };

/**
 * Envia uma pergunta ao tutor e devolve a resposta aos poucos, em linhas JSON:
 * { t: "inicio", conversaId } · { t: "texto", v } · { t: "fim" } · { t: "erro", mensagem }.
 * Listar, abrir e apagar conversas o painel faz direto pelas funções do banco.
 */
export async function POST(req: Request) {
  const sessao = await sessaoDaRequisicao(req);
  if (!sessao) return erroDeSessao(sessao);
  if (!iaDisponivel()) return erro(503, "indisponivel", "O tutor não está configurado neste servidor.");
  const { supabase, usuario } = sessao;

  const corpo = (await req.json().catch(() => null)) as Corpo | null;
  const pergunta = corpo?.pergunta?.trim() ?? "";
  const trilha = corpo ? getTrilha(corpo.trilha) : undefined;
  const topico = trilha?.topicos.find((t) => t.id === corpo?.topico);
  if (!trilha || !topico || !pergunta) return erro(400, "invalido", "Pergunta ou tópico inválido.");
  if (pergunta.length > LIMITE_PERGUNTA)
    return erro(400, "longa", `A pergunta passa de ${LIMITE_PERGUNTA} caracteres. Divida em partes menores.`);

  // O banco aplica os limites do plano e cria a conversa, se for nova.
  const reserva = await supabase.rpc("tutor_reservar", {
    p_conversa: corpo?.conversaId ?? null,
    p_trilha: trilha.slug,
    p_topico: topico.id,
    p_titulo: pergunta,
  });
  if (reserva.error) return erroDoBanco(reserva.error);
  const conversaId = reserva.data as string;

  const [aberta, system] = await Promise.all([
    supabase.rpc("tutor_abrir", { p_conversa: conversaId }).single<{ mensagens: MensagemTutor[] }>(),
    montarSistema(supabase, usuario.id, trilha, topico, Boolean(corpo?.incluirNotas)),
  ]);
  const mensagens = [...(aberta.data?.mensagens ?? []), { papel: "usuario" as const, texto: pergunta }];

  const codificador = new TextEncoder();
  const corpoResposta = new ReadableStream<Uint8Array>({
    async start(controller) {
      const enviar = (evento: object) => {
        // Se o aluno fechou o painel, o stream já foi encerrado: só ignora.
        if (!req.signal.aborted) controller.enqueue(codificador.encode(JSON.stringify(evento) + "\n"));
      };
      enviar({ t: "inicio", conversaId });

      let resposta = "";
      try {
        if (modoDemonstracao()) {
          for await (const pedaco of respostaDemonstracao(topico.titulo, pergunta)) {
            resposta += pedaco;
            enviar({ t: "texto", v: pedaco });
          }
        } else {
          const stream = new Anthropic().beta.messages.stream(
            {
              model: MODELO,
              max_tokens: 8000,
              output_config: { effort: "low" },
              // Se um classificador de segurança recusar, a API tenta outro modelo.
              betas: ["server-side-fallback-2026-07-01"],
              fallbacks: "default",
              cache_control: { type: "ephemeral" },
              system,
              messages: paraMensagensApi(mensagens),
            },
            { signal: req.signal },
          );
          for await (const evento of stream) {
            if (evento.type === "content_block_delta" && evento.delta.type === "text_delta") {
              resposta += evento.delta.text;
              enviar({ t: "texto", v: evento.delta.text });
            }
          }
          if ((await stream.finalMessage()).stop_reason === "refusal") {
            const aviso = "Não posso ajudar com esse pedido. Tente reformular a pergunta com foco no tópico.";
            const separador = resposta ? "\n\n" : "";
            resposta += separador + aviso;
            enviar({ t: "texto", v: separador + aviso });
          }
        }

        const salvo = await supabase.rpc("tutor_registrar", {
          p_conversa: conversaId,
          p_pergunta: pergunta,
          p_resposta: resposta,
        });
        if (salvo.error) console.error("[tutor] erro ao salvar", salvo.error);
        enviar({ t: "fim" });
      } catch (e) {
        console.error("[tutor] erro na IA", e);
        enviar({ t: "erro", mensagem: mensagemDeErro(e) });
      } finally {
        if (!req.signal.aborted) controller.close();
      }
    },
  });

  return new Response(corpoResposta, {
    headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store" },
  });
}

function mensagemDeErro(e: unknown) {
  if (e instanceof Anthropic.RateLimitError) return "Muitas pessoas usando o tutor agora. Tente de novo em instantes.";
  if (e instanceof Anthropic.APIConnectionError) return "Não foi possível falar com a IA. Verifique a conexão e tente de novo.";
  if (e instanceof Anthropic.APIError) {
    if (e.type === "overloaded_error") return "A IA está sobrecarregada agora. Tente de novo em instantes.";
    // Chave inválida ou sem crédito são problemas do servidor, não do aluno.
    if (e.status === 401 || e.status === 402 || e.status === 403) return "O tutor está indisponível no momento.";
  }
  return "Algo deu errado ao gerar a resposta. Tente de novo.";
}
