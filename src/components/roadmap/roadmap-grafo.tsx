"use client";

import { Background, BackgroundVariant, Controls, ReactFlow, type Edge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useMemo } from "react";
import type { Status, Topico } from "@/lib/types";
import { calcularLayout } from "./layout";
import { NoTopico, type NoTopicoTipo } from "./no-topico";

const tiposNo = { topico: NoTopico };

type Props = {
  topicos: Topico[];
  status: Map<string, Status>;
  visiveis: Set<string>;
  selecionado: string | null;
  aoSelecionar: (id: string) => void;
};

export function RoadmapGrafo({ topicos, status, visiveis, selecionado, aoSelecionar }: Props) {
  const posicoes = useMemo(() => calcularLayout(topicos), [topicos]);
  // A visão inicial enquadra o nível básico; o resto do mapa fica a um scroll.
  const enquadrar = useMemo(
    () => topicos.filter((t) => t.nivel === "basico").map((t) => ({ id: t.id })),
    [topicos],
  );

  const nos = useMemo<NoTopicoTipo[]>(
    () =>
      topicos.map((t) => ({
        id: t.id,
        type: "topico",
        position: posicoes.get(t.id)!,
        data: {
          titulo: t.titulo,
          nivel: t.nivel,
          status: status.get(t.id) ?? "frio",
          esmaecido: !visiveis.has(t.id),
          selecionado: selecionado === t.id,
        },
      })),
    [topicos, posicoes, status, visiveis, selecionado],
  );

  const arestas = useMemo<Edge[]>(
    () =>
      topicos.flatMap((t) =>
        t.requisitos.map((r) => {
          const quente = status.get(r) === "forjado";
          const visivel = visiveis.has(r) && visiveis.has(t.id);
          return {
            id: `${r}->${t.id}`,
            source: r,
            target: t.id,
            type: "smoothstep",
            animated: quente && status.get(t.id) !== "forjado",
            style: {
              stroke: quente ? "var(--color-brasa)" : "var(--color-escoria)",
              strokeWidth: quente ? 2 : 1.5,
              opacity: visivel ? 1 : 0.15,
            },
          };
        }),
      ),
    [topicos, status, visiveis],
  );

  return (
    <ReactFlow
      nodes={nos}
      edges={arestas}
      nodeTypes={tiposNo}
      onNodeClick={(_, no) => aoSelecionar(no.id)}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={false}
      fitView
      fitViewOptions={{ nodes: enquadrar, padding: 0.15, maxZoom: 1 }}
      minZoom={0.25}
      maxZoom={1.5}
      colorMode="dark"
    >
      <Background variant={BackgroundVariant.Dots} gap={22} size={1} color="#2a2724" />
      <Controls showInteractive={false} />
    </ReactFlow>
  );
}
