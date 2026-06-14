"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Target,
  Eye,
  Heart,
  Users,
  Rocket,
  Award,
  TrendingUp,
  Building2,
  ArrowRight,
} from "lucide-react";

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

export default function AboutView() {
  const { t } = useTranslation();

  const values = [
    { icon: Target, title: "Maqsadimiz", desc: "Ta'lim markazlarini raqamlashtirib, ularning samaradorligini oshirish." },
    { icon: Eye, title: "Vizyonimiz", desc: "Markaziy Osiyodagi yetakchi ta'lim texnologiyalari platformasiga aylanish." },
    { icon: Heart, title: "Qadriyatlarimiz", desc: "Ishonch, shaffoflik va mijozlar muvaffaqiyatiga sodiqlik." },
  ];

  const stats = [
    { icon: Users, value: "10,000+", label: "Faol foydalanuvchilar" },
    { icon: Building2, value: "200+", label: "Hamkor markazlar" },
    { icon: Award, value: "99.9%", label: "Mamnunlik darajasi" },
    { icon: TrendingUp, value: "3x", label: "O'rtacha o'sish" },
  ];

  const timeline = [
    { year: "2024", title: "Boshlanish", desc: "EduMRX g'oyasi tug'ildi va birinchi prototip yaratildi." },
    { year: "2025", title: "Birinchi mijozlar", desc: "50 dan ortiq ta'lim markazi platformaga qo'shildi." },
    { year: "2026", title: "Kengayish", desc: "200+ markaz va 10,000+ faol foydalanuvchiga yetdik." },
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
            {t("about.label", "Biz haqimizda")}
          </motion.p>
          <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            {t("about.title", "Ta'lim kelajagini birga quramiz")}
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-slate-600 dark:text-slate-400 mt-5">
            {t("about.subtitle", "EduMRX — O'zbekistondagi ta'lim markazlarini zamonaviy texnologiyalar bilan kuchaytirishga bag'ishlangan jamoa.")}
          </motion.p>
        </motion.div>
      </section>

      {/* STATS */}
      <section className="py-12">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto max-w-5xl px-4 grid grid-cols-2 md:grid-cols-4 gap-5"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center"
            >
              <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center mx-auto mb-3">
                <stat.icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* VALUES */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {values.map((value) => (
              <motion.div
                key={value.title}
                variants={fadeUp}
                className="p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mb-4 shadow-lg">
                  <value.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">{value.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-16 bg-slate-50/50 dark:bg-slate-950/30 border-y border-slate-200/60 dark:border-slate-800/60">
        <div className="mx-auto max-w-3xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">
              {t("about.journey", "Bizning yo'limiz")}
            </h2>
          </motion.div>

          <div className="relative">
            {/* Line */}
            <div className="absolute left-[27px] top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-800" />

            <div className="space-y-8">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative flex gap-5"
                >
                  <div className="relative z-10 w-14 h-14 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/25">
                    <Rocket className="w-6 h-6 text-white" />
                  </div>
                  <div className="pt-1">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{item.year}</span>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">{item.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
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
              {t("about.cta_title", "Bizning hikoyamizning bir qismi bo'ling")}
            </h2>
            <Link
              href="/contact"
              className="group inline-flex h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl items-center gap-2 transition-all shadow-lg shadow-indigo-500/25 hover:-translate-y-0.5"
            >
              <span>{t("about.cta_button", "Biz bilan bog'laning")}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}