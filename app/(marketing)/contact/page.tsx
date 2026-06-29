import type { Metadata } from "next";
import ContactView from "@/views/marketing/ContactView";

const SITE_URL = "https://edumrx.uz";

export const metadata: Metadata = {
  title: "Bog'lanish — EduMRX CRM demo so'rash va savol-javob",
  description:
    "EduMRX jamoasi bilan bog'laning. O'quv markazi uchun CRM demo so'rovi, hamkorlik takliflari va savollar uchun murojaat qiling — tez javob beramiz.",
  keywords: [
    "EduMRX bog'lanish",
    "CRM demo so'rash",
    "o'quv markazi CRM konsultatsiya",
    "EduMRX контакты",
    "демо CRM учебный центр",
    "EduMRX contact demo",
  ],
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "EduMRX — Bog'lanish va demo so'rash",
    description: "O'quv markazi uchun CRM bo'yicha demo so'rash yoki savol berish uchun bog'laning.",
    url: `${SITE_URL}/contact`,
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "EduMRX — Bog'lanish",
    description: "CRM demo so'rash yoki savol berish uchun EduMRX jamoasi bilan bog'laning.",
    images: ["/og-image.png"],
  },
};

export default ContactView;
