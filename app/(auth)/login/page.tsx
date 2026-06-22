import type { Metadata } from "next";
import LoginClient from "./LoginClient";

export const metadata: Metadata = {
  title: "Kirish — EduMRX",
  description:
    "EduMRX tizimiga kirish. O'quvchi yoki xodim sifatida tizimga kiring va o'z panelingizdan foydalaning.",
  keywords: [
    "edumrx login",
    "edumrx kirish",
    "edumrx tizimiga kirish",
    "o'quv markazi tizimi",
    "edumrx",
  ],
  alternates: { canonical: "https://login.edumrx.uz/" },
  openGraph: {
    title: "Kirish — EduMRX",
    description: "EduMRX tizimiga kirish sahifasi",
    url: "https://login.edumrx.uz/",
    siteName: "EduMRX",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Kirish — EduMRX",
  description:
    "EduMRX tizimiga kirish. O'quvchi yoki xodim sifatida tizimga kiring.",
  url: "https://login.edumrx.uz/",
  isPartOf: { "@type": "WebSite", name: "EduMRX", url: "https://edumrx.uz" },
};

export default function LoginPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LoginClient />
    </>
  );
}
