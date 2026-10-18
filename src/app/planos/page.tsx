import type { Metadata } from "next";
import { Check, Clock, Flame } from "lucide-react";
import { SeuPlano } from "@/components/seu-plano";
import { RECURSOS_PLANOS } from "@/lib/planos";

export const metadata: Metadata = {
  title: "Planos",
  description: "Compare o plano grátis e o Pro do Forge: chats com o tutor de IA, questionários, cursos e roteiros.",
};

export default function PaginaPlanos() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-20 pt-12">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-brasa">Planos</p>
      <h1 className="mb-4 max-w-2xl font-display text-5xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-6xl">
        Forje mais rápido com <span className="texto-brasa">IA ilimitada</span>
      </h1>
      <p className="mb-10 max-w-xl text-cinza">
        Trilhas, mapas, progresso, anotações e certificações são de graça, para sempre. O Pro libera a IA sem limites
        para estudar no seu ritmo.
      </p>

      <SeuPlano />

      <div className="mb-12 grid gap-5 md:grid-cols-2">
        <section className="rounded-2xl border border-ferro bg-bigorna p-6">
          <h2 className="font-display text-3xl font-bold uppercase tracking-wide">Grátis</h2>
          <p className="mb-6 text-sm text-cinza">Para começar a forjar.</p>
          <p className="mb-6 font-display text-4xl font-bold">R$ 0</p>
          <ul className="space-y-2 text-sm">
            {RECURSOS_PLANOS.map((r) => (
              <Item key={r.recurso} texto={`${r.recurso}: ${r.gratis.toLowerCase()}`} breve={!r.disponivel} />
            ))}
          </ul>
        </section>

        <section className="relative rounded-2xl border border-brasa/60 bg-bigorna p-6 shadow-brasa">
          <span className="absolute -top-3 right-6 flex items-center gap-1 rounded-full bg-brasa px-3 py-1 text-xs font-semibold text-tinta">
            <Flame className="size-3.5" />
            Recomendado
          </span>
          <h2 className="font-display text-3xl font-bold uppercase tracking-wide">Pro</h2>
          <p className="mb-6 text-sm text-cinza">Para quem quer acelerar a carreira.</p>
          <p className="mb-6 font-display text-4xl font-bold text-fosco">Em breve</p>
          <ul className="mb-6 space-y-2 text-sm">
            {RECURSOS_PLANOS.map((r) => (
              <Item key={r.recurso} texto={`${r.recurso}: ${r.pro.toLowerCase()}`} breve={!r.disponivel} destaque />
            ))}
          </ul>
          <button
            disabled
            className="w-full cursor-not-allowed rounded-lg bg-brasa px-4 py-3 font-display text-lg font-bold uppercase tracking-wider text-tinta opacity-60"
          >
            Assinatura em breve
          </button>
        </section>
      </div>

      <section>
        <h2 className="mb-4 font-display text-3xl font-bold uppercase tracking-wide">Comparação</h2>
        <div className="overflow-x-auto rounded-xl border border-ferro">
          <table className="w-full min-w-[520px] text-sm">
            <thead className="bg-ferro/60 text-left font-mono text-xs uppercase tracking-widest text-fosco">
              <tr>
                <th className="px-4 py-3 font-normal">Recurso</th>
                <th className="px-4 py-3 font-normal">Grátis</th>
                <th className="px-4 py-3 font-normal text-brasa-clara">Pro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ferro bg-bigorna">
              {RECURSOS_PLANOS.map((r) => (
                <tr key={r.recurso}>
                  <td className="px-4 py-3">
                    {r.recurso}
                    {!r.disponivel && <span className="ml-2 font-mono text-[10px] uppercase text-fosco">em breve</span>}
                  </td>
                  <td className="px-4 py-3 text-cinza">{r.gratis}</td>
                  <td className="px-4 py-3 font-medium">{r.pro}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-fosco">
          Os limites mensais renovam no primeiro dia de cada mês. O uso ilimitado do Pro segue uma política de uso justo
          para evitar abusos.
        </p>
      </section>
    </main>
  );
}

function Item({ texto, breve, destaque }: { texto: string; breve: boolean; destaque?: boolean }) {
  const Icone = breve ? Clock : Check;
  return (
    <li className={`flex items-start gap-2 ${breve ? "text-fosco" : ""}`}>
      <Icone className={`mt-0.5 size-4 shrink-0 ${breve ? "" : destaque ? "text-brasa" : "text-cinza"}`} />
      <span>
        {texto}
        {breve && <span className="ml-1 font-mono text-[10px] uppercase">· em breve</span>}
      </span>
    </li>
  );
}
