"use client";

import { Check, CloudOff, LoaderCircle, NotebookPen } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { LIMITE_NOTA } from "@/lib/notas-store";
import { chaveTopico } from "@/lib/status";
import { useForge, type DestinoNota } from "../forge-provider";

/** Tempo sem digitar até salvar. */
const ESPERA_MS = 800;

type Estado = "ocioso" | "pendente" | "salvando" | DestinoNota;

export function AnotacaoTopico({ trilha, topico }: { trilha: string; topico: string }) {
  const { notas, salvarNota, usuario } = useForge();
  const salvo = notas.get(chaveTopico(trilha, topico))?.texto ?? "";
  const [rascunho, setRascunho] = useState(salvo);
  const [base, setBase] = useState(salvo);
  const [estado, setEstado] = useState<Estado>("ocioso");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const pendente = useRef<string | null>(null);

  // Se a anotação mudar por fora (sincronização após o login, outra aba) e o
  // usuário não tiver editado nada, mostra a versão nova.
  if (salvo !== base) {
    setBase(salvo);
    if (rascunho === base) setRascunho(salvo);
  }

  function salvar(texto: string) {
    pendente.current = null;
    setEstado("salvando");
    void salvarNota(trilha, topico, texto).then((destino) => {
      // Uma resposta antiga não apaga o "Salvando…" de uma edição mais nova.
      if (pendente.current === null) setEstado(destino);
    });
  }

  function aoDigitar(texto: string) {
    setRascunho(texto);
    setEstado("pendente");
    pendente.current = texto;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => salvar(texto), ESPERA_MS);
  }

  // Fechar o painel ou trocar de tópico não pode perder o que foi digitado.
  const salvarAoSair = useRef(salvarNota);
  useEffect(() => {
    salvarAoSair.current = salvarNota;
  }, [salvarNota]);
  useEffect(
    () => () => {
      clearTimeout(timer.current);
      if (pendente.current !== null) void salvarAoSair.current(trilha, topico, pendente.current);
    },
    [trilha, topico],
  );

  return (
    <section>
      <label htmlFor="anotacao" className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-fosco">
        <NotebookPen className="size-3.5" />
        Minhas anotações
      </label>
      <textarea
        id="anotacao"
        value={rascunho}
        onChange={(e) => aoDigitar(e.target.value)}
        maxLength={LIMITE_NOTA}
        placeholder="O que você aprendeu, comandos úteis, dúvidas para pesquisar…"
        className="field-sizing-content block max-h-80 min-h-28 w-full resize-y rounded-lg border border-ferro bg-carvao/50 p-3 text-sm leading-relaxed placeholder:text-fosco focus:border-brasa/60 focus:outline-none"
      />
      <div className="mt-1.5 flex items-center justify-between gap-3 text-xs text-fosco">
        <StatusNota estado={estado} logado={Boolean(usuario)} />
        {rascunho.length > LIMITE_NOTA * 0.9 && (
          <span className="font-mono">
            {rascunho.length}/{LIMITE_NOTA}
          </span>
        )}
      </div>
    </section>
  );
}

function StatusNota({ estado, logado }: { estado: Estado; logado: boolean }) {
  switch (estado) {
    case "ocioso":
      return <span>{logado ? "Salva automaticamente na sua conta." : "Salva automaticamente neste navegador."}</span>;
    case "pendente":
    case "salvando":
      return (
        <span className="flex items-center gap-1.5">
          <LoaderCircle className="size-3.5 animate-spin" />
          Salvando…
        </span>
      );
    case "conta":
      return (
        <span className="flex items-center gap-1.5">
          <Check className="size-3.5 text-brasa" />
          Salvo na conta
        </span>
      );
    case "navegador":
      return (
        <span className="flex items-center gap-1.5">
          <Check className="size-3.5 text-brasa" />
          Salvo neste navegador · entre para guardar na conta
        </span>
      );
    case "erro":
      return (
        <span className="flex items-center gap-1.5 text-rubro">
          <CloudOff className="size-3.5" />
          Sem conexão com a conta; o texto ficou neste navegador.
        </span>
      );
  }
}
