export type Nivel = "basico" | "intermediario" | "avancado";

export type TipoRecurso = "doc" | "artigo" | "curso" | "video" | "pratica";

export type Recurso = {
  titulo: string;
  url: string;
  tipo: TipoRecurso;
};

export type Topico = {
  id: string;
  titulo: string;
  nivel: Nivel;
  resumo: string;
  /** O que estudar dentro do tópico. */
  estudar: string[];
  /** IDs dos tópicos que devem vir antes (desbloqueio sugerido). */
  requisitos: string[];
  recursos: Recurso[];
};

export type Trilha = {
  slug: string;
  titulo: string;
  descricao: string;
  /** Nome de um ícone do lucide-react. */
  icone: "terminal" | "network" | "server" | "cloud" | "infinity";
  topicos: Topico[];
};

/** Estado de um tópico para o usuário. */
export type Status = "frio" | "aquecendo" | "forjado";

export const NIVEIS: { id: Nivel; nome: string }[] = [
  { id: "basico", nome: "Básico" },
  { id: "intermediario", nome: "Intermediário" },
  { id: "avancado", nome: "Avançado" },
];

export const STATUS: { id: Status; nome: string; descricao: string }[] = [
  { id: "frio", nome: "Frio", descricao: "Pré-requisitos pendentes" },
  { id: "aquecendo", nome: "Aquecendo", descricao: "Pronto para estudar" },
  { id: "forjado", nome: "Forjado", descricao: "Concluído" },
];

export const TIPOS_RECURSO: Record<TipoRecurso, string> = {
  doc: "Documentação",
  artigo: "Artigo",
  curso: "Curso",
  video: "Vídeo",
  pratica: "Prática",
};
