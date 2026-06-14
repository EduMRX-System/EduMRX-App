"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Calendar,
  CreditCard,
  Users,
  BarChart3,
  Bell,
  CheckSquare,
  Smartphone,
  ShieldCheck,
  FileSpreadsheet,
} from "lucide-react";

export default function FeaturesPage() {
  const { t } = useTranslation();

  // Kartalar konfiguratsiyasi va i18n kalit nomlari
  const features = [
    {
      key: "schedule",
      icon: Calendar,
      border: "border-t-purple-500",
      iconStyle: "text-purple-600 bg-purple-50 dark:bg-purple-950/40",
    },
    {
      key: "payments",
      icon: CreditCard,
      border: "border-t-emerald-500",
      iconStyle: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40",
    },
    {
      key: "students",
      icon: Users,
      border: "border-t-indigo-500",
      iconStyle: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40",
    },
    {
      key: "stats",
      icon: BarChart3,
      border: "border-t-teal-500",
      iconStyle: "text-teal-600 bg-teal-50 dark:bg-teal-950/40",
    },
    {
      key: "reminders",
      icon: Bell,
      border: "border-t-blue-500",
      iconStyle: "text-blue-600 bg-blue-50 dark:bg-blue-950/40",
    },
    {
      key: "attendance",
      icon: CheckSquare,
      border: "border-t-green-500",
      iconStyle: "text-green-600 bg-green-50 dark:bg-green-950/40",
    },
    {
      key: "mobile",
      icon: Smartphone,
      border: "border-t-violet-500",
      iconStyle: "text-violet-600 bg-violet-50 dark:bg-violet-500/10",
    },
    {
      key: "security",
      icon: ShieldCheck,
      border: "border-t-cyan-500",
      iconStyle: "text-cyan-600 bg-cyan-50 dark:bg-cyan-500/10",
    },
    {
      key: "reports",
      icon: FileSpreadsheet,
      border: "border-t-indigo-600",
      iconStyle: "text-indigo-600 bg-indigo-50 dark:bg-indigo-600/10",
    },
  ];

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 space-y-16">
        {/* Sarlavha bloki */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
            {t("featuresPage.title")}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">
            {t("featuresPage.subtitle")}
          </p>
        </div>

        {/* 3 Ustunli Flat Grid Kontenti */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, idx) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.25, delay: idx * 0.04 }}
              className={`p-6 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-900 border-t-4 ${item.border} flex flex-col items-start space-y-4`}
            >
              {/* Ikonka qutisi */}
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-slate-100/70 dark:border-slate-800 ${item.iconStyle}`}
              >
                <item.icon className="w-4 h-4" />
              </div>

              {/* Dinamik i18n Matnlari */}
              <div className="space-y-1.5">
                <h3 className="font-black text-sm text-slate-900 dark:text-white tracking-tight">
                  {t(`featuresPage.items.${item.key}.title`)}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-400 font-medium leading-relaxed">
                  {t(`featuresPage.items.${item.key}.description`)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
