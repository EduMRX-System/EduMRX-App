import type { Metadata } from "next";
import BlogView from "@/views/marketing/BlogView";

const SITE_URL = "https://edumrx.uz";

export const metadata: Metadata = {
  title: "Blog — O'quv markazi boshqaruvi va CRM bo'yicha maqolalar",
  description:
    "EduMRX blog: o'quv markazlarini CRM bilan boshqarish, raqamlashtirish va ta'lim texnologiyalari haqida foydali maqolalar. CRM tanlash, davomat, to'lovlar bo'yicha qo'llanmalar.",
  keywords: [
    "o'quv markazi CRM blog",
    "ta'lim markazi boshqaruvi maqolalar",
    "CRM tanlash qo'llanma",
    "блог CRM учебный центр",
    "управление учебным центром статьи",
    "education CRM blog Uzbekistan",
  ],
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "EduMRX Blog — CRM va ta'lim texnologiyalari",
    description: "O'quv markazlarini CRM bilan boshqarish bo'yicha foydali maqolalar va qo'llanmalar.",
    url: `${SITE_URL}/blog`,
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "EduMRX Blog",
    description: "O'quv markazi CRM va boshqaruvi bo'yicha maqolalar.",
    images: ["/og-image.png"],
  },
};

export default BlogView;
