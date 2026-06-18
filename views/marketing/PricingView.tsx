"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Check,
  X,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Users,
  Building2,
  BookOpen,
  TrendingUp,
  Lightbulb,
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

// ─── Kalkulyator narx mantig'i ──────────────────────────
// Bularni o'zingizning real narxlaringizga moslang.
const PRICING_CONFIG = {
  basePrice: 99_000,          // boshlang'ich narx (oyiga)
  perStudent: 500,            // har o'quvchi uchun (limit ichida)
  studentsIncluded: 200,      // bazaga kiritilgan o'quvchilar soni
  perBranch: 50_000,          // har qo'shimcha filial (1-chisi bepul)
  perTeacher: 5_000,          // har o'qituvchi (limit ichida)
  teachersIncluded: 10,       // bazaga kiritilgan o'qituvchilar
  extraStudentThreshold: 1200, // shu sondan keyin qo'shimcha narx
  extraStudentPrice: 3_000,   // threshold'dan oshgan har o'quvchi
  yearlyDiscount: 0.1,        // yillik to'lovda 10% chegirma
};

export default function PricingView() {
  const { t } = useTranslation();
  const [yearly, setYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Kalkulyator state
  const [students, setStudents] = useState(200);
  const [branches, setBranches] = useState(1);
  const [teachers, setTeachers] = useState(10);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("uz-UZ").format(Math.round(price));

  // ─── Kalkulyator hisobi ───
  const calc = useMemo(() => {
    const c = PRICING_CONFIG;

    // O'quvchilar narxi
    const billableStudents = Math.max(0, students - c.studentsIncluded);
    let studentsCost = billableStudents * c.perStudent;

    // Threshold'dan oshgan o'quvchilar uchun qo'shimcha
    if (students > c.extraStudentThreshold) {
      const extra = students - c.extraStudentThreshold;
      studentsCost += extra * c.extraStudentPrice;
    }

    // Filiallar (1-chisi bazada)
    const branchesCost = Math.max(0, branches - 1) * c.perBranch;

    // O'qituvchilar
    const billableTeachers = Math.max(0, teachers - c.teachersIncluded);
    const teachersCost = billableTeachers * c.perTeacher;

    const monthly = c.basePrice + studentsCost + branchesCost + teachersCost;
    const yearlyTotal = monthly * 12 * (1 - c.yearlyDiscount);

    return { monthly, yearlyTotal };
  }, [students, branches, teachers]);

  const plans = [
    {
      key: "starter",
      monthly: 299000,
      yearly: 2990000,
      popular: false,
      features: [
        { key: "students_200", included: true },
        { key: "managers_5", included: true },
        { key: "attendance_payments", included: true },
        { key: "basic_reports", included: true },
        { key: "sms", included: false },
        { key: "telegram", included: false },
        { key: "coins", included: false },
      ],
    },
    {
      key: "pro",
      monthly: 599000,
      yearly: 5990000,
      popular: true,
      features: [
        { key: "students_1000", included: true },
        { key: "unlimited_managers", included: true },
        { key: "all_basic", included: true },
        { key: "deep_analytics", included: true },
        { key: "sms", included: true },
        { key: "telegram", included: true },
        { key: "coins", included: false },
      ],
    },
    {
      key: "enterprise",
      monthly: 1199000,
      yearly: 11990000,
      popular: false,
      features: [
        { key: "unlimited_students", included: true },
        { key: "multibranch", included: true },
        { key: "all_features", included: true },
        { key: "custom_integrations", included: true },
        { key: "sms", included: true },
        { key: "telegram", included: true },
        { key: "coins", included: true },
      ],
    },
  ];

  const faqKeys = ["trial", "change_plan", "payment", "security"];

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
            {t("marketing.pricing.label")}
          </motion.p>
          <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            {t("marketing.pricing.title")}
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-slate-600 dark:text-slate-400 mt-5">
            {t("marketing.pricing.subtitle")}
          </motion.p>

          {/* Billing toggle */}
          <motion.div variants={fadeUp} className="inline-flex items-center gap-3 mt-8 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setYearly(false)}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${!yearly ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-sm" : "text-slate-500"
                }`}
            >
              {t("marketing.pricing.monthly")}
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-1.5 ${yearly ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-sm" : "text-slate-500"
                }`}
            >
              {t("marketing.pricing.yearly")}
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
              key={plan.key}
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
                    {t("marketing.pricing.popular")}
                  </div>
                </div>
              )}

              {/* Header */}
              <div className="mb-6">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">{t(`marketing.pricing.plans.${plan.key}.name`)}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t(`marketing.pricing.plans.${plan.key}.desc`)}</p>
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
                    <span className="text-sm text-slate-500">{t("marketing.pricing.currency")}</span>
                  </motion.div>
                </AnimatePresence>
                {yearly && (
                  <p className="text-xs text-slate-400 mt-1">
                    {formatPrice(plan.yearly)} {t("marketing.pricing.per_year")}
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
                <span>{t("marketing.pricing.choose")}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Features */}
              <div className="space-y-3">
                {plan.features.map((f) => (
                  <div key={f.key} className="flex items-center gap-2.5">
                    {f.included ? (
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-slate-300 dark:text-slate-700 shrink-0" />
                    )}
                    <span className={`text-sm ${f.included ? "text-slate-700 dark:text-slate-200" : "text-slate-400 dark:text-slate-600 line-through"}`}>
                      {t(`marketing.pricing.features.${f.key}`)}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>


      {/* ═══════════════ CALCULATOR ═══════════════ */}
      <section className="py-12">
        <div className="mx-auto max-w-5xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {t("marketing.pricing.calc.title")}
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400 mt-3">
              {t("marketing.pricing.calc.subtitle")}
            </p>
          </motion.div>

          {/* Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            {/* Students */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center">
                  <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t("marketing.pricing.calc.students")}</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">{students}</p>
                </div>
              </div>
              <input
                type="range"
                min={50}
                max={2000}
                step={10}
                value={students}
                onChange={(e) => setStudents(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>50</span>
                <span>2000</span>
              </div>
            </div>

            {/* Branches */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/50 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t("marketing.pricing.calc.branches")}</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">{branches}</p>
                </div>
              </div>
              <input
                type="range"
                min={1}
                max={15}
                step={1}
                value={branches}
                onChange={(e) => setBranches(Number(e.target.value))}
                className="range-slider w-full"
                style={{ "--fill": `${((branches - 1) / (15 - 1)) * 100}%`, "--accent": "#8b5cf6" } as React.CSSProperties}
              />
              <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 mt-1">
                <span>1</span>
                <span>15</span>
              </div>
            </div>

            {/* Teachers */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t("marketing.pricing.calc.teachers")}</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">{teachers}</p>
                </div>
              </div>
              <input
                type="range"
                min={5}
                max={100}
                step={1}
                value={teachers}
                onChange={(e) => setTeachers(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>5</span>
                <span>100</span>
              </div>
            </div>
          </div>

          {/* Result */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Summary card */}
            <div className="relative p-6 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-black text-lg">{t("marketing.pricing.calc.your_plan")}</p>
                  <TrendingUp className="w-5 h-5" />
                </div>
                <p className="text-sm text-indigo-100 leading-relaxed">
                  {t("marketing.pricing.calc.summary", { students, branches, teachers })}
                </p>
              </div>
            </div>

            {/* Monthly */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">{t("marketing.pricing.calc.monthly_label")}</p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={calc.monthly}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="text-3xl font-black text-slate-900 dark:text-white mt-1"
                >
                  {formatPrice(calc.monthly)}
                </motion.p>
              </AnimatePresence>
              <p className="text-xs text-slate-400 mt-1">{t("marketing.pricing.calc.per_month")}</p>
            </div>

            {/* Yearly */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">{t("marketing.pricing.calc.yearly_label")}</p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={calc.yearlyTotal}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="text-3xl font-black text-slate-900 dark:text-white mt-1"
                >
                  {formatPrice(calc.yearlyTotal)}
                </motion.p>
              </AnimatePresence>
              <p className="text-xs font-bold text-emerald-600 mt-1">{t("marketing.pricing.calc.discount")}</p>
            </div>
          </div>

          {/* Note */}
          <div className="mt-5 flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40">
            <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 dark:text-white">
              {t("marketing.pricing.calc.note", {
                threshold: PRICING_CONFIG.extraStudentThreshold,
                price: formatPrice(PRICING_CONFIG.extraStudentPrice),
              })}
            </p>
          </div>
        </div>
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
              {t("marketing.pricing.faq_title")}
            </h2>
          </motion.div>

          <div className="space-y-3">
            {faqKeys.map((key, i) => (
              <motion.div
                key={key}
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
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{t(`marketing.pricing.faq.${key}.q`)}</span>
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
                        {t(`marketing.pricing.faq.${key}.a`)}
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