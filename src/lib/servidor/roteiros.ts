import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import { trilhas } from "@/content";
import { certificacoes } from "@/content/certificacoes";
import { limparEtapas, type Etapa } from "@/lib/roteiros";
import { NIVEIS } from "@/lib/types";
import { MODELO } from "./tutor";

const Saida = z.object({
  titulo: z.string().describe("Nome curto do roteiro, até 60 caracteres"),
  etapas: z.array(
    z.object({
      titulo: z.string(),
      descricao: z.string().describe("O que a etapa entrega, em 1 ou 2 frases"),
      topicos: z.array(z.string()).describe('Chaves exatas do catálogo, no formato "trilha/topico"'),
    }),
  ),
});

const nomeNivel = Object.fromEntries(NIVEIS.map((n) => [n.id, n.nome]));

// Catálogo fixo (mesmo texto em todas as chamadas) para aproveitar o cache de prompt.
const CATALOGO = [
  "Catálogo de tópicos do Forge (chave · título · nível · pré-requisitos):",
  ...trilhas.flatMap((t) => [
    `\n## Trilha ${t.titulo}`,
    ...t.topicos.map(
      (x) => `${t.slug}/${x.id} · ${x.titulo} · ${nomeNivel[x.nivel]}${x.requisitos.length ? ` · requer ${x.requisitos.join(", ")}` : ""}`,
    ),
  ]),
  "\n## Certificações e seus tópicos",
  ...certificacoes.map((c) => `${c.nome}: ${c.topicos.join(", ")}`),
].join("\n");

const INSTRUCOES = `Você monta roteiros de estudo personalizados de Infraestrutura de TI, em português do Brasil, usando SOMENTE tópicos do catálogo abaixo (pelas chaves exatas).

Regras:
- Organize em 3 a 8 etapas, da base para o avançado, respeitando os pré-requisitos (um tópico vem depois dos que ele requer).
- Inclua só o que serve ao objetivo do aluno; um roteiro focado é melhor que um roteiro com tudo.
- Pode misturar trilhas. Se o objetivo citar uma certificação, cubra os tópicos dela.
- Cada tópico aparece no máximo uma vez.
- Se o aluno informar tempo disponível, dimensione o roteiro para caber nele.

${CATALOGO}`;

async function chamar(pedido: string) {
  const resposta = await new Anthropic().beta.messages.parse({
    model: MODELO,
    max_tokens: 16000,
    output_config: { effort: "low", format: betaZodOutputFormat(Saida) },
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    cache_control: { type: "ephemeral" },
    system: INSTRUCOES,
    messages: [{ role: "user", content: pedido }],
  });
  if (resposta.stop_reason === "refusal" || !resposta.parsed_output) throw new Error(`sem roteiro: ${resposta.stop_reason}`);
  return { titulo: resposta.parsed_output.titulo.slice(0, 120), etapas: limparEtapas(resposta.parsed_output.etapas) };
}

export function gerarRoteiro(objetivo: string, detalhes: string) {
  return chamar(`Objetivo do aluno: ${objetivo}\n${detalhes}`);
}

export function editarRoteiro(titulo: string, etapas: Etapa[], instrucao: string) {
  const atual = etapas.map((e) => ({ titulo: e.titulo, descricao: e.descricao, topicos: e.topicos }));
  return chamar(
    `Roteiro atual "${titulo}":\n${JSON.stringify(atual, null, 1)}\n\n` +
      `Ajuste o roteiro conforme o pedido do aluno e devolva o roteiro completo atualizado.\nPedido: ${instrucao}`,
  );
}

const PALAVRAS: Record<string, string[]> = {
  linux: ["linux", "rhcsa", "lpic", "servidor", "shell", "bash"],
  redes: ["rede", "redes", "ccna", "network", "cisco", "firewall"],
  "windows-server": ["windows", "active directory", "ad ", "az-802", "microsoft"],
  cloud: ["cloud", "nuvem", "aws", "azure", "az-104", "az-900", "gcp"],
  devops: ["devops", "kubernetes", "docker", "sre", "ci/cd", "terraform", "pipeline", "cka"],
};

/** Roteiro montado por palavras-chave, para o modo demonstração. */
export function roteiroDemonstracao(objetivo: string) {
  const texto = ` ${objetivo.toLowerCase()} `;
  const escolhidas = trilhas.filter((t) => PALAVRAS[t.slug]?.some((p) => texto.includes(p)));
  const usadas = escolhidas.length ? escolhidas : trilhas.slice(0, 2);
  const etapas = NIVEIS.map((n) => ({
    titulo: `${n.nome}: ${usadas.map((t) => t.titulo).join(" + ")}`,
    descricao: "Etapa de demonstração montada sem IA, a partir das palavras do seu objetivo.",
    topicos: usadas.flatMap((t) => t.topicos.filter((x) => x.nivel === n.id).slice(0, 3).map((x) => `${t.slug}/${x.id}`)),
  }));
  return { titulo: `Roteiro (demo): ${objetivo.slice(0, 40)}`, etapas: limparEtapas(etapas) };
}
