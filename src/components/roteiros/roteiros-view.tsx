"use client";

import { ArrowRight, FilePlus2, LoaderCircle, LogIn, Map as IconeMapa, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LIMITE_OBJETIVO, progressoRoteiro, type Roteiro } from "@/lib/roteiros";
import { cabecalhosAuth, getSupabase } from "@/lib/supabase";
import { useForge } from "../forge-provider";
import { BarraProgresso } from "../progresso";
import { restante, usePlano, useStatusIa } from "../use-plano";

const EXEMPLOS = [
  "Quero passar na AZ-104 em 3 meses",
  "Sair do suporte técnico e virar SRE",
  "Administrar servidores Linux em produção",
  "Montar e proteger a rede de uma pequena empresa",
];

const NIVEIS_ALUNO = ["Iniciante", "Já trabalho com TI", "Experiente"];
const HORAS = [3, 5, 10, 15, 20];

const MENSAGENS_DB: Record<string, string> = {
  limite_roteiros: "Você chegou ao limite de roteiros salvos do seu plano. Apague um para criar outro.",
};

export function RoteirosView() {
  const { usuario, authPronto, contasAtivas, concluidos } = useForge();
  const status = useStatusIa();
  const { situacao, recarregar } = usePlano();
  const router = useRouter();
  const [roteiros, setRoteiros] = useState<Roteiro[] | null>(null);
  const [objetivo, setObjetivo] = useState("");
  const [nivel, setNivel] = useState(NIVEIS_ALUNO[0]);
  const [horas, setHoras] = useState(5);
  const [criando, setCriando] = useState<"ia" | "branco" | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const userId = usuario?.id;
  useEffect(() => {
    if (!userId) return;
    let ativo = true;
    void getSupabase()
      ?.from("roteiros")
      .select("id, titulo, objetivo, etapas, gerado_por_ia, atualizado_em")
      .order("atualizado_em", { ascending: false })
      .then(({ data }) => {
        if (ativo) setRoteiros((data as Roteiro[]) ?? []);
      });
    return () => {
      ativo = false;
    };
  }, [userId]);

  async function gerarComIa() {
    setCriando("ia");
    setErro(null);
    try {
      const res = await fetch("/api/roteiros", {
        method: "POST",
        headers: await cabecalhosAuth(),
        body: JSON.stringify({ objetivo, nivel, horasPorSemana: horas }),
      });
      const dados = await res.json().catch(() => null);
      if (!res.ok) return setErro(dados?.mensagem ?? "Não foi possível gerar o roteiro.");
      router.push(`/roteiros/ver?id=${dados.id}`);
    } catch {
      setErro("Sem conexão com o servidor. Tente de novo.");
    } finally {
      setCriando(null);
      recarregar();
    }
  }

  async function criarEmBranco() {
    setCriando("branco");
    setErro(null);
    const titulo = objetivo.trim().slice(0, 60) || "Meu roteiro";
    const { data, error } = (await getSupabase()?.rpc("roteiro_criar", {
      p_titulo: titulo,
      p_objetivo: objetivo.trim(),
      p_etapas: [],
      p_ia: false,
    })) ?? { data: null, error: null };
    setCriando(null);
    if (error) return setErro(MENSAGENS_DB[error.message] ?? "Não foi possível criar o roteiro.");
    router.push(`/roteiros/ver?id=${data}`);
  }

  if (!contasAtivas) return <p className="text-cinza">Os roteiros precisam das contas ativadas neste servidor.</p>;
  if (!authPronto) return <div className="h-64 animate-pulse rounded-2xl border border-ferro bg-bigorna" />;
  if (!usuario) {
    return (
      <div className="flex flex-col gap-3 rounded-xl border border-brasa/40 bg-brasa/5 p-5 sm:flex-row sm:items-center">
        <p className="text-cinza">Entre na sua conta para criar roteiros e guardar o progresso deles.</p>
        <Link
          href="/entrar"
          className="flex shrink-0 items-center justify-center gap-1.5 rounded-md border border-brasa/60 px-3 py-1.5 text-sm text-brasa-clara transition hover:bg-brasa hover:text-tinta sm:ml-auto"
        >
          <LogIn className="size-4" />
          Entrar
        </Link>
      </div>
    );
  }

  const limites = situacao?.limites;
  const geracoes = limites ? restante(limites.conteudos_ia_por_mes, situacao.uso.conteudos_ia) : null;
  const cheio = limites != null && roteiros != null && roteiros.length >= limites.roteiros_max;
  const objetivoValido = objetivo.trim().length >= 10;

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
      <section>
        <h2 className="mb-4 font-display text-3xl font-bold uppercase tracking-wide">Seus roteiros</h2>
        {roteiros == null ? (
          <div className="space-y-3">
            {[0, 1].map((i) => (
              <div key={i} className="h-28 animate-pulse rounded-xl bg-bigorna" />
            ))}
          </div>
        ) : roteiros.length === 0 ? (
          <div className="rounded-xl border border-dashed border-ferro p-8 text-center text-fosco">
            <IconeMapa className="mx-auto mb-3 size-8" />
            Nenhum roteiro ainda. Descreva o seu objetivo ao lado para criar o primeiro.
          </div>
        ) : (
          <ul className="grid gap-3">
            {roteiros.map((r) => {
              const { feitos, total, pct } = progressoRoteiro(r.etapas, concluidos);
              return (
                <li key={r.id}>
                  <Link
                    href={`/roteiros/ver?id=${r.id}`}
                    className="group block rounded-xl border border-ferro bg-bigorna p-5 transition hover:border-brasa/60"
                  >
                    <div className="mb-1 flex items-center gap-2">
                      <h3 className="min-w-0 flex-1 truncate font-display text-2xl font-bold uppercase tracking-wide">
                        {r.titulo}
                      </h3>
                      {r.gerado_por_ia && <Sparkles className="size-4 shrink-0 text-brasa" aria-label="Gerado com IA" />}
                      <ArrowRight className="size-4 shrink-0 text-fosco transition group-hover:translate-x-1 group-hover:text-brasa" />
                    </div>
                    {r.objetivo && <p className="mb-3 line-clamp-2 text-sm text-cinza">{r.objetivo}</p>}
                    <div className="mb-1.5 flex justify-between font-mono text-xs text-fosco">
                      <span>
                        {r.etapas.length} etapa(s) · {total} tópico(s)
                      </span>
                      <span className={pct > 0 ? "text-brasa-clara" : ""}>
                        {feitos}/{total} · {pct}%
                      </span>
                    </div>
                    <BarraProgresso pct={pct} />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <aside>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void gerarComIa();
          }}
          className="rounded-2xl border border-brasa/40 bg-bigorna p-5"
        >
          <h2 className="mb-3 font-display text-2xl font-bold uppercase tracking-wide">Novo roteiro</h2>
          <label htmlFor="objetivo" className="mb-1.5 block text-sm text-cinza">
            Qual é o seu objetivo?
          </label>
          <textarea
            id="objetivo"
            value={objetivo}
            onChange={(e) => setObjetivo(e.target.value)}
            maxLength={LIMITE_OBJETIVO}
            rows={3}
            placeholder="Ex.: quero passar na AZ-104 em 3 meses"
            className="mb-2 block w-full resize-y rounded-lg border border-ferro bg-carvao/50 p-3 text-sm placeholder:text-fosco focus:border-brasa/60 focus:outline-none"
          />
          <div className="mb-4 flex flex-wrap gap-1.5">
            {EXEMPLOS.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => setObjetivo(ex)}
                className="rounded-full border border-ferro px-2.5 py-1 text-xs text-cinza transition hover:border-brasa/50 hover:text-aco"
              >
                {ex}
              </button>
            ))}
          </div>
          <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
            <label className="block">
              <span className="mb-1 block text-cinza">Seu nível</span>
              <select
                value={nivel}
                onChange={(e) => setNivel(e.target.value)}
                className="w-full rounded-lg border border-ferro bg-carvao/50 px-2 py-2 focus:border-brasa/60 focus:outline-none"
              >
                {NIVEIS_ALUNO.map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-cinza">Horas por semana</span>
              <select
                value={horas}
                onChange={(e) => setHoras(Number(e.target.value))}
                className="w-full rounded-lg border border-ferro bg-carvao/50 px-2 py-2 focus:border-brasa/60 focus:outline-none"
              >
                {HORAS.map((h) => (
                  <option key={h} value={h}>
                    {h}h
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button
            type="submit"
            disabled={!objetivoValido || criando != null || cheio || geracoes === 0 || status?.ia === false}
            className="mb-2 flex w-full items-center justify-center gap-2 rounded-lg bg-brasa px-4 py-2.5 font-medium text-tinta transition hover:bg-brasa-clara disabled:opacity-50"
          >
            {criando === "ia" ? <LoaderCircle className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {criando === "ia" ? "Montando o roteiro…" : "Gerar com IA"}
          </button>
          <button
            type="button"
            onClick={() => void criarEmBranco()}
            disabled={criando != null || cheio}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-escoria px-4 py-2.5 text-sm text-cinza transition hover:text-aco disabled:opacity-50"
          >
            <FilePlus2 className="size-4" />
            Começar em branco
          </button>

          <p className="mt-3 text-center font-mono text-xs text-fosco">
            {status?.demonstracao && <span className="mr-2 text-ouro">demo</span>}
            {limites &&
              `${roteiros?.length ?? 0}/${limites.roteiros_max} roteiros · ${
                geracoes == null ? "IA ilimitada" : `${geracoes} geração(ões) com IA no mês`
              }`}
          </p>
          {(cheio || geracoes === 0) && (
            <p className="mt-3 rounded-lg border border-brasa/40 bg-brasa/5 p-3 text-xs text-cinza">
              {cheio
                ? "Você chegou ao limite de roteiros salvos. Apague um para criar outro"
                : "As gerações com IA do mês acabaram; ainda dá para começar em branco"}
              . O plano Pro libera até 100 roteiros e IA ilimitada.{" "}
              <Link href="/planos" className="text-brasa-clara hover:underline">
                Ver planos
              </Link>
            </p>
          )}
          {erro && <p className="mt-3 rounded-lg border border-rubro/40 bg-rubro/10 p-3 text-sm text-rubro">{erro}</p>}
        </form>
      </aside>
    </div>
  );
}
