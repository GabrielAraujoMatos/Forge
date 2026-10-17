import type { Metadata } from "next";
import { Barlow_Condensed, IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import { ForgeProvider } from "@/components/forge-provider";
import { SiteHeader } from "@/components/site-header";
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

export const metadata: Metadata = {
  title: { default: "Forge: trilhas de Infraestrutura de TI", template: "%s · Forge" },
  description:
    "Roadmaps do básico ao avançado para forjar sua carreira em Infraestrutura de TI: Linux, Redes e mais.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${barlow.variable} ${plex.variable} ${jetbrains.variable} h-full antialiased`}
    >
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
