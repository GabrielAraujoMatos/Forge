"use client";

import { Search } from "lucide-react";
import { normalizar } from "@/lib/status";
import { NIVEIS, STATUS, type Nivel, type Status, type Topico } from "@/lib/types";
import { COR_STATUS, ICONE_STATUS } from "./legenda-status";

export type EstadoFiltros = {
  busca: string;
  niveis: Nivel[];
  status: Status[];
};

export const FILTROS_VAZIOS: EstadoFiltros = { busca: "", niveis: [], status: [] };

export function combinaFiltros(topico: Topico, status: Status, filtros: EstadoFiltros) {
  if (filtros.niveis.length && !filtros.niveis.includes(topico.nivel)) return false;
  if (filtros.status.length && !filtros.status.includes(status)) return false;
  const termo = normalizar(filtros.busca.trim());
  if (!termo) return true;
  return normalizar([topico.titulo, topico.resumo, ...topico.estudar].join(" ")).includes(termo);
}

function alternarItem<T>(lista: T[], item: T) {
  return lista.includes(item) ? lista.filter((i) => i !== item) : [...lista, item];
}

function Chip({ ativo, onClick, children }: { ativo: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={ativo}
      className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition ${
        ativo ? "border-brasa bg-brasa/15 text-aco" : "border-ferro text-cinza hover:border-escoria hover:text-aco"
      }`}
    >
      {children}
    </button>
  );
}

export function Filtros({
  valor,
  aoMudar,
  placeholder = "Buscar tópico…",
  children,
}: {
  valor: EstadoFiltros;
  aoMudar: (v: EstadoFiltros) => void;
  placeholder?: string;
  children?: React.ReactNode;
}) {
  const algumAtivo = valor.busca || valor.niveis.length || valor.status.length;

  return (
    <div className="flex flex-col gap-3">
      <label className="relative block">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fosco" />
        <input
          type="search"
          value={valor.busca}
          onChange={(e) => aoMudar({ ...valor, busca: e.target.value })}
          placeholder={placeholder}
          className="w-full rounded-lg border border-ferro bg-bigorna py-2.5 pl-10 pr-3 text-sm placeholder:text-fosco focus:border-brasa/60 focus:outline-none"
        />
      </label>
      <div className="flex flex-wrap items-center gap-2">
        {children}
        {NIVEIS.map((n) => (
          <Chip key={n.id} ativo={valor.niveis.includes(n.id)} onClick={() => aoMudar({ ...valor, niveis: alternarItem(valor.niveis, n.id) })}>
            {n.nome}
          </Chip>
        ))}
        <span className="mx-1 h-4 w-px bg-ferro" />
        {STATUS.map((s) => {
          const Icone = ICONE_STATUS[s.id];
          return (
            <Chip key={s.id} ativo={valor.status.includes(s.id)} onClick={() => aoMudar({ ...valor, status: alternarItem(valor.status, s.id) })}>
              <Icone className={`size-3.5 ${COR_STATUS[s.id]}`} />
              {s.nome}
            </Chip>
          );
        })}
        {algumAtivo ? (
          <button onClick={() => aoMudar(FILTROS_VAZIOS)} className="ml-1 text-xs text-fosco underline-offset-2 hover:text-aco hover:underline">
            Limpar
          </button>
        ) : null}
      </div>
    </div>
  );
}
