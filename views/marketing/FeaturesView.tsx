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
  TrendingUp,
  FileText,
  DoorOpen,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] as const },
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
      key: "academic",
      barClass: "bg-primary",
      items: [
        { icon: Users, key: "students" },
        { icon: GraduationCap, key: "groups" },
        { icon: ClipboardCheck, key: "attendance" },
        { icon: DoorOpen, key: "rooms" },
      ],
    },
    {
      key: "finance",
      barClass: "bg-success",
      items: [
        { icon: CreditCard, key: "payments" },
        { icon: TrendingUp, key: "debtors" },
        { icon: FileText, key: "payment_types" },
        { icon: BarChart3, key: "expenses" },
      ],
    },
    {
      key: "marketing",
      barClass: "bg-foreground-muted",
      items: [
        { icon: MessageCircle, key: "sms" },
        { icon: Bot, key: "telegram" },
        { icon: FileText, key: "leads" },
        { icon: Bell, key: "notifications" },
      ],
    },
    {
      key: "analytics",
      barClass: "bg-warning",
      items: [
        { icon: BarChart3, key: "overview" },
        { icon: TrendingUp, key: "payment_analysis" },
        { icon: Coins, key: "coins" },
        { icon: Calendar, key: "holidays" },
      ],
    },
  ];

  const highlights = ["multibranch", "security", "pwa", "realtime", "languages", "support"];

  return (
    <div className="w-full">
      {/* HERO */}
      <section className="relative pt-20 pb-16 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-72 bg-primary/8 blur-3xl rounded-full -z-10" />
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-3xl px-4"
        >
          <motion.p variants={fadeUp} className="text-sm font-bold text-primary uppercase tracking-widest mb-3">
            {t("marketing.features.label")}
          </motion.p>
          <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl font-black tracking-tight text-foreground leading-tight">
            {t("marketing.features.title")}
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-foreground-muted mt-5 max-w-2xl mx-auto">
            {t("marketing.features.subtitle")}
          </motion.p>
        </motion.div>
      </section>

      {/* CATEGORIES */}
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-4 space-y-16">
          {categories.map((cat) => (
            <motion.div
              key={cat.key}
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {/* Category header */}
              <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
                <div className={`w-1.5 h-8 rounded-full ${cat.barClass}`} />
                <div>
                  <h2 className="text-xl font-black text-foreground">{t(`marketing.features.categories.${cat.key}.title`)}</h2>
                  <p className="text-sm text-foreground-muted">{t(`marketing.features.categories.${cat.key}.desc`)}</p>
                </div>
              </motion.div>

              {/* Items grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {cat.items.map((item) => (
                  <motion.div
                    key={item.key}
                    variants={fadeUp}
                    whileHover={{ y: -4 }}
                    className="group p-5 rounded-2xl bg-surface border border-border hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary-soft flex items-center justify-center mb-3">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-bold text-sm text-foreground mb-1">{t(`marketing.features.categories.${cat.key}.items.${item.key}.title`)}</h3>
                    <p className="text-xs text-foreground-muted leading-relaxed">{t(`marketing.features.categories.${cat.key}.items.${item.key}.desc`)}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="py-20 bg-layout border-y border-border">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-black text-foreground mb-10"
          >
            {t("marketing.features.highlights_title")}
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
                className="flex items-center gap-3 p-3.5 rounded-xl bg-surface border border-border text-left"
              >
                <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                <span className="text-sm font-medium text-foreground">{t(`marketing.features.highlights.${h}`)}</span>
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
            <h2 className="text-3xl font-black text-foreground">
              {t("marketing.features.cta_title")}
            </h2>
            <Link
              href="/pricing"
              className="group inline-flex h-12 px-8 bg-primary hover:bg-primary-hover text-primary-fg text-sm font-bold rounded-xl items-center gap-2 transition-all shadow-lg shadow-primary/25 hover:-translate-y-0.5"
            >
              <span>{t("marketing.features.cta_button")}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
