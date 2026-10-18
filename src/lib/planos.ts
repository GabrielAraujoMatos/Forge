/**
 * Planos do Forge. Os números dos limites ficam no banco (tabela
 * planos_limites), que é quem os aplica; aqui fica a comparação mostrada na
 * página de planos.
 */

export type Plano = "gratis" | "pro";

/** Linha de planos_limites. null = ilimitado. */
export type LimitesPlano = {
  plano: Plano;
  chats_por_mes: number | null;
  perguntas_por_chat: number;
  perguntas_por_dia: number;
  historico_por_topico: number | null;
  questionarios_por_mes: number | null;
  roteiros_max: number;
  conteudos_ia_por_mes: number | null;
  editor_ia: boolean;
};

export const NOME_PLANO: Record<Plano, string> = { gratis: "Grátis", pro: "Pro" };

/** Comparação dos planos. "disponivel" marca o que já existe no app. */
export const RECURSOS_PLANOS: { recurso: string; gratis: string; pro: string; disponivel: boolean }[] = [
  { recurso: "Trilhas, mapas e progresso", gratis: "Completo", pro: "Completo", disponivel: true },
  { recurso: "Anotações, ritmo e certificações", gratis: "Completo", pro: "Completo", disponivel: true },
  { recurso: "Chats com o tutor de IA", gratis: "20 por mês", pro: "Ilimitados", disponivel: true },
  { recurso: "Histórico de chats", gratis: "Últimos 3 por tópico", pro: "Completo", disponivel: true },
  { recurso: "Questionários com IA", gratis: "2 por mês", pro: "Ilimitados", disponivel: true },
  { recurso: "Roteiros gerados com IA", gratis: "2 por mês", pro: "Ilimitados", disponivel: true },
  { recurso: "Roteiros personalizados salvos", gratis: "3", pro: "Até 100", disponivel: true },
  { recurso: "Editor de roteiros", gratis: "Básico (manual)", pro: "Com IA", disponivel: true },
  { recurso: "Cursos e guias com IA", gratis: "Dentro das 2 gerações do mês", pro: "Ilimitados", disponivel: false },
  { recurso: "Lições do curso de IA", gratis: "5", pro: "Ilimitadas", disponivel: false },
  { recurso: "Pacotes de aulas", gratis: "Limitados", pro: "Todos desbloqueados", disponivel: false },
];

const doisDigitos = (n: number) => String(n).padStart(2, "0");

/** Mês de contagem do uso, em UTC como no banco ("AAAA-MM"). */
export function periodoMes(data = new Date()) {
  return `${data.getUTCFullYear()}-${doisDigitos(data.getUTCMonth() + 1)}`;
}
