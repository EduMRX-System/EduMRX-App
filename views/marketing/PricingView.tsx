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

const PRICING_CONFIG = {
  basePrice: 99_000,
  perStudent: 500,
  studentsIncluded: 200,
  perBranch: 50_000,
  perTeacher: 5_000,
  teachersIncluded: 10,
  extraStudentThreshold: 1200,
  extraStudentPrice: 3_000,
  yearlyDiscount: 0.1,
};

export default function PricingView() {
  const { t } = useTranslation();
  const [yearly, setYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [students, setStudents] = useState(200);
  const [branches, setBranches] = useState(1);
  const [teachers, setTeachers] = useState(10);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("uz-UZ").format(Math.round(price));

  const calc = useMemo(() => {
    const c = PRICING_CONFIG;

    const billableStudents = Math.max(0, students - c.studentsIncluded);
    let studentsCost = billableStudents * c.perStudent;

    if (students > c.extraStudentThreshold) {
      const extra = students - c.extraStudentThreshold;
      studentsCost += extra * c.extraStudentPrice;
    }

    const branchesCost = Math.max(0, branches - 1) * c.perBranch;

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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-72 bg-primary/8 blur-3xl rounded-full -z-10" />
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-3xl px-4"
        >
          <motion.p variants={fadeUp} className="text-sm font-bold text-primary uppercase tracking-widest mb-3">
            {t("marketing.pricing.label")}
          </motion.p>
          <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl font-black tracking-tight text-foreground">
            {t("marketing.pricing.title")}
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-foreground-muted mt-5">
            {t("marketing.pricing.subtitle")}
          </motion.p>

          {/* Billing toggle */}
          <motion.div variants={fadeUp} className="inline-flex items-center gap-3 mt-8 p-1 rounded-xl bg-layout border border-border">
            <button
              onClick={() => setYearly(false)}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${!yearly ? "bg-surface text-primary shadow-sm" : "text-foreground-muted"
                }`}
            >
              {t("marketing.pricing.monthly")}
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-1.5 ${yearly ? "bg-surface text-primary shadow-sm" : "text-foreground-muted"
                }`}
            >
              {t("marketing.pricing.yearly")}
              <span className="text-[10px] font-bold text-success bg-success-bg px-1.5 py-0.5 rounded">
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
                ? "bg-surface border-primary shadow-2xl shadow-primary/10 lg:scale-105"
                : "bg-surface border-border"
                }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-primary-fg text-xs font-bold shadow-lg">
                    <Sparkles className="w-3 h-3" />
                    {t("marketing.pricing.popular")}
                  </div>
                </div>
              )}

              {/* Header */}
              <div className="mb-6">
                <h3 className="text-lg font-black text-foreground">{t(`marketing.pricing.plans.${plan.key}.name`)}</h3>
                <p className="text-sm text-foreground-muted mt-1">{t(`marketing.pricing.plans.${plan.key}.desc`)}</p>
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
                    <span className="text-3xl font-black text-foreground">
                      {formatPrice(yearly ? Math.round(plan.yearly / 12) : plan.monthly)}
                    </span>
                    <span className="text-sm text-foreground-muted">{t("marketing.pricing.currency")}</span>
                  </motion.div>
                </AnimatePresence>
                {yearly && (
                  <p className="text-xs text-foreground-subtle mt-1">
                    {formatPrice(plan.yearly)} {t("marketing.pricing.per_year")}
                  </p>
                )}
              </div>

              {/* CTA */}
              <Link
                href="/contact"
                className={`w-full h-11 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all mb-6 ${plan.popular
                  ? "bg-primary hover:bg-primary-hover text-primary-fg shadow-lg shadow-primary/25"
                  : "bg-hover text-foreground hover:bg-border"
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
                      <Check className="w-4 h-4 text-success shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-foreground-subtle shrink-0" />
                    )}
                    <span className={`text-sm ${f.included ? "text-foreground" : "text-foreground-subtle line-through"}`}>
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
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              {t("marketing.pricing.calc.title")}
            </h2>
            <p className="text-base text-foreground-muted mt-3">
              {t("marketing.pricing.calc.subtitle")}
            </p>
          </motion.div>

          {/* Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            {/* Students */}
            <div className="p-6 rounded-2xl bg-surface border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary-soft flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-foreground-muted">{t("marketing.pricing.calc.students")}</p>
                  <p className="text-2xl font-black text-foreground">{students}</p>
                </div>
              </div>
              <input
                type="range"
                min={50}
                max={2000}
                step={10}
                value={students}
                onChange={(e) => setStudents(Number(e.target.value))}
                className="range-slider w-full"
                style={{ "--fill": `${((students - 50) / (2000 - 50)) * 100}%` } as React.CSSProperties}
              />
              <div className="flex justify-between text-xs text-foreground-subtle mt-1">
                <span>50</span>
                <span>2000</span>
              </div>
            </div>

            {/* Branches */}
            <div className="p-6 rounded-2xl bg-surface border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary-soft flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-foreground-muted">{t("marketing.pricing.calc.branches")}</p>
                  <p className="text-2xl font-black text-foreground">{branches}</p>
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
                style={{ "--fill": `${((branches - 1) / (15 - 1)) * 100}%` } as React.CSSProperties}
              />
              <div className="flex justify-between text-xs text-foreground-subtle mt-1">
                <span>1</span>
                <span>15</span>
              </div>
            </div>

            {/* Teachers */}
            <div className="p-6 rounded-2xl bg-surface border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary-soft flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-foreground-muted">{t("marketing.pricing.calc.teachers")}</p>
                  <p className="text-2xl font-black text-foreground">{teachers}</p>
                </div>
              </div>
              <input
                type="range"
                min={5}
                max={100}
                step={1}
                value={teachers}
                onChange={(e) => setTeachers(Number(e.target.value))}
                className="range-slider w-full"
                style={{ "--fill": `${((teachers - 5) / (100 - 5)) * 100}%` } as React.CSSProperties}
              />
              <div className="flex justify-between text-xs text-foreground-subtle mt-1">
                <span>5</span>
                <span>100</span>
              </div>
            </div>
          </div>

          {/* Result */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Summary card */}
            <div className="relative p-6 rounded-2xl bg-surface-raised border border-primary/30 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(184,134,11,0.08),transparent_60%)]" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-black text-lg text-foreground">{t("marketing.pricing.calc.your_plan")}</p>
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm text-foreground-muted leading-relaxed">
                  {t("marketing.pricing.calc.summary", { students, branches, teachers })}
                </p>
              </div>
            </div>

            {/* Monthly */}
            <div className="p-6 rounded-2xl bg-surface border border-border">
              <p className="text-sm text-foreground-muted">{t("marketing.pricing.calc.monthly_label")}</p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={calc.monthly}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="text-3xl font-black text-foreground mt-1"
                >
                  {formatPrice(calc.monthly)}
                </motion.p>
              </AnimatePresence>
              <p className="text-xs text-foreground-subtle mt-1">{t("marketing.pricing.calc.per_month")}</p>
            </div>

            {/* Yearly */}
            <div className="p-6 rounded-2xl bg-surface border border-border">
              <p className="text-sm text-foreground-muted">{t("marketing.pricing.calc.yearly_label")}</p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={calc.yearlyTotal}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="text-3xl font-black text-foreground mt-1"
                >
                  {formatPrice(calc.yearlyTotal)}
                </motion.p>
              </AnimatePresence>
              <p className="text-xs font-bold text-success mt-1">{t("marketing.pricing.calc.discount")}</p>
            </div>
          </div>

          {/* Note */}
          <div className="mt-5 flex items-start gap-3 p-4 rounded-xl bg-warning-bg border border-warning/20">
            <Lightbulb className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <p className="text-sm text-foreground-muted">
              {t("marketing.pricing.calc.note", {
                threshold: PRICING_CONFIG.extraStudentThreshold,
                price: formatPrice(PRICING_CONFIG.extraStudentPrice),
              })}
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-layout border-y border-border">
        <div className="mx-auto max-w-3xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-black text-foreground">
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
                className="rounded-xl bg-surface border border-border overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left"
                >
                  <span className="font-bold text-sm text-foreground">{t(`marketing.pricing.faq.${key}.q`)}</span>
                  <motion.div animate={{ rotate: openFaq === i ? 45 : 0 }}>
                    <HelpCircle className="w-5 h-5 text-primary shrink-0" />
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
                      <p className="px-5 pb-5 text-sm text-foreground-muted leading-relaxed">
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
