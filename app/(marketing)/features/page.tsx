import type { Metadata } from "next";
import FeaturesView from "@/views/marketing/FeaturesView";

const SITE_URL = "https://edumrx.uz";

export const metadata: Metadata = {
  title: "Imkoniyatlar — EduMRX CRM funksiyalari: davomat, to'lov, baholar",
  description:
    "EduMRX CRM imkoniyatlari: o'quvchilar qabuli, elektron davomat, to'lovlar boshqaruvi, baholash tizimi va real-vaqt hisobotlar. Barchasi bitta o'quv markazi CRM tizimida.",
  keywords: [
    "CRM funksiyalari o'quv markazi",
    "elektron davomat tizimi",
    "to'lovlar boshqaruvi CRM",
    "функции CRM учебного центра",
    "электронная посещаемость",
    "управление платежами CRM",
    "education CRM features",
    "EduMRX imkoniyatlari",
  ],
  alternates: { canonical: "/features" },
  openGraph: {
    title: "EduMRX — CRM funksiyalari va imkoniyatlari",
    description:
      "Davomat, to'lovlar, baholar, SMS, Telegram bot va hisobotlar — o'quv markazi uchun to'liq CRM tizimi.",
    url: `${SITE_URL}/features`,
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "EduMRX — CRM imkoniyatlari",
    description: "O'quv markazi uchun to'liq CRM: davomat, to'lovlar, hisobotlar.",
    images: ["/og-image.png"],
  },
};

export default FeaturesView;
