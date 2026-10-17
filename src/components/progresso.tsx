"use client";

import { progressoTrilha } from "@/lib/status";
import type { Topico } from "@/lib/types";
import { useForge } from "./forge-provider";

export function BarraProgresso({ pct, className = "" }: { pct: number; className?: string }) {
  return (
    <div
      className={`h-1.5 overflow-hidden rounded-full bg-ferro ${className}`}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="barra-calor h-full rounded-full transition-[width] duration-500" style={{ width: `${pct}%` }} />
    </div>
  );
}

export function ProgressoTrilha({ trilha, topicos }: { trilha: string; topicos: Pick<Topico, "id">[] }) {
  const { concluidos } = useForge();
  const { feitos, total, pct } = progressoTrilha(trilha, topicos, concluidos);

  return (
    <div>
      <div className="mb-1.5 flex justify-between font-mono text-xs text-cinza">
        <span>
          {feitos}/{total} forjados
        </span>
        <span className={pct > 0 ? "text-brasa-clara" : ""}>{pct}%</span>
      </div>
      <BarraProgresso pct={pct} />
    </div>
  );
}
