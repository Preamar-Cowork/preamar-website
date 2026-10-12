import type { SiteSections } from "@/lib/content/schema";
import { SITE_DESCRIPTION, SITE_DESCRIPTION_EN, SITE_URL } from "@/lib/seo";
import { LOCALE_PATH, UI, type Locale } from "@/lib/locale";

/**
 * Structured data (schema.org) built from the live content, so prices and
 * FAQ in Google always match what the page says. Nothing here is visible.
 */
export function JsonLd({ sections: c, locale = "pt" }: { sections: SiteSections; locale?: Locale }) {
  const pageUrl = `${SITE_URL}${LOCALE_PATH[locale] === "/" ? "/" : LOCALE_PATH[locale]}`;
  const phone = c.footer.phone && !/0{3}\s?0{3}/.test(c.footer.phone) ? c.footer.phone : undefined; // skip placeholder

  const offers = c.plans.plans.flatMap((p) =>
    p.options.length
      ? p.options.map((o) => ({
          "@type": "Offer",
          name: `${p.name} — ${o.label}${o.people ? ` ${UI[locale].people}` : ""}`,
          description: p.desc,
          price: o.price,
          priceCurrency: "EUR",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: o.price,
            priceCurrency: "EUR",
            valueAddedTaxIncluded: true,
            referenceQuantity: {
              "@type": "QuantitativeValue",
              value: 1,
              unitCode: /dia|day/i.test(o.unit) ? "DAY" : /semana|week/i.test(o.unit) ? "WEE" : "MON",
            },
          },
        }))
      : [
          {
            "@type": "Offer",
            name: p.name,
            description: p.desc,
            price: p.price,
            priceCurrency: "EUR",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: p.price,
              priceCurrency: "EUR",
              valueAddedTaxIncluded: true,
              referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" },
            },
          },
        ]
  );

  const business = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#preamar`,
    name: "PREAMAR",
    url: pageUrl,
    description: locale === "en" ? SITE_DESCRIPTION_EN : SITE_DESCRIPTION,
    image: `${SITE_URL}/opengraph-image.jpg`,
    logo: `${SITE_URL}/icon.png`,
    email: c.footer.email || undefined,
    telephone: phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: c.footer.place || "Montijo",
      addressRegion: "Setúbal",
      addressCountry: "PT",
    },
    areaServed: ["Montijo", "Alcochete", "Moita"].map((name) => ({ "@type": "City", name })),
    amenityFeature: c.space.amenities.map((a) => ({ "@type": "LocationFeatureSpecification", name: a, value: true })),
    makesOffer: offers,
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale === "en" ? "en" : "pt-PT",
    mainEntity: c.faq.items
      .filter((i) => i.q && i.a)
      .map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(business).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq).replace(/</g, "\\u003c") }} />
    </>
  );
}
