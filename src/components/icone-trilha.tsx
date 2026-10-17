import { Cloud, Infinity as InfinityIcon, Network, Server, Terminal } from "lucide-react";
import type { Trilha } from "@/lib/types";

const icones = {
  terminal: Terminal,
  network: Network,
  server: Server,
  cloud: Cloud,
  infinity: InfinityIcon,
} satisfies Record<Trilha["icone"], unknown>;

export function IconeTrilha({ icone, className }: { icone: Trilha["icone"]; className?: string }) {
  const Icone = icones[icone];
  return <Icone className={className} />;
}
