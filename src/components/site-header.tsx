"use client";

import { Anvil, LogIn, LogOut, Route, Search, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BotaoTema } from "./botao-tema";
import { useForge } from "./forge-provider";
import { ChamaSequencia } from "./ritmo";

const links = [
  { href: "/", rotulo: "Trilhas", icone: Route },
  { href: "/busca", rotulo: "Busca", icone: Search },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { usuario, authPronto, contasAtivas, sair } = useForge();

  return (
    <header className="sticky top-0 z-40 border-b border-ferro bg-carvao/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
        <Link href="/" className="group flex items-center gap-2">
          <Anvil className="size-6 text-brasa transition group-hover:drop-shadow-[0_0_8px_rgb(255_107_26/0.8)]" />
          <span className="font-display text-2xl font-extrabold tracking-[0.18em] text-aco">FORGE</span>
        </Link>

        <nav className="ml-auto flex items-center gap-1 text-sm">
          {links.map(({ href, rotulo, icone: Icone }) => {
            const ativo = href === "/" ? pathname === "/" || pathname.startsWith("/trilhas") : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-label={rotulo}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 transition sm:px-3 ${
                  ativo ? "bg-ferro text-aco" : "text-cinza hover:text-aco"
                }`}
              >
                <Icone className="size-4" />
                <span className="hidden sm:inline">{rotulo}</span>
              </Link>
            );
          })}

          <ChamaSequencia />
          <BotaoTema />

          {contasAtivas && (
            <div className="ml-1 flex justify-end border-l border-ferro pl-2 sm:ml-2 sm:min-w-24 sm:pl-3">
              {!authPronto ? null : usuario ? (
                <div className="flex items-center gap-1">
                  <Link
                    href="/perfil"
                    aria-label="Perfil"
                    title={usuario.email}
                    className={`flex items-center gap-2 rounded-md px-2 py-1 transition ${
                      pathname.startsWith("/perfil") ? "bg-ferro text-aco" : "text-cinza hover:text-aco"
                    }`}
                  >
                    {usuario.user_metadata?.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element -- avatar externo do GitHub
                      <img src={usuario.user_metadata.avatar_url} alt="" className="size-6 rounded-full" />
                    ) : (
                      <UserRound className="size-4" />
                    )}
                    <span className="hidden max-w-40 truncate sm:inline">
                      {usuario.user_metadata?.user_name ?? usuario.email}
                    </span>
                  </Link>
                  <button
                    onClick={() => void sair()}
                    className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-cinza transition hover:text-aco"
                    title="Sair"
                    aria-label="Sair"
                  >
                    <LogOut className="size-4" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/entrar"
                  className="flex items-center gap-1.5 rounded-md border border-brasa/60 px-3 py-1.5 text-brasa-clara transition hover:bg-brasa hover:text-tinta"
                >
                  <LogIn className="size-4" />
                  Entrar
                </Link>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
