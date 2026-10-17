import type { Topico, Trilha } from "@/lib/types";
import linux from "./trilhas/linux";
import redes from "./trilhas/redes";
import windowsServer from "./trilhas/windows-server";
import cloud from "./trilhas/cloud";
import devops from "./trilhas/devops";

/** Para adicionar uma trilha: crie o arquivo em ./trilhas e inclua aqui. */
export const trilhas: Trilha[] = [linux, redes, windowsServer, cloud, devops];

export function getTrilha(slug: string): Trilha | undefined {
  return trilhas.find((t) => t.slug === slug);
}

export type TopicoComTrilha = Topico & { trilha: Pick<Trilha, "slug" | "titulo"> };

export function todosTopicos(): TopicoComTrilha[] {
  return trilhas.flatMap((t) =>
    t.topicos.map((topico) => ({ ...topico, trilha: { slug: t.slug, titulo: t.titulo } })),
  );
}
