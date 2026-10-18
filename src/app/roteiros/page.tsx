import type { Metadata } from "next";
import { RoteirosView } from "@/components/roteiros/roteiros-view";

export const metadata: Metadata = {
  title: "Roteiros",
  description: "Monte roteiros de estudo personalizados para o seu objetivo, com os tópicos das trilhas do Forge.",
};

export default function PaginaRoteiros() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-20 pt-10">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-brasa">Roteiros personalizados</p>
      <h1 className="mb-4 max-w-2xl font-display text-5xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-6xl">
        Um caminho feito para <span className="texto-brasa">o seu objetivo</span>
      </h1>
      <p className="mb-10 max-w-xl text-cinza">
        Diga aonde quer chegar e a IA monta um roteiro com os tópicos das trilhas, em etapas. Depois é só editar do seu
        jeito e acompanhar o progresso.
      </p>
      <RoteirosView />
    </main>
  );
}
