import { Check, Flame, Snowflake } from "lucide-react";
import { STATUS, type Status } from "@/lib/types";

export const ICONE_STATUS = { frio: Snowflake, aquecendo: Flame, forjado: Check } satisfies Record<Status, unknown>;

export const COR_STATUS: Record<Status, string> = {
  frio: "text-fosco",
  aquecendo: "text-brasa",
  forjado: "text-ouro",
};

export function LegendaStatus() {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
      {STATUS.map((s) => {
        const Icone = ICONE_STATUS[s.id];
        return (
          <li key={s.id} className="flex items-center gap-2">
            <Icone className={`size-4 ${COR_STATUS[s.id]}`} />
            <span className="text-aco">{s.nome}</span>
            <span className="text-fosco">{s.descricao}</span>
          </li>
        );
      })}
    </ul>
  );
}
