import type { Metadata } from "next";
import HomeView from "@/views/marketing/HomeView";

const SITE_URL = "https://edumrx.uz";

export const metadata: Metadata = {
  title: "EduMRX — O'quv markazlari uchun CRM va boshqaruv tizimi",
  description:
    "EduMRX — o'quv markazlari uchun to'liq CRM platforma. O'quvchilar qabuli, davomat, baholar, to'lovlar va hisobotlar bitta tizimda. 14 kun bepul sinab ko'ring.",
  keywords: [
    "o'quv markazi CRM",
    "ta'lim markazi boshqaruv tizimi",
    "CRM для учебного центра",
    "система управления учебным центром",
    "education CRM Uzbekistan",
    "EduMRX",
    "o'quvchilar boshqaruvi",
    "davomat tizimi",
    "to'lovlar boshqaruvi",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "EduMRX — O'quv markazlari uchun CRM platforma",
    description:
      "Qabul, davomat, baholar, to'lovlar va real-vaqt hisobotlar — barchasi bitta platformada. Bepul sinab ko'ring.",
    url: SITE_URL,
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "EduMRX — O'quv markazlari uchun CRM",
    description: "Davomat, to'lovlar, hisobotlar — barchasi bitta tizimda. Bepul boshlang.",
    images: ["/og-image.png"],
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "EduMRX",
  url: SITE_URL,
  logo: `${SITE_URL}/icons/icon-512.png`,
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    availableLanguage: ["Uzbek", "Russian", "English"],
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "EduMRX",
  url: SITE_URL,
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <HomeView />
    </>
  );
}
