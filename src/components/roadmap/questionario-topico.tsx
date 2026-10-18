"use client";

import { Check, ClipboardCheck, LoaderCircle, LogIn, RotateCcw, Trophy, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cabecalhosAuth, getSupabase } from "@/lib/supabase";
import { useForge } from "../forge-provider";
import { restante, usePlano, useStatusIa } from "../use-plano";

type Pergunta = { enunciado: string; alternativas: string[]; correta: number; explicacao: string };

/** Acertos a partir dos quais o questionário sugere marcar como forjado. */
const NOTA_FORJAR = 0.8;

type Props = { trilha: string; topico: string; forjado: boolean };

export function QuestionarioTopico({ trilha, topico, forjado }: Props) {
  const { usuario, authPronto, contasAtivas } = useForge();
  const status = useStatusIa();
  const { situacao, recarregar } = usePlano();
  const [perguntas, setPerguntas] = useState<Pergunta[] | null>(null);
  const [demonstracao, setDemonstracao] = useState(false);
  const [atual, setAtual] = useState(0);
  const [escolhas, setEscolhas] = useState<number[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [melhor, setMelhor] = useState<{ acertos: number; total: number } | null>(null);

  const userId = usuario?.id;
  useEffect(() => {
    if (!userId) return;
    let ativo = true;
    void getSupabase()
      ?.from("questionario_resultados")
      .select("acertos, total")
      .match({ trilha, topico })
      .order("acertos", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (ativo) setMelhor(data);
      });
    return () => {
      ativo = false;
    };
  }, [userId, trilha, topico]);

  async function gerar() {
    setCarregando(true);
    setErro(null);
    try {
      const res = await fetch("/api/questionario", {
        method: "POST",
        headers: await cabecalhosAuth(),
        body: JSON.stringify({ trilha, topico }),
      });
      const dados = await res.json().catch(() => null);
      if (!res.ok) return setErro(dados?.mensagem ?? "Não foi possível gerar o questionário.");
      setPerguntas(dados.perguntas);
      setDemonstracao(Boolean(dados.demonstracao));
      setAtual(0);
      setEscolhas([]);
    } catch {
      setErro("Sem conexão com o servidor. Tente de novo.");
    } finally {
      setCarregando(false);
      recarregar();
    }
  }

  async function concluir(respostas: number[]) {
    if (!perguntas) return;
    const acertos = respostas.filter((r, i) => r === perguntas[i].correta).length;
    const total = perguntas.length;
    if (!melhor || acertos / total > melhor.acertos / melhor.total) setMelhor({ acertos, total });
    const { error } = (await getSupabase()?.from("questionario_resultados").insert({ trilha, topico, acertos, total })) ?? {};
    if (error) console.error("[forge] erro ao salvar resultado", error);
  }

  function escolher(indice: number) {
    if (escolhas[atual] !== undefined || !perguntas) return;
    const novas = [...escolhas];
    novas[atual] = indice;
    setEscolhas(novas);
    if (novas.filter((e) => e !== undefined).length === perguntas.length) void concluir(novas);
  }

  if (!contasAtivas || status?.ia === false) {
    return <Aviso>Os questionários com IA ainda não estão configurados neste servidor.</Aviso>;
  }
  if (!authPronto || !status) return <div className="m-5 h-24 animate-pulse rounded-lg bg-ferro" />;
  if (!usuario) {
    return (
      <Aviso>
        <p className="mb-3">Entre na sua conta para fazer questionários sobre este tópico.</p>
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

  const sobra = situacao ? restante(situacao.limites.questionarios_por_mes, situacao.uso.questionarios) : null;
  const esgotado = sobra === 0;

  // Tela inicial (ou depois de terminar, para gerar outro).
  if (!perguntas) {
    return (
      <div className="flex-1 overflow-y-auto p-5">
        <div className="mb-4 flex items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-escoria bg-ferro text-brasa">
            <ClipboardCheck className="size-5" />
          </span>
          <p className="text-sm text-cinza">
            A IA cria 5 perguntas de múltipla escolha sobre este tópico, com explicação de cada resposta. Acertando 4 ou
            mais, você provavelmente já pode marcar o tópico como forjado.
          </p>
        </div>
        {melhor && (
          <p className="mb-4 flex items-center gap-2 text-sm">
            <Trophy className="size-4 text-ouro" />
            Melhor resultado: {melhor.acertos}/{melhor.total}
          </p>
        )}
        <button
          onClick={() => void gerar()}
          disabled={carregando || esgotado}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-brasa px-4 py-2.5 font-medium text-tinta transition hover:bg-brasa-clara disabled:opacity-50"
        >
          {carregando ? <LoaderCircle className="size-4 animate-spin" /> : <ClipboardCheck className="size-4" />}
          {carregando ? "Gerando perguntas…" : "Gerar questionário"}
        </button>
        <p className="mt-2 text-center font-mono text-xs text-fosco">
          {status.demonstracao && <span className="mr-2 text-ouro">demo</span>}
          {situacao == null ? "" : sobra == null ? "Pro · ilimitado" : `${sobra} restante(s) neste mês`}
        </p>
        {esgotado && (
          <p className="mt-4 rounded-lg border border-brasa/40 bg-brasa/5 p-3 text-sm text-cinza">
            Você usou os questionários do mês no plano grátis. Eles renovam no início do próximo mês, e o plano Pro terá
            questionários ilimitados.{" "}
            <Link href="/planos" className="text-brasa-clara hover:underline">
              Ver planos
            </Link>
          </p>
        )}
        {erro && <p className="mt-4 rounded-lg border border-rubro/40 bg-rubro/10 p-3 text-sm text-rubro">{erro}</p>}
      </div>
    );
  }

  const respondidas = escolhas.filter((e) => e !== undefined).length;
  const terminou = respondidas === perguntas.length;

  if (terminou && atual >= perguntas.length) {
    const acertos = escolhas.filter((r, i) => r === perguntas[i].correta).length;
    const aprovado = acertos / perguntas.length >= NOTA_FORJAR;
    return (
      <div className="flex-1 overflow-y-auto p-5 text-center">
        <Trophy className={`mx-auto mb-3 size-10 ${aprovado ? "text-ouro" : "text-fosco"}`} />
        <p className="font-display text-4xl font-bold">
          {acertos}/{perguntas.length}
        </p>
        <p className="mb-5 text-sm text-cinza">
          {!aprovado
            ? "Ainda vale revisar. Releia os recursos ou pergunte ao tutor."
            : forjado
              ? "Mandou bem! Você domina este tópico."
              : "Mandou bem! Se sentir que domina o tópico, marque como forjado no botão abaixo."}
        </p>
        {demonstracao && <p className="mb-4 text-xs text-ouro">Questionário de demonstração (sem a chave da IA).</p>}
        <div className="grid gap-2">
          <button
            onClick={() => setPerguntas(null)}
            className="flex items-center justify-center gap-2 rounded-lg border border-escoria px-4 py-2.5 text-sm text-cinza transition hover:text-aco"
          >
            <RotateCcw className="size-4" />
            Voltar
          </button>
        </div>
      </div>
    );
  }

  const p = perguntas[atual];
  const escolhida = escolhas[atual];
  const respondeu = escolhida !== undefined;

  return (
    <div className="flex-1 overflow-y-auto p-5">
      <div className="mb-4 flex items-center gap-1.5" aria-label={`Pergunta ${atual + 1} de ${perguntas.length}`}>
        {perguntas.map((q, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full ${
              escolhas[i] === undefined ? (i === atual ? "bg-escoria" : "bg-ferro") : escolhas[i] === q.correta ? "bg-brasa" : "bg-rubro/70"
            }`}
          />
        ))}
      </div>
      <p className="mb-1 font-mono text-xs text-fosco">
        Pergunta {atual + 1} de {perguntas.length}
      </p>
      <p className="mb-4 font-medium">{p.enunciado}</p>
      <ul className="mb-4 space-y-2">
        {p.alternativas.map((alt, i) => {
          const certa = i === p.correta;
          const estilo = !respondeu
            ? "border-ferro hover:border-brasa/50"
            : certa
              ? "border-brasa bg-brasa/10"
              : i === escolhida
                ? "border-rubro/60 bg-rubro/10"
                : "border-ferro opacity-60";
          return (
            <li key={i}>
              <button
                onClick={() => escolher(i)}
                disabled={respondeu}
                className={`flex w-full items-start gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition ${estilo}`}
              >
                <span className="mt-0.5 font-mono text-xs text-fosco">{String.fromCharCode(65 + i)}</span>
                <span className="flex-1">{alt}</span>
                {respondeu && certa && <Check className="size-4 shrink-0 text-brasa" />}
                {respondeu && !certa && i === escolhida && <X className="size-4 shrink-0 text-rubro" />}
              </button>
            </li>
          );
        })}
      </ul>
      {respondeu && (
        <>
          <p className="mb-4 rounded-lg border border-escoria bg-ferro/50 p-3 text-sm text-cinza">{p.explicacao}</p>
          <button
            onClick={() => setAtual((a) => a + 1)}
            className="w-full rounded-lg bg-brasa px-4 py-2.5 font-medium text-tinta transition hover:bg-brasa-clara"
          >
            {atual + 1 < perguntas.length ? "Próxima" : "Ver resultado"}
          </button>
        </>
      )}
    </div>
  );
}

function Aviso({ children }: { children: React.ReactNode }) {
  return <div className="m-5 rounded-lg border border-escoria bg-ferro/60 p-4 text-sm text-cinza">{children}</div>;
}
