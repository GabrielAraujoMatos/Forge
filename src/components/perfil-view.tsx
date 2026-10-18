"use client";

import type { User } from "@supabase/supabase-js";
import { ArrowRight, Check, Flame, LogIn, UserRound } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { chaveTopico, progressoTrilha, statusTopico } from "@/lib/status";
import { NIVEIS, type Trilha } from "@/lib/types";
import { useForge } from "./forge-provider";
import { IconeTrilha } from "./icone-trilha";
import { BarraProgresso } from "./progresso";
import { CertificacoesPerfil } from "./certificacoes";
import { PainelRitmo } from "./ritmo";
import { SeuPlano } from "./seu-plano";

const MAX_PROXIMOS = 3;
const MAX_RECENTES = 6;

type Recente = { trilha: string; topico: string; concluido_em: string };

const formatoData = new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "short" });
const formatoMes = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" });

export function PerfilView({ trilhas }: { trilhas: Trilha[] }) {
  const { authPronto, usuario, contasAtivas, concluidos } = useForge();

  const total = trilhas.reduce((n, t) => n + t.topicos.length, 0);
  const feitos = trilhas.reduce((n, t) => n + progressoTrilha(t.slug, t.topicos, concluidos).feitos, 0);
  const pct = total ? Math.round((feitos / total) * 100) : 0;

  return (
    <>
      <section className="mb-10 flex flex-col gap-6 rounded-2xl border border-ferro bg-bigorna p-6 sm:flex-row sm:items-center sm:p-8">
        <Identidade usuario={usuario} carregando={!authPronto} />
        <div className="sm:ml-auto sm:w-64">
          <div className="mb-1.5 flex items-baseline justify-between">
            <span className="font-mono text-xs uppercase tracking-widest text-fosco">Total forjado</span>
            <span className="font-display text-3xl font-bold text-brasa-clara">{pct}%</span>
          </div>
          <BarraProgresso pct={pct} />
          <p className="mt-1.5 font-mono text-xs text-cinza">
            {feitos}/{total} tópicos
          </p>
        </div>
      </section>

      {contasAtivas && authPronto && !usuario && (
        <div className="mb-10 flex flex-col gap-3 rounded-xl border border-brasa/40 bg-brasa/5 p-4 sm:flex-row sm:items-center">
          <p className="text-sm text-cinza">
            Seu progresso está salvo só neste navegador. Entre para guardar na sua conta e acessar de qualquer lugar.
          </p>
          <Link
            href="/entrar"
            className="flex shrink-0 items-center justify-center gap-1.5 rounded-md border border-brasa/60 px-3 py-1.5 text-sm text-brasa-clara transition hover:bg-brasa hover:text-tinta sm:ml-auto"
          >
            <LogIn className="size-4" />
            Entrar
          </Link>
        </div>
      )}

      <div className="mb-10 empty:hidden">
        <SeuPlano compacto />
      </div>

      <PainelRitmo />

      <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
        <div className="space-y-10">
          <section>
            <h2 className="mb-4 font-display text-3xl font-bold uppercase tracking-wide">Trilhas</h2>
            <div className="grid gap-4">
              {trilhas.map((trilha) => (
                <CartaoTrilha key={trilha.slug} trilha={trilha} concluidos={concluidos} />
              ))}
            </div>
          </section>
          <CertificacoesPerfil />
        </div>

        <aside className="space-y-10">
          <Proximos trilhas={trilhas} concluidos={concluidos} />
          {usuario && <Recentes trilhas={trilhas} concluidos={concluidos} userId={usuario.id} />}
        </aside>
      </div>
    </>
  );
}

function Identidade({ usuario, carregando }: { usuario: User | null; carregando: boolean }) {
  if (carregando) {
    return (
      <div className="flex items-center gap-4">
        <div className="size-16 animate-pulse rounded-full bg-ferro" />
        <div className="h-8 w-40 animate-pulse rounded bg-ferro" />
      </div>
    );
  }

  const meta = usuario?.user_metadata ?? {};
  const nome: string = meta.user_name ?? meta.name ?? usuario?.email?.split("@")[0] ?? "Visitante";
  const avatar: string | undefined = meta.avatar_url;

  return (
    <div className="flex min-w-0 items-center gap-4">
      {avatar ? (
        // eslint-disable-next-line @next/next/no-img-element -- avatar externo do GitHub
        <img src={avatar} alt="" className="size-16 shrink-0 rounded-full border-2 border-brasa/60" />
      ) : (
        <span className="grid size-16 shrink-0 place-items-center rounded-full border-2 border-escoria bg-ferro text-fosco">
          <UserRound className="size-8" />
        </span>
      )}
      <div className="min-w-0">
        <h1 className="truncate font-display text-4xl font-extrabold uppercase leading-none tracking-tight">{nome}</h1>
        <p className="mt-1.5 truncate font-mono text-xs text-fosco">
          {usuario ? `Forjando desde ${formatoMes.format(new Date(usuario.created_at))}` : "Sem conta"}
        </p>
      </div>
    </div>
  );
}

function CartaoTrilha({ trilha, concluidos }: { trilha: Trilha; concluidos: ReadonlySet<string> }) {
  const { feitos, total, pct } = progressoTrilha(trilha.slug, trilha.topicos, concluidos);

  return (
    <Link
      href={`/trilhas/${trilha.slug}`}
      className="group rounded-xl border border-ferro bg-bigorna p-5 transition hover:border-brasa/60"
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="grid size-9 place-items-center rounded-lg border border-escoria bg-ferro text-brasa">
          <IconeTrilha icone={trilha.icone} className="size-4" />
        </span>
        <h3 className="font-display text-2xl font-bold uppercase tracking-wide">{trilha.titulo}</h3>
        <span className="ml-auto font-mono text-sm text-cinza">
          {feitos}/{total} · <span className={pct > 0 ? "text-brasa-clara" : ""}>{pct}%</span>
        </span>
        <ArrowRight className="size-4 text-fosco transition group-hover:translate-x-1 group-hover:text-brasa" />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {NIVEIS.map((nivel) => {
          const doNivel = trilha.topicos.filter((t) => t.nivel === nivel.id);
          const p = progressoTrilha(trilha.slug, doNivel, concluidos);
          return (
            <div key={nivel.id}>
              <div className="mb-1 flex justify-between font-mono text-xs text-fosco">
                <span>{nivel.nome}</span>
                <span>
                  {p.feitos}/{p.total}
                </span>
              </div>
              <BarraProgresso pct={p.pct} />
            </div>
          );
        })}
      </div>
    </Link>
  );
}

/** Tópicos com todos os pré-requisitos forjados, na ordem da trilha. */
function Proximos({ trilhas, concluidos }: { trilhas: Trilha[]; concluidos: ReadonlySet<string> }) {
  const grupos = trilhas
    .map((trilha) => ({
      trilha,
      topicos: trilha.topicos
        .filter((t) => statusTopico(trilha.slug, t, concluidos) === "aquecendo")
        .slice(0, MAX_PROXIMOS),
    }))
    .filter((g) => g.topicos.length);

  return (
    <section>
      <h2 className="mb-4 font-display text-3xl font-bold uppercase tracking-wide">Próximos</h2>
      {grupos.length === 0 ? (
        <p className="text-sm text-fosco">Tudo forjado. A bigorna espera novas trilhas.</p>
      ) : (
        <div className="space-y-5">
          {grupos.map(({ trilha, topicos }) => (
            <div key={trilha.slug}>
              <h3 className="mb-2 font-mono text-xs uppercase tracking-widest text-fosco">{trilha.titulo}</h3>
              <ul className="space-y-2">
                {topicos.map((t) => (
                  <li key={t.id}>
                    <Link
                      href={`/trilhas/${trilha.slug}#${t.id}`}
                      className="flex items-center gap-3 rounded-lg border border-ferro bg-bigorna p-3 transition hover:border-brasa/50"
                    >
                      <Flame className="size-4 shrink-0 text-brasa" />
                      <span className="min-w-0 flex-1 truncate text-sm font-medium">{t.titulo}</span>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-fosco">
                        {NIVEIS.find((n) => n.id === t.nivel)?.nome}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/** Últimos tópicos forjados, com a data salva na conta. */
function Recentes({ trilhas, concluidos, userId }: { trilhas: Trilha[]; concluidos: ReadonlySet<string>; userId: string }) {
  const [recentes, setRecentes] = useState<Recente[] | null>(null);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;
    let ativo = true;
    // Espera a gravação otimista chegar ao banco antes de recarregar.
    const espera = setTimeout(async () => {
      const { data, error } = await supabase
        .from("progresso")
        .select("trilha, topico, concluido_em")
        .order("concluido_em", { ascending: false })
        .limit(MAX_RECENTES);
      if (!ativo) return;
      if (error) console.error("[forge] erro ao carregar recentes", error);
      else setRecentes(data as Recente[]);
    }, 400);
    return () => {
      ativo = false;
      clearTimeout(espera);
    };
  }, [userId, concluidos]);

  const titulos = new Map(trilhas.flatMap((tr) => tr.topicos.map((t) => [chaveTopico(tr.slug, t.id), t.titulo])));
  const nomesTrilha = new Map(trilhas.map((t) => [t.slug, t.titulo]));
  const visiveis = recentes?.filter((r) => titulos.has(chaveTopico(r.trilha, r.topico)));

  return (
    <section>
      <h2 className="mb-4 font-display text-3xl font-bold uppercase tracking-wide">Forjados recentemente</h2>
      {!visiveis ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="h-11 animate-pulse rounded-lg bg-bigorna" />
          ))}
        </div>
      ) : visiveis.length === 0 ? (
        <p className="text-sm text-fosco">Nada forjado ainda. Escolha um tópico em Próximos para começar.</p>
      ) : (
        <ul className="space-y-2">
          {visiveis.map((r) => (
            <li key={chaveTopico(r.trilha, r.topico)}>
              <Link
                href={`/trilhas/${r.trilha}#${r.topico}`}
                className="flex items-center gap-3 rounded-lg border border-ferro p-3 transition hover:border-brasa/50"
              >
                <Check className="size-4 shrink-0 text-ouro" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{titulos.get(chaveTopico(r.trilha, r.topico))}</span>
                  <span className="text-xs text-fosco">{nomesTrilha.get(r.trilha)}</span>
                </span>
                <time dateTime={r.concluido_em} className="shrink-0 font-mono text-xs text-fosco">
                  {formatoData.format(new Date(r.concluido_em))}
                </time>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
