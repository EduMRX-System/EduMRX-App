/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://edumrx.uz",
  generateRobotsTxt: true,
  generateIndexSitemap: false,

  // Private/app routes exclude
  exclude: [
    "/director*",
    "/manager*",
    "/teacher*",
    "/student*",
    "/parent*",
    "/login*",
    "/staff-login*",
  ],

  robotsTxtOptions: {
    additionalSitemaps: ["https://edumrx.uz/sitemap.xml"],
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/director",
          "/manager",
          "/teacher",
          "/student",
          "/parent",
          "/login",
          "/staff-login",
        ],
      },
    ],
  },
};
