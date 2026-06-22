import type { Metadata } from "next";
import StudentLoginClient from "./StudentLoginClient";

export const metadata: Metadata = {
  title: "O'quvchi kirish — EduMRX",
  description:
    "O'quvchilar uchun EduMRX student paneliga kirish. Darslar, guruhlar va o'quv materiallarini ko'rish uchun tizimga kiring.",
  keywords: [
    "edumrx student",
    "edumrx student login",
    "edumrx o'quvchi kirish",
    "student panel kirish",
    "edumrx",
  ],
  alternates: { canonical: "https://login.edumrx.uz/student" },
  openGraph: {
    title: "O'quvchi kirish — EduMRX",
    description: "O'quvchilar uchun EduMRX student paneliga kirish sahifasi",
    url: "https://login.edumrx.uz/student",
    siteName: "EduMRX",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "O'quvchi kirish — EduMRX",
  description:
    "O'quvchilar uchun EduMRX student paneliga kirish. Darslar va guruhlarni ko'ring.",
  url: "https://login.edumrx.uz/student",
  isPartOf: { "@type": "WebSite", name: "EduMRX", url: "https://edumrx.uz" },
};

export default function StudentLoginPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <StudentLoginClient />
    </>
  );
}
