"use client";

import { BookOpen, ExternalLink, FileText, FlaskConical, GraduationCap, Hammer, Video, X } from "lucide-react";
import { chaveTopico } from "@/lib/status";
import { NIVEIS, STATUS, TIPOS_RECURSO, type Status, type TipoRecurso, type Topico } from "@/lib/types";
import { COR_STATUS, ICONE_STATUS } from "../legenda-status";
import { ChipsCertificacao } from "../certificacoes";
import { AnotacaoTopico } from "./anotacao-topico";

const iconeRecurso = {
  doc: BookOpen,
  artigo: FileText,
  curso: GraduationCap,
  video: Video,
  pratica: FlaskConical,
} satisfies Record<TipoRecurso, unknown>;

type Props = {
  trilha: string;
  topico: Topico;
  topicos: Topico[];
  status: Map<string, Status>;
  aoFechar: () => void;
  aoSelecionar: (id: string) => void;
  aoAlternar: () => void;
};

export function PainelTopico({ trilha, topico, topicos, status, aoFechar, aoSelecionar, aoAlternar }: Props) {
  const st = status.get(topico.id) ?? "frio";
  const infoStatus = STATUS.find((s) => s.id === st)!;
  const IconeStatus = ICONE_STATUS[st];
  const porId = new Map(topicos.map((t) => [t.id, t]));
  const desbloqueia = topicos.filter((t) => t.requisitos.includes(topico.id));
  const forjado = st === "forjado";

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 md:hidden" onClick={aoFechar} aria-hidden />
      <aside
        className="fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col rounded-t-2xl border border-escoria bg-bigorna shadow-2xl md:inset-y-0 md:left-auto md:right-0 md:top-14 md:max-h-none md:w-[420px] md:rounded-none md:border-y-0 md:border-r-0"
        aria-label={topico.titulo}
      >
        <header className="flex items-start gap-3 border-b border-ferro p-5">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-widest">
              <span className="text-fosco">{NIVEIS.find((n) => n.id === topico.nivel)?.nome}</span>
              <span className="text-escoria">/</span>
              <span className={`flex items-center gap-1 ${COR_STATUS[st]}`}>
                <IconeStatus className="size-3.5" />
                {infoStatus.nome}
              </span>
            </div>
            <h2 className="font-display text-3xl font-bold uppercase leading-none tracking-wide">{topico.titulo}</h2>
          </div>
          <button onClick={aoFechar} className="rounded-md p-1.5 text-cinza transition hover:bg-ferro hover:text-aco" aria-label="Fechar">
            <X className="size-5" />
          </button>
        </header>
  
        <div className="flex-1 space-y-6 overflow-y-auto p-5">
          <p className="text-cinza">{topico.resumo}</p>
  
          {st === "frio" && (
            <p className="rounded-lg border border-escoria bg-ferro/60 p-3 text-sm text-cinza">
              Os pré-requisitos ainda estão frios, mas nada te impede de estudar este tópico agora.
            </p>
          )}
  
          <section>
            <h3 className="mb-2 font-mono text-xs uppercase tracking-widest text-fosco">O que estudar</h3>
            <ul className="space-y-1.5">
              {topico.estudar.map((item) => (
                <li key={item} className="flex gap-2 text-sm">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brasa" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
  
          <section>
            <h3 className="mb-2 font-mono text-xs uppercase tracking-widest text-fosco">Recursos</h3>
            <ul className="space-y-2">
              {topico.recursos.map((r) => {
                const Icone = iconeRecurso[r.tipo];
                return (
                  <li key={r.url}>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 rounded-lg border border-ferro bg-carvao/50 p-3 transition hover:border-brasa/50"
                    >
                      <Icone className="size-4 shrink-0 text-brasa" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium group-hover:text-brasa-clara">{r.titulo}</span>
                        <span className="text-xs text-fosco">{TIPOS_RECURSO[r.tipo]}</span>
                      </span>
                      <ExternalLink className="size-3.5 shrink-0 text-fosco" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>
  
          <AnotacaoTopico trilha={trilha} topico={topico.id} />

          <ChipsCertificacao chave={chaveTopico(trilha, topico.id)} />
  
          {(topico.requisitos.length > 0 || desbloqueia.length > 0) && (
            <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-1">
              {topico.requisitos.length > 0 && (
                <ListaLigacoes titulo="Pré-requisitos" ids={topico.requisitos} porId={porId} status={status} aoSelecionar={aoSelecionar} />
              )}
              {desbloqueia.length > 0 && (
                <ListaLigacoes titulo="Aquece" ids={desbloqueia.map((t) => t.id)} porId={porId} status={status} aoSelecionar={aoSelecionar} />
              )}
            </section>
          )}
        </div>
  
        <footer className="border-t border-ferro p-4">
          <button
            onClick={aoAlternar}
            className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-display text-lg font-bold uppercase tracking-wider transition ${
              forjado
                ? "border border-escoria text-cinza hover:border-cinza hover:text-aco"
                : "bg-brasa text-tinta hover:bg-brasa-clara hover:shadow-brasa"
            }`}
          >
            <Hammer className="size-5" />
            {forjado ? "Desmarcar" : "Marcar como forjado"}
          </button>
        </footer>
      </aside>
    </>
  );
}

function ListaLigacoes({
  titulo,
  ids,
  porId,
  status,
  aoSelecionar,
}: {
  titulo: string;
  ids: string[];
  porId: Map<string, Topico>;
  status: Map<string, Status>;
  aoSelecionar: (id: string) => void;
}) {
  return (
    <div>
      <h3 className="mb-2 font-mono text-xs uppercase tracking-widest text-fosco">{titulo}</h3>
      <ul className="flex flex-wrap gap-2">
        {ids.map((id) => {
          const st = status.get(id) ?? "frio";
          const Icone = ICONE_STATUS[st];
          return (
            <li key={id}>
              <button
                onClick={() => aoSelecionar(id)}
                className="flex items-center gap-1.5 rounded-md border border-ferro px-2 py-1 text-left text-xs transition hover:border-brasa/50"
              >
                <Icone className={`size-3.5 shrink-0 ${COR_STATUS[st]}`} />
                {porId.get(id)?.titulo}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
