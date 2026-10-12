import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = { "pt-PT": `${SITE_URL}/`, en: `${SITE_URL}/en` };
  return [
    { url: `${SITE_URL}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1, alternates: { languages } },
    { url: `${SITE_URL}/en`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8, alternates: { languages } },
  ];
}
