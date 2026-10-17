import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { cacheLife } from "next/cache";
import { ImageResponse } from "next/og";

/** Tamanho padrão das prévias de link (Open Graph). */
export const TAMANHO_OG = { width: 1200, height: 630 };

const pastaFontes = join(process.cwd(), "node_modules/@fontsource");
// Em base64 porque o cache não preserva bytes binários.
const fonte = (arquivo: string) => readFile(join(pastaFontes, arquivo), "base64");

// Com Cache Components, ler arquivos deixaria a rota dinâmica; em cache, as
// imagens são geradas no build e o node_modules não precisa ir para produção.
async function carregarFontes() {
  "use cache";
  cacheLife("max");
  return Promise.all([
    fonte("barlow-condensed/files/barlow-condensed-latin-800-normal.woff"),
    fonte("ibm-plex-sans/files/ibm-plex-sans-latin-400-normal.woff"),
    fonte("ibm-plex-sans/files/ibm-plex-sans-latin-500-normal.woff"),
  ]);
}

const COR = { carvao: "#121212", ferro: "#24221f", aco: "#e8e2d9", cinza: "#9a938a", brasa: "#ff6b1a", ouro: "#ffc15e" };

function Bigorna({ tamanho }: { tamanho: number }) {
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      fill="none"
      stroke={COR.brasa}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 10H6a4 4 0 0 1-4-4 1 1 0 0 1 1-1h4" />
      <path d="M7 5a1 1 0 0 1 1-1h13a1 1 0 0 1 1 1 7 7 0 0 1-7 7H8a1 1 0 0 1-1-1z" />
      <path d="M9 12v5" />
      <path d="M15 12v5" />
      <path d="M5 20a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3 1 1 0 0 1-1 1H6a1 1 0 0 1-1-1" />
    </svg>
  );
}

type Props = {
  /** Texto pequeno acima do título. */
  rotulo: string;
  titulo: string;
  descricao: string;
  /** Itens do rodapé, como "25 tópicos". */
  detalhes: string[];
};

export async function imagemOg({ rotulo, titulo, descricao, detalhes }: Props) {
  // O ImageResponse exige um ArrayBuffer exato, sem sobras do pool do Buffer.
  const [barlow, plex400, plex500] = (await carregarFontes()).map((b64) => new Uint8Array(Buffer.from(b64, "base64")).buffer);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "64px 72px",
          background: COR.carvao,
          backgroundImage: "radial-gradient(ellipse 70% 60% at 85% 0%, rgba(255,107,26,0.28), transparent 70%)",
          color: COR.aco,
          fontFamily: "Plex",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}>
          <Bigorna tamanho={52} />
          <span style={{ fontFamily: "Barlow", fontSize: 44, letterSpacing: 8 }}>FORGE</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", marginTop: "auto" }}>
          <span style={{ color: COR.brasa, fontSize: 24, fontWeight: 500, letterSpacing: 6, textTransform: "uppercase" }}>
            {rotulo}
          </span>
          <span
            style={{
              fontFamily: "Barlow",
              fontSize: titulo.length > 16 ? 96 : 136,
              lineHeight: 0.95,
              textTransform: "uppercase",
              marginTop: 12,
            }}
          >
            {titulo}
          </span>
          <span style={{ color: COR.cinza, fontSize: 30, lineHeight: 1.35, marginTop: 20, maxWidth: 940 }}>{descricao}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 28, marginTop: 44, fontSize: 24, color: COR.aco }}>
          {detalhes.map((d) => (
            <span key={d} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 10, height: 10, borderRadius: 10, background: COR.brasa }} />
              {d}
            </span>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            height: 8,
            marginTop: 28,
            borderRadius: 8,
            background: `linear-gradient(90deg, #c2410c, ${COR.brasa} 60%, ${COR.ouro})`,
          }}
        />
      </div>
    ),
    {
      ...TAMANHO_OG,
      fonts: [
        { name: "Barlow", data: barlow, weight: 800, style: "normal" },
        { name: "Plex", data: plex400, weight: 400, style: "normal" },
        { name: "Plex", data: plex500, weight: 500, style: "normal" },
      ],
    },
  );
}
