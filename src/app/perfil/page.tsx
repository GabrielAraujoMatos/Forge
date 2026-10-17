import type { Metadata } from "next";
import { trilhas } from "@/content";
import { PerfilView } from "@/components/perfil-view";

export const metadata: Metadata = { title: "Perfil" };

export default function PaginaPerfil() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-10">
      <PerfilView trilhas={trilhas} />
    </main>
  );
}
