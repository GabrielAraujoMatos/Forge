import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getTrilha, trilhas } from "@/content";
import { IconeTrilha } from "@/components/icone-trilha";
import { LegendaStatus } from "@/components/legenda-status";
import { ProgressoTrilha } from "@/components/progresso";
import { TrilhaView } from "@/components/roadmap/trilha-view";

export function generateStaticParams() {
  return trilhas.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/trilhas/[slug]">): Promise<Metadata> {
  const trilha = getTrilha((await params).slug);
  return trilha ? { title: `Trilha ${trilha.titulo}`, description: trilha.descricao } : {};
}

export default function PaginaTrilha({ params }: PageProps<"/trilhas/[slug]">) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-8">
      <Suspense fallback={<Esqueleto />}>
        <ConteudoTrilha params={params} />
      </Suspense>
    </main>
  );
}

function Esqueleto() {
  return (
    <div className="animate-pulse">
      <div className="mb-6 h-3 w-24 rounded bg-ferro" />
      <div className="mb-4 h-14 w-72 rounded bg-ferro" />
      <div className="mb-8 h-4 w-full max-w-xl rounded bg-ferro" />
      <div className="h-[72vh] min-h-[520px] rounded-xl border border-ferro bg-bigorna" />
    </div>
  );
}

async function ConteudoTrilha({ params }: Pick<PageProps<"/trilhas/[slug]">, "params">) {
  const trilha = getTrilha((await params).slug);
  if (!trilha) notFound();

  return (
    <>
      <nav className="mb-6 font-mono text-xs text-fosco">
        <Link href="/" className="hover:text-aco">
          trilhas
        </Link>
        <span className="mx-2 text-escoria">/</span>
        <span className="text-cinza">{trilha.slug}</span>
      </nav>

      <header className="mb-8 grid gap-6 md:grid-cols-[1fr_280px] md:items-end">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-lg border border-escoria bg-ferro text-brasa">
              <IconeTrilha icone={trilha.icone} className="size-6" />
            </span>
            <h1 className="font-display text-5xl font-extrabold uppercase tracking-tight sm:text-6xl">{trilha.titulo}</h1>
          </div>
          <p className="max-w-2xl text-cinza">{trilha.descricao}</p>
        </div>
        <ProgressoTrilha trilha={trilha.slug} topicos={trilha.topicos} />
      </header>

      <div className="mb-4">
        <LegendaStatus />
      </div>

      <TrilhaView trilha={trilha} />
    </>
  );
}
