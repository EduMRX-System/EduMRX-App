"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Phone,
  Send,
  SendToBack,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  HelpCircle,
  Users2,
  ArrowUpRight,
} from "lucide-react";

export default function ContactPage() {
  const { t } = useTranslation();

  // Yuqori 6 ta asosiy bog'lanish kartalari
  const contactMethods = [
    {
      key: "phone",
      icon: Phone,
      style:
        "bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400",
    },
    {
      key: "telegram",
      icon: Send,
      style:
        "bg-blue-50/50 dark:bg-blue-950/10 border-blue-100 dark:border-blue-900/40 text-blue-600 dark:text-blue-400",
      link: "https://t.me/EduCrmSupport",
    },
    {
      key: "channel",
      icon: SendToBack,
      style:
        "bg-indigo-50/50 dark:bg-indigo-950/10 border-indigo-100 dark:border-indigo-900/40 text-indigo-600 dark:text-indigo-400",
      link: "https://t.me/educationcrm_uz",
    },
    {
      key: "instagram",
      icon: "Instagram",
      style:
        "bg-pink-50/50 dark:bg-pink-950/10 border-pink-100 dark:border-pink-900/40 text-pink-600 dark:text-pink-400",
      link: "https://instagram.com/educationcrm.uz",
    },
    {
      key: "email",
      icon: Mail,
      style:
        "bg-amber-50/50 dark:bg-amber-950/10 border-amber-100 dark:border-amber-900/40 text-amber-600 dark:text-amber-500",
      link: "mailto:info@educationcrm.uz",
    },
    {
      key: "address",
      icon: MapPin,
      style:
        "bg-purple-50/50 dark:bg-purple-950/10 border-purple-100 dark:border-purple-900/40 text-purple-600 dark:text-purple-400",
    },
  ];

  // Nega biz bilan bog'lanish kerak bloki
  const whyUs = [
    {
      key: "speed",
      icon: Clock,
      iconColor: "text-blue-600 bg-blue-50 dark:bg-blue-950/50",
    },
    {
      key: "security",
      icon: ShieldCheck,
      iconColor: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50",
    },
    {
      key: "consult",
      icon: HelpCircle,
      iconColor: "text-purple-600 bg-purple-50 dark:bg-purple-950/50",
    },
    {
      key: "team",
      icon: Users2,
      iconColor: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50",
    },
  ];

  // Kimlar uchun foydali ekanligi (Emoji bilan)
  const targets = [
    { key: "centers", emoji: "🏫" },
    { key: "schools", emoji: "🏛️" },
    { key: "kindergartens", emoji: "👶" },
    { key: "institutes", emoji: "🎓" },
    { key: "courses", emoji: "📚" },
    { key: "online", emoji: "🌐" },
  ];

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 pb-24">
      {/* ================= HERO BACKDROP SECTION ================= */}
      <section className="relative w-full bg-indigo-950 text-white py-20 px-4 text-center overflow-hidden border-b border-indigo-900">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e1b4b_1px,transparent_1px),linear-gradient(to_bottom,#1e1b4b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60" />

        <div className="relative max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-900/60 border border-indigo-700/50 text-[10px] font-black uppercase tracking-wider text-indigo-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {t("contactPage.badge")}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
            Savollaringiz <span className="text-indigo-400">bormi?</span>
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200/70 font-medium leading-relaxed max-w-2xl mx-auto">
            {t("contactPage.subtitle")}
          </p>
        </div>
      </section>

      {/* ================= BOG'LANISH USULLARI GRID ================= */}
      <section className="max-w-6xl mx-auto px-4 py-16 space-y-10">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            {t("contactPage.section_methods")}
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            {t("contactPage.section_methods_sub")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {contactMethods.map((method, idx) => {
            const CardWrapper = method.link ? "a" : "div";
            return (
              <motion.div
                key={method.key}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.2, delay: idx * 0.04 }}
              >
                <CardWrapper
                  href={method.link}
                  target={method.link ? "_blank" : undefined}
                  rel={method.link ? "noopener noreferrer" : undefined}
                  className={`p-6 rounded-2xl border bg-white dark:bg-slate-900/40 flex flex-col items-start space-y-4 ${method.style} ${method.link ? "hover:scale-[1.01] transition-transform cursor-pointer group" : ""}`}
                >
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-current/10 flex items-center justify-center shrink-0">
                    <method.icon className="w-4 h-4" />
                  </div>

                  <div className="space-y-1 w-full">
                    <p className="text-[10px] font-black tracking-wider opacity-60 uppercase">
                      {t(`contactPage.methods.${method.key}.title`)}
                    </p>
                    <div className="flex items-center gap-1 font-black text-sm text-slate-900 dark:text-white tracking-tight">
                      <span>
                        {t(`contactPage.methods.${method.key}.value`)}
                      </span>
                      {method.link && (
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium">
                      {t(`contactPage.methods.${method.key}.desc`)}
                    </p>
                  </div>
                </CardWrapper>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ================= DOUBLE BOTTOM PANELS ================= */}
      <section className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8 border-t border-slate-200/50 dark:border-slate-900/50">
        {/* Nega biz bilan bog'lanish kerak */}
        <div className="lg:col-span-5 space-y-6">
          <h3 className="text-lg font-black tracking-tight">
            {t("contactPage.why_title")}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {whyUs.map((item) => (
              <div
                key={item.key}
                className="p-5 rounded-2xl border border-slate-200/50 dark:border-slate-900 bg-white dark:bg-slate-900/20 space-y-3"
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.iconColor}`}
                >
                  <item.icon className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-black text-xs text-slate-900 dark:text-white tracking-tight">
                    {t(`contactPage.why.${item.key}_title`)}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                    {t(`contactPage.why.${item.key}_desc`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kimlar uchun foydali & CTA */}
        <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-lg font-black tracking-tight">
              {t("contactPage.who_title")}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {targets.map((target) => (
                <div
                  key={target.key}
                  className="p-3.5 rounded-xl border border-slate-200/50 dark:border-slate-900 bg-white dark:bg-slate-900/20 flex items-center gap-2.5 font-bold text-xs text-slate-800 dark:text-slate-200"
                >
                  <span className="text-base shrink-0">{target.emoji}</span>
                  <span className="truncate">
                    {t(`contactPage.targets.${target.key}`)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Box Banner */}
          <div className="p-6 rounded-2xl bg-indigo-600 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mt-4">
            <div className="space-y-1">
              <h4 className="font-black text-base tracking-tight">
                {t("contactPage.cta_title")}
              </h4>
              <p className="text-[11px] text-indigo-100/80 font-medium max-w-md leading-relaxed">
                {t("contactPage.cta_desc")}
              </p>
            </div>
            <button className="px-5 py-2.5 rounded-xl bg-white text-indigo-600 hover:bg-indigo-50 font-black text-xs transition-colors shrink-0 flex items-center gap-1">
              <span>{t("contactPage.cta_btn")}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
