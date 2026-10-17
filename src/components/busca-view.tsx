"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { TopicoComTrilha } from "@/content";
import { statusTopico } from "@/lib/status";
import { NIVEIS } from "@/lib/types";
import { combinaFiltros, Filtros, FILTROS_VAZIOS, type EstadoFiltros } from "./filtros";
import { useForge } from "./forge-provider";
import { COR_STATUS, ICONE_STATUS } from "./legenda-status";

const nomeNivel = Object.fromEntries(NIVEIS.map((n) => [n.id, n.nome]));

export function BuscaView({ topicos, trilhas }: { topicos: TopicoComTrilha[]; trilhas: { slug: string; titulo: string }[] }) {
  const { concluidos } = useForge();
  const [filtros, setFiltros] = useState<EstadoFiltros>(FILTROS_VAZIOS);
  const [trilhaAtiva, setTrilhaAtiva] = useState<string | null>(null);

  const resultados = useMemo(
    () =>
      topicos
        .map((t) => ({ ...t, status: statusTopico(t.trilha.slug, t, concluidos) }))
        .filter((t) => (!trilhaAtiva || t.trilha.slug === trilhaAtiva) && combinaFiltros(t, t.status, filtros)),
    [topicos, concluidos, filtros, trilhaAtiva],
  );

  return (
    <>
      <div className="mb-6">
        <Filtros valor={filtros} aoMudar={setFiltros} placeholder="Buscar em todas as trilhas: DNS, permissões, VPN…">
          {trilhas.map((t) => (
            <button
              key={t.slug}
              onClick={() => setTrilhaAtiva(trilhaAtiva === t.slug ? null : t.slug)}
              aria-pressed={trilhaAtiva === t.slug}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                trilhaAtiva === t.slug ? "border-aco bg-aco text-carvao" : "border-ferro text-aco hover:border-escoria"
              }`}
            >
              {t.titulo}
            </button>
          ))}
          <span className="mx-1 h-4 w-px bg-ferro" />
        </Filtros>
      </div>

      <p className="mb-3 font-mono text-xs text-fosco">
        {resultados.length} {resultados.length === 1 ? "tópico" : "tópicos"}
      </p>

      <ul className="grid gap-3 md:grid-cols-2">
        {resultados.map((t) => {
          const Icone = ICONE_STATUS[t.status];
          return (
            <li key={`${t.trilha.slug}/${t.id}`}>
              <Link
                href={`/trilhas/${t.trilha.slug}#${t.id}`}
                className="flex h-full gap-3 rounded-xl border border-ferro bg-bigorna p-4 transition hover:border-brasa/50"
              >
                <Icone className={`mt-0.5 size-5 shrink-0 ${COR_STATUS[t.status]}`} />
                <div className="min-w-0">
                  <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-fosco">
                    {t.trilha.titulo} · {nomeNivel[t.nivel]}
                  </p>
                  <p className="font-semibold">{t.titulo}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-cinza">{t.resumo}</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
      {resultados.length === 0 && <p className="py-16 text-center text-fosco">Nada na bigorna com esses filtros.</p>}
    </>
  );
}
