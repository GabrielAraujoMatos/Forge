/**
 * Valor salvo no localStorage exposto como store externa (useSyncExternalStore),
 * no mesmo formato do progresso e das anotações.
 */
export function criarStoreLocal<T>(chave: string, vazio: T, de: (bruto: unknown) => T, para: (valor: T) => unknown = (v) => v) {
  let valor = vazio;
  let carregado = false;
  const ouvintes = new Set<() => void>();

  function ler(): T {
    try {
      const bruto = localStorage.getItem(chave);
      return bruto ? de(JSON.parse(bruto)) : vazio;
    } catch {
      return vazio;
    }
  }

  function avisar() {
    ouvintes.forEach((ouvinte) => ouvinte());
  }

  function aoMudarEmOutraAba(evento: StorageEvent) {
    if (evento.key !== chave) return;
    valor = ler();
    avisar();
  }

  return {
    assinar(ouvinte: () => void) {
      if (ouvintes.size === 0) window.addEventListener("storage", aoMudarEmOutraAba);
      ouvintes.add(ouvinte);
      return () => {
        ouvintes.delete(ouvinte);
        if (ouvintes.size === 0) window.removeEventListener("storage", aoMudarEmOutraAba);
      };
    },
    ler(): T {
      if (!carregado) {
        carregado = true;
        valor = ler();
      }
      return valor;
    },
    lerServidor: (): T => vazio,
    salvar(novo: T) {
      valor = novo;
      carregado = true;
      try {
        localStorage.setItem(chave, JSON.stringify(para(novo)));
      } catch {
        // Armazenamento indisponível (aba anônima, cota): mantém só em memória.
      }
      avisar();
    },
  };
}
