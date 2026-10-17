import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cliente: SupabaseClient | null | undefined;

/**
 * Cliente do Supabase para o navegador. Retorna null no servidor ou se as
 * variáveis de ambiente não estiverem configuradas (o site funciona offline).
 */
export function getSupabase(): SupabaseClient | null {
  if (typeof window === "undefined") return null;
  if (cliente !== undefined) return cliente;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const chave = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  cliente = url && chave ? createClient(url, chave, { auth: { flowType: "pkce" } }) : null;
  return cliente;
}
