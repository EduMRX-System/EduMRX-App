// app/sitemap.ts
import type { MetadataRoute } from "next";

const SITE_URL = "https://edumrx.uz";
const LOGIN_URL = "https://login.edumrx.uz";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // Marketing sahifalar — o'zingiznikiga moslang
  const routes = [
    { path: "", priority: 1.0, changeFrequency: "daily" as const },
    { path: "/pricing", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/features", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/blog", priority: 0.8, changeFrequency: "daily" as const },
  ];

  const locales = ["uz", "ru", "en"];

  const entries: MetadataRoute.Sitemap = [];

  for (const route of routes) {
    // Har bir sahifa uchun til alternativalari (hreflang)
    const languages: Record<string, string> = {};
    for (const locale of locales) {
      languages[locale] = `${SITE_URL}/${locale}${route.path}`;
    }

    entries.push({
      url: `${SITE_URL}${route.path}`,
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: { languages },
    });
  }

  // Login sahifalar (login.edumrx.uz)
  entries.push(
    {
      url: `${LOGIN_URL}/`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${LOGIN_URL}/student`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${LOGIN_URL}/staff`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
  );

  return entries;
}
