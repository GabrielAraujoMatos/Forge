import type { Status, Topico } from "./types";

/** Chave única de um tópico no progresso salvo. */
export function chaveTopico(trilha: string, topico: string) {
  return `${trilha}/${topico}`;
}

export function statusTopico(
  trilha: string,
  topico: Pick<Topico, "id" | "requisitos">,
  concluidos: ReadonlySet<string>,
): Status {
  if (concluidos.has(chaveTopico(trilha, topico.id))) return "forjado";
  const pronto = topico.requisitos.every((r) => concluidos.has(chaveTopico(trilha, r)));
  return pronto ? "aquecendo" : "frio";
}

export function progressoTrilha(
  trilha: string,
  topicos: Pick<Topico, "id">[],
  concluidos: ReadonlySet<string>,
) {
  const feitos = topicos.filter((t) => concluidos.has(chaveTopico(trilha, t.id))).length;
  return {
    feitos,
    total: topicos.length,
    pct: topicos.length ? Math.round((feitos / topicos.length) * 100) : 0,
  };
}

/** Remove acentos e caixa para comparar textos na busca. */
export function normalizar(texto: string) {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}
