import type { Metadata } from "next";
import { todosTopicos, trilhas } from "@/content";
import { BuscaView } from "@/components/busca-view";

export const metadata: Metadata = { title: "Busca" };

export default function PaginaBusca() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10">
      <h1 className="mb-6 font-display text-5xl font-extrabold uppercase tracking-tight">Busca</h1>
      <BuscaView topicos={todosTopicos()} trilhas={trilhas.map(({ slug, titulo }) => ({ slug, titulo }))} />
    </main>
  );
}
