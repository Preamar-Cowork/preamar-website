import type { Metadata } from "next";
import { Libre_Caslon_Display, Libre_Caslon_Text, Archivo_Narrow } from "next/font/google";
import "./globals.css";

const caslonDisplay = Libre_Caslon_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-caslon-display",
  display: "swap",
});

const caslonText = Libre_Caslon_Text({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-caslon-text",
  display: "swap",
});

const archivoNarrow = Archivo_Narrow({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PREAMAR — Cowork e Escritórios no Montijo",
  description:
    "Cowork e escritórios no Montijo, junto ao estuário do Tejo. Secretárias, gabinetes privados e sala de reuniões — a dez minutos de Alcochete, sem ponte.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body
        className={`${caslonDisplay.variable} ${caslonText.variable} ${archivoNarrow.variable} font-body`}
      >
        {children}
      </body>
    </html>
  );
}
