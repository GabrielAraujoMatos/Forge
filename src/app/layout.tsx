import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import { ForgeProvider } from "@/components/forge-provider";
import { SiteHeader } from "@/components/site-header";
import { SCRIPT_TEMA } from "@/lib/tema";
import "./globals.css";

const barlow = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const plex = IBM_Plex_Sans({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

const descricao =
  "Roadmaps do básico ao avançado para forjar sua carreira em Infraestrutura de TI: Linux, Redes, Windows Server, Cloud e DevOps.";

export const metadata: Metadata = {
  // Prévias de link precisam de URL absoluta; a Vercel informa o domínio de produção.
  metadataBase: new URL(
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000",
  ),
  title: { default: "Forge: trilhas de Infraestrutura de TI", template: "%s · Forge" },
  description: descricao,
  openGraph: {
    title: "Forge: trilhas de Infraestrutura de TI",
    description: descricao,
    siteName: "Forge",
    locale: "pt_BR",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

// Cor da barra do navegador no celular (o BotaoTema troca no tema escuro)
export const viewport: Viewport = { themeColor: "#f5f1ea" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${barlow.variable} ${plex.variable} ${jetbrains.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_TEMA }} />
      </head>
      <body className="textura-forja flex min-h-full flex-col font-sans">
        <ForgeProvider>
          <SiteHeader />
          <div className="flex flex-1 flex-col">{children}</div>
          <footer className="border-t border-ferro px-4 py-6 text-center text-sm text-fosco">
            Forge · forjado com café e terminal
          </footer>
        </ForgeProvider>
      </body>
    </html>
  );
}
