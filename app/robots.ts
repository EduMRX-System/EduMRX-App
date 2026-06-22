// app/robots.ts
import type { MetadataRoute } from "next";

const SITE_URL = "https://edumrx.uz";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/director/",
          "/manager/",
          "/teacher/",
          "/student/",
          "/parent/",
          "/_next/",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
