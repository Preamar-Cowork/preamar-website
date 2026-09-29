import type { Metadata, Viewport } from "next";

// Canonical site address. Override with NEXT_PUBLIC_SITE_URL (e.g. a Vercel preview).
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://preamar.pt").replace(/\/$/, "");

export const SITE_TITLE = "PREAMAR — Cowork e Escritórios no Montijo";
export const SITE_DESCRIPTION =
  "Cowork e escritórios no Montijo, junto ao estuário do Tejo. Secretárias, gabinetes privados e sala de reuniões — a dez minutos de Alcochete, sem ponte.";

export const SITE_METADATA: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: "%s | PREAMAR" },
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
