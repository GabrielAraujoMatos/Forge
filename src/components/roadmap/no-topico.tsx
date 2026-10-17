"use client";

import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { memo } from "react";
import { NIVEIS, type Nivel, type Status } from "@/lib/types";
import { ICONE_STATUS } from "../legenda-status";
import { ALTURA_NO, LARGURA_NO } from "./layout";

export type NoTopicoDados = {
  titulo: string;
  nivel: Nivel;
  status: Status;
  esmaecido: boolean;
  selecionado: boolean;
};

export type NoTopicoTipo = Node<NoTopicoDados, "topico">;

const estilos: Record<Status, string> = {
  frio: "border-escoria bg-bigorna text-cinza",
  aquecendo: "border-brasa/70 bg-ferro text-aco shadow-brasa",
  forjado: "border-ouro/70 bg-linear-to-br from-brasa to-rubro text-carvao shadow-forjado",
};

const iconeCor: Record<Status, string> = {
  frio: "text-fosco",
  aquecendo: "text-brasa",
  forjado: "text-carvao",
};

const nomeNivel = Object.fromEntries(NIVEIS.map((n) => [n.id, n.nome]));

function NoTopicoBase({ data }: NodeProps<NoTopicoTipo>) {
  const Icone = ICONE_STATUS[data.status];
  return (
    <div
      style={{ width: LARGURA_NO, height: ALTURA_NO }}
      className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 transition duration-300 ${estilos[data.status]} ${
        data.esmaecido ? "opacity-20" : ""
      } ${data.selecionado ? "ring-2 ring-aco ring-offset-2 ring-offset-carvao" : ""} ${
        data.status === "aquecendo" && !data.esmaecido ? "pulso-brasa" : ""
      }`}
    >
      <Handle type="target" position={Position.Top} className="size-1.5! border-0! bg-escoria!" />
      <Icone className={`size-5 shrink-0 ${iconeCor[data.status]}`} />
      <div className="min-w-0">
        <p
          className={`font-mono text-[10px] uppercase tracking-widest ${
            data.status === "forjado" ? "text-carvao/70" : "text-fosco"
          }`}
        >
          {nomeNivel[data.nivel]}
        </p>
        <p className="line-clamp-2 text-sm font-semibold leading-tight">{data.titulo}</p>
      </div>
      <Handle type="source" position={Position.Bottom} className="size-1.5! border-0! bg-escoria!" />
    </div>
  );
}

export const NoTopico = memo(NoTopicoBase);
