import type { Metadata } from "next";
import AboutView from "@/views/marketing/AboutView";

const SITE_URL = "https://edumrx.uz";

export const metadata: Metadata = {
  title: "Biz haqimizda — EduMRX ta'lim CRM platformasi",
  description:
    "EduMRX — O'zbekistondagi o'quv markazlarini raqamlashtirish uchun yaratilgan ta'lim CRM platformasi. Missiyamiz, qadriyatlarimiz va jamoamiz bilan tanishing.",
  keywords: [
    "EduMRX haqida",
    "ta'lim CRM O'zbekiston",
    "o'quv markazi raqamlashtirish",
    "EduMRX jamoa",
    "о EduMRX",
    "образовательная CRM Узбекистан",
    "education CRM company Uzbekistan",
  ],
  alternates: { canonical: "/about" },
  openGraph: {
    title: "EduMRX — Biz haqimizda",
    description: "O'quv markazlarini raqamlashtirayotgan O'zbekiston CRM platformasi.",
    url: `${SITE_URL}/about`,
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "EduMRX — Biz haqimizda",
    description: "O'zbekistondagi ta'lim CRM platformasi. Missiyamiz va jamoamiz.",
    images: ["/og-image.png"],
  },
};

export default AboutView;
