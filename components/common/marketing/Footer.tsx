"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Send,
  ArrowRight,

} from "lucide-react";

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  const columns = [
    {
      title: t("footer.product", "Mahsulot"),
      links: [
        { label: t("nav.features", "Imkoniyatlar"), href: "/features" },
        { label: t("nav.pricing", "Tariflar"), href: "/pricing" },
        { label: t("footer.updates", "Yangilanishlar"), href: "/blog" },
        { label: t("footer.docs", "Hujjatlar"), href: "https://edumrx-dev-doc.vercel.app" },
      ],
    },
    {
      title: t("footer.company", "Kompaniya"),
      links: [
        { label: t("nav.about", "Biz haqimizda"), href: "/about" },
        { label: t("nav.contact", "Bog'lanish"), href: "/contact" },
        { label: t("footer.blog", "Blog"), href: "/blog" },
        { label: t("footer.careers", "Vakansiyalar"), href: "/about" },
      ],
    },
    {
      title: t("footer.support", "Yordam"),
      links: [
        { label: t("footer.help", "Yordam markazi"), href: "/contact" },
        { label: t("footer.privacy", "Maxfiylik"), href: "/about" },
        { label: t("footer.terms", "Shartlar"), href: "/about" },
        { label: t("footer.security", "Xavfsizlik"), href: "/about" },
      ],
    },
  ];
  const socials = [
    { icon: Send, href: "https://t.me/edumrx", label: "Telegram" },
    { icon: "Instagram", href: "https://instagram.com/edumrx", label: "Instagram" },
    { icon: "Youtube", href: "https://youtube.com/@edumrx", label: "YouTube" },
  ];
  return (
    <footer className="relative bg-slate-50 dark:bg-slate-950 border-t border-slate-200/60 dark:border-slate-800/60 overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-4">

        {/* Top: CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="py-12 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-200/60 dark:border-slate-800/60"
        >
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              {t("footer.cta_title", "Markazingizni bugun raqamlashtiring")}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {t("footer.cta_desc", "14 kun bepul · Kredit karta talab qilinmaydi")}
            </p>
          </div>
          <Link
            href="/pricing"
            className="group shrink-0 inline-flex h-11 px-6 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl items-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
          >
            <span>{t("footer.cta_button", "Boshlash")}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>

        {/* Middle: links */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand col */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-black text-lg tracking-tight text-slate-900 dark:text-white">
                EduMRX
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mb-5">
              {t("footer.brand_desc", "O'zbekistondagi yetakchi ta'lim markazlari boshqaruv tizimi. Biznesingizni professional darajaga olib chiqing.")}
            </p>

            {/* Contact */}
            <div className="space-y-2.5">
              <a href="mailto:info@edumrx.uz" className="flex items-center gap-2.5 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <Mail className="w-4 h-4" />
                <span>info@edumrx.uz</span>
              </a>
              <a href="tel:+998901234567" className="flex items-center gap-2.5 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <Phone className="w-4 h-4" />
                <span>+998 90 123 45 67</span>
              </a>
              <div className="flex items-center gap-2.5 text-sm text-slate-500 dark:text-slate-400">
                <MapPin className="w-4 h-4" />
                <span>{t("footer.location", "Toshkent, O'zbekiston")}</span>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom: copyright + socials */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200/60 dark:border-slate-800/60">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            © {year} EduMRX. {t("footer.rights", "Barcha huquqlar himoyalangan.")}
          </p>

          <div className="flex items-center gap-2">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="w-9 h-9 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all hover:-translate-y-0.5"
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}