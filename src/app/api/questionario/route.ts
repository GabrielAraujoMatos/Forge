import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import { getTrilha } from "@/content";
import { NIVEIS, type Topico, type Trilha } from "@/lib/types";
import {
  erro,
  erroDeSessao,
  erroDoBanco,
  iaDisponivel,
  modoDemonstracao,
  sessaoDaRequisicao,
} from "@/lib/servidor/supabase-usuario";
import { MODELO } from "@/lib/servidor/tutor";

const QUANTIDADE = 5;

const Questionario = z.object({
  perguntas: z.array(
    z.object({
      enunciado: z.string(),
      alternativas: z.array(z.string()).describe("Exatamente 4 alternativas"),
      correta: z.number().int().describe("Índice (0 a 3) da alternativa correta"),
      explicacao: z.string().describe("Por que a correta está certa, em 1 a 3 frases"),
    }),
  ),
});

type Pergunta = z.infer<typeof Questionario>["perguntas"][number];

/** Gera um questionário de múltipla escolha sobre o tópico ({ trilha, topico }). */
export async function POST(req: Request) {
  const sessao = await sessaoDaRequisicao(req);
  if (!sessao) return erroDeSessao(sessao);
  if (!iaDisponivel()) return erro(503, "indisponivel", "Os questionários não estão configurados neste servidor.");

  const corpo = (await req.json().catch(() => null)) as { trilha?: string; topico?: string } | null;
  const trilha = corpo?.trilha ? getTrilha(corpo.trilha) : undefined;
  const topico = trilha?.topicos.find((t) => t.id === corpo?.topico);
  if (!trilha || !topico) return erro(400, "invalido", "Tópico inválido.");

  const reserva = await sessao.supabase.rpc("questionario_reservar");
  if (reserva.error) return erroDoBanco(reserva.error);

  try {
    const perguntas = modoDemonstracao() ? questionarioDemonstracao(topico) : await gerar(trilha, topico);
    // Descarta perguntas malformadas em vez de mostrar algo quebrado.
    const validas = perguntas.filter(
      (p) => p.alternativas.length === 4 && p.correta >= 0 && p.correta < 4 && p.enunciado.trim(),
    );
    if (!validas.length) return erro(502, "ia", "Não foi possível montar o questionário. Tente de novo.");
    return Response.json({ perguntas: validas.slice(0, QUANTIDADE), demonstracao: modoDemonstracao() });
  } catch (e) {
    console.error("[questionario] erro na IA", e);
    return erro(502, "ia", "A IA não respondeu agora. Tente de novo em instantes.");
  }
}

async function gerar(trilha: Trilha, topico: Topico) {
  const resposta = await new Anthropic().beta.messages.parse({
    model: MODELO,
    max_tokens: 16000,
    output_config: { effort: "low", format: betaZodOutputFormat(Questionario) },
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system:
      "Você cria questionários de múltipla escolha, em português do Brasil, para quem estuda Infraestrutura de TI. " +
      "Misture conceito e prática (comandos, cenários de troubleshooting, configurações). Cada pergunta tem exatamente " +
      "4 alternativas plausíveis e só uma correta; varie a posição da correta. Nada de pegadinhas de redação.",
    messages: [
      {
        role: "user",
        content: [
          `Crie ${QUANTIDADE} perguntas sobre o tópico "${topico.titulo}" da trilha ${trilha.titulo}`,
          `(nível ${NIVEIS.find((n) => n.id === topico.nivel)?.nome}).`,
          `Resumo: ${topico.resumo}`,
          `Conteúdo que o aluno estudou:\n${topico.estudar.map((e) => `- ${e}`).join("\n")}`,
        ].join("\n"),
      },
    ],
  });
  if (resposta.stop_reason === "refusal" || !resposta.parsed_output) throw new Error(`sem questionário: ${resposta.stop_reason}`);
  return resposta.parsed_output.perguntas;
}

/** Perguntas montadas do próprio conteúdo do tópico, para o modo demonstração. */
function questionarioDemonstracao(topico: Topico): Pergunta[] {
  const itens = topico.estudar;
  return itens.slice(0, QUANTIDADE).map((item, i) => {
    const correta = i % 4;
    const outras = ["Configurar a impressora padrão", "Desfragmentar o disco semanalmente", "Trocar o papel de parede", "Limpar o cache do navegador"];
    const alternativas = outras.slice(0, 3);
    alternativas.splice(correta, 0, item);
    return {
      enunciado: `(Demonstração) Qual destes itens faz parte do estudo de "${topico.titulo}"?`,
      alternativas,
      correta,
      explicacao: `"${item}" está na lista do que estudar neste tópico. Com a chave da IA, as perguntas serão de verdade.`,
    };
  });
}
