"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Star,
  Shield,
  Clock,
  HelpCircle,
  Check,
  Smartphone,
  AlertCircle,
  Building2,
  Users,
  UserCheck,
  Sparkles,
} from "lucide-react";

export default function PricingPage() {
  const { t } = useTranslation();

  // Kalkulyator Input Steytlari (image_b773ba.png ga mos standart qiymatlar)
  const [studentCount, setStudentCount] = useState<number>(200);
  const [branchCount, setBranchCount] = useState<number>(1);
  const [teacherCount, setTeacherCount] = useState<number>(10);

  // Hisob-kitob natijalari uchun steytlar
  const [tariffName, setTariffName] = useState<string>("Starter");
  const [monthlyPrice, setMonthlyPrice] = useState<number>(199000);
  const [yearlyPrice, setYearlyPrice] = useState<number>(2149200);

  // Rangli yuqori chiziqlar va stil boshqaruvi uchun o'zgaruvchi
  const [tariffColor, setTariffColor] = useState<string>(
    "bg-indigo-600 dark:bg-indigo-500",
  );

  // Har safar slayder o'zgarganda hisoblaydigan formula
  useEffect(() => {
    let basePrice = 199000;
    let currentTariff = "Starter";
    let colorClass = "bg-indigo-600 dark:bg-indigo-500";

    // 1. Tarif turini aniqlash shartlari
    if (studentCount > 500 || branchCount > 3 || teacherCount > 30) {
      currentTariff = "Enterprise";
      basePrice = 699000;
      colorClass = "bg-orange-600 dark:bg-orange-500";
    } else if (studentCount > 200 || branchCount > 1 || teacherCount > 15) {
      currentTariff = "Professional";
      basePrice = 399000;
      colorClass = "bg-purple-600 dark:bg-purple-500";
    } else {
      currentTariff = "Starter";
      basePrice = 199000;
      colorClass = "bg-indigo-600 dark:bg-indigo-500";
    }

    // 2. Qo'shimcha o'quvchilar uchun hisob-kitob (1200 tadan oshganda har biri 3,000 so'm)
    let extraCharge = 0;
    if (studentCount > 1200) {
      extraCharge = (studentCount - 1200) * 3000;
    }

    const totalMonthly = basePrice + extraCharge;
    // Yillik to'lov: 12 oyga ko'paytirib, 10% chegirma beriladi
    const totalYearly = Math.round(totalMonthly * 12 * 0.9);

    setTariffName(currentTariff);
    setMonthlyPrice(totalMonthly);
    setYearlyPrice(totalYearly);
    setTariffColor(colorClass);
  }, [studentCount, branchCount, teacherCount]);

  // Raqamlarni chiroyli formatlash (Masalan: 199,000)
  const formatMoney = (num: number) => {
    return num.toLocaleString("en-US");
  };

  return (
    <div className="w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 pb-24">
      {/* ================= HEADER HERO ================= */}
      <section className="mx-auto max-w-4xl px-4 pt-16 pb-8 text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
          {t("pricingPage.title")}
        </h1>
        <p className="mx-auto max-w-2xl text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">
          {t("pricingPage.subtitle")}
        </p>

        {/* Badges line */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-[11px] font-bold text-slate-400">
          <span className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-amber-500" />{" "}
            {t("pricingPage.badges.rating")}
          </span>
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-indigo-500" />{" "}
            {t("pricingPage.badges.secure")}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-500" />{" "}
            {t("pricingPage.badges.setup")}
          </span>
          <span className="flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-purple-500" />{" "}
            {t("pricingPage.badges.support")}
          </span>
        </div>
      </section>

      {/* ================= STATIC TARIF CARDS ================= */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-xs font-black tracking-widest text-indigo-600 dark:text-indigo-400 uppercase">
            {t("pricingPage.section_title")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Starter Plan */}
          <div className="p-6 rounded-2xl border border-slate-200/70 dark:border-slate-900 bg-white dark:bg-slate-950 flex flex-col justify-between space-y-6 relative">
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-lg font-black tracking-tight">Starter</h3>
                <p className="text-[11px] font-medium text-slate-400">
                  Kichik o'quv markazlari uchun
                </p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black tracking-tight">
                  199,000
                </span>
                <span className="text-xs font-medium text-slate-400">
                  /oyiga
                </span>
              </div>
              <ul className="space-y-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                {[
                  "200 tagacha o'quvchi",
                  "1 filial",
                  "15 tagacha o'qituvchi",
                  "Dars jadvali",
                  "Davomat nazorati",
                  "To'lovlar nazorati",
                  "Mobil ilova",
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />{" "}
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <button className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
              {t("pricingPage.btn_start")} →
            </button>
          </div>

          {/* Professional Plan (Featured) */}
          <div className="p-6 rounded-2xl border-2 border-indigo-600 dark:border-indigo-500 bg-white dark:bg-slate-950 flex flex-col justify-between space-y-6 relative">
            <div className="absolute top-0 right-6 -translate-y-1/2 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">
              Eng mashhur
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-lg font-black tracking-tight">
                  Professional
                </h3>
                <p className="text-[11px] font-medium text-slate-400">
                  O'rta hajmdagi o'quv markazlari uchun
                </p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black tracking-tight text-indigo-600 dark:text-indigo-400">
                  399,000
                </span>
                <span className="text-xs font-medium text-slate-400">
                  /oyiga
                </span>
              </div>
              <ul className="space-y-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                {[
                  "500 tagacha o'quvchi",
                  "3 filial",
                  "30 tagacha o'qituvchi",
                  "Dars jadvali",
                  "Davomat nazorati",
                  "To'lovlar nazorati",
                  "Hisobotlar",
                  "SMS xabarnomalar",
                  "Mobil ilova",
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-indigo-500 shrink-0" />{" "}
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <button className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors">
              {t("pricingPage.btn_start")} →
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="p-6 rounded-2xl border border-slate-200/70 dark:border-slate-900 bg-white dark:bg-slate-950 flex flex-col justify-between space-y-6 relative">
            <div className="absolute top-0 right-6 -translate-y-1/2 bg-amber-500 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">
              To'liq imkoniyatlar
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-lg font-black tracking-tight">
                  Enterprise
                </h3>
                <p className="text-[11px] font-medium text-slate-400">
                  Katta o'quv markazlari uchun
                </p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black tracking-tight">
                  699,000
                </span>
                <span className="text-xs font-medium text-slate-400">
                  /oyiga
                </span>
              </div>
              <ul className="space-y-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                {[
                  "1000 tagacha o'quvchi",
                  "∞ filial",
                  "50 tagacha o'qituvchi",
                  "Dars jadvali",
                  "Davomat nazorati",
                  "To'lovlar nazorati",
                  "Hisobotlar",
                  "SMS xabarnomalar",
                  "Mobil ilova",
                  "API integratsiya",
                  "Maxsus funksiyalar",
                  "24/7 qo'llab-quvvatlash",
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-500 shrink-0" />{" "}
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <button className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
              {t("pricingPage.btn_start")} →
            </button>
          </div>
        </div>

        {/* Micro alerts line */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 items-center justify-center text-[11px] font-bold">
          <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5" />{" "}
            {t("pricingPage.free_mobile")}
          </span>
          <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />{" "}
            {t("pricingPage.extra_note")}
          </span>
        </div>
      </section>

      {/* ================= INTERACTIVE DYNAMIC CALCULATOR ================= */}
      <section className="mx-auto max-w-4xl px-4 py-16 border-t border-slate-100 dark:border-slate-900/50 space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            {t("pricingPage.calc_title")}
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            {t("pricingPage.calc_subtitle")}
          </p>
        </div>

        {/* Sliders Box */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Students Slayder */}
          <div className="p-5 rounded-2xl border border-slate-100 dark:border-slate-900 bg-slate-50/40 dark:bg-slate-900/10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-100/40 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  {t("pricingPage.labels.students")}
                </p>
                <p className="text-base font-black">{studentCount}</p>
              </div>
            </div>
            <input
              type="range"
              min="50"
              max="2000"
              step="10"
              value={studentCount}
              onChange={(e) => setStudentCount(Number(e.target.value))}
              className="w-full accent-indigo-600 dark:accent-indigo-400 h-1 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold">
              <span>50</span>
              <span>2000</span>
            </div>
          </div>

          {/* Branches Slayder */}
          <div className="p-5 rounded-2xl border border-slate-100 dark:border-slate-900 bg-slate-50/40 dark:bg-slate-900/10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-100/40 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  {t("pricingPage.labels.branches")}
                </p>
                <p className="text-base font-black">{branchCount}</p>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              step="1"
              value={branchCount}
              onChange={(e) => setBranchCount(Number(e.target.value))}
              className="w-full accent-indigo-600 dark:accent-indigo-400 h-1 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold">
              <span>1</span>
              <span>15</span>
            </div>
          </div>

          {/* Teachers Slayder */}
          <div className="p-5 rounded-2xl border border-slate-100 dark:border-slate-900 bg-slate-50/40 dark:bg-slate-900/10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-100/40 flex items-center justify-center">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  {t("pricingPage.labels.teachers")}
                </p>
                <p className="text-base font-black">{teacherCount}</p>
              </div>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              step="1"
              value={teacherCount}
              onChange={(e) => setTeacherCount(Number(e.target.value))}
              className="w-full accent-indigo-600 dark:accent-indigo-400 h-1 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold">
              <span>5</span>
              <span>100</span>
            </div>
          </div>
        </div>

        {/* Dynamic Calculation Output Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
          {/* Active Badge Status Card */}
          <div
            className={`md:col-span-4 p-5 rounded-2xl text-white flex flex-col justify-between space-y-4 transition-all duration-300 ${tariffColor}`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-white/80" />
                <span className="text-xs font-black uppercase tracking-wider">
                  {tariffName} {t("pricingPage.labels.tariff_label")}
                </span>
              </div>
              <p className="text-[11px] text-white/80 font-medium leading-normal">
                {t("pricingPage.labels.details", {
                  students: studentCount,
                  branches: branchCount,
                  teachers: teacherCount,
                })}
              </p>
            </div>
          </div>

          {/* Monthly Block */}
          <div className="md:col-span-4 p-5 rounded-2xl border border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950 flex flex-col justify-center space-y-0.5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
              {t("pricingPage.labels.monthly")}
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-slate-900 dark:text-white">
                {formatMoney(monthlyPrice)}
              </span>
              <span className="text-xs font-bold text-slate-400">UZS / oy</span>
            </div>
          </div>

          {/* Yearly Block */}
          <div className="md:col-span-4 p-5 rounded-2xl border border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950 flex flex-col justify-center relative">
            <span className="absolute top-3 right-4 bg-emerald-500 text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md">
              {t("pricingPage.labels.discount")}
            </span>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
              {t("pricingPage.labels.yearly")}
            </p>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-black text-slate-900 dark:text-white">
                {formatMoney(yearlyPrice)}
              </span>
              <span className="text-xs font-bold text-slate-400">
                UZS / yil
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic limit warning hint block */}
        {studentCount > 1200 && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 flex items-center gap-3 text-amber-800 dark:text-amber-400 text-xs font-semibold"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>{t("pricingPage.extra_note")}</span>
          </motion.div>
        )}
      </section>

      {/* ================= TRIAL BENEFITS FOOTER ================= */}
      <section className="mx-auto max-w-4xl px-4 py-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-t border-slate-100 dark:border-slate-900/50">
        <div className="md:col-span-6 space-y-4">
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-100/40">
            {t("pricingPage.trial_title")}
          </div>
          <h3 className="text-xl font-black tracking-tight">
            {t("pricingPage.trial_subtitle")}
          </h3>
          <p className="text-xs text-slate-400 font-medium leading-relaxed">
            {t("pricingPage.trial_desc")}
          </p>
          <button className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors">
            {t("pricingPage.trial_btn")}
          </button>
        </div>

        <div className="md:col-span-6 bg-slate-50/60 dark:bg-slate-900/20 p-6 rounded-2xl border border-slate-100 dark:border-slate-900/60 space-y-4">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">
            {t("pricingPage.benefits_title")}
          </h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] font-bold text-slate-600 dark:text-slate-300">
            {(
              t("pricingPage.benefits", { returnObjects: true }) as string[]
            ).map((benefit, i) => (
              <li key={i} className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
