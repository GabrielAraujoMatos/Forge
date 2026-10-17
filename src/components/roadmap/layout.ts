import dagre from "@dagrejs/dagre";
import type { Topico } from "@/lib/types";

export const LARGURA_NO = 232;
export const ALTURA_NO = 68;

/** Calcula a posição de cada tópico em um grafo de cima para baixo. */
export function calcularLayout(topicos: Topico[]) {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: "TB", nodesep: 36, ranksep: 64, marginx: 20, marginy: 20 });
  g.setDefaultEdgeLabel(() => ({}));

  for (const t of topicos) g.setNode(t.id, { width: LARGURA_NO, height: ALTURA_NO });
  for (const t of topicos) for (const r of t.requisitos) g.setEdge(r, t.id);

  dagre.layout(g);

  const posicoes = new Map<string, { x: number; y: number }>();
  for (const t of topicos) {
    const { x, y } = g.node(t.id);
    posicoes.set(t.id, { x: x - LARGURA_NO / 2, y: y - ALTURA_NO / 2 });
  }
  return posicoes;
}
