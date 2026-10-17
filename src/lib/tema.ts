/**
 * Tema claro/escuro. O atributo data-tema no <html> é a fonte da verdade: o
 * script do layout aplica a escolha salva antes da primeira pintura.
 */

export type Tema = "claro" | "escuro";

export const CHAVE_TEMA = "forge:tema";
const COR_BARRA: Record<Tema, string> = { claro: "#f5f1ea", escuro: "#121212" };

/** Roda inline no <head>, antes do React, para não piscar o tema errado. */
export const SCRIPT_TEMA = `(function(){try{if(localStorage.getItem("${CHAVE_TEMA}")==="escuro")document.documentElement.setAttribute("data-tema","escuro")}catch(e){}})()`;

const ouvintes = new Set<() => void>();

export function assinarTema(ouvinte: () => void) {
  ouvintes.add(ouvinte);
  return () => {
    ouvintes.delete(ouvinte);
  };
}

export function lerTema(): Tema {
  return document.documentElement.dataset.tema === "escuro" ? "escuro" : "claro";
}

export function lerTemaServidor(): Tema {
  return "claro";
}

export function lerTemaSalvo(): Tema {
  try {
    return localStorage.getItem(CHAVE_TEMA) === "escuro" ? "escuro" : "claro";
  } catch {
    return "claro";
  }
}

export function aplicarTema(tema: Tema) {
  const raiz = document.documentElement;
  if (tema === "escuro") raiz.dataset.tema = "escuro";
  else delete raiz.dataset.tema;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", COR_BARRA[tema]);
  ouvintes.forEach((ouvinte) => ouvinte());
}

export function salvarTema(tema: Tema) {
  try {
    localStorage.setItem(CHAVE_TEMA, tema);
  } catch {
    // Armazenamento indisponível: o tema vale só até recarregar.
  }
  aplicarTema(tema);
}
