"use client";

import { Moon, Sun } from "lucide-react";
import { useLayoutEffect, useSyncExternalStore } from "react";
import { aplicarTema, assinarTema, lerTema, lerTemaSalvo, lerTemaServidor, salvarTema } from "@/lib/tema";

export function useTema() {
  return useSyncExternalStore(assinarTema, lerTema, lerTemaServidor);
}

export function BotaoTema() {
  const tema = useTema();

  // Em dev o React remonta o <html> e limpa o atributo do script; reaplica antes
  // da pintura. Também acerta a cor da barra do navegador. Em produção não muda nada.
  useLayoutEffect(() => aplicarTema(lerTemaSalvo()), []);

  const escuro = tema === "escuro";
  const rotulo = escuro ? "Ativar tema claro" : "Ativar tema escuro";

  return (
    <button
      onClick={() => salvarTema(escuro ? "claro" : "escuro")}
      className="rounded-md p-2 text-cinza transition hover:text-aco"
      aria-label={rotulo}
      title={rotulo}
    >
      {escuro ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
