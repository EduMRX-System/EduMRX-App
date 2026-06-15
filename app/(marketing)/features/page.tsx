import FeaturesView from "@/views/marketing/FeaturesView";
import { Metadata } from "next";

export const featuresMetadata: Metadata = {
    title: "Imkoniyatlar — Davomat, baholar, to'lovlar",
    description:
        "EduMRX imkoniyatlari: o'quvchilar qabuli, davomat monitoringi, baholash tizimi, to'lovlar boshqaruvi va real-vaqt hisobotlar.",
    alternates: { canonical: "/features" },
    openGraph: {
        title: "EduMRX imkoniyatlari",
        description:
            "Qabul, davomat, baholar, to'lovlar va hisobotlar — barchasi bitta tizimda.",
        url: "https://edumrx.uz/features",
    },
};

export default FeaturesView