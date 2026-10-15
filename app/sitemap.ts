import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = { "pt-PT": `${SITE_URL}/`, en: `${SITE_URL}/en` };
  return [
    { url: `${SITE_URL}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1, alternates: { languages } },
    { url: `${SITE_URL}/en`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8, alternates: { languages } },
    {
      url: `${SITE_URL}/privacidade`,
      changeFrequency: "yearly",
      priority: 0.2,
      alternates: { languages: { "pt-PT": `${SITE_URL}/privacidade`, en: `${SITE_URL}/en/privacy` } },
    },
    {
      url: `${SITE_URL}/en/privacy`,
      changeFrequency: "yearly",
      priority: 0.2,
      alternates: { languages: { "pt-PT": `${SITE_URL}/privacidade`, en: `${SITE_URL}/en/privacy` } },
    },
  ];
}
