import type { Metadata } from "next";
import PricingView from "@/views/marketing/PricingView";

const SITE_URL = "https://edumrx.uz";

export const metadata: Metadata = {
  title: "Tariflar — O'quv markazi uchun CRM tariflari va narxlari",
  description:
    "EduMRX CRM tariflari: kichik markazlardan yirik tarmoqlargacha. Oylik va yillik to'lov. 14 kun bepul sinov. O'quv markazi uchun eng qulay CRM narxlari.",
  keywords: [
    "o'quv markazi uchun CRM narxlari",
    "ta'lim markazi CRM tariflari",
    "EduMRX narxlar",
    "CRM для учебного центра цены",
    "тарифы CRM учебный центр",
    "education CRM pricing Uzbekistan",
  ],
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "EduMRX — O'quv markazi uchun CRM tariflari",
    description:
      "Markazingiz hajmiga mos CRM tariflari. Starter, Pro va Enterprise — hamma uchun ochiq narxlar. 14 kun bepul sinov.",
    url: `${SITE_URL}/pricing`,
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "EduMRX — CRM tariflari va narxlari",
    description: "O'quv markazi uchun moslashuvchan CRM tariflari. Bepul sinov bilan boshlang.",
    images: ["/og-image.png"],
  },
};

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "EduMRX",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web, Android, iOS",
  url: SITE_URL,
  description:
    "O'quv markazlari uchun CRM va boshqaruv tizimi — davomat, to'lovlar, baholar va hisobotlar bitta platformada.",
  offers: [
    {
      "@type": "Offer",
      name: "Starter",
      price: "299000",
      priceCurrency: "UZS",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "299000",
        priceCurrency: "UZS",
        unitText: "MONTH",
      },
    },
    {
      "@type": "Offer",
      name: "Pro",
      price: "599000",
      priceCurrency: "UZS",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "599000",
        priceCurrency: "UZS",
        unitText: "MONTH",
      },
    },
    {
      "@type": "Offer",
      name: "Enterprise",
      price: "1199000",
      priceCurrency: "UZS",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "1199000",
        priceCurrency: "UZS",
        unitText: "MONTH",
      },
    },
  ],
  publisher: {
    "@type": "Organization",
    name: "EduMRX",
    url: SITE_URL,
    logo: `${SITE_URL}/icons/icon-512.png`,
  },
};

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      <PricingView />
    </>
  );
}
