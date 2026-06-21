import type { Metadata } from "next";
import PricingView from "@/views/marketing/PricingView";

export const metadata: Metadata = {
  title: "Tariflar — O'quv markazi uchun narxlar",
  description:
    "EduMRX tariflari: kichik markazlardan yirik tarmoqlargacha. Oylik va yillik to'lov. Bepul sinov bilan boshlang, keyin o'zingizga mos tarifni tanlang.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "EduMRX — Tariflar va narxlar",
    description:
      "O'quv markazingiz hajmiga mos moslashuvchan tariflar. 14 kun bepul sinov.",
    url: "https://edumrx.uz/pricing",
  },
};

export default PricingView;
