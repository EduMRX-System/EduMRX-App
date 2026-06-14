"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Users,
  GraduationCap,
  ClipboardCheck,
  CreditCard,
  BarChart3,
  MessageCircle,
  Bot,
  Coins,
  Bell,
  Calendar,
  Building2,
  TrendingUp,
  FileText,
  DoorOpen,
  Shield,
  Archive,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: [0.16 , 1, 0.3, 1] as const },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

export default function FeaturesView() {
  const { t } = useTranslation();

  const categories = [
    {
      title: t("features.cat_academic", "O'quv jarayoni"),
      desc: t("features.cat_academic_desc", "O'quvchilar, guruhlar va darslarni boshqarish"),
      color: "from-indigo-500 to-blue-600",
      items: [
        { icon: Users, title: "O'quvchilar bazasi", desc: "Qabul, profil va arxiv boshqaruvi" },
        { icon: GraduationCap, title: "Guruh va kurslar", desc: "Guruhlar, jadval va o'qituvchi biriktirish" },
        { icon: ClipboardCheck, title: "Elektron davomat", desc: "Real vaqt davomat va statistika" },
        { icon: DoorOpen, title: "Xonalar boshqaruvi", desc: "O'quv xonalari va bandlik nazorati" },
      ],
    },
    {
      title: t("features.cat_finance", "Moliya"),
      desc: t("features.cat_finance_desc", "To'lovlar, qarzdorlar va chiqimlar"),
      color: "from-emerald-500 to-teal-600",
      items: [
        { icon: CreditCard, title: "To'lovlar tizimi", desc: "To'lovlarni qabul qilish va kuzatish" },
        { icon: TrendingUp, title: "Qarzdorlar nazorati", desc: "Avtomatik qarzdorlar ro'yxati" },
        { icon: FileText, title: "To'lov turlari", desc: "Turli to'lov usullarini sozlash" },
        { icon: BarChart3, title: "Chiqimlar hisobi", desc: "Markaz xarajatlarini boshqarish" },
      ],
    },
    {
      title: t("features.cat_marketing", "Marketing & Aloqa"),
      desc: t("features.cat_marketing_desc", "Lidlar, SMS va Telegram integratsiyasi"),
      color: "from-violet-500 to-purple-600",
      items: [
        { icon: MessageCircle, title: "Avto SMS", desc: "Avtomatik xabarnoma va eslatmalar" },
        { icon: Bot, title: "Telegram bot", desc: "Talaba va ota-ona uchun bot" },
        { icon: FileText, title: "Lidlar boshqaruvi", desc: "Potensial mijozlar bilan ishlash" },
        { icon: Bell, title: "Bildirishnomalar", desc: "Real vaqt push xabarlar" },
      ],
    },
    {
      title: t("features.cat_analytics", "Tahlil & Hisobot"),
      desc: t("features.cat_analytics_desc", "Chuqur statistika va biznes tahlil"),
      color: "from-amber-500 to-orange-600",
      items: [
        { icon: BarChart3, title: "Umumiy analiz", desc: "Daromad va o'sish ko'rsatkichlari" },
        { icon: TrendingUp, title: "To'lovlar analizi", desc: "Moliyaviy oqim tahlili" },
        { icon: Coins, title: "Coin tizimi", desc: "O'quvchilarni rag'batlantirish" },
        { icon: Calendar, title: "Bayram kunlari", desc: "Dam olish kunlari sozlamasi" },
      ],
    },
  ];

  const highlights = [
    "Multi-filial qo'llab-quvvatlash",
    "Bank darajasidagi xavfsizlik",
    "Mobil ilovalar (PWA)",
    "Real vaqt ma'lumotlar",
    "3 tilda interfeys",
    "24/7 texnik yordam",
  ];

  return (
    <div className="w-full">
      {/* HERO */}
      <section className="relative pt-20 pb-16 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-72 bg-indigo-500/10 blur-3xl rounded-full -z-10" />
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-3xl px-4"
        >
          <motion.p variants={fadeUp} className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-3">
            {t("features.label", "Imkoniyatlar")}
          </motion.p>
          <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            {t("features.title", "Markazingiz uchun barcha vositalar")}
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-slate-600 dark:text-slate-400 mt-5 max-w-2xl mx-auto">
            {t("features.subtitle", "O'quvchilarni boshqarishdan moliyaviy tahlilgacha — biznesingiz uchun kerakli barcha funksiyalar.")}
          </motion.p>
        </motion.div>
      </section>

      {/* CATEGORIES */}
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-4 space-y-16">
          {categories.map((cat, ci) => (
            <motion.div
              key={cat.title}
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {/* Category header */}
              <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
                <div className={`w-1.5 h-8 rounded-full bg-gradient-to-b ${cat.color}`} />
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">{cat.title}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{cat.desc}</p>
                </div>
              </motion.div>

              {/* Items grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {cat.items.map((item) => (
                  <motion.div
                    key={item.title}
                    variants={fadeUp}
                    whileHover={{ y: -4 }}
                    className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-xl hover:shadow-indigo-500/5 transition-all"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-3 shadow-lg`}>
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">{item.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="py-20 bg-slate-50/50 dark:bg-slate-950/30 border-y border-slate-200/60 dark:border-slate-800/60">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-black text-slate-900 dark:text-white mb-10"
          >
            {t("features.highlights_title", "Va yana ko'plab afzalliklar")}
          </motion.h2>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto"
          >
            {highlights.map((h) => (
              <motion.div
                key={h}
                variants={fadeUp}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{h}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">
              {t("features.cta_title", "Barchasini bepul sinab ko'ring")}
            </h2>
            <Link
              href="/pricing"
              className="group inline-flex h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl items-center gap-2 transition-all shadow-lg shadow-indigo-500/25 hover:-translate-y-0.5"
            >
              <span>{t("features.cta_button", "Boshlash")}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}