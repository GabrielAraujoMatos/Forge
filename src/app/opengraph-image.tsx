import { trilhas } from "@/content";
import { imagemOg, TAMANHO_OG } from "@/lib/og";

export const alt = "Forge: trilhas de Infraestrutura de TI do básico ao avançado";
export const size = TAMANHO_OG;
export const contentType = "image/png";

export default function Imagem() {
  const topicos = trilhas.reduce((n, t) => n + t.topicos.length, 0);
  return imagemOg({
    rotulo: "Infraestrutura de TI",
    titulo: "Forje sua carreira em infra",
    descricao: "Roadmaps em forma de mapa, do básico ao avançado. Marque o que já domina e siga o calor.",
    detalhes: [`${trilhas.length} trilhas`, `${topicos} tópicos`, trilhas.map((t) => t.titulo).join(" · ")],
  });
}
