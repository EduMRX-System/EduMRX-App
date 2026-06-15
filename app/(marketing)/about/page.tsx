import type { Metadata } from "next";
import AboutView from "@/views/marketing/AboutView";

export const metadata: Metadata = {
    title: "Biz haqimizda",
    description:
        "EduMRX — O'zbekistondagi o'quv markazlarini raqamlashtirish uchun yaratilgan jamoa. Bizning vazifamiz va qadriyatlarimiz bilan tanishing.",
    alternates: { canonical: "/about" },
    openGraph: {
        title: "EduMRX — Biz haqimizda",
        description: "O'quv markazlarini raqamlashtirayotgan jamoa.",
        url: "https://edumrx.uz/about",
    },
};

export default AboutView;