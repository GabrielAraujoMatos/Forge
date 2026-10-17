import { notFound } from "next/navigation";
import { getTrilha, trilhas } from "@/content";
import { imagemOg, TAMANHO_OG } from "@/lib/og";
import { NIVEIS } from "@/lib/types";

export const alt = "Roadmap da trilha no Forge";
export const size = TAMANHO_OG;
export const contentType = "image/png";

export function generateStaticParams() {
  return trilhas.map((t) => ({ slug: t.slug }));
}

export default async function Imagem({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const trilha = getTrilha(slug);
  if (!trilha) notFound();

  return imagemOg({
    rotulo: "Trilha · do básico ao avançado",
    titulo: trilha.titulo,
    descricao: trilha.descricao,
    detalhes: [
      `${trilha.topicos.length} tópicos`,
      ...NIVEIS.map((n) => `${trilha.topicos.filter((t) => t.nivel === n.id).length} ${n.nome.toLowerCase()}`),
    ],
  });
}
