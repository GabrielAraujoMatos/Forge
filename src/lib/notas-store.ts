/**
 * Anotações salvas no navegador (localStorage), no mesmo formato de store
 * externa do progresso. A chave é a de chaveTopico ("trilha/topico").
 */

export type Nota = { texto: string; /** ISO 8601 */ em: string };
export type Notas = ReadonlyMap<string, Nota>;

/** Limite igual ao da tabela no Supabase. */
export const LIMITE_NOTA = 10000;

const CHAVE = "forge:anotacoes";
const VAZIO: Notas = new Map();

let notas: Notas = VAZIO;
let carregado = false;
const ouvintes = new Set<() => void>();

function ler(): Notas {
  try {
    const bruto = localStorage.getItem(CHAVE);
    return bruto ? new Map<string, Nota>(Object.entries(JSON.parse(bruto))) : VAZIO;
  } catch {
    return VAZIO;
  }
}

function avisar() {
  ouvintes.forEach((ouvinte) => ouvinte());
}

function aoMudarEmOutraAba(evento: StorageEvent) {
  if (evento.key !== CHAVE) return;
  notas = ler();
  avisar();
}

export function assinarNotas(ouvinte: () => void) {
  if (ouvintes.size === 0) window.addEventListener("storage", aoMudarEmOutraAba);
  ouvintes.add(ouvinte);
  return () => {
    ouvintes.delete(ouvinte);
    if (ouvintes.size === 0) window.removeEventListener("storage", aoMudarEmOutraAba);
  };
}

export function lerNotas(): Notas {
  if (!carregado) {
    carregado = true;
    notas = ler();
  }
  return notas;
}

export function lerNotasServidor(): Notas {
  return VAZIO;
}

export function salvarNotas(novas: Notas) {
  notas = novas;
  carregado = true;
  try {
    localStorage.setItem(CHAVE, JSON.stringify(Object.fromEntries(novas)));
  } catch {
    // Armazenamento indisponível (aba anônima, cota): mantém só em memória.
  }
  avisar();
}
