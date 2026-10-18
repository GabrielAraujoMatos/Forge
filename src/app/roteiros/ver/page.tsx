import type { Metadata } from "next";
import { Suspense } from "react";
import { RoteiroEditor } from "@/components/roteiros/roteiro-editor";

export const metadata: Metadata = { title: "Roteiro" };

// O id vem em ?id= (e não em /roteiros/[id]) para a página continuar estática:
// os roteiros são de cada usuário e só existem no navegador dele.
export default function PaginaRoteiro() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 pb-20 pt-8">
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl border border-ferro bg-bigorna" />}>
        <RoteiroEditor />
      </Suspense>
    </main>
  );
}
