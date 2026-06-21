import type { Metadata } from "next";
import BlogView from "@/views/marketing/BlogView";

export const metadata: Metadata = {
  title: "Blog — Ta'lim va texnologiya",
  description:
    "EduMRX blog: o'quv markazlarini boshqarish, raqamlashtirish va ta'lim texnologiyalari haqida foydali maqolalar va yangiliklar.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "EduMRX Blog — Ta'lim va texnologiya",
    description:
      "O'quv markazlarini boshqarish va raqamlashtirish haqida maqolalar.",
    url: "https://edumrx.uz/blog",
  },
};

export default BlogView;
