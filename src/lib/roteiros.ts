import { todosTopicos } from "@/content";
import { progressoChaves } from "./status";

export type Etapa = { id: string; titulo: string; descricao: string; topicos: string[] };

export type Roteiro = {
  id: string;
  titulo: string;
  objetivo: string;
  etapas: Etapa[];
  gerado_por_ia: boolean;
  atualizado_em: string;
};

export const LIMITE_OBJETIVO = 1000;

/** Tópicos de todas as trilhas por chave "trilha/topico". */
export const TOPICOS = new Map(todosTopicos().map((t) => [`${t.trilha.slug}/${t.id}`, t]));

export const novoIdEtapa = () => Math.random().toString(36).slice(2, 10);

/**
 * Limpa etapas vindas da IA ou do banco: só chaves que existem e sem tópico
 * repetido no roteiro. Etapas vazias saem, a não ser no editor (manterVazias),
 * onde a pessoa acabou de criar uma etapa para preencher.
 */
export function limparEtapas(
  etapas: { titulo: string; descricao?: string; topicos: string[]; id?: string }[],
  manterVazias = false,
): Etapa[] {
  const vistos = new Set<string>();
  return etapas
    .map((e) => ({
      id: e.id || novoIdEtapa(),
      titulo: e.titulo.trim().slice(0, 120) || "Etapa",
      descricao: (e.descricao ?? "").trim().slice(0, 500),
      topicos: e.topicos.filter((k) => TOPICOS.has(k) && !vistos.has(k) && vistos.add(k)),
    }))
    .filter((e) => manterVazias || e.topicos.length);
}

export function progressoRoteiro(etapas: Etapa[], concluidos: ReadonlySet<string>) {
  return progressoChaves(
    etapas.flatMap((e) => e.topicos),
    concluidos,
  );
}
