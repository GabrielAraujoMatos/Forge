/**
 * Progresso salvo no navegador (localStorage), exposto como uma store externa
 * para ser lida com useSyncExternalStore sem problemas de hidratação.
 */

const CHAVE = "forge:progresso";
const VAZIO: ReadonlySet<string> = new Set();

let concluidos: ReadonlySet<string> = VAZIO;
let carregado = false;
const ouvintes = new Set<() => void>();

function ler(): ReadonlySet<string> {
  try {
    const bruto = localStorage.getItem(CHAVE);
    return bruto ? new Set<string>(JSON.parse(bruto)) : VAZIO;
  } catch {
    return VAZIO;
  }
}

function avisar() {
  ouvintes.forEach((ouvinte) => ouvinte());
}

function aoMudarEmOutraAba(evento: StorageEvent) {
  if (evento.key !== CHAVE) return;
  concluidos = ler();
  avisar();
}

export function assinar(ouvinte: () => void) {
  if (ouvintes.size === 0) window.addEventListener("storage", aoMudarEmOutraAba);
  ouvintes.add(ouvinte);
  return () => {
    ouvintes.delete(ouvinte);
    if (ouvintes.size === 0) window.removeEventListener("storage", aoMudarEmOutraAba);
  };
}

export function lerProgresso(): ReadonlySet<string> {
  if (!carregado) {
    carregado = true;
    concluidos = ler();
  }
  return concluidos;
}

export function lerProgressoServidor(): ReadonlySet<string> {
  return VAZIO;
}

export function salvarProgresso(novo: ReadonlySet<string>) {
  concluidos = novo;
  carregado = true;
  try {
    localStorage.setItem(CHAVE, JSON.stringify([...novo]));
  } catch {
    // Armazenamento indisponível (aba anônima, cota): mantém só em memória.
  }
  avisar();
}
