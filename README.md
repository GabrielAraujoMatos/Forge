# Forge

Trilhas de Infraestrutura de TI em forma de roadmap, do básico ao avançado. Cada tópico "aquece" os
próximos: **frio** (pré-requisitos pendentes) → **aquecendo** (pronto para estudar) → **forjado** (concluído).

Stack: Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · React Flow · Supabase.

## Rodando localmente

```bash
npm install
cp .env.example .env.local   # preencha com a URL e a chave publishable do Supabase
npm run dev
```

Abra http://localhost:3000.

## Supabase

1. **Tabela de progresso:** no painel do Supabase, abra *SQL Editor* e execute
   [`supabase/migrations/0001_progresso.sql`](supabase/migrations/0001_progresso.sql).
2. **URLs de redirecionamento:** em *Authentication → URL Configuration*, defina o *Site URL*
   (ex.: `http://localhost:3000` em desenvolvimento) e adicione a URL de produção em *Redirect URLs*.
3. **Login com GitHub (opcional):** crie um OAuth App no GitHub com callback
   `https://<seu-projeto>.supabase.co/auth/v1/callback` e ative o provider em
   *Authentication → Sign In / Providers → GitHub*.

Sem login, o progresso fica salvo no navegador. Ao entrar, ele é mesclado com o da conta.

## Adicionando conteúdo

Cada trilha é um arquivo em `src/content/trilhas/`. Para criar uma nova:

1. Copie `linux.ts` para `minha-trilha.ts` e edite `slug`, `titulo`, `descricao` e `topicos`.
2. Em cada tópico, `requisitos` lista os `id`s que vêm antes; o mapa é montado automaticamente.
3. Registre a trilha em `src/content/index.ts`.

## Estrutura

```
src/
  app/                 páginas (início, trilhas/[slug], busca, entrar)
  components/
    roadmap/           grafo (React Flow + dagre), painel do tópico, visão da trilha
    forge-provider.tsx sessão do Supabase + progresso (localStorage ↔ nuvem)
  content/trilhas/     conteúdo das trilhas
  lib/                 tipos, cálculo de status, cliente Supabase
supabase/migrations/   SQL do banco
```
