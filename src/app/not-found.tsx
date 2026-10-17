import Link from "next/link";

export default function NaoEncontrado() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <p className="font-mono text-sm text-brasa">404</p>
      <h1 className="mt-2 font-display text-5xl font-extrabold uppercase tracking-tight">Metal frio</h1>
      <p className="mt-3 text-cinza">Essa página não saiu da forja.</p>
      <Link href="/" className="mt-6 text-brasa-clara hover:underline">
        Voltar para as trilhas
      </Link>
    </main>
  );
}
