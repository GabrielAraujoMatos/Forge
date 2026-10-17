import type { Metadata } from "next";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = { title: "Entrar" };

export default function PaginaEntrar() {
  return (
    <main className="mx-auto w-full max-w-sm px-4 py-16">
      <div className="rounded-2xl border border-ferro bg-bigorna p-6 shadow-2xl sm:p-8">
        <LoginForm />
      </div>
    </main>
  );
}
