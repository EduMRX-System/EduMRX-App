import type { Metadata } from "next";
import FeaturesView from "@/views/marketing/FeaturesView";

export const metadata: Metadata = {
  title: "Imkoniyatlar — Davomat, to'lovlar va hisobotlar",
  description:
    "EduMRX imkoniyatlari: o'quvchilar qabuli, davomat monitoringi, baholash tizimi, to'lovlar boshqaruvi va real-vaqt hisobotlar. Barchasi bitta tizimda.",
  alternates: { canonical: "/features" },
  openGraph: {
    title: "EduMRX — Imkoniyatlar",
    description:
      "Qabul, davomat, baholar, to'lovlar va hisobotlar — barchasi bitta tizimda.",
    url: "https://edumrx.uz/features",
  },
};

export default FeaturesView;
