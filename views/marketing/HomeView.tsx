"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  Shield,
  Users,
  BarChart3,
  CreditCard,
  GraduationCap,
  ClipboardCheck,
  MessageCircle,
  Bot,
  Coins,
  TrendingUp,
  Building2,
  Bell,
  Calendar,
  CheckCircle2,
  Sparkles,
  Lock,
  Zap,
  Globe,
} from "lucide-react";
import ScrollReveal from "@/components/common/marketing/ScrollReveal";


// ─── Animation presets ──────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};


export default function HomeView() {
  const [isLocal, setIsLocal] = useState(false);


  const { t } = useTranslation();
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -40]);

  useEffect(() => {
    setIsLocal(window.location.hostname.includes("localhost"));
  }, []);

  const loginBase = isLocal
    ? "http://login.localhost:3000"
    : "https://login.edumrx.uz";

  // Asosiy features (ta'lim CRM)
  const features = [
    { icon: Users, key: "students", title: "O'quvchilar bazasi", desc: "Barcha o'quvchilar ma'lumotlari, qabul jarayoni va arxiv bitta joyda." },
    { icon: GraduationCap, key: "groups", title: "Guruh va kurslar", desc: "Guruhlarni boshqarish, dars jadvali va o'qituvchi biriktirish." },
    { icon: ClipboardCheck, key: "attendance", title: "Elektron davomat", desc: "Real vaqtda davomat olish, statistika va avtomatik hisobotlar." },
    { icon: CreditCard, key: "payments", title: "To'lovlar tizimi", desc: "To'lovlarni kuzatish, qarzdorlar nazorati va moliyaviy oqim." },
    { icon: BarChart3, key: "analytics", title: "Chuqur analitika", desc: "Daromad, o'sish va o'qituvchilar reytingi bo'yicha to'liq tahlil." },
    { icon: MessageCircle, key: "sms", title: "Avto SMS xabarlar", desc: "Ota-onalarga avtomatik xabarnomalar, to'lov eslatmalari." },
    { icon: Bot, key: "telegram", title: "Telegram bot", desc: "Talaba va ota-onalar uchun integratsiyalashgan Telegram bot." },
    { icon: Coins, key: "coins", title: "Coin motivatsiya", desc: "O'quvchilarni rag'batlantirish uchun coin va mukofot tizimi." },
  ];

  // Statistika
  const stats = [
    { value: "10,000+", label: "Faol o'quvchilar" },
    { value: "200+", label: "O'quv markazlari" },
    { value: "99.9%", label: "Uptime kafolati" },
    { value: "24/7", label: "Texnik yordam" },
  ];

  // Role panellari
  const panels = [
    { icon: Shield, title: "Director", desc: "To'liq nazorat, moliya auditi va strategik hisobotlar.", color: "from-indigo-500 to-blue-600", loginUrl: "/staff" },
    { icon: Users, title: "Manager", desc: "O'quvchilar qabuli, guruhlar va kundalik operatsiyalar.", color: "from-violet-500 to-purple-600", loginUrl: "/staff" },
    { icon: GraduationCap, title: "Teacher", desc: "Dars jadvali, davomat va o'quvchilar baholash.", color: "from-blue-500 to-cyan-600", loginUrl: "/" },
    { icon: MessageCircle, title: "Student & Parent", desc: "O'zlashtirish, to'lovlar va uy vazifalari.", color: "from-emerald-500 to-teal-600", loginUrl: "/" },
  ];

  // Afzalliklar
  const benefits = [
    { icon: Lock, title: "Bank darajasidagi xavfsizlik", desc: "Ma'lumotlaringiz shifrlangan va himoyalangan." },
    { icon: Zap, title: "Yashin tezligida ishlash", desc: "Optimallashtirilgan tizim — kechikishlarsiz." },
    { icon: Globe, title: "Istalgan joydan kirish", desc: "Bulutli platforma — kompyuter va telefondan." },
    { icon: Building2, title: "Multi-filial qo'llab-quvvatlash", desc: "Bir nechta filialni bitta panelda boshqaring." },
  ];

  return (
    <div className="w-full overflow-hidden">

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative pt-20 pb-24 sm:pt-28 sm:pb-32">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 dark:bg-indigo-500/[0.07] blur-3xl rounded-full" />
          <div
            className="absolute inset-0 opacity-[0.4] dark:opacity-[0.15]"
            style={{
              backgroundImage: `linear-gradient(to right, rgb(99 102 241 / 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgb(99 102 241 / 0.05) 1px, transparent 1px)`,
              backgroundSize: "64px 64px",
              maskImage: "radial-gradient(ellipse 60% 50% at 50% 0%, black, transparent)",
            }}
          />
        </div>

        <motion.div style={{ y: heroY }} className="mx-auto max-w-4xl px-4 text-center">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center gap-6"
          >
            {/* Badge */}
            <motion.div variants={fadeUp}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50">
                <Sparkles className="w-3.5 h-3.5" />
                <ScrollReveal direction="up" delay={0.1}>
                  <span>{t("home.badge", "O'zbekistondagi #1 ta'lim CRM platformasi")}</span>
                </ScrollReveal>
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.05]"
            >
              {t("home.title_1", "Ta'lim markazingizni")}
              <br />
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                  {t("home.title_2", "raqamlashtiring")}
                </span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute bottom-1 left-0 w-full h-3 bg-indigo-200/60 dark:bg-indigo-500/20 -z-0 origin-left rounded"
                />
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp}
              className="max-w-2xl text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed"
            >
              {t("home.subtitle", "O'quvchilar, davomat, to'lovlar va hisobotlar — barchasi bitta xavfsiz tizimda. Markazingizni professional darajada boshqaring.")}
            </motion.p>

            {/* CTA buttons */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Link
                href="/pricing"
                className="group inline-flex h-12 px-7 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl items-center gap-2 transition-all shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5"
              >
                <span>{t("home.cta_primary", "Bepul sinab ko'rish")}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-12 px-7 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-xl items-center gap-2 transition-all border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-0.5"
              >
                <span>{t("home.cta_secondary", "Demo so'rash")}</span>
              </Link>
            </motion.div>

            {/* Trust line */}
            <motion.div variants={fadeUp} className="flex items-center gap-2 pt-4 text-xs text-slate-500 dark:text-slate-500">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>{t("home.trust", "Kredit karta talab qilinmaydi · 14 kun bepul")}</span>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Hero dashboard mockup */}
        <motion.div
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto max-w-5xl px-4 mt-16"
        >
          <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl shadow-slate-900/10 dark:shadow-black/40 overflow-hidden">
            {/* Browser bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 rounded-md bg-white dark:bg-slate-800 text-[11px] text-slate-400 font-medium">
                  director.edumrx.uz
                </div>
              </div>
            </div>
            {/* Dashboard content */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
              {[
                { label: "Jami daromad", value: "₊245M", trend: "+12.5%", icon: TrendingUp },
                { label: "Faol o'quvchilar", value: "1,284", trend: "+8.2%", icon: Users },
                { label: "Bu oy to'lovlar", value: "892", trend: "+15.3%", icon: CreditCard },
              ].map((card, i) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="p-4 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center">
                      <card.icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
                      {card.trend}
                    </span>
                  </div>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">{card.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{card.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════ STATS ═══════════════ */}
      <section className="py-12 border-y border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/30">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto max-w-5xl px-4 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((stat) => (
            <motion.div key={stat.label} variants={fadeUp} className="text-center">
              <p className="text-3xl sm:text-4xl font-black bg-gradient-to-br from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══════════════ FEATURES ═══════════════ */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <motion.p variants={fadeUp} className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-3">
              {t("home.features_label", "Imkoniyatlar")}
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {t("home.features_title", "Markaz uchun barcha vositalar")}
            </motion.h2>
            <motion.p variants={fadeUp} className="text-base text-slate-600 dark:text-slate-400 mt-4">
              {t("home.features_desc", "Ta'lim biznesingizni boshqarish uchun kerakli barcha funksiyalar bitta platformada jamlangan.")}
            </motion.p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.key}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-xl hover:shadow-indigo-500/5 transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors">
                  <feature.icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1.5">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ PANELS ═══════════════ */}
      <section className="py-24 bg-slate-50/50 dark:bg-slate-950/30 border-y border-slate-200/60 dark:border-slate-800/60">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <motion.p variants={fadeUp} className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-3">
              {t("home.panels_label", "Rollar")}
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {t("home.panels_title", "Har bir foydalanuvchi uchun alohida panel")}
            </motion.h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {panels.map((panel) => {
              const path = panel.loginUrl === "/staff" ? "/staff" : "/";
              const href = `${loginBase}${path}`;

              return (
                <motion.a
                  key={panel.title}
                  href={href}
                  variants={fadeUp}
                  whileHover={{ y: -6 }}
                  className="group relative p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden transition-all hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700 cursor-pointer block"
                >
                  {/* Gradient glow on hover */}
                  <div className={`absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br ${panel.color} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity rounded-full`} />

                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${panel.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    <panel.icon className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
                    {panel.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                    {panel.desc}
                  </p>

                  {/* Hover da chiqadigan "Kirish" */}
                  <div className="flex items-center gap-1.5 text-sm font-bold text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                    <span>Kirish</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>

                  {/* Corner arrow badge */}
                  <div className="absolute top-5 right-5 w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
                    <ArrowRight className="w-4 h-4 text-indigo-600 dark:text-indigo-400 -rotate-45" />
                  </div>
                </motion.a>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ BENEFITS ═══════════════ */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-4 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left text */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.p variants={fadeUp} className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-3">
              {t("home.why_label", "Nega aynan biz")}
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-8">
              {t("home.why_title", "Ishonchli va xavfsiz platforma")}
            </motion.h2>

            <div className="space-y-5">
              {benefits.map((benefit) => (
                <motion.div key={benefit.title} variants={fadeUp} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center shrink-0">
                    <benefit.icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">{benefit.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{benefit.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right visual */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-8 overflow-hidden shadow-2xl shadow-indigo-500/20">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_60%)]" />
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center border border-white/20">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold">SSL Shifrlangan</p>
                    <p className="text-indigo-200 text-xs">256-bit himoya</p>
                  </div>
                </div>

                {/* Mini stats */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Bell, label: "Bildirishnomalar", value: "Real-time" },
                    { icon: Calendar, label: "Dars jadvali", value: "Avtomatik" },
                    { icon: Coins, label: "Coin tizimi", value: "Faol" },
                    { icon: BarChart3, label: "Hisobotlar", value: "Jonli" },
                  ].map((item) => (
                    <div key={item.label} className="p-3 rounded-xl bg-white/10 backdrop-blur border border-white/10">
                      <item.icon className="w-4 h-4 text-indigo-200 mb-2" />
                      <p className="text-white text-sm font-bold">{item.value}</p>
                      <p className="text-indigo-200 text-[10px]">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-4">
          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-indigo-950 dark:to-slate-900 p-10 sm:p-16 text-center overflow-hidden border border-slate-800"
          >
            {/* Grid bg */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `linear-gradient(to right, rgb(99 102 241 / 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgb(99 102 241 / 0.2) 1px, transparent 1px)`,
                backgroundSize: "32px 32px",
                maskImage: "radial-gradient(ellipse 80% 60% at 50% 50%, black, transparent)",
              }}
            />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-indigo-500/20 blur-3xl rounded-full" />

            <div className="relative z-10 flex flex-col items-center gap-6">
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {t("home.cta_title", "Bugun boshlang, farqni his qiling")}
              </h2>
              <p className="text-slate-300 max-w-lg">
                {t("home.cta_desc", "Minglab o'quv markazlari EduMRX bilan o'z biznesini professional darajaga olib chiqdi. Endi navbat sizda.")}
              </p>
              <Link
                href="/pricing"
                className="group inline-flex h-12 px-8 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl items-center gap-2 transition-all shadow-lg shadow-indigo-500/30 hover:-translate-y-0.5"
              >
                <span>{t("home.cta_button", "Bepul boshlash")}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
