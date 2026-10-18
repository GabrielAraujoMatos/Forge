"use client";

import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Check,
  Eye,
  LoaderCircle,
  Lock,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getTrilha } from "@/content";
import { limparEtapas, novoIdEtapa, progressoRoteiro, TOPICOS, type Etapa, type Roteiro } from "@/lib/roteiros";
import { cabecalhosAuth, getSupabase } from "@/lib/supabase";
import { normalizar, statusTopico } from "@/lib/status";
import { NIVEIS } from "@/lib/types";
import { useForge } from "../forge-provider";
import { COR_STATUS, ICONE_STATUS } from "../legenda-status";
import { BarraProgresso } from "../progresso";
import { usePlano, useStatusIa } from "../use-plano";

const nomeNivel = Object.fromEntries(NIVEIS.map((n) => [n.id, n.nome]));
const ESPERA_SALVAR = 800;

function mover<T>(lista: T[], de: number, para: number) {
  if (para < 0 || para >= lista.length) return lista;
  const nova = [...lista];
  const [item] = nova.splice(de, 1);
  nova.splice(para, 0, item);
  return nova;
}

export function RoteiroEditor() {
  const id = useSearchParams().get("id") ?? "";
  const { usuario, authPronto } = useForge();
  const [roteiro, setRoteiro] = useState<Roteiro | null | undefined>(undefined);
  const userId = usuario?.id;

  useEffect(() => {
    if (!userId) return;
    let ativo = true;
    void getSupabase()
      ?.from("roteiros")
      .select("id, titulo, objetivo, etapas, gerado_por_ia, atualizado_em")
      .eq("id", id || "00000000-0000-0000-0000-000000000000")
      .maybeSingle()
      .then(({ data }) => {
        if (ativo) setRoteiro(data ? { ...(data as Roteiro), etapas: limparEtapas((data as Roteiro).etapas, true) } : null);
      });
    return () => {
      ativo = false;
    };
  }, [userId, id]);

  if (!authPronto || (usuario && roteiro === undefined)) {
    return <div className="h-64 animate-pulse rounded-2xl border border-ferro bg-bigorna" />;
  }
  if (!usuario || !roteiro) {
    return (
      <div className="rounded-xl border border-escoria p-8 text-center text-cinza">
        <p className="mb-4">{usuario ? "Roteiro não encontrado." : "Entre na sua conta para ver os seus roteiros."}</p>
        <Link href={usuario ? "/roteiros" : "/entrar"} className="text-brasa-clara hover:underline">
          {usuario ? "Voltar aos roteiros" : "Entrar"}
        </Link>
      </div>
    );
  }
  return <Editor inicial={roteiro} />;
}

function Editor({ inicial }: { inicial: Roteiro }) {
  const { concluidos, alternar } = useForge();
  const router = useRouter();
  const [roteiro, setRoteiro] = useState(inicial);
  const [editando, setEditando] = useState(inicial.etapas.length === 0);
  const [salvo, setSalvo] = useState<"salvo" | "salvando" | "erro">("salvo");
  const [confirmarExclusao, setConfirmarExclusao] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const pendente = useRef<Roteiro | null>(null);

  async function gravar(r: Roteiro) {
    pendente.current = null;
    setSalvo("salvando");
    const { error } = (await getSupabase()
      ?.from("roteiros")
      .update({ titulo: r.titulo.trim() || "Meu roteiro", etapas: r.etapas, atualizado_em: new Date().toISOString() })
      .eq("id", r.id)) ?? { error: null };
    if (error) console.error("[forge] erro ao salvar roteiro", error);
    if (!pendente.current) setSalvo(error ? "erro" : "salvo");
  }

  // Toda edição manual passa por aqui e é salva sozinha, como as anotações.
  function alterar(mudar: (r: Roteiro) => Roteiro) {
    setRoteiro((r) => {
      const novo = mudar(r);
      pendente.current = novo;
      clearTimeout(timer.current);
      timer.current = setTimeout(() => void gravar(novo), ESPERA_SALVAR);
      return novo;
    });
    setSalvo("salvando");
  }

  // Sair da página não pode perder a última edição.
  useEffect(
    () => () => {
      clearTimeout(timer.current);
      if (pendente.current) void gravar(pendente.current);
    },
    [],
  );

  const alterarEtapa = (i: number, mudar: (e: Etapa) => Etapa) =>
    alterar((r) => ({ ...r, etapas: r.etapas.map((e, j) => (j === i ? mudar(e) : e)) }));

  async function excluir() {
    clearTimeout(timer.current);
    pendente.current = null;
    await getSupabase()?.from("roteiros").delete().eq("id", roteiro.id);
    router.push("/roteiros");
  }

  const { feitos, total, pct } = progressoRoteiro(roteiro.etapas, concluidos);
  const noRoteiro = new Set(roteiro.etapas.flatMap((e) => e.topicos));

  return (
    <>
      <nav className="mb-6 flex items-center justify-between gap-3 font-mono text-xs text-fosco">
        <Link href="/roteiros" className="flex items-center gap-1 hover:text-aco">
          <ArrowLeft className="size-3.5" />
          roteiros
        </Link>
        <span>
          {salvo === "salvando" ? "Salvando…" : salvo === "erro" ? <span className="text-rubro">Erro ao salvar</span> : "Salvo"}
        </span>
      </nav>

      <header className="mb-8 rounded-2xl border border-ferro bg-bigorna p-6">
        {editando ? (
          <input
            value={roteiro.titulo}
            onChange={(e) => alterar((r) => ({ ...r, titulo: e.target.value.slice(0, 120) }))}
            aria-label="Título do roteiro"
            className="mb-2 w-full rounded-lg border border-ferro bg-carvao/50 px-3 py-2 font-display text-3xl font-bold uppercase tracking-wide focus:border-brasa/60 focus:outline-none"
          />
        ) : (
          <h1 className="mb-2 font-display text-4xl font-extrabold uppercase leading-none tracking-tight sm:text-5xl">
            {roteiro.titulo}
          </h1>
        )}
        {roteiro.objetivo && <p className="mb-4 text-cinza">{roteiro.objetivo}</p>}
        <div className="mb-1.5 flex justify-between font-mono text-xs text-fosco">
          <span>
            {roteiro.etapas.length} etapa(s) · {total} tópico(s)
          </span>
          <span className={pct > 0 ? "text-brasa-clara" : ""}>
            {feitos}/{total} · {pct}%
          </span>
        </div>
        <BarraProgresso pct={pct} />
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            onClick={() => setEditando((e) => !e)}
            className="flex items-center gap-1.5 rounded-md border border-escoria px-3 py-1.5 text-sm text-cinza transition hover:text-aco"
          >
            {editando ? <Eye className="size-4" /> : <Pencil className="size-4" />}
            {editando ? "Ver roteiro" : "Editar"}
          </button>
          {confirmarExclusao ? (
            <span className="flex items-center gap-2 text-sm">
              <button
                onClick={() => void excluir()}
                className="rounded-md bg-rubro px-3 py-1.5 text-white transition hover:opacity-90"
              >
                Confirmar exclusão
              </button>
              <button onClick={() => setConfirmarExclusao(false)} className="text-cinza hover:text-aco">
                Cancelar
              </button>
            </span>
          ) : (
            <button
              onClick={() => setConfirmarExclusao(true)}
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-fosco transition hover:text-rubro"
            >
              <Trash2 className="size-4" />
              Apagar
            </button>
          )}
        </div>
      </header>

      {editando && <EditorIa roteiro={roteiro} aoAtualizar={(r) => setRoteiro({ ...r, etapas: limparEtapas(r.etapas) })} />}

      {roteiro.etapas.length === 0 && !editando && (
        <p className="rounded-xl border border-dashed border-ferro p-8 text-center text-fosco">
          Este roteiro ainda não tem etapas. Clique em Editar para montar.
        </p>
      )}

      <ol className="space-y-5">
        {roteiro.etapas.map((etapa, i) => {
          const p = progressoRoteiro([etapa], concluidos);
          return (
            <li key={etapa.id} className="relative rounded-2xl border border-ferro bg-bigorna p-5">
              <div className="mb-3 flex items-start gap-3">
                <span
                  className={`grid size-9 shrink-0 place-items-center rounded-full border font-display text-lg font-bold ${
                    p.total && p.feitos === p.total ? "border-ouro/70 bg-brasa text-tinta" : "border-escoria text-cinza"
                  }`}
                >
                  {p.total && p.feitos === p.total ? <Check className="size-4" /> : i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  {editando ? (
                    <>
                      <input
                        value={etapa.titulo}
                        onChange={(e) => alterarEtapa(i, (et) => ({ ...et, titulo: e.target.value.slice(0, 120) }))}
                        aria-label={`Título da etapa ${i + 1}`}
                        className="mb-2 w-full rounded-md border border-ferro bg-carvao/50 px-2 py-1.5 font-semibold focus:border-brasa/60 focus:outline-none"
                      />
                      <input
                        value={etapa.descricao}
                        onChange={(e) => alterarEtapa(i, (et) => ({ ...et, descricao: e.target.value.slice(0, 500) }))}
                        placeholder="Descrição (opcional)"
                        aria-label={`Descrição da etapa ${i + 1}`}
                        className="w-full rounded-md border border-ferro bg-carvao/50 px-2 py-1.5 text-sm text-cinza placeholder:text-fosco focus:border-brasa/60 focus:outline-none"
                      />
                    </>
                  ) : (
                    <>
                      <h2 className="font-display text-2xl font-bold uppercase tracking-wide">{etapa.titulo}</h2>
                      {etapa.descricao && <p className="text-sm text-cinza">{etapa.descricao}</p>}
                    </>
                  )}
                </div>
                {editando ? (
                  <div className="flex shrink-0 gap-1">
                    <BotaoIcone rotulo="Subir etapa" Icone={ArrowUp} aoClicar={() => alterar((r) => ({ ...r, etapas: mover(r.etapas, i, i - 1) }))} />
                    <BotaoIcone rotulo="Descer etapa" Icone={ArrowDown} aoClicar={() => alterar((r) => ({ ...r, etapas: mover(r.etapas, i, i + 1) }))} />
                    <BotaoIcone
                      rotulo="Remover etapa"
                      Icone={Trash2}
                      perigo
                      aoClicar={() => alterar((r) => ({ ...r, etapas: r.etapas.filter((_, j) => j !== i) }))}
                    />
                  </div>
                ) : (
                  <span className="shrink-0 font-mono text-xs text-fosco">
                    {p.feitos}/{p.total}
                  </span>
                )}
              </div>

              <ul className="space-y-1.5 sm:pl-12">
                {etapa.topicos.map((chave, k) => {
                  const t = TOPICOS.get(chave);
                  if (!t) return null;
                  const trilha = getTrilha(t.trilha.slug)!;
                  const st = statusTopico(trilha.slug, t, concluidos);
                  const Icone = ICONE_STATUS[st];
                  return (
                    <li key={chave} className="flex items-center gap-2 rounded-lg border border-ferro px-3 py-2">
                      <button
                        onClick={() => alternar(trilha.slug, t.id)}
                        aria-label={st === "forjado" ? `Desmarcar ${t.titulo}` : `Marcar ${t.titulo} como forjado`}
                        className={`grid size-7 shrink-0 place-items-center rounded-md border transition ${
                          st === "forjado" ? "border-ouro/60 bg-brasa" : "border-escoria hover:border-brasa"
                        }`}
                      >
                        <Icone className={`size-3.5 ${st === "forjado" ? "text-tinta" : COR_STATUS[st]}`} />
                      </button>
                      <Link href={`/trilhas/${trilha.slug}#${t.id}`} className="min-w-0 flex-1 hover:text-brasa-clara">
                        <span className="block truncate text-sm font-medium">{t.titulo}</span>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-fosco">
                          {trilha.titulo} · {nomeNivel[t.nivel]}
                        </span>
                      </Link>
                      {editando && (
                        <span className="flex shrink-0 gap-1">
                          <BotaoIcone
                            rotulo="Subir tópico"
                            Icone={ArrowUp}
                            aoClicar={() => alterarEtapa(i, (et) => ({ ...et, topicos: mover(et.topicos, k, k - 1) }))}
                          />
                          <BotaoIcone
                            rotulo="Descer tópico"
                            Icone={ArrowDown}
                            aoClicar={() => alterarEtapa(i, (et) => ({ ...et, topicos: mover(et.topicos, k, k + 1) }))}
                          />
                          <BotaoIcone
                            rotulo="Remover tópico"
                            Icone={X}
                            perigo
                            aoClicar={() => alterarEtapa(i, (et) => ({ ...et, topicos: et.topicos.filter((x) => x !== chave) }))}
                          />
                        </span>
                      )}
                    </li>
                  );
                })}
                {editando && (
                  <li>
                    <BuscaTopico
                      excluir={noRoteiro}
                      aoEscolher={(chave) => alterarEtapa(i, (et) => ({ ...et, topicos: [...et.topicos, chave] }))}
                    />
                  </li>
                )}
              </ul>
            </li>
          );
        })}
      </ol>

      {editando && (
        <button
          onClick={() =>
            alterar((r) => ({
              ...r,
              etapas: [...r.etapas, { id: novoIdEtapa(), titulo: `Etapa ${r.etapas.length + 1}`, descricao: "", topicos: [] }],
            }))
          }
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-escoria p-4 text-sm text-cinza transition hover:border-brasa/50 hover:text-aco"
        >
          <Plus className="size-4" />
          Adicionar etapa
        </button>
      )}
    </>
  );
}

function BotaoIcone({
  rotulo,
  Icone,
  aoClicar,
  perigo,
}: {
  rotulo: string;
  Icone: typeof ArrowUp;
  aoClicar: () => void;
  perigo?: boolean;
}) {
  return (
    <button
      onClick={aoClicar}
      aria-label={rotulo}
      title={rotulo}
      className={`rounded-md p-1.5 text-fosco transition hover:bg-ferro ${perigo ? "hover:text-rubro" : "hover:text-aco"}`}
    >
      <Icone className="size-3.5" />
    </button>
  );
}

/** Busca entre todos os tópicos das trilhas para adicionar à etapa. */
function BuscaTopico({ excluir, aoEscolher }: { excluir: ReadonlySet<string>; aoEscolher: (chave: string) => void }) {
  const [termo, setTermo] = useState("");
  const busca = normalizar(termo.trim());
  const resultados = busca
    ? [...TOPICOS]
        .filter(([chave, t]) => !excluir.has(chave) && normalizar(`${t.titulo} ${t.trilha.titulo}`).includes(busca))
        .slice(0, 8)
    : [];

  return (
    <div>
      <label className="relative block">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-fosco" />
        <input
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          placeholder="Adicionar tópico: busque por nome ou trilha…"
          className="w-full rounded-lg border border-dashed border-escoria bg-transparent py-2 pl-8 pr-3 text-sm placeholder:text-fosco focus:border-brasa/60 focus:outline-none"
        />
      </label>
      {resultados.length > 0 && (
        <ul className="mt-1 overflow-hidden rounded-lg border border-ferro bg-carvao">
          {resultados.map(([chave, t]) => (
            <li key={chave}>
              <button
                onClick={() => {
                  aoEscolher(chave);
                  setTermo("");
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition hover:bg-ferro"
              >
                <Plus className="size-3.5 shrink-0 text-brasa" />
                <span className="min-w-0 flex-1 truncate">{t.titulo}</span>
                <span className="shrink-0 font-mono text-[10px] uppercase text-fosco">{t.trilha.titulo}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Editor com IA: no Pro, aplica um pedido em linguagem natural; no grátis, mostra o convite. */
function EditorIa({ roteiro, aoAtualizar }: { roteiro: Roteiro; aoAtualizar: (r: Roteiro) => void }) {
  const { situacao } = usePlano();
  const status = useStatusIa();
  const [pedido, setPedido] = useState("");
  const [aplicando, setAplicando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  if (!situacao || status?.ia === false) return null;
  if (!situacao.limites.editor_ia) {
    return (
      <div className="mb-6 flex items-start gap-3 rounded-xl border border-escoria bg-bigorna p-4 text-sm">
        <Lock className="mt-0.5 size-4 shrink-0 text-fosco" />
        <p className="text-cinza">
          <strong className="text-aco">Editor com IA</strong> é do plano Pro: peça mudanças como &quot;foque em AWS&quot; ou
          &quot;deixe em 2 meses&quot; e a IA reorganiza o roteiro.{" "}
          <Link href="/planos" className="text-brasa-clara hover:underline">
            Ver planos
          </Link>
        </p>
      </div>
    );
  }

  async function aplicar() {
    setAplicando(true);
    setErro(null);
    try {
      const res = await fetch("/api/roteiros/editar", {
        method: "POST",
        headers: await cabecalhosAuth(),
        body: JSON.stringify({ id: roteiro.id, instrucao: pedido }),
      });
      const dados = await res.json().catch(() => null);
      if (!res.ok) return setErro(dados?.mensagem ?? "Não foi possível editar o roteiro.");
      aoAtualizar(dados);
      setPedido("");
    } catch {
      setErro("Sem conexão com o servidor. Tente de novo.");
    } finally {
      setAplicando(false);
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void aplicar();
      }}
      className="mb-6 rounded-xl border border-brasa/40 bg-bigorna p-4"
    >
      <label htmlFor="pedido-ia" className="mb-2 flex items-center gap-2 text-sm font-medium">
        <Sparkles className="size-4 text-brasa" />
        Editar com IA
        {status?.demonstracao && <span className="font-mono text-xs text-ouro">demo</span>}
      </label>
      <div className="flex gap-2">
        <input
          id="pedido-ia"
          value={pedido}
          onChange={(e) => setPedido(e.target.value)}
          maxLength={1000}
          placeholder='Ex.: "troque Azure por AWS" ou "adicione Kubernetes no fim"'
          className="min-w-0 flex-1 rounded-lg border border-ferro bg-carvao/50 px-3 py-2 text-sm placeholder:text-fosco focus:border-brasa/60 focus:outline-none"
        />
        <button
          type="submit"
          disabled={pedido.trim().length < 3 || aplicando}
          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-brasa px-3 py-2 text-sm font-medium text-tinta transition hover:bg-brasa-clara disabled:opacity-50"
        >
          {aplicando ? <LoaderCircle className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
          Aplicar
        </button>
      </div>
      {erro && <p className="mt-2 text-sm text-rubro">{erro}</p>}
    </form>
  );
}
