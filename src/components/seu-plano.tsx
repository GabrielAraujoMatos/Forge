"use client";

import { Sparkles } from "lucide-react";
import Link from "next/link";
import { NOME_PLANO } from "@/lib/planos";
import { useForge } from "./forge-provider";
import { usePlano } from "./use-plano";

function Uso({ rotulo, usado, limite }: { rotulo: string; usado: number; limite: number | null }) {
  return (
    <span>
      <strong className="text-aco">{limite == null ? "ilimitado" : `${usado}/${limite}`}</strong> {rotulo}
    </span>
  );
}

/** Plano atual e uso do mês. Some para quem não está logado. */
export function SeuPlano({ compacto = false }: { compacto?: boolean }) {
  const { usuario } = useForge();
  const { situacao } = usePlano();
  if (!usuario || !situacao) return null;
  const { plano, limites, uso } = situacao;

  return (
    <div
      className={`flex flex-col gap-3 rounded-xl border border-ferro bg-bigorna p-4 text-sm sm:flex-row sm:items-center ${
        compacto ? "" : "mb-10"
      }`}
    >
      <span className="flex items-center gap-2">
        <Sparkles className="size-4 text-brasa" />
        Seu plano: <strong className="text-brasa-clara">{NOME_PLANO[plano]}</strong>
      </span>
      <span className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-cinza sm:ml-auto">
        <Uso rotulo="chats no mês" usado={uso.chats ?? 0} limite={limites.chats_por_mes} />
        <Uso rotulo="questionários no mês" usado={uso.questionarios ?? 0} limite={limites.questionarios_por_mes} />
      </span>
      {compacto && plano === "gratis" && (
        <Link href="/planos" className="text-xs text-brasa-clara hover:underline">
          Ver planos
        </Link>
      )}
    </div>
  );
}
