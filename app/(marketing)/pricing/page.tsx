import PricingView from "@/views/marketing/PricingView";
import { Metadata } from "next";

export const pricingMetadata: Metadata = {
    title: "Narxlar — O'quv markazi uchun tariflar",
    description:
        "EduMRX tariflari: kichik markazlardan yirik tarmoqlargacha. Bepul sinov bilan boshlang, keyin o'zingizga mos tarifni tanlang.",
    alternates: { canonical: "/pricing" },
    openGraph: {
        title: "EduMRX narxlari — moslashuvchan tariflar",
        description: "O'quv markazingiz hajmiga mos tarif. Bepul sinov mavjud.",
        url: "https://edumrx.uz/pricing",
    },
};

export default PricingView