"use client";

import { Anvil, Loader, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { useForge } from "./forge-provider";

const traducoes: Record<string, string> = {
  "Invalid login credentials": "E-mail ou senha incorretos.",
  "User already registered": "Este e-mail já tem uma conta. Tente entrar.",
  "Email not confirmed": "Confirme seu e-mail antes de entrar (veja sua caixa de entrada).",
  "Password should be at least 6 characters.": "A senha precisa ter pelo menos 6 caracteres.",
  "Unsupported provider: provider is not enabled": "O login com GitHub ainda não foi ativado no Supabase.",
};

function traduzir(mensagem: string) {
  return traducoes[mensagem] ?? mensagem;
}

function IconeGithub({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.56-.29-5.25-1.28-5.25-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.39-5.27 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

export function LoginForm() {
  const router = useRouter();
  const { usuario, authPronto, contasAtivas } = useForge();
  const [modo, setModo] = useState<"entrar" | "criar">("entrar");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  if (!contasAtivas) {
    return <p className="text-cinza">As contas ainda não estão configuradas neste ambiente.</p>;
  }

  if (authPronto && usuario) {
    return (
      <div className="text-center">
        <p className="mb-4 text-cinza">
          Você está conectado como <strong className="text-aco">{usuario.email}</strong>.
        </p>
        <Link href="/" className="text-brasa-clara hover:underline">
          Voltar para as trilhas
        </Link>
      </div>
    );
  }

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    const supabase = getSupabase();
    if (!supabase) return;
    setEnviando(true);
    setErro(null);
    setAviso(null);

    if (modo === "entrar") {
      const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
      setEnviando(false);
      if (error) return setErro(traduzir(error.message));
      router.push("/");
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: senha,
        options: { emailRedirectTo: window.location.origin },
      });
      setEnviando(false);
      if (error) return setErro(traduzir(error.message));
      if (data.session) router.push("/");
      else setAviso("Conta criada! Enviamos um link de confirmação para o seu e-mail.");
    }
  }

  async function entrarComGithub() {
    const supabase = getSupabase();
    if (!supabase) return;
    setErro(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: window.location.origin },
    });
    if (error) setErro(traduzir(error.message));
  }

  return (
    <div>
      <div className="mb-8 text-center">
        <Anvil className="mx-auto mb-3 size-10 text-brasa" />
        <h1 className="font-display text-4xl font-extrabold uppercase tracking-tight">
          {modo === "entrar" ? "Entrar na forja" : "Criar conta"}
        </h1>
        <p className="mt-2 text-sm text-cinza">Salve seu progresso na nuvem e continue de qualquer dispositivo.</p>
      </div>

      <button
        onClick={() => void entrarComGithub()}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-escoria bg-ferro px-4 py-2.5 font-medium transition hover:border-cinza"
      >
        <IconeGithub className="size-5" />
        Continuar com GitHub
      </button>

      <div className="my-6 flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-fosco">
        <span className="h-px flex-1 bg-ferro" />
        ou com e-mail
        <span className="h-px flex-1 bg-ferro" />
      </div>

      <form onSubmit={(e) => void enviar(e)} className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm text-cinza">E-mail</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-ferro bg-carvao px-3 py-2.5 focus:border-brasa/60 focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm text-cinza">Senha</span>
          <input
            type="password"
            required
            minLength={6}
            autoComplete={modo === "entrar" ? "current-password" : "new-password"}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full rounded-lg border border-ferro bg-carvao px-3 py-2.5 focus:border-brasa/60 focus:outline-none"
          />
        </label>

        {erro && <p className="rounded-lg border border-rubro/50 bg-rubro/10 p-3 text-sm text-brasa-clara">{erro}</p>}
        {aviso && (
          <p className="flex gap-2 rounded-lg border border-ouro/40 bg-ouro/10 p-3 text-sm text-ouro">
            <Mail className="mt-0.5 size-4 shrink-0" />
            {aviso}
          </p>
        )}

        <button
          type="submit"
          disabled={enviando}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-brasa px-4 py-3 font-display text-lg font-bold uppercase tracking-wider text-carvao transition hover:bg-brasa-clara hover:shadow-brasa disabled:opacity-60"
        >
          {enviando && <Loader className="size-4 animate-spin" />}
          {modo === "entrar" ? "Entrar" : "Criar conta"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-cinza">
        {modo === "entrar" ? "Ainda não tem conta?" : "Já tem conta?"}{" "}
        <button
          onClick={() => {
            setModo(modo === "entrar" ? "criar" : "entrar");
            setErro(null);
            setAviso(null);
          }}
          className="text-brasa-clara hover:underline"
        >
          {modo === "entrar" ? "Criar conta" : "Entrar"}
        </button>
      </p>
    </div>
  );
}
