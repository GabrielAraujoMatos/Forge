"use client";

import { ArrowRight, Award, ExternalLink, X } from "lucide-react";
import Link from "next/link";
import { certificacoes, certificacoesDaTrilha, certificacoesDoTopico } from "@/content/certificacoes";
import { progressoChaves } from "@/lib/status";
import { NIVEIS_CERTIFICACAO, type Certificacao } from "@/lib/types";
import { useForge } from "./forge-provider";
import { BarraProgresso } from "./progresso";

const AVISO = "Cobertura aproximada, com base nos objetivos oficiais. Confira o guia da prova antes de agendar.";

function LinkOficial({ cert, className = "" }: { cert: Certificacao; className?: string }) {
  return (
    <a
      href={cert.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 text-brasa-clara hover:underline ${className}`}
    >
      Página oficial
      <ExternalLink className="size-3" />
    </a>
  );
}

/** Cartões das provas da trilha; clicar destaca no mapa os tópicos da prova. */
export function CertificacoesTrilha({
  trilha,
  selecionada,
  aoSelecionar,
}: {
  trilha: string;
  selecionada: Certificacao | null;
  aoSelecionar: (id: string | null) => void;
}) {
  const { concluidos } = useForge();
  const lista = certificacoesDaTrilha(trilha);
  if (!lista.length) return null;

  const deFora = selecionada?.topicos.filter((k) => !k.startsWith(`${trilha}/`)) ?? [];

  return (
    <section className="mb-6">
      <h2 className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-fosco">
        <Award className="size-3.5" />
        Certificações
      </h2>
      {/* No celular os cartões rolam para o lado para não empurrar o mapa para baixo. */}
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
        {lista.map((cert) => {
          const { feitos, total, pct } = progressoChaves(cert.topicos, concluidos);
          const ativa = selecionada?.id === cert.id;
          return (
            <button
              key={cert.id}
              onClick={() => aoSelecionar(ativa ? null : cert.id)}
              aria-pressed={ativa}
              title={ativa ? "Mostrar todos os tópicos" : `Destacar os tópicos de ${cert.nome}`}
              className={`w-56 shrink-0 rounded-xl border p-4 text-left transition sm:w-auto ${
                ativa ? "border-brasa bg-brasa/10" : "border-ferro bg-bigorna hover:border-brasa/50"
              }`}
            >
              <div className="mb-1 flex items-baseline justify-between gap-2">
                <span className="font-display text-xl font-bold uppercase tracking-wide">{cert.sigla}</span>
                <span className="font-mono text-xs text-cinza">
                  {feitos}/{total}
                </span>
              </div>
              <p className="mb-3 truncate font-mono text-[10px] uppercase tracking-widest text-fosco">
                {cert.emissor} · {NIVEIS_CERTIFICACAO[cert.nivel]}
              </p>
              <BarraProgresso pct={pct} />
            </button>
          );
        })}
      </div>

      {selecionada && (
        <div className="mt-3 flex flex-col gap-2 rounded-lg border border-brasa/40 bg-brasa/5 p-3 text-sm sm:flex-row sm:items-center">
          <p className="text-cinza">
            Destacando os tópicos de <strong className="text-aco">{selecionada.nome}</strong>
            {deFora.length > 0 && <> e mais {deFora.length} de outras trilhas</>}.{" "}
            <span className="text-xs text-fosco">{AVISO}</span>
          </p>
          <div className="flex shrink-0 items-center gap-3 sm:ml-auto">
            <LinkOficial cert={selecionada} className="text-xs" />
            <button
              onClick={() => aoSelecionar(null)}
              className="flex items-center gap-1 rounded-md border border-escoria px-2 py-1 text-xs text-cinza transition hover:text-aco"
            >
              <X className="size-3" />
              Ver todos
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

/** Provas em que o tópico cai, no painel do tópico. */
export function ChipsCertificacao({ chave }: { chave: string }) {
  const lista = certificacoesDoTopico(chave);
  if (!lista.length) return null;

  return (
    <section>
      <h3 className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-fosco">
        <Award className="size-3.5" />
        Cai na prova
      </h3>
      <ul className="flex flex-wrap gap-2">
        {lista.map((cert) => (
          <li key={cert.id}>
            <a
              href={cert.url}
              target="_blank"
              rel="noopener noreferrer"
              title={`${cert.nome} (${cert.emissor})`}
              className="flex items-center gap-1.5 rounded-md border border-ferro px-2 py-1 text-xs transition hover:border-brasa/50"
            >
              {cert.sigla}
              <ExternalLink className="size-3 text-fosco" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Todas as provas com o quanto do conteúdo já foi forjado, no perfil. */
export function CertificacoesPerfil() {
  const { concluidos } = useForge();
  const lista = certificacoes
    .map((cert) => ({ cert, ...progressoChaves(cert.topicos, concluidos) }))
    .sort((a, b) => b.pct - a.pct);

  return (
    <section>
      <h2 className="mb-1 font-display text-3xl font-bold uppercase tracking-wide">Certificações</h2>
      <p className="mb-4 text-xs text-fosco">{AVISO}</p>
      <ul className="divide-y divide-ferro overflow-hidden rounded-xl border border-ferro bg-bigorna">
        {lista.map(({ cert, feitos, total, pct }) => (
          <li key={cert.id}>
            <Link
              href={`/trilhas/${cert.trilha}?cert=${cert.id}`}
              className="group grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 px-4 py-3 transition hover:bg-ferro/40 sm:grid-cols-[1fr_160px_auto]"
            >
              <span className="min-w-0">
                <span className="block truncate font-medium">
                  {cert.sigla}
                  <span className="ml-2 font-normal text-fosco">{cert.nome !== cert.sigla && cert.nome}</span>
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-fosco">
                  {cert.emissor} · {NIVEIS_CERTIFICACAO[cert.nivel]}
                </span>
              </span>
              <span className="col-span-2 row-start-2 sm:col-span-1 sm:row-start-auto">
                <BarraProgresso pct={pct} />
              </span>
              <span className="col-start-2 row-start-1 flex items-center gap-2 font-mono text-xs text-cinza sm:col-start-auto sm:row-start-auto">
                {feitos}/{total}
                <ArrowRight className="size-4 text-fosco transition group-hover:translate-x-1 group-hover:text-brasa" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
