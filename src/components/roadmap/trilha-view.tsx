"use client";

import { List, Workflow } from "lucide-react";
import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import { statusTopico } from "@/lib/status";
import { NIVEIS, type Status, type Trilha } from "@/lib/types";
import { combinaFiltros, Filtros, FILTROS_VAZIOS, type EstadoFiltros } from "../filtros";
import { useForge } from "../forge-provider";
import { COR_STATUS, ICONE_STATUS } from "../legenda-status";
import { PainelTopico } from "./painel-topico";
import { RoadmapGrafo } from "./roadmap-grafo";

// O tópico aberto fica no hash da URL (#ssh) para poder ser compartilhado e
// para o botão "voltar" do navegador fechar o painel.
function assinarHash(ouvinte: () => void) {
  window.addEventListener("hashchange", ouvinte);
  return () => window.removeEventListener("hashchange", ouvinte);
}
const lerHash = () => decodeURIComponent(window.location.hash.slice(1));
const lerHashServidor = () => "";

export function TrilhaView({ trilha }: { trilha: Trilha }) {
  const { concluidos, alternar } = useForge();
  const [filtros, setFiltros] = useState<EstadoFiltros>(FILTROS_VAZIOS);
  const [modo, setModo] = useState<"mapa" | "lista">("mapa");
  const hash = useSyncExternalStore(assinarHash, lerHash, lerHashServidor);

  const { topicos } = trilha;
  const selecionado = topicos.find((t) => t.id === hash) ?? null;

  const status = useMemo(
    () => new Map<string, Status>(topicos.map((t) => [t.id, statusTopico(trilha.slug, t, concluidos)])),
    [topicos, trilha.slug, concluidos],
  );

  const visiveis = useMemo(
    () => new Set(topicos.filter((t) => combinaFiltros(t, status.get(t.id)!, filtros)).map((t) => t.id)),
    [topicos, status, filtros],
  );

  const selecionar = useCallback((id: string) => {
    window.location.hash = id;
  }, []);

  const fechar = useCallback(() => {
    history.replaceState(null, "", window.location.pathname + window.location.search);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  }, []);

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-start">
        <div className="flex-1">
          <Filtros valor={filtros} aoMudar={setFiltros} placeholder={`Buscar em ${trilha.titulo}…`} />
        </div>
        <div className="flex shrink-0 self-start rounded-lg border border-ferro bg-bigorna p-1 text-sm">
          {(
            [
              { id: "mapa", rotulo: "Mapa", Icone: Workflow },
              { id: "lista", rotulo: "Lista", Icone: List },
            ] as const
          ).map(({ id, rotulo, Icone }) => (
            <button
              key={id}
              onClick={() => setModo(id)}
              aria-pressed={modo === id}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 transition ${
                modo === id ? "bg-ferro text-aco" : "text-cinza hover:text-aco"
              }`}
            >
              <Icone className="size-4" />
              {rotulo}
            </button>
          ))}
        </div>
      </div>

      {modo === "mapa" ? (
        <div className="h-[72vh] min-h-[520px] overflow-hidden rounded-xl border border-ferro bg-carvao/60">
          <RoadmapGrafo
            topicos={topicos}
            status={status}
            visiveis={visiveis}
            selecionado={selecionado?.id ?? null}
            aoSelecionar={selecionar}
          />
        </div>
      ) : (
        <div className="space-y-8">
          {NIVEIS.map((nivel) => {
            const doNivel = topicos.filter((t) => t.nivel === nivel.id && visiveis.has(t.id));
            if (!doNivel.length) return null;
            return (
              <section key={nivel.id}>
                <h2 className="mb-3 font-display text-2xl font-bold uppercase tracking-wide text-cinza">{nivel.nome}</h2>
                <ul className="divide-y divide-ferro overflow-hidden rounded-xl border border-ferro bg-bigorna">
                  {doNivel.map((t) => {
                    const st = status.get(t.id)!;
                    const Icone = ICONE_STATUS[st];
                    return (
                      <li key={t.id} className="flex items-center gap-3 px-4 py-3">
                        <button
                          onClick={() => alternar(trilha.slug, t.id)}
                          aria-label={st === "forjado" ? `Desmarcar ${t.titulo}` : `Marcar ${t.titulo} como forjado`}
                          className={`grid size-8 shrink-0 place-items-center rounded-md border transition ${
                            st === "forjado" ? "border-ouro/60 bg-brasa text-carvao" : "border-escoria hover:border-brasa"
                          }`}
                        >
                          <Icone className={`size-4 ${st === "forjado" ? "text-carvao" : COR_STATUS[st]}`} />
                        </button>
                        <button onClick={() => selecionar(t.id)} className="min-w-0 flex-1 text-left">
                          <p className={`font-medium ${st === "frio" ? "text-cinza" : ""}`}>{t.titulo}</p>
                          <p className="truncate text-sm text-fosco">{t.resumo}</p>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
          {visiveis.size === 0 && <p className="py-12 text-center text-fosco">Nenhum tópico encontrado com esses filtros.</p>}
        </div>
      )}

      {selecionado && (
        <PainelTopico
          key={selecionado.id}
          topico={selecionado}
          topicos={topicos}
          status={status}
          aoFechar={fechar}
          aoSelecionar={selecionar}
          aoAlternar={() => alternar(trilha.slug, selecionado.id)}
        />
      )}
    </>
  );
}
