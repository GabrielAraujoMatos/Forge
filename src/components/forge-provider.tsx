"use client";

import type { User } from "@supabase/supabase-js";
import { createContext, use, useCallback, useEffect, useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { assinar, lerProgresso, lerProgressoServidor, salvarProgresso } from "@/lib/progress-store";
import { chaveTopico } from "@/lib/status";
import { getSupabase } from "@/lib/supabase";

type ForgeContexto = {
  /** false enquanto a sessão ainda está sendo verificada. */
  authPronto: boolean;
  usuario: User | null;
  /** true se as variáveis do Supabase estiverem configuradas. */
  contasAtivas: boolean;
  concluidos: ReadonlySet<string>;
  alternar: (trilha: string, topico: string) => void;
  sair: () => Promise<void>;
};

const Contexto = createContext<ForgeContexto | null>(null);

type Linha = { trilha: string; topico: string };

/** Mescla o progresso local com o da conta e sobe o que só existia no navegador. */
async function sincronizar(userId: string) {
  const supabase = getSupabase();
  if (!supabase) return;

  const { data, error } = await supabase.from("progresso").select("trilha, topico");
  if (error) {
    console.error("[forge] erro ao carregar progresso", error);
    return;
  }

  const remotos = new Set((data as Linha[]).map((l) => chaveTopico(l.trilha, l.topico)));
  const locais = lerProgresso();
  const soLocais = [...locais].filter((k) => !remotos.has(k));

  if (soLocais.length) {
    const linhas = soLocais.map((k) => {
      const [trilha, topico] = k.split("/");
      return { user_id: userId, trilha, topico };
    });
    const { error: erroEnvio } = await supabase
      .from("progresso")
      .upsert(linhas, { onConflict: "user_id,trilha,topico", ignoreDuplicates: true });
    if (erroEnvio) console.error("[forge] erro ao enviar progresso local", erroEnvio);
  }

  salvarProgresso(new Set([...remotos, ...locais]));
}

export function ForgeProvider({ children }: { children: ReactNode }) {
  const supabase = typeof window === "undefined" ? null : getSupabase();
  const contasAtivas = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const [usuario, setUsuario] = useState<User | null>(null);
  const [authPronto, setAuthPronto] = useState(!contasAtivas);
  const concluidos = useSyncExternalStore(assinar, lerProgresso, lerProgressoServidor);

  useEffect(() => {
    if (!supabase) return;
    const { data } = supabase.auth.onAuthStateChange((_evento, sessao) => {
      setUsuario(sessao?.user ?? null);
      setAuthPronto(true);
    });
    return () => data.subscription.unsubscribe();
  }, [supabase]);

  const userId = usuario?.id;
  useEffect(() => {
    if (userId) void sincronizar(userId);
  }, [userId]);

  const alternar = useCallback(
    (trilha: string, topico: string) => {
      const chave = chaveTopico(trilha, topico);
      const anterior = lerProgresso();
      const novo = new Set(anterior);
      const marcar = !novo.has(chave);
      if (marcar) novo.add(chave);
      else novo.delete(chave);
      salvarProgresso(novo);

      if (!supabase || !userId) return;
      const req = marcar
        ? supabase.from("progresso").upsert({ user_id: userId, trilha, topico })
        : supabase.from("progresso").delete().match({ user_id: userId, trilha, topico });
      void req.then(({ error }) => {
        if (!error) return;
        console.error("[forge] erro ao salvar progresso", error);
        salvarProgresso(anterior);
      });
    },
    [supabase, userId],
  );

  const sair = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    // O progresso continua salvo na conta; limpa o navegador para o próximo usuário.
    salvarProgresso(new Set());
  }, [supabase]);

  return (
    <Contexto value={{ authPronto, usuario, contasAtivas, concluidos, alternar, sair }}>
      {children}
    </Contexto>
  );
}

export function useForge() {
  const ctx = use(Contexto);
  if (!ctx) throw new Error("useForge precisa estar dentro de <ForgeProvider>");
  return ctx;
}
