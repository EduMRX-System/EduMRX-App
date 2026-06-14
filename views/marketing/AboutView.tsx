"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Building2,
  Users2,
  Star,
  Calendar,
  CheckCircle2,
  Shield,
  Zap,
  HeartHandshake,
  Globe2,
  ChevronRight,
} from "lucide-react";

const resources = {
  uz: {
    translation: {
      about: {
        badge: "Biz haqimizda",
        hero_title_1: "O'zbekistondagi",
        hero_title_2: "#1 Ta'lim CRM",
        hero_desc:
          "EducationCRM — o'quv markazlarini avtomatlashtirish va raqamlashtirish uchun yaratilgan professional platforma. Director, Manager va Teacher panellari bilan to'liq boshqaruv.",

        // Stats
        stat_centers: "O'quv markazlar",
        stat_students: "Faol o'quvchilar",
        stat_rating: "Mijozlar reytingi",
        stat_created: "Tashkil etilgan",

        // Purpose
        purpose_badge: "Bizning maqsadimiz",
        purpose_title: "Bizning Maqsadimiz",
        purpose_p1:
          "O'quv markazlar uchun zamonaviy va samarali CRM tizimi yaratish ta'lim tizimini raqamlashtirish, avtomatlashtirish va tizimlashtirish oliy maqsad qilingan. Biz ta'lim sohasida texnologiya orqali samaradorlikni oshirishni maqsad qilganmiz.",
        purpose_p2:
          "2024-yilda tashkil etilgan EducationCRM kompaniyasi hozirda ko'plab o'quv markazida ishlatilmoqda va ularning samaradorligini sezilarli darajada oshirmoqda.",
        check_time: "Vaqtni tejash",
        check_errors: "Xatolarni kamaytirish",
        check_efficiency: "Samaradorlikni oshirish",
        check_free: "Bepul foydalanish",

        // Why us card
        why_title: "Nega aynan biz?",
        why_1_title: "100% Bepul",
        why_1_desc: "Barcha imkoniyatlar bepul",
        why_2_title: "24/7 Yordam",
        why_2_desc: "Doimo yordam beramiz",
        why_3_title: "Oson ishlatish",
        why_3_desc: "Sodda va qulay interfeys",
        feature_director: "Director panel — to'liq nazorat",
        feature_manager: "Manager panel — boshqaruv",
        feature_teacher: "Teacher panel — o'qituvchilar",
        feature_ai: "AI chatbot va support",
        feature_sms: "SMS va xabarnomalar",
        feature_reports: "Batafsil hisobotlar",

        // Values
        values_title: "Bizning qadriyatlarimiz",
        values_subtitle:
          "Har bir qaror va mahsulotimizda biz ushbu asosiy qadriyatlarga tayanamiz",
        val_trust_title: "Ishonchlilik",
        val_trust_desc:
          "Ma'lumotlaringiz 100% xavfsiz va shifrlangan. GDPR standartlariga mos.",
        val_speed_title: "Tezlik",
        val_speed_desc:
          "Tizim soniyalar ichida ishlaydi. Hech qanday kechikish yo'q.",
        val_support_title: "Qo'llab-quvvatlash",
        val_support_desc:
          "7/24 texnik yordam. Har qanday savolingizga javob beramiz.",
        val_lang_title: "Ko'p tillilik",
        val_lang_desc:
          "O'zbek, Rus va Ingliz tillarida to'liq qo'llab-quvvatlash.",
      },
    },
  },
  en: {
    translation: {
      about: {
        badge: "About Us",
        hero_title_1: "Uzbekistan's",
        hero_title_2: "#1 Education CRM",
        hero_desc:
          "EducationCRM is a professional platform designed to automate and digitalize training centers. Complete management with Director, Manager, and Teacher panels.",
        stat_centers: "Learning Centers",
        stat_students: "Active Students",
        stat_rating: "Client Rating",
        stat_created: "Established",
        purpose_badge: "Our Mission",
        purpose_title: "Our Mission",
        purpose_p1:
          "Creating a modern and efficient CRM system for training centers, aiming at digitalizing, automating, and systematizing the educational framework. We thrive to increase efficiency through technology.",
        purpose_p2:
          "Founded in 2024, EducationCRM is currently empowering numerous educational hubs, significantly upgrading their operational performance.",
        check_time: "Save Time",
        check_errors: "Reduce Mistakes",
        check_efficiency: "Boost Efficiency",
        check_free: "Free to Use",
        why_title: "Why choose us?",
        why_1_title: "100% Free",
        why_1_desc: "All features are free",
        why_2_title: "24/7 Support",
        why_2_desc: "Always here to help",
        why_3_title: "Easy to Use",
        why_3_desc: "Simple and intuitive UI",
        feature_director: "Director panel — complete control",
        feature_manager: "Manager panel — management",
        feature_teacher: "Teacher panel — instructors",
        feature_ai: "AI chatbot and support",
        feature_sms: "SMS and notifications",
        feature_reports: "Detailed reports",
        values_title: "Our Core Values",
        values_subtitle:
          "In every decision and product, we rely on these foundational pillars",
        val_trust_title: "Reliability",
        val_trust_desc:
          "Your data is 100% safe and encrypted. Compliant with GDPR standards.",
        val_speed_title: "Speed",
        val_speed_desc:
          "The system runs within seconds. Zero latency experienced.",
        val_support_title: "Support",
        val_support_desc:
          "24/7 technical assistance. We answer any questions you have.",
        val_lang_title: "Multilingual",
        val_lang_desc:
          "Full support across Uzbek, Russian, and English languages.",
      },
    },
  },
  ru: {
    translation: {
      about: {
        badge: "О нас",
        hero_title_1: "В Узбекистане",
        hero_title_2: "CRM для образования #1",
        hero_desc:
          "EducationCRM — профессиональная платформа для автоматизации и цифровизации учебных центров. Полное управление с панелями Директора, Менеджера и Учителя.",
        stat_centers: "Учебных центров",
        stat_students: "Активных студентов",
        stat_rating: "Рейтинг клиентов",
        stat_created: "Основано",
        purpose_badge: "Наша цель",
        purpose_title: "Наша Цель",
        purpose_p1:
          "Создание современной и эффективной CRM-системы для учебных центров, высшей целью которой является цифровизация, автоматизация и систематизация образования. Мы стремимся повысить эффективность сферы через технологии.",
        purpose_p2:
          "Компания EducationCRM, основанная в 2024 году, в настоящее время используется во многих учебных центрах, значительно повышая их эффективность.",
        check_time: "Экономия времени",
        check_errors: "Сокращение ошибок",
        check_efficiency: "Повышение отдачи",
        check_free: "Бесплатное использование",
        why_title: "Почему именно мы?",
        why_1_title: "100% Бесплатно",
        why_1_desc: "Все функции бесплатны",
        why_2_title: "Поддержка 24/7",
        why_2_desc: "Всегда готовы помочь",
        why_3_title: "Простота",
        why_3_desc: "Простой и удобный интерфейс",
        feature_director: "Панель директора — полный контроль",
        feature_manager: "Панель менеджера — управление",
        feature_teacher: "Панель учителя — преподаватели",
        feature_ai: "AI чат-бот и поддержка",
        feature_sms: "SMS и уведомления",
        feature_reports: "Детальные отчеты",
        values_title: "Наши ценности",
        values_subtitle:
          "В каждом решении и продукте мы опираемся на эти основные ценности",
        val_trust_title: "Надежность",
        val_trust_desc:
          "Ваши данные на 100% безопасны и зашифрованы. Соответствует стандартам GDPR.",
        val_speed_title: "Скорость",
        val_speed_desc: "Система работает за секунды. Никаких задержек.",
        val_support_title: "Поддержка",
        val_support_desc:
          "Техническая помощь 24/7. Ответим на любой ваш вопрос.",
        val_lang_title: "Мультиязычность",
        val_lang_desc:
          "Полная поддержка на узбекском, русском и английском языках.",
      },
    },
  },
};

export default function AboutPage() {
  const { t } = useTranslation();

  // Stats Data
  const stats = [
    { icon: Building2, value: "500+", label: t("about.stat_centers") },
    { icon: Users2, value: "50,000+", label: t("about.stat_students") },
    { icon: Star, value: "4.9/5", label: t("about.stat_rating") },
    { icon: Calendar, value: "2023", label: t("about.stat_created") },
  ];

  // Checkbox points
  const checks = [
    t("about.check_time"),
    t("about.check_errors"),
    t("about.check_efficiency"),
    t("about.check_free"),
  ];

  // Why Us Box Features
  const microFeatures = [
    t("about.feature_director"),
    t("about.feature_manager"),
    t("about.feature_teacher"),
    t("about.feature_ai"),
    t("about.feature_sms"),
    t("about.feature_reports"),
  ];

  // Values Card Data
  const values = [
    {
      icon: Shield,
      title: t("about.val_trust_title"),
      desc: t("about.val_trust_desc"),
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40 border-blue-100",
    },
    {
      icon: Zap,
      title: t("about.val_speed_title"),
      desc: t("about.val_speed_desc"),
      color: "text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-100",
    },
    {
      icon: HeartHandshake,
      title: t("about.val_support_title"),
      desc: t("about.val_support_desc"),
      color:
        "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100",
    },
    {
      icon: Globe2,
      title: t("about.val_lang_title"),
      desc: t("about.val_lang_desc"),
      color:
        "text-purple-600 bg-purple-50 dark:bg-purple-950/40 border-purple-100",
    },
  ];

  return (
    <div className="w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 pb-24">
      {/* ================= HERO SECTION ================= */}
      <section className="mx-auto max-w-4xl px-4 pt-16 pb-12 text-center space-y-5">
        <div className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
          ✦ {t("about.badge")}
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.15]">
          {t("about.hero_title_1")}{" "}
          <span className="text-indigo-600 dark:text-indigo-400 block sm:inline">
            {t("about.hero_title_2")}
          </span>
        </h1>

        <p className="mx-auto max-w-2xl text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
          {t("about.hero_desc")}
        </p>
      </section>

      {/* ================= STATS SECTION ================= */}
      <section className="mx-auto max-w-5xl px-4 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl border border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/20 flex flex-col items-center justify-center text-center space-y-2"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100/40">
                <stat.icon className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= MISSION & WHY US SECTION ================= */}
      <section className="mx-auto max-w-5xl px-4 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Our Purpose */}
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30">
            {t("about.purpose_badge")}
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            {t("about.purpose_title")}
          </h2>
          <div className="space-y-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            <p>{t("about.purpose_p1")}</p>
            <p>{t("about.purpose_p2")}</p>
          </div>

          {/* Checks list */}
          <div className="grid grid-cols-2 gap-3 pt-3">
            {checks.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Why Us Premium Console Card */}
        <div className="lg:col-span-5 bg-indigo-600 dark:bg-indigo-950 p-6 rounded-2xl border border-indigo-700 dark:border-indigo-900 text-white space-y-6">
          <div className="space-y-1.5">
            <h3 className="text-lg font-black tracking-tight">
              {t("about.why_title")}
            </h3>
          </div>

          {/* Why Steps */}
          <div className="space-y-4">
            {[
              {
                num: "1",
                title: t("about.why_1_title"),
                desc: t("about.why_1_desc"),
              },
              {
                num: "2",
                title: t("about.why_2_title"),
                desc: t("about.why_2_desc"),
              },
              {
                num: "3",
                title: t("about.why_3_title"),
                desc: t("about.why_3_desc"),
              },
            ].map((step) => (
              <div key={step.num} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-white/10 border border-white/20 flex items-center justify-center font-black text-xs shrink-0">
                  {step.num}
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-black">{step.title}</h4>
                  <p className="text-[11px] text-indigo-200 dark:text-indigo-300 font-medium">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <hr className="border-indigo-500/40 dark:border-indigo-900" />

          {/* Micro features grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-bold text-indigo-100">
            {microFeatures.map((feat, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <ChevronRight className="w-3 h-3 text-indigo-300 shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= VALUES SECTION ================= */}
      <section className="mx-auto max-w-5xl px-4 py-12 border-t border-slate-100 dark:border-slate-900/60 text-center space-y-12">
        <div className="space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            {t("about.values_title")}
          </h2>
          <p className="text-xs text-slate-400 font-medium leading-relaxed">
            {t("about.values_subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          {values.map((val, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950 flex flex-col justify-between min-h-[180px]"
            >
              <div className="space-y-4">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center border ${val.color}`}
                >
                  <val.icon className="w-4 h-4" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-bold text-xs text-slate-900 dark:text-white tracking-tight">
                    {val.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
