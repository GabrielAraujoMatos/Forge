"use client";

import type { User } from "@supabase/supabase-js";
import { createContext, use, useCallback, useEffect, useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { assinarNotas, lerNotas, lerNotasServidor, salvarNotas, type Nota, type Notas } from "@/lib/notas-store";
import {
  atividadeStore,
  DIA_VAZIO,
  diaLocal,
  limitarMeta,
  META_PADRAO,
  metaStore,
  ultimoStore,
  type Atividade,
  type Dia,
} from "@/lib/ritmo";
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
  notas: Notas;
  atividade: Atividade;
  meta: number;
  definirMeta: (meta: number) => void;
  /** Salva no navegador e, com login, na conta. Texto vazio apaga a anotação. */
  salvarNota: (trilha: string, topico: string, texto: string) => Promise<DestinoNota>;
  sair: () => Promise<void>;
};

/** Onde a anotação ficou salva, para o painel avisar o usuário. */
export type DestinoNota = "navegador" | "conta" | "erro";

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

type LinhaNota = Linha & { texto: string; atualizado_em: string };

/** Mescla as anotações locais com as da conta; em conflito, vale a mais recente. */
async function sincronizarNotas(userId: string) {
  const supabase = getSupabase();
  if (!supabase) return;

  const { data, error } = await supabase.from("anotacoes").select("trilha, topico, texto, atualizado_em");
  if (error) {
    console.error("[forge] erro ao carregar anotações", error);
    return;
  }

  const mescladas = new Map<string, Nota>(
    (data as LinhaNota[]).map((l) => [chaveTopico(l.trilha, l.topico), { texto: l.texto, em: l.atualizado_em }]),
  );
  const envios: LinhaNota[] = [];
  for (const [chave, local] of lerNotas()) {
    const remota = mescladas.get(chave);
    if (remota && Date.parse(remota.em) >= Date.parse(local.em)) continue;
    mescladas.set(chave, local);
    const [trilha, topico] = chave.split("/");
    envios.push({ trilha, topico, texto: local.texto, atualizado_em: local.em });
  }

  if (envios.length) {
    const linhas = envios.map((l) => ({ user_id: userId, ...l }));
    const { error: erroEnvio } = await supabase.from("anotacoes").upsert(linhas, { onConflict: "user_id,trilha,topico" });
    if (erroEnvio) console.error("[forge] erro ao enviar anotações locais", erroEnvio);
  }

  salvarNotas(mescladas);
}

type LinhaDia = Dia & { dia: string };

/**
 * Mescla a atividade local com a da conta. Os dias anteriores à tabela de
 * atividade vêm das datas do progresso. Por dia vale o maior número de
 * tópicos forjados, então dois aparelhos no mesmo dia não somam.
 */
async function sincronizarAtividade(userId: string) {
  const supabase = getSupabase();
  if (!supabase) return;

  const [atividade, progresso, preferencias] = await Promise.all([
    supabase.from("atividade").select("dia, forjados, anotou"),
    supabase.from("progresso").select("concluido_em"),
    supabase.from("preferencias").select("meta_semanal").maybeSingle(),
  ]);
  if (atividade.error || progresso.error || preferencias.error) {
    console.error("[forge] erro ao carregar atividade", atividade.error ?? progresso.error ?? preferencias.error);
    return;
  }

  const remota = new Map((atividade.data as LinhaDia[]).map(({ dia, ...d }) => [dia, d]));
  const historico = new Map<string, number>();
  for (const { concluido_em } of progresso.data as { concluido_em: string }[]) {
    const dia = diaLocal(new Date(concluido_em));
    historico.set(dia, (historico.get(dia) ?? 0) + 1);
  }

  const local = atividadeStore.ler();
  const mesclada = new Map<string, Dia>();
  const envios: LinhaDia[] = [];
  for (const dia of new Set([...remota.keys(), ...local.keys(), ...historico.keys()])) {
    const r = remota.get(dia);
    const l = local.get(dia);
    const d = {
      forjados: Math.max(r?.forjados ?? 0, l?.forjados ?? 0, historico.get(dia) ?? 0),
      anotou: Boolean(r?.anotou || l?.anotou),
    };
    mesclada.set(dia, d);
    if (!r || r.forjados !== d.forjados || r.anotou !== d.anotou) envios.push({ dia, ...d });
  }

  if (envios.length) {
    const linhas = envios.map((l) => ({ user_id: userId, ...l }));
    const { error } = await supabase.from("atividade").upsert(linhas, { onConflict: "user_id,dia" });
    if (error) console.error("[forge] erro ao enviar atividade local", error);
  }
  atividadeStore.salvar(mesclada);

  // A meta da conta vale mais que a do navegador; sem meta na conta, sobe a local.
  if (preferencias.data) metaStore.salvar(limitarMeta(preferencias.data.meta_semanal));
  else if (metaStore.ler() !== META_PADRAO)
    await supabase.from("preferencias").upsert({ user_id: userId, meta_semanal: metaStore.ler() });
}

export function ForgeProvider({ children }: { children: ReactNode }) {
  const supabase = typeof window === "undefined" ? null : getSupabase();
  const contasAtivas = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const [usuario, setUsuario] = useState<User | null>(null);
  const [authPronto, setAuthPronto] = useState(!contasAtivas);
  const concluidos = useSyncExternalStore(assinar, lerProgresso, lerProgressoServidor);
  const notas = useSyncExternalStore(assinarNotas, lerNotas, lerNotasServidor);
  const atividade = useSyncExternalStore(atividadeStore.assinar, atividadeStore.ler, atividadeStore.lerServidor);
  const meta = useSyncExternalStore(metaStore.assinar, metaStore.ler, metaStore.lerServidor);

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
    if (!userId) return;
    void sincronizar(userId);
    void sincronizarNotas(userId);
    void sincronizarAtividade(userId);
  }, [userId]);

  /** Atualiza o dia de hoje no navegador e na conta. */
  const registrarHoje = useCallback(
    (mudar: (d: Dia) => Dia) => {
      const hoje = diaLocal();
      const novo = new Map(atividadeStore.ler());
      const dia = mudar(novo.get(hoje) ?? DIA_VAZIO);
      novo.set(hoje, dia);
      atividadeStore.salvar(novo);

      if (!supabase || !userId) return;
      void supabase
        .from("atividade")
        .upsert({ user_id: userId, dia: hoje, ...dia })
        .then(({ error }) => {
          if (error) console.error("[forge] erro ao salvar atividade", error);
        });
    },
    [supabase, userId],
  );

  const alternar = useCallback(
    (trilha: string, topico: string) => {
      const chave = chaveTopico(trilha, topico);
      const anterior = lerProgresso();
      const novo = new Set(anterior);
      const marcar = !novo.has(chave);
      if (marcar) novo.add(chave);
      else novo.delete(chave);
      salvarProgresso(novo);
      registrarHoje((d) => ({ ...d, forjados: marcar ? d.forjados + 1 : Math.max(0, d.forjados - 1) }));

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
    [supabase, userId, registrarHoje],
  );

  const salvarNota = useCallback(
    async (trilha: string, topico: string, texto: string): Promise<DestinoNota> => {
      const chave = chaveTopico(trilha, topico);
      const limpo = texto.trim() ? texto : "";
      const novas = new Map(lerNotas());
      const em = new Date().toISOString();
      if (limpo) novas.set(chave, { texto: limpo, em });
      else novas.delete(chave);
      salvarNotas(novas);
      if (limpo && !atividadeStore.ler().get(diaLocal())?.anotou) registrarHoje((d) => ({ ...d, anotou: true }));

      if (!supabase || !userId) return "navegador";
      // Diferente do progresso, não desfaz o local em caso de erro: o texto
      // continua no navegador e sobe na próxima sincronização.
      const { error } = limpo
        ? await supabase.from("anotacoes").upsert({ user_id: userId, trilha, topico, texto: limpo, atualizado_em: em })
        : await supabase.from("anotacoes").delete().match({ user_id: userId, trilha, topico });
      if (!error) return "conta";
      console.error("[forge] erro ao salvar anotação", error);
      return "erro";
    },
    [supabase, userId, registrarHoje],
  );

  const definirMeta = useCallback(
    (valor: number) => {
      const meta = limitarMeta(valor);
      metaStore.salvar(meta);
      if (!supabase || !userId) return;
      void supabase
        .from("preferencias")
        .upsert({ user_id: userId, meta_semanal: meta })
        .then(({ error }) => {
          if (error) console.error("[forge] erro ao salvar meta", error);
        });
    },
    [supabase, userId],
  );

  const sair = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    // O progresso e as anotações continuam salvos na conta; limpa o navegador para o próximo usuário.
    salvarProgresso(new Set());
    salvarNotas(new Map());
    atividadeStore.salvar(new Map());
    metaStore.salvar(META_PADRAO);
    ultimoStore.salvar(null);
  }, [supabase]);

  return (
    <Contexto value={{ authPronto, usuario, contasAtivas, concluidos, alternar, notas, salvarNota, atividade, meta, definirMeta, sair }}>
      {children}
    </Contexto>
  );
}

export function useForge() {
  const ctx = use(Contexto);
  if (!ctx) throw new Error("useForge precisa estar dentro de <ForgeProvider>");
  return ctx;
}
