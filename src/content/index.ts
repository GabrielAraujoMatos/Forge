import type { Topico, Trilha } from "@/lib/types";
import linux from "./trilhas/linux";
import redes from "./trilhas/redes";

/** Para adicionar uma trilha: crie o arquivo em ./trilhas e inclua aqui. */
export const trilhas: Trilha[] = [linux, redes];

export function getTrilha(slug: string): Trilha | undefined {
  return trilhas.find((t) => t.slug === slug);
}

export type TopicoComTrilha = Topico & { trilha: Pick<Trilha, "slug" | "titulo"> };

export function todosTopicos(): TopicoComTrilha[] {
  return trilhas.flatMap((t) =>
    t.topicos.map((topico) => ({ ...topico, trilha: { slug: t.slug, titulo: t.titulo } })),
  );
}
