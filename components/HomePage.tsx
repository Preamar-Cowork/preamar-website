import type { Metadata } from "next";
import { Landing } from "@/components/Landing";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSiteContent } from "@/lib/siteContent";
import { getUpcomingHighTides } from "@/lib/tide";
import { applyTokens, priceTokens, resolveSections } from "@/lib/content/tokens";
import { localizeSections } from "@/lib/content/en";
import { localizeHero } from "@/lib/heroSettings";
import { LOCALE_PATH, type Locale } from "@/lib/locale";
import {
  LANGUAGE_ALTERNATES,
  SITE_DESCRIPTION,
  SITE_DESCRIPTION_EN,
  SITE_DESCRIPTION_TEMPLATE,
  SITE_DESCRIPTION_TEMPLATE_EN,
  SITE_METADATA,
  SITE_TITLE,
  SITE_TITLE_EN,
} from "@/lib/seo";

/** Page title/description per language, with the day-pass price taken live from /admin → Planos. */
export async function homeMetadata(locale: Locale): Promise<Metadata> {
  const { sections } = await getSiteContent();
  const en = locale === "en";
  const template = en ? SITE_DESCRIPTION_TEMPLATE_EN : SITE_DESCRIPTION_TEMPLATE;
  const filled = applyTokens(template, priceTokens(sections, locale)).replace(/ /g, " ");
  const description = filled.includes("{") ? (en ? SITE_DESCRIPTION_EN : SITE_DESCRIPTION) : filled; // renamed plan → safe text
  const title = en ? SITE_TITLE_EN : SITE_TITLE;
  const url = LOCALE_PATH[locale];
  // openGraph/twitter/alternates replace the layout's (no deep merge), so carry them over
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url, languages: LANGUAGE_ALTERNATES },
    openGraph: {
      ...SITE_METADATA.openGraph,
      title,
      description,
      url,
      locale: en ? "en_GB" : "pt_PT",
      alternateLocale: [en ? "pt_PT" : "en_GB"],
    },
    twitter: { ...SITE_METADATA.twitter, title, description },
  };
}

export async function HomePage({ locale }: { locale: Locale }) {
  const [content, tides] = await Promise.all([getSiteContent(), getUpcomingHighTides().catch(() => [])]);
  const pt = content.sections;
  const texts = locale === "en" ? localizeSections(pt, content.sectionsEn) : pt;
  const sections = resolveSections(texts, locale, pt); // fill in {price} variables (named after the PT plans)
  const heroSettings = applyTokens(localizeHero(content.heroSettings, locale), priceTokens(pt, locale));
  return (
    <>
      <JsonLd sections={sections} locale={locale} />
      <Landing
        locale={locale}
        heroVideoUrl={content.heroVideoUrl}
        heroSettings={heroSettings}
        sections={sections}
        formValues={pt.form}
        tides={tides}
      />
    </>
  );
}
