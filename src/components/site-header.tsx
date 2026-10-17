"use client";

import { Anvil, LogIn, LogOut, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useForge } from "./forge-provider";

const links = [
  { href: "/", rotulo: "Trilhas" },
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
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 transition ${
                  ativo ? "bg-ferro text-aco" : "text-cinza hover:text-aco"
                }`}
              >
                {Icone && <Icone className="size-4" />}
                {rotulo}
              </Link>
            );
          })}

          {contasAtivas && (
            <div className="ml-2 flex min-w-24 justify-end border-l border-ferro pl-3">
              {!authPronto ? null : usuario ? (
                <div className="flex items-center gap-2">
                  <span className="hidden max-w-40 truncate text-cinza sm:inline" title={usuario.email}>
                    {usuario.user_metadata?.user_name ?? usuario.email}
                  </span>
                  <button
                    onClick={() => void sair()}
                    className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-cinza transition hover:text-aco"
                    title="Sair"
                  >
                    <LogOut className="size-4" />
                    <span className="sm:hidden">Sair</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/entrar"
                  className="flex items-center gap-1.5 rounded-md border border-brasa/60 px-3 py-1.5 text-brasa-clara transition hover:bg-brasa hover:text-carvao"
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
