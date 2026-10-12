import type { Metadata } from "next";
import { SITE_METADATA, SITE_VIEWPORT } from "@/lib/seo";
import { Libre_Caslon_Display, Libre_Caslon_Text, Archivo_Narrow } from "next/font/google";
import { headers } from "next/headers";
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

export const metadata: Metadata = SITE_METADATA;
export const viewport = SITE_VIEWPORT;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // set by middleware.ts for /en
  const lang = headers().get("x-pm-locale") === "en" ? "en" : "pt-PT";
  return (
    <html lang={lang}>
      <body
        className={`${caslonDisplay.variable} ${caslonText.variable} ${archivoNarrow.variable} font-body`}
      >
        {children}
      </body>
    </html>
  );
}
