import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { trilhas } from "@/content";
import { IconeTrilha } from "@/components/icone-trilha";
import { LegendaStatus } from "@/components/legenda-status";
import { ProgressoTrilha } from "@/components/progresso";
import { NIVEIS } from "@/lib/types";

export default function Home() {
  const totalTopicos = trilhas.reduce((n, t) => n + t.topicos.length, 0);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-20">
      <section className="py-16 sm:py-24">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-brasa">
          Infraestrutura de TI · do básico ao avançado
        </p>
        <h1 className="max-w-3xl font-display text-5xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-7xl">
          Forje sua carreira <span className="texto-brasa">em infra.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-cinza">
          Trilhas em forma de mapa: cada tópico aquece o próximo. Marque o que já domina, siga o calor e
          acompanhe seu progresso até o nível avançado.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-6 font-mono text-sm text-fosco">
          <span>
            <strong className="text-aco">{trilhas.length}</strong> trilhas
          </span>
          <span>
            <strong className="text-aco">{totalTopicos}</strong> tópicos
          </span>
          <span>
            <strong className="text-aco">{NIVEIS.length}</strong> níveis
          </span>
        </div>
      </section>

      <section>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-3xl font-bold uppercase tracking-wide">Trilhas</h2>
          <LegendaStatus />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {trilhas.map((trilha) => (
            <Link
              key={trilha.slug}
              href={`/trilhas/${trilha.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-ferro bg-bigorna p-6 transition hover:border-brasa/60 hover:shadow-brasa"
            >
              <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-brasa/0 blur-3xl transition group-hover:bg-brasa/20" />
              <div className="mb-4 flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-lg border border-escoria bg-ferro text-brasa">
                  <IconeTrilha icone={trilha.icone} className="size-5" />
                </span>
                <h3 className="font-display text-3xl font-bold uppercase tracking-wide">{trilha.titulo}</h3>
                <ArrowRight className="ml-auto size-5 text-fosco transition group-hover:translate-x-1 group-hover:text-brasa" />
              </div>
              <p className="mb-6 flex-1 text-cinza">{trilha.descricao}</p>
              <div className="mb-5 flex gap-2 font-mono text-xs text-fosco">
                {NIVEIS.map((nivel) => (
                  <span key={nivel.id} className="rounded border border-ferro px-2 py-0.5">
                    {trilha.topicos.filter((t) => t.nivel === nivel.id).length} {nivel.nome.toLowerCase()}
                  </span>
                ))}
              </div>
              <ProgressoTrilha trilha={trilha.slug} topicos={trilha.topicos} />
            </Link>
          ))}

          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-ferro p-6 text-center text-fosco">
            <p className="font-display text-xl font-bold uppercase tracking-wide text-cinza">Em breve</p>
            <p className="mt-1 text-sm">Segurança, bancos de dados e mais trilhas na bigorna.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
