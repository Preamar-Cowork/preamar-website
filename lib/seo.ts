import type { Metadata, Viewport } from "next";

// Canonical site address. Override with NEXT_PUBLIC_SITE_URL (e.g. a Vercel preview).
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://preamar.pt").replace(/\/$/, "");

export const SITE_TITLE = "Cowork no Montijo — Secretárias, Gabinetes e Morada Fiscal | PREAMAR";
export const SITE_DESCRIPTION =
  "Cowork no Montijo, junto ao Tejo: secretárias desde 12 €/dia, gabinetes privados e morada fiscal. A dez minutos de Alcochete, sem ponte. Reserva o teu lugar.";

export const SITE_METADATA: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: "%s | PREAMAR" }, // home uses the full title as-is
  description: SITE_DESCRIPTION,
  applicationName: "PREAMAR",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_PT",
    url: "/",
    siteName: "PREAMAR",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: { card: "summary_large_image", title: SITE_TITLE, description: SITE_DESCRIPTION },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  category: "business",
};

export const SITE_VIEWPORT: Viewport = { themeColor: "#F3F1EC" };
