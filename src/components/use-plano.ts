"use client";

import { useCallback, useEffect, useState } from "react";
import { periodoMes, type LimitesPlano, type Plano } from "@/lib/planos";
import { getSupabase } from "@/lib/supabase";
import { useForge } from "./forge-provider";

export type SituacaoPlano = {
  plano: Plano;
  limites: LimitesPlano;
  /** Uso do mês por recurso ("chats", "questionarios"...). */
  uso: Record<string, number>;
};

async function buscar(): Promise<SituacaoPlano | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const [assinatura, limites, uso] = await Promise.all([
    supabase.from("assinaturas").select("plano").maybeSingle(),
    supabase.from("planos_limites").select("*"),
    supabase.from("uso").select("recurso, quantidade").eq("periodo", periodoMes()),
  ]);
  if (limites.error || !limites.data) return null;
  const plano: Plano = assinatura.data?.plano === "pro" ? "pro" : "gratis";
  return {
    plano,
    limites: (limites.data as LimitesPlano[]).find((l) => l.plano === plano)!,
    uso: Object.fromEntries((uso.data ?? []).map((l: { recurso: string; quantidade: number }) => [l.recurso, l.quantidade])),
  };
}

/** Plano, limites e uso do mês do usuário logado (lidos com o RLS dele). */
export function usePlano() {
  const { usuario } = useForge();
  const [situacao, setSituacao] = useState<SituacaoPlano | null>(null);
  const [versao, setVersao] = useState(0);
  const userId = usuario?.id;

  useEffect(() => {
    if (!userId) return;
    let ativo = true;
    void buscar().then((s) => {
      if (ativo) setSituacao(s);
    });
    return () => {
      ativo = false;
    };
  }, [userId, versao]);

  const recarregar = useCallback(() => setVersao((v) => v + 1), []);
  return { situacao: userId ? situacao : null, recarregar };
}

/** Quanto ainda resta de um recurso no mês; null = ilimitado. */
export function restante(limite: number | null, usado = 0) {
  return limite == null ? null : Math.max(0, limite - usado);
}

type StatusIa = { ia: boolean; demonstracao: boolean };
let statusIa: Promise<StatusIa> | null = null;

/** Se a IA está ligada no servidor; null enquanto carrega. Busca uma vez por página. */
export function useStatusIa() {
  const [status, setStatus] = useState<StatusIa | null>(null);
  useEffect(() => {
    let ativo = true;
    statusIa ??= fetch("/api/status")
      .then((r) => r.json() as Promise<StatusIa>)
      .catch(() => ({ ia: false, demonstracao: false }));
    void statusIa.then((s) => {
      if (ativo) setStatus(s);
    });
    return () => {
      ativo = false;
    };
  }, []);
  return status;
}
