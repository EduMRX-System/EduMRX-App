import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig: any = {
  reactCompiler: true,

  turbopack: {},

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "edumrx-1.onrender.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.edumrx.uz",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "edumrx.uz",
        pathname: "/**",
      },
    ],
  },

  async rewrites() {
    const isDev = process.env.NODE_ENV === "development";

    return [
      // API proxy — CORS ni chetlab o'tish uchun
      {
        source: "/api/:path*",
        destination: isDev
          ? "https://edumrx-1.onrender.com/api/:path*"
          : "https://www.edumrx.uz/api/:path*",
      },
      // Subdomain → path rewrite'lar OLIB TASHLANDI.
      // Endi middleware.ts subdomain'ni o'zi /director, /student ga rewrite qiladi.
    ];
  },
};

export default withPWA(nextConfig);
