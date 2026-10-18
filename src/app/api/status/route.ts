import { iaDisponivel, modoDemonstracao } from "@/lib/servidor/supabase-usuario";

/** Se os recursos de IA estão ligados neste servidor (e se em modo demonstração). */
export async function GET() {
  return Response.json({ ia: iaDisponivel(), demonstracao: modoDemonstracao() });
}
