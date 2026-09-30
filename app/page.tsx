import type { Metadata } from "next";
import { Landing } from "@/components/Landing";
import { getSiteContent } from "@/lib/siteContent";
import { getUpcomingHighTides } from "@/lib/tide";
import { JsonLd } from "@/components/seo/JsonLd";
import { applyTokens, priceTokens, resolveSections } from "@/lib/content/tokens";
import { SITE_DESCRIPTION, SITE_DESCRIPTION_TEMPLATE, SITE_METADATA } from "@/lib/seo";

// Read the hero video + settings on every request, so changes saved in
// /admin show up immediately (and with no flash of default values).
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { sections } = await getSiteContent();
  const filled = applyTokens(SITE_DESCRIPTION_TEMPLATE, priceTokens(sections)).replace(/\u00A0/g, " ");
  const description = filled.includes("{") ? SITE_DESCRIPTION : filled; // a renamed plan → keep the safe text
  // openGraph/twitter objects replace the layout's (no deep merge), so carry them over
  return {
    description,
    openGraph: { ...SITE_METADATA.openGraph, description },
    twitter: { ...SITE_METADATA.twitter, description },
  };
}

export default async function Home() {
  const [content, tides] = await Promise.all([
    getSiteContent(),
    getUpcomingHighTides().catch(() => []),
  ]);
  const sections = resolveSections(content.sections); // fill in {price} variables
  const heroSettings = applyTokens(content.heroSettings, priceTokens(content.sections));
  return (
    <>
      <JsonLd sections={sections} />
      <Landing
        heroVideoUrl={content.heroVideoUrl}
        heroSettings={heroSettings}
        sections={sections}
        tides={tides}
      />
    </>
  );
}
