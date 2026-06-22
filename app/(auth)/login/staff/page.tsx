import type { Metadata } from "next";
import StaffLoginClient from "./StaffLoginClient";

export const metadata: Metadata = {
  title: "Xodimlar kirish — EduMRX",
  description:
    "Direktor, menejer va o'qituvchilar uchun EduMRX staff paneliga kirish. O'quv markazingizni boshqarish uchun tizimga kiring.",
  keywords: [
    "edumrx staff",
    "edumrx staff login",
    "edumrx xodimlar kirish",
    "edumrx direktor kirish",
    "edumrx o'qituvchi kirish",
    "staff panel kirish",
    "edumrx",
  ],
  alternates: { canonical: "https://login.edumrx.uz/staff" },
  openGraph: {
    title: "Xodimlar kirish — EduMRX",
    description:
      "Direktor, menejer, o'qituvchilar uchun EduMRX staff paneliga kirish",
    url: "https://login.edumrx.uz/staff",
    siteName: "EduMRX",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Xodimlar kirish — EduMRX",
  description:
    "Direktor, menejer va o'qituvchilar uchun EduMRX staff paneliga kirish.",
  url: "https://login.edumrx.uz/staff",
  isPartOf: { "@type": "WebSite", name: "EduMRX", url: "https://edumrx.uz" },
};

export default function StaffLoginPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <StaffLoginClient />
    </>
  );
}
