"use client";

import { ArrowUp, Bot, ClipboardCheck, FlaskConical, History, LogIn, MessageSquarePlus, Square, Sparkles, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { cabecalhosAuth, getSupabase } from "@/lib/supabase";
import { useForge } from "../forge-provider";
import { usePlano, useStatusIa } from "../use-plano";

type Mensagem = { papel: "usuario" | "tutor"; texto: string };
type ResumoConversa = { id: string; titulo: string; atualizada_em: string };

const ATALHOS = [
  { Icone: Sparkles, rotulo: "Explique do zero", texto: "Me explique este tópico do zero, com um exemplo prático." },
  { Icone: FlaskConical, rotulo: "Exercício prático", texto: "Me dê um exercício prático de laboratório sobre este tópico." },
  { Icone: ClipboardCheck, rotulo: "Me teste", texto: "Me teste sobre este tópico para ver se estou pronto para marcar como forjado." },
];

const CHAVE_NOTAS = "forge:tutor-notas";

async function listarConversas(trilha: string, topico: string): Promise<ResumoConversa[]> {
  const { data } = (await getSupabase()?.rpc("tutor_listar", { p_trilha: trilha, p_topico: topico })) ?? { data: null };
  return (data as ResumoConversa[] | null) ?? [];
}

export function TutorTopico({ trilha, topico }: { trilha: string; topico: string }) {
  const { usuario, authPronto, contasAtivas } = useForge();
  const status = useStatusIa();
  const { situacao, recarregar: recarregarPlano } = usePlano();
  const [conversas, setConversas] = useState<ResumoConversa[]>([]);
  const [versaoConversas, setVersaoConversas] = useState(0);
  const [conversaId, setConversaId] = useState<string | null>(null);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [entrada, setEntrada] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [verHistorico, setVerHistorico] = useState(false);
  const [incluirNotas, setIncluirNotas] = useState(() => {
    try {
      return localStorage.getItem(CHAVE_NOTAS) !== "nao";
    } catch {
      return true;
    }
  });
  const cancelar = useRef<AbortController | null>(null);
  const fim = useRef<HTMLDivElement>(null);

  const userId = usuario?.id;
  useEffect(() => {
    if (!userId) return;
    let ativo = true;
    void listarConversas(trilha, topico).then((c) => {
      if (ativo) setConversas(c);
    });
    return () => {
      ativo = false;
    };
  }, [userId, trilha, topico, versaoConversas]);

  const atualizar = useCallback(() => {
    setVersaoConversas((v) => v + 1);
    recarregarPlano();
  }, [recarregarPlano]);

  // Fechar o painel interrompe a resposta em andamento.
  useEffect(() => () => cancelar.current?.abort(), []);

  useEffect(() => {
    fim.current?.scrollIntoView({ block: "end" });
  }, [mensagens]);

  async function abrirConversa(id: string) {
    setVerHistorico(false);
    setErro(null);
    const { data } = (await getSupabase()?.rpc("tutor_abrir", { p_conversa: id }).maybeSingle<{ mensagens: Mensagem[] }>()) ?? {
      data: null,
    };
    if (!data) return setErro("Não foi possível abrir a conversa.");
    setConversaId(id);
    setMensagens(data.mensagens);
  }

  async function apagarConversa(id: string) {
    await getSupabase()?.rpc("tutor_apagar", { p_conversa: id });
    if (id === conversaId) novaConversa();
    atualizar();
  }

  function novaConversa() {
    cancelar.current?.abort();
    setConversaId(null);
    setMensagens([]);
    setErro(null);
    setVerHistorico(false);
  }

  async function enviar(texto: string) {
    const pergunta = texto.trim();
    if (!pergunta || enviando) return;
    setErro(null);
    setEntrada("");
    setEnviando(true);
    setMensagens((m) => [...m, { papel: "usuario", texto: pergunta }, { papel: "tutor", texto: "" }]);

    const controle = new AbortController();
    cancelar.current = controle;
    // Atualiza a última mensagem (a resposta do tutor) conforme o texto chega.
    const escrever = (mudar: (texto: string) => string) =>
      setMensagens((m) => [...m.slice(0, -1), { papel: "tutor", texto: mudar(m[m.length - 1].texto) }]);

    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: await cabecalhosAuth(),
        body: JSON.stringify({ conversaId, trilha, topico, pergunta, incluirNotas }),
        signal: controle.signal,
      });
      if (!res.ok || !res.body) {
        const dados = await res.json().catch(() => null);
        setMensagens((m) => m.slice(0, -2));
        setEntrada(pergunta);
        setErro(dados?.mensagem ?? "Não foi possível falar com o tutor.");
        return;
      }

      const leitor = res.body.pipeThrough(new TextDecoderStream()).getReader();
      let resto = "";
      for (;;) {
        const { value, done } = await leitor.read();
        if (done) break;
        const linhas = (resto + value).split("\n");
        resto = linhas.pop() ?? "";
        for (const linha of linhas) {
          if (!linha) continue;
          const evento = JSON.parse(linha);
          if (evento.t === "inicio") setConversaId(evento.conversaId);
          else if (evento.t === "texto") escrever((t) => t + evento.v);
          else if (evento.t === "erro") setErro(evento.mensagem);
        }
      }
    } catch (e) {
      if (!controle.signal.aborted) setErro("A conexão caiu no meio da resposta. Tente de novo.");
      console.error("[tutor]", e);
    } finally {
      setEnviando(false);
      cancelar.current = null;
      atualizar();
    }
  }

  if (!contasAtivas || status?.ia === false) {
    return <Aviso>O tutor de IA ainda não está configurado neste servidor.</Aviso>;
  }
  if (!authPronto || !status) return <div className="m-5 h-24 animate-pulse rounded-lg bg-ferro" />;
  if (!usuario) {
    return (
      <Aviso>
        <p className="mb-3">Entre na sua conta para conversar com o tutor de IA sobre este tópico.</p>
        <Link
          href="/entrar"
          className="inline-flex items-center gap-1.5 rounded-md border border-brasa/60 px-3 py-1.5 text-sm text-brasa-clara transition hover:bg-brasa hover:text-tinta"
        >
          <LogIn className="size-4" />
          Entrar
        </Link>
      </Aviso>
    );
  }

  const perguntasFeitas = mensagens.filter((m) => m.papel === "usuario").length;
  const limiteChats = situacao?.limites.chats_por_mes ?? null;
  const chatsNoMes = situacao?.uso.chats ?? 0;
  const conversaCheia = situacao != null && perguntasFeitas >= situacao.limites.perguntas_por_chat;
  const semChats = !conversaId && limiteChats != null && chatsNoMes >= limiteChats;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center gap-2 border-b border-ferro px-5 py-2 text-xs">
        <button
          onClick={() => setVerHistorico((v) => !v)}
          aria-pressed={verHistorico}
          className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-1 text-cinza transition hover:bg-ferro hover:text-aco"
        >
          <History className="size-3.5" />
          Conversas ({conversas.length})
        </button>
        <button
          onClick={novaConversa}
          className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-1 text-cinza transition hover:bg-ferro hover:text-aco"
        >
          <MessageSquarePlus className="size-3.5" />
          Nova
        </button>
        {situacao && (
          <span className="ml-auto truncate whitespace-nowrap font-mono text-fosco">
            {status.demonstracao && <span className="mr-2 text-ouro" title="Respostas simuladas: a chave da IA não está configurada">demo</span>}
            {limiteChats == null ? "Pro · ilimitado" : `${chatsNoMes}/${limiteChats} chats no mês`}
          </span>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        {verHistorico ? (
          <Historico
            conversas={conversas}
            atual={conversaId}
            plano={situacao?.plano ?? "gratis"}
            aoAbrir={abrirConversa}
            aoApagar={apagarConversa}
          />
        ) : mensagens.length === 0 ? (
          <div>
            <div className="mb-4 flex items-start gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-escoria bg-ferro text-brasa">
                <Bot className="size-5" />
              </span>
              <p className="text-sm text-cinza">
                Sou o tutor do Forge. Conheço este tópico, o seu progresso na trilha e as provas em que ele cai. Por onde
                começamos?
              </p>
            </div>
            <div className="grid gap-2">
              {ATALHOS.map(({ Icone, rotulo, texto }) => (
                <button
                  key={rotulo}
                  onClick={() => void enviar(texto)}
                  disabled={enviando || semChats}
                  className="flex items-center gap-2 rounded-lg border border-ferro bg-carvao/50 px-3 py-2.5 text-left text-sm transition hover:border-brasa/50 disabled:opacity-50"
                >
                  <Icone className="size-4 shrink-0 text-brasa" />
                  {rotulo}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {mensagens.map((m, i) =>
              m.papel === "usuario" ? (
                <p key={i} className="ml-8 whitespace-pre-wrap rounded-lg bg-ferro px-3 py-2 text-sm">
                  {m.texto}
                </p>
              ) : (
                <div key={i} className="text-sm leading-relaxed">
                  {m.texto ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={MARKDOWN}>
                      {m.texto}
                    </ReactMarkdown>
                  ) : (
                    <span className="inline-flex gap-1 py-2" aria-label="Escrevendo">
                      {[0, 150, 300].map((atraso) => (
                        <span
                          key={atraso}
                          className="size-1.5 animate-bounce rounded-full bg-brasa"
                          style={{ animationDelay: `${atraso}ms` }}
                        />
                      ))}
                    </span>
                  )}
                </div>
              ),
            )}
            <div ref={fim} />
          </div>
        )}

        {erro && <p className="mt-4 rounded-lg border border-rubro/40 bg-rubro/10 p-3 text-sm text-rubro">{erro}</p>}
        {semChats && (
          <p className="mt-4 rounded-lg border border-brasa/40 bg-brasa/5 p-3 text-sm text-cinza">
            Você usou os {limiteChats} chats do mês no plano grátis. Eles renovam no início do próximo mês, e o
            plano Pro, que vem em breve, terá chats ilimitados.
          </p>
        )}
        {conversaCheia && (
          <p className="mt-4 rounded-lg border border-escoria p-3 text-sm text-cinza">
            Esta conversa chegou ao limite de perguntas.{" "}
            <button onClick={novaConversa} className="text-brasa-clara hover:underline">
              Comece uma nova
            </button>
            .
          </p>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void enviar(entrada);
        }}
        className="border-t border-ferro p-3"
      >
        <div className="flex items-end gap-2">
          <textarea
            value={entrada}
            onChange={(e) => setEntrada(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void enviar(entrada);
              }
            }}
            disabled={semChats || conversaCheia}
            rows={1}
            maxLength={4000}
            placeholder="Pergunte ao tutor…"
            aria-label="Pergunta para o tutor"
            className="field-sizing-content block max-h-36 min-h-10 flex-1 resize-none rounded-lg border border-ferro bg-carvao/50 px-3 py-2 text-sm placeholder:text-fosco focus:border-brasa/60 focus:outline-none disabled:opacity-50"
          />
          {enviando ? (
            <button
              type="button"
              onClick={() => cancelar.current?.abort()}
              aria-label="Parar resposta"
              title="Parar"
              className="grid size-10 shrink-0 place-items-center rounded-lg border border-escoria text-cinza transition hover:text-aco"
            >
              <Square className="size-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!entrada.trim() || semChats || conversaCheia}
              aria-label="Enviar pergunta"
              className="grid size-10 shrink-0 place-items-center rounded-lg bg-brasa text-tinta transition hover:bg-brasa-clara disabled:opacity-40"
            >
              <ArrowUp className="size-4" />
            </button>
          )}
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[11px] text-fosco">
          <label className="flex cursor-pointer items-center gap-1.5">
            <input
              type="checkbox"
              checked={incluirNotas}
              onChange={(e) => {
                setIncluirNotas(e.target.checked);
                try {
                  localStorage.setItem(CHAVE_NOTAS, e.target.checked ? "sim" : "nao");
                } catch {
                  // Sem armazenamento: vale só nesta sessão.
                }
              }}
              className="accent-brasa"
            />
            Usar minhas anotações
          </label>
          <span>A IA pode errar. Não cole senhas ou chaves.</span>
        </div>
      </form>
    </div>
  );
}

function Aviso({ children }: { children: React.ReactNode }) {
  return <div className="m-5 rounded-lg border border-escoria bg-ferro/60 p-4 text-sm text-cinza">{children}</div>;
}

const formatoData = new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

function Historico({
  conversas,
  atual,
  plano,
  aoAbrir,
  aoApagar,
}: {
  conversas: ResumoConversa[];
  atual: string | null;
  plano: "gratis" | "pro";
  aoAbrir: (id: string) => void;
  aoApagar: (id: string) => void;
}) {
  if (!conversas.length) return <p className="text-sm text-fosco">Nenhuma conversa sobre este tópico ainda.</p>;
  return (
    <div>
      <ul className="space-y-2">
        {conversas.map((c) => (
          <li key={c.id} className="flex items-center gap-2">
            <button
              onClick={() => aoAbrir(c.id)}
              className={`min-w-0 flex-1 rounded-lg border px-3 py-2 text-left transition hover:border-brasa/50 ${
                c.id === atual ? "border-brasa/60" : "border-ferro"
              }`}
            >
              <span className="block truncate text-sm">{c.titulo}</span>
              <span className="font-mono text-[10px] text-fosco">{formatoData.format(new Date(c.atualizada_em))}</span>
            </button>
            <button
              onClick={() => aoApagar(c.id)}
              aria-label={`Apagar a conversa ${c.titulo}`}
              title="Apagar"
              className="rounded-md p-2 text-fosco transition hover:bg-ferro hover:text-rubro"
            >
              <Trash2 className="size-4" />
            </button>
          </li>
        ))}
      </ul>
      {plano === "gratis" && (
        <p className="mt-3 text-xs text-fosco">No plano grátis aparecem as últimas conversas de cada tópico.</p>
      )}
    </div>
  );
}

// O react-markdown passa o nó da árvore em "node"; ele não pode ir para o DOM.
function semNo<T extends { node?: unknown }>(props: T): Omit<T, "node"> {
  const resto = { ...props };
  delete resto.node;
  return resto;
}

// Estilos do Markdown das respostas, no visual do site.
const MARKDOWN: Components = {
  p: (props) => <p className="mb-3 last:mb-0" {...semNo(props)} />,
  ul: (props) => <ul className="mb-3 list-disc space-y-1 pl-5" {...semNo(props)} />,
  ol: (props) => <ol className="mb-3 list-decimal space-y-1 pl-5" {...semNo(props)} />,
  h1: (props) => <h4 className="mb-2 mt-4 font-display text-lg font-bold uppercase tracking-wide" {...semNo(props)} />,
  h2: (props) => <h4 className="mb-2 mt-4 font-display text-lg font-bold uppercase tracking-wide" {...semNo(props)} />,
  h3: (props) => <h5 className="mb-2 mt-3 font-semibold" {...semNo(props)} />,
  strong: (props) => <strong className="font-semibold text-aco" {...semNo(props)} />,
  a: (props) => <a className="text-brasa-clara underline" target="_blank" rel="noopener noreferrer" {...semNo(props)} />,
  blockquote: (props) => <blockquote className="mb-3 border-l-2 border-brasa/60 pl-3 text-cinza" {...semNo(props)} />,
  pre: (props) => (
    <pre className="mb-3 overflow-x-auto rounded-lg border border-ferro bg-carvao p-3 font-mono text-xs leading-relaxed" {...semNo(props)} />
  ),
  code: ({ className, ...props }) =>
    className ? (
      <code className={className} {...semNo(props)} />
    ) : (
      <code className="rounded bg-ferro px-1 py-0.5 font-mono text-[0.85em]" {...semNo(props)} />
    ),
  table: (props) => (
    <div className="mb-3 overflow-x-auto">
      <table className="w-full border-collapse text-xs" {...semNo(props)} />
    </div>
  ),
  th: (props) => <th className="border border-ferro px-2 py-1 text-left font-semibold" {...semNo(props)} />,
  td: (props) => <td className="border border-ferro px-2 py-1" {...semNo(props)} />,
};
