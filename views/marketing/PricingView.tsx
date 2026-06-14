"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Check, X, ArrowRight, Sparkles, HelpCircle } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function PricingView() {
  const { t } = useTranslation();
  const [yearly, setYearly] = useState(false);

  const plans = [
    {
      name: t("pricing.starter", "Boshlang'ich"),
      desc: t("pricing.starter_desc", "Kichik markazlar uchun"),
      monthly: 299000,
      yearly: 2990000,
      popular: false,
      features: [
        { text: "200 tagacha o'quvchi", included: true },
        { text: "5 ta menejer", included: true },
        { text: "Davomat va to'lovlar", included: true },
        { text: "Asosiy hisobotlar", included: true },
        { text: "SMS xabarlar", included: false },
        { text: "Telegram bot", included: false },
        { text: "Coin tizimi", included: false },
      ],
    },
    {
      name: t("pricing.pro", "Professional"),
      desc: t("pricing.pro_desc", "O'rta markazlar uchun"),
      monthly: 599000,
      yearly: 5990000,
      popular: true,
      features: [
        { text: "1000 tagacha o'quvchi", included: true },
        { text: "Cheksiz menejerlar", included: true },
        { text: "Barcha asosiy funksiyalar", included: true },
        { text: "Chuqur analitika", included: true },
        { text: "SMS xabarlar", included: true },
        { text: "Telegram bot", included: true },
        { text: "Coin tizimi", included: false },
      ],
    },
    {
      name: t("pricing.enterprise", "Korporativ"),
      desc: t("pricing.enterprise_desc", "Yirik tarmoqlar uchun"),
      monthly: 1199000,
      yearly: 11990000,
      popular: false,
      features: [
        { text: "Cheksiz o'quvchilar", included: true },
        { text: "Multi-filial boshqaruv", included: true },
        { text: "Barcha funksiyalar", included: true },
        { text: "Maxsus integratsiyalar", included: true },
        { text: "SMS xabarlar", included: true },
        { text: "Telegram bot", included: true },
        { text: "Coin tizimi", included: true },
      ],
    },
  ];

  const faqs = [
    { q: "Bepul sinov muddati bormi?", a: "Ha, barcha tariflar uchun 14 kunlik bepul sinov mavjud. Kredit karta talab qilinmaydi." },
    { q: "Tarifni keyinroq o'zgartira olamanmi?", a: "Albatta. Istalgan vaqtda tarifni yuqori yoki past darajaga o'tkazishingiz mumkin." },
    { q: "To'lov qanday amalga oshiriladi?", a: "Click, Payme va bank o'tkazmalari orqali to'lov qilishingiz mumkin." },
    { q: "Ma'lumotlarim xavfsizmi?", a: "Ha, barcha ma'lumotlar shifrlangan va xavfsiz serverlarda saqlanadi." },
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("uz-UZ").format(price);

  return (
    <div className="w-full">
      {/* HERO */}
      <section className="relative pt-20 pb-12 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-72 bg-indigo-500/10 blur-3xl rounded-full -z-10" />
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-3xl px-4"
        >
          <motion.p variants={fadeUp} className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-3">
            {t("pricing.label", "Tariflar")}
          </motion.p>
          <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            {t("pricing.title", "Sizga mos rejani tanlang")}
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-slate-600 dark:text-slate-400 mt-5">
            {t("pricing.subtitle", "Markazingiz hajmiga mos tarif. Istalgan vaqtda o'zgartiring.")}
          </motion.p>

          {/* Billing toggle */}
          <motion.div variants={fadeUp} className="inline-flex items-center gap-3 mt-8 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setYearly(false)}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${!yearly ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-sm" : "text-slate-500"
                }`}
            >
              {t("pricing.monthly", "Oylik")}
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-1.5 ${yearly ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-sm" : "text-slate-500"
                }`}
            >
              {t("pricing.yearly", "Yillik")}
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
                -17%
              </span>
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* PLANS */}
      <section className="py-12">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto max-w-6xl px-4 grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              className={`relative p-7 rounded-2xl border transition-all ${plan.popular
                  ? "bg-white dark:bg-slate-900 border-indigo-500 dark:border-indigo-500 shadow-2xl shadow-indigo-500/10 lg:scale-105"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-bold shadow-lg">
                    <Sparkles className="w-3 h-3" />
                    {t("pricing.popular", "Mashhur")}
                  </div>
                </div>
              )}

              {/* Header */}
              <div className="mb-6">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">{plan.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{plan.desc}</p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={yearly ? "y" : "m"}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-baseline gap-1"
                  >
                    <span className="text-3xl font-black text-slate-900 dark:text-white">
                      {formatPrice(yearly ? Math.round(plan.yearly / 12) : plan.monthly)}
                    </span>
                    <span className="text-sm text-slate-500">{t("pricing.currency", "so'm/oy")}</span>
                  </motion.div>
                </AnimatePresence>
                {yearly && (
                  <p className="text-xs text-slate-400 mt-1">
                    {formatPrice(plan.yearly)} {t("pricing.per_year", "so'm/yil")}
                  </p>
                )}
              </div>

              {/* CTA */}
              <Link
                href="/contact"
                className={`w-full h-11 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all mb-6 ${plan.popular
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
              >
                <span>{t("pricing.choose", "Tanlash")}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Features */}
              <div className="space-y-3">
                {plan.features.map((f) => (
                  <div key={f.text} className="flex items-center gap-2.5">
                    {f.included ? (
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-slate-300 dark:text-slate-700 shrink-0" />
                    )}
                    <span className={`text-sm ${f.included ? "text-slate-700 dark:text-slate-200" : "text-slate-400 dark:text-slate-600 line-through"}`}>
                      {f.text}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-slate-50/50 dark:bg-slate-950/30 border-y border-slate-200/60 dark:border-slate-800/60">
        <div className="mx-auto max-w-3xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">
              {t("pricing.faq_title", "Ko'p so'raladigan savollar")}
            </h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left"
                >
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{faq.q}</span>
                  <motion.div animate={{ rotate: openFaq === i ? 45 : 0 }}>
                    <HelpCircle className="w-5 h-5 text-indigo-500 shrink-0" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p className="px-5 pb-5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}