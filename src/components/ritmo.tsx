"use client";

import { ArrowRight, Check, Flame, Minus, Plus, Target, Trophy } from "lucide-react";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { getTrilha } from "@/content";
import {
  dataDoDia,
  diaAtivo,
  forjadosNaSemana,
  inicioSemana,
  maiorSequencia,
  META_MAX,
  META_MIN,
  sequenciaAtual,
  somarDias,
  ultimoStore,
  useHoje,
  type Atividade,
  type Dia,
} from "@/lib/ritmo";
import { statusTopico } from "@/lib/status";
import { NIVEIS } from "@/lib/types";
import { useForge } from "./forge-provider";
import { COR_STATUS, ICONE_STATUS } from "./legenda-status";
import { BarraProgresso } from "./progresso";

const plural = (n: number, um: string, varios: string) => `${n} ${n === 1 ? um : varios}`;

/** Chama com a sequência de dias no cabeçalho; some quando não há sequência. */
export function ChamaSequencia() {
  const { atividade } = useForge();
  const hoje = useHoje();
  const dias = hoje ? sequenciaAtual(atividade, hoje) : 0;
  if (!dias) return null;
  const estudouHoje = hoje ? diaAtivo(atividade.get(hoje)) : false;

  return (
    <Link
      href="/perfil"
      title={`${plural(dias, "dia seguido", "dias seguidos")} estudando${estudouHoje ? "" : " · estude hoje para manter"}`}
      aria-label={`Sequência de ${plural(dias, "dia", "dias")}`}
      className="flex items-center gap-1 rounded-md px-2 py-1.5 font-mono text-sm font-semibold text-brasa-clara transition hover:bg-ferro"
    >
      <Flame className={`size-4 ${estudouHoje ? "fill-brasa/30 text-brasa" : "text-fosco"}`} />
      {dias}
    </Link>
  );
}

/** Sequência, recorde, meta da semana e calendário de atividade, no perfil. */
export function PainelRitmo() {
  const { atividade, meta, definirMeta } = useForge();
  const hoje = useHoje();

  if (!hoje) return <div className="mb-10 h-72 animate-pulse rounded-2xl border border-ferro bg-bigorna" />;

  const sequencia = sequenciaAtual(atividade, hoje);
  const recorde = maiorSequencia(atividade);
  const semana = forjadosNaSemana(atividade, hoje);
  const bateu = semana >= meta;
  const estudouHoje = diaAtivo(atividade.get(hoje));

  return (
    <section className="mb-10 rounded-2xl border border-ferro bg-bigorna p-6 sm:p-8">
      <h2 className="mb-6 font-display text-3xl font-bold uppercase tracking-wide">Ritmo</h2>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Indicador
          Icone={Flame}
          rotulo="Sequência"
          valor={plural(sequencia, "dia", "dias")}
          detalhe={
            sequencia === 0
              ? "Forje um tópico ou escreva uma anotação para acender."
              : estudouHoje
                ? "Hoje já conta. Volte amanhã!"
                : "Estude hoje para não apagar."
          }
          aceso={estudouHoje}
        />
        <Indicador Icone={Trophy} rotulo="Recorde" valor={plural(recorde, "dia", "dias")} detalhe="Maior sequência até hoje." />

        <div className="rounded-xl border border-ferro bg-carvao/50 p-4">
          <div className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-fosco">
            <Target className="size-3.5" />
            Meta da semana
          </div>
          <div className="mb-2 flex items-center gap-2">
            <span className="font-display text-3xl font-bold">
              {semana}
              <span className="text-fosco">/{meta}</span>
            </span>
            <span className="text-sm text-cinza">tópicos</span>
            <div className="ml-auto flex items-center gap-1">
              <BotaoMeta rotulo="Diminuir meta" Icone={Minus} desativado={meta <= META_MIN} aoClicar={() => definirMeta(meta - 1)} />
              <BotaoMeta rotulo="Aumentar meta" Icone={Plus} desativado={meta >= META_MAX} aoClicar={() => definirMeta(meta + 1)} />
            </div>
          </div>
          <BarraProgresso pct={Math.min(100, Math.round((semana / meta) * 100))} />
          <p className="mt-2 flex items-center gap-1.5 text-xs text-cinza">
            {bateu ? (
              <>
                <Check className="size-3.5 text-brasa" />
                Meta batida! Tudo a mais é lucro.
              </>
            ) : (
              `Faltam ${plural(meta - semana, "tópico", "tópicos")} até domingo.`
            )}
          </p>
        </div>
      </div>

      <Calendario atividade={atividade} hoje={hoje} />
    </section>
  );
}

function Indicador({
  Icone,
  rotulo,
  valor,
  detalhe,
  aceso,
}: {
  Icone: typeof Flame;
  rotulo: string;
  valor: string;
  detalhe: string;
  aceso?: boolean;
}) {
  return (
    <div className="rounded-xl border border-ferro bg-carvao/50 p-4">
      <div className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-fosco">
        <Icone className={`size-3.5 ${aceso ? "fill-brasa/30 text-brasa" : ""}`} />
        {rotulo}
      </div>
      <p className="mb-2 font-display text-3xl font-bold">{valor}</p>
      <p className="text-xs text-cinza">{detalhe}</p>
    </div>
  );
}

function BotaoMeta({ rotulo, Icone, desativado, aoClicar }: { rotulo: string; Icone: typeof Plus; desativado: boolean; aoClicar: () => void }) {
  return (
    <button
      onClick={aoClicar}
      disabled={desativado}
      aria-label={rotulo}
      title={rotulo}
      className="grid size-7 place-items-center rounded-md border border-escoria text-cinza transition hover:border-brasa hover:text-aco disabled:pointer-events-none disabled:opacity-40"
    >
      <Icone className="size-3.5" />
    </button>
  );
}

const SEMANAS = 26;
const NOMES_DIA = ["Seg", "", "Qua", "", "Sex", "", ""];
const formatoMes = new Intl.DateTimeFormat("pt-BR", { month: "short" });
const formatoDia = new Intl.DateTimeFormat("pt-BR", { weekday: "short", day: "numeric", month: "short" });

/** 0 = nada, 1 = só anotação ou 1 tópico, 2 = 2 tópicos, 3 = 3 ou mais. */
function intensidade(d: Dia | undefined) {
  if (!diaAtivo(d)) return 0;
  return Math.min(3, Math.max(1, d!.forjados));
}

const COR_INTENSIDADE = ["bg-ferro", "bg-brasa/30", "bg-brasa/60", "bg-brasa"];

function descreverDia(dia: string, d: Dia | undefined) {
  const partes = [];
  if (d?.forjados) partes.push(plural(d.forjados, "tópico forjado", "tópicos forjados"));
  if (d?.anotou) partes.push("anotações");
  return `${formatoDia.format(dataDoDia(dia))}: ${partes.length ? partes.join(" e ") : "sem atividade"}`;
}

/** Grade de atividade das últimas semanas, uma coluna por semana. */
function Calendario({ atividade, hoje }: { atividade: Atividade; hoje: string }) {
  const primeiro = somarDias(inicioSemana(hoje), -7 * (SEMANAS - 1));
  const semanas = Array.from({ length: SEMANAS }, (_, s) =>
    Array.from({ length: 7 }, (_, d) => somarDias(primeiro, s * 7 + d)),
  );
  const diasAtivos = semanas.flat().filter((dia) => dia <= hoje && diaAtivo(atividade.get(dia))).length;

  return (
    <div>
      <div className="mb-3 flex max-w-3xl flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-mono text-xs uppercase tracking-widest text-fosco">Últimos 6 meses</h3>
        <p className="font-mono text-xs text-cinza">{plural(diasAtivos, "dia com estudo", "dias com estudo")}</p>
      </div>
      {/* As colunas dividem a largura disponível; cada dia é um quadrado. */}
      <div className="max-w-3xl">
        <div
          className="grid grid-flow-col gap-[3px]"
          style={{ gridTemplateRows: "auto repeat(7, auto)", gridTemplateColumns: `auto repeat(${SEMANAS}, minmax(0, 1fr))` }}
        >
          <div />
          {NOMES_DIA.map((nome, i) => (
            <span key={i} className="flex items-center pr-2 font-mono text-[10px] text-fosco">
              {nome}
            </span>
          ))}
          {semanas.map((dias, s) => {
            // Mostra o mês na primeira semana em que ele aparece.
            const mes = dataDoDia(dias[0]).getMonth();
            const novoMes = s === 0 || dataDoDia(semanas[s - 1][0]).getMonth() !== mes;
            return [
              <span key={`m${s}`} className="h-4 overflow-visible whitespace-nowrap font-mono text-[10px] text-fosco">
                {novoMes ? formatoMes.format(dataDoDia(dias[0])).replace(".", "") : ""}
              </span>,
              ...dias.map((dia) => {
                const futuro = dia > hoje;
                const d = atividade.get(dia);
                return (
                  <span
                    key={dia}
                    title={futuro ? undefined : descreverDia(dia, d)}
                    aria-label={futuro ? undefined : descreverDia(dia, d)}
                    className={`aspect-square rounded-[3px] ${futuro ? "" : COR_INTENSIDADE[intensidade(d)]} ${
                      dia === hoje ? "ring-1 ring-aco ring-offset-1 ring-offset-bigorna" : ""
                    }`}
                  />
                );
              }),
            ];
          })}
        </div>
      </div>
      <div className="mt-3 flex max-w-3xl items-center justify-end gap-1.5 font-mono text-[10px] text-fosco">
        Menos
        {COR_INTENSIDADE.map((cor) => (
          <span key={cor} className={`size-3 rounded-[3px] ${cor}`} />
        ))}
        Mais
      </div>
    </div>
  );
}

/** Na página inicial: volta ao último tópico aberto e mostra o ritmo da semana. */
export function ContinuarCard() {
  const { concluidos, atividade, meta } = useForge();
  const ultimo = useSyncExternalStore(ultimoStore.assinar, ultimoStore.ler, ultimoStore.lerServidor);
  const hoje = useHoje();

  const trilha = ultimo ? getTrilha(ultimo.trilha) : undefined;
  const topico = trilha?.topicos.find((t) => t.id === ultimo?.topico);
  if (!trilha || !topico || !hoje) return null;

  const st = statusTopico(trilha.slug, topico, concluidos);
  const IconeStatus = ICONE_STATUS[st];
  const sequencia = sequenciaAtual(atividade, hoje);
  const semana = forjadosNaSemana(atividade, hoje);

  return (
    <section className="mb-12 grid gap-4 rounded-2xl border border-brasa/40 bg-bigorna p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-6">
      <Link href={`/trilhas/${trilha.slug}#${topico.id}`} className="group flex min-w-0 items-center gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-lg border border-escoria bg-ferro">
          <IconeStatus className={`size-5 ${COR_STATUS[st]}`} />
        </span>
        <span className="min-w-0">
          <span className="block font-mono text-xs uppercase tracking-widest text-brasa">Continue de onde parou</span>
          <span className="block truncate font-display text-2xl font-bold uppercase tracking-wide group-hover:text-brasa-clara">
            {topico.titulo}
          </span>
          <span className="block text-sm text-fosco">
            {trilha.titulo} · {NIVEIS.find((n) => n.id === topico.nivel)?.nome}
          </span>
        </span>
        <ArrowRight className="ml-auto size-5 shrink-0 text-fosco transition group-hover:translate-x-1 group-hover:text-brasa" />
      </Link>
      <Link
        href="/perfil"
        className="flex items-center gap-5 border-t border-ferro pt-4 font-mono text-sm text-cinza transition hover:text-aco sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0"
      >
        <span className="flex items-center gap-1.5" title="Sequência de dias">
          <Flame className={`size-4 ${diaAtivo(atividade.get(hoje)) ? "fill-brasa/30 text-brasa" : "text-fosco"}`} />
          {plural(sequencia, "dia", "dias")}
        </span>
        <span className="flex items-center gap-1.5" title="Meta da semana">
          <Target className={`size-4 ${semana >= meta ? "text-brasa" : "text-fosco"}`} />
          {semana}/{meta} na semana
        </span>
      </Link>
    </section>
  );
}
