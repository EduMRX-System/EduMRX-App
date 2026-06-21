import type { Metadata } from "next";
import ContactView from "@/views/marketing/ContactView";

export const metadata: Metadata = {
  title: "Bog'lanish — Savol va takliflar",
  description:
    "EduMRX jamoasi bilan bog'laning. Demo so'rovi, hamkorlik takliflari va savollar uchun murojaat qiling — tez javob beramiz.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "EduMRX — Bog'lanish",
    description:
      "Demo so'rovi yoki savollar uchun EduMRX jamoasi bilan bog'laning.",
    url: "https://edumrx.uz/contact",
  },
};

export default ContactView;
