// app/robots.ts
import type { MetadataRoute } from "next";

const SITE_URL = "https://edumrx.uz";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Dashboard subdomainlari va shaxsiy sahifalarni indekslamaslik
        disallow: [
          "/api/",
          "/admin/",
          "/director/",
          "/manager/",
          "/teacher/",
          "/student/",
          "/parent/",
          "/login",
          "/staff",
          "/_next/",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
