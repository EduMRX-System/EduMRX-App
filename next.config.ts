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
      {
        source: "/api/:path*",
        destination: isDev
          ? "https://edumrx-1.onrender.com/api/:path*"
          : "https://www.edumrx.uz/api/:path*",
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "admin.localhost" }],
        destination: "/admin/:path*",
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "director.localhost" }],
        destination: "/director/:path*",
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "manager.localhost" }],
        destination: "/manager/:path*",
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "teacher.localhost" }],
        destination: "/teacher/:path*",
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "student.localhost" }],
        destination: "/student/:path*",
      },
    ];
  },
};

export default withPWA(nextConfig);
