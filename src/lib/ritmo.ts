import { useSyncExternalStore } from "react";
import { criarStoreLocal } from "./store-local";

/** O que a pessoa fez num dia. Os dias são "AAAA-MM-DD" no fuso dela. */
export type Dia = { forjados: number; anotou: boolean };
export type Atividade = ReadonlyMap<string, Dia>;

export const DIA_VAZIO: Dia = { forjados: 0, anotou: false };

export const META_PADRAO = 3;
export const META_MIN = 1;
export const META_MAX = 10;

export const limitarMeta = (n: number) => Math.min(META_MAX, Math.max(META_MIN, Math.round(n)));

export const atividadeStore = criarStoreLocal<Atividade>(
  "forge:atividade",
  new Map(),
  (bruto) => new Map(Object.entries(bruto as Record<string, Dia>)),
  (valor) => Object.fromEntries(valor),
);

export const metaStore = criarStoreLocal<number>("forge:meta", META_PADRAO, (bruto) =>
  typeof bruto === "number" ? limitarMeta(bruto) : META_PADRAO,
);

/** Último tópico aberto neste aparelho, para o "continue de onde parou". */
export type Ultimo = { trilha: string; topico: string } | null;
export const ultimoStore = criarStoreLocal<Ultimo>("forge:ultimo", null, (bruto) => bruto as Ultimo);

const doisDigitos = (n: number) => String(n).padStart(2, "0");

export function diaLocal(data = new Date()) {
  return `${data.getFullYear()}-${doisDigitos(data.getMonth() + 1)}-${doisDigitos(data.getDate())}`;
}

export function dataDoDia(dia: string) {
  const [a, m, d] = dia.split("-").map(Number);
  return new Date(a, m - 1, d);
}

export function somarDias(dia: string, n: number) {
  const data = dataDoDia(dia);
  data.setDate(data.getDate() + n);
  return diaLocal(data);
}

export const diaAtivo = (d: Dia | undefined) => Boolean(d && (d.forjados > 0 || d.anotou));

/** Dias seguidos com atividade. Hoje ainda sem atividade não quebra a sequência. */
export function sequenciaAtual(atividade: Atividade, hoje: string) {
  let dia = diaAtivo(atividade.get(hoje)) ? hoje : somarDias(hoje, -1);
  let n = 0;
  while (diaAtivo(atividade.get(dia))) {
    n++;
    dia = somarDias(dia, -1);
  }
  return n;
}

export function maiorSequencia(atividade: Atividade) {
  const dias = [...atividade].filter(([, d]) => diaAtivo(d)).map(([dia]) => dia).sort();
  let maior = 0;
  let atual = 0;
  let anterior: string | null = null;
  for (const dia of dias) {
    atual = anterior && somarDias(anterior, 1) === dia ? atual + 1 : 1;
    maior = Math.max(maior, atual);
    anterior = dia;
  }
  return maior;
}

/** A semana começa na segunda-feira. */
export function inicioSemana(dia: string) {
  return somarDias(dia, -((dataDoDia(dia).getDay() + 6) % 7));
}

export function forjadosNaSemana(atividade: Atividade, hoje: string) {
  let n = 0;
  // "AAAA-MM-DD" pode ser comparado como texto.
  for (let dia = inicioSemana(hoje); dia <= hoje; dia = somarDias(dia, 1)) n += atividade.get(dia)?.forjados ?? 0;
  return n;
}

const nada = () => () => {};

/**
 * Dia de hoje no fuso do navegador, ou null no servidor e na hidratação: as
 * páginas são pré-renderizadas no build, então a data só existe no cliente.
 */
export function useHoje() {
  return useSyncExternalStore(nada, diaLocal, () => null);
}
