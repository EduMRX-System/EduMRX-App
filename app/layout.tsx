import type { Metadata, Viewport } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import Provider from "@/components/Provider";

import "bootstrap-icons/font/bootstrap-icons.css";

import "leaflet/dist/leaflet.css";
import ThemeInitializer from "@/components/ThemeInitializer";
import LanguageInitializer from "@/components/LanguageInitializer";
import { cn } from "@/lib/utils";
import TokenSync from "@/components/auth/TokenSync";


const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});


const SITE_URL = "https://edumrx.uz";
const SITE_NAME = "EduMRX";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "EduMRX — O'quv markazlari uchun zamonaviy boshqaruv tizimi (CRM)",
    template: "%s | EduMRX",
  },

  description:
    "EduMRX — o'quv markazlari uchun to'liq CRM va boshqaruv tizimi. O'quvchilar qabuli, davomat, baholar, to'lovlar va hisobotlar — barchasi bitta platformada. Bepul sinab ko'ring.",

  keywords: [
    "o'quv markaz CRM",
    "ta'lim markazi boshqaruv tizimi",
    "EduMRX",
    "o'quvchilar boshqaruvi",
    "davomat tizimi",
    "to'lovlar boshqaruvi",
    "education CRM Uzbekistan",
    "учебный центр CRM",
    "система управления образованием",
  ],

  authors: [{ name: "EduMRX" }],
  creator: "EduMRX",
  publisher: "EduMRX",

  applicationName: SITE_NAME,
  generator: "Next.js",

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  alternates: {
    canonical: "/",
    languages: {
      "uz-UZ": "/uz",
      "ru-RU": "/ru",
      "en-US": "/en",
      "x-default": "/",
    },
  },

  openGraph: {
    type: "website",
    locale: "uz_UZ",
    alternateLocale: ["ru_RU", "en_US"],
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "EduMRX — O'quv markazlari uchun zamonaviy boshqaruv tizimi",
    description:
      "O'quv jarayonlarini avtomatlashtiring: qabul, davomat, baholar, to'lovlar va hisobotlar bitta platformada.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "EduMRX — ta'lim boshqaruv platformasi",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "EduMRX — O'quv markazlari uchun boshqaruv tizimi",
    description:
      "Qabul, davomat, baholar, to'lovlar va hisobotlar bitta platformada.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: [
      { url: "/icons/icon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icons/icon-96.png", sizes: "96x96", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-180.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/icons/manifest.json",

  // Google Search Console tasdiqlash kodi (o'zingiznikiga almashtiring)
  verification: {
    google: "GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE",
    yandex: "YANDEX_VERIFICATION_CODE",
  },

  category: "education",
};


export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#b8860b",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={`${inter.variable} antialiased`}>
        <TokenSync />
        <ThemeInitializer />
        <LanguageInitializer />
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}