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

  const features = [
    { icon: Users, key: "students" },
    { icon: GraduationCap, key: "groups" },
    { icon: ClipboardCheck, key: "attendance" },
    { icon: CreditCard, key: "payments" },
    { icon: BarChart3, key: "analytics" },
    { icon: MessageCircle, key: "sms" },
    { icon: Bot, key: "telegram" },
    { icon: Coins, key: "coins" },
  ];

  const stats = [
    { value: "10,000+", key: "students" },
    { value: "200+", key: "centers" },
    { value: "99.9%", key: "uptime" },
    { value: "24/7", key: "support" },
  ];

  const panels = [
    { icon: Shield,        key: "director", profile: "staff"    },
    { icon: Users,         key: "manager",  profile: "staff"    },
    { icon: GraduationCap, key: "teacher",  profile: "staff"    },
    { icon: MessageCircle, key: "student",  profile: "student"  },
  ];

  const benefits = [
    { icon: Lock, key: "security" },
    { icon: Zap, key: "speed" },
    { icon: Globe, key: "access" },
    { icon: Building2, key: "multibranch" },
  ];

  return (
    <div className="w-full overflow-hidden">

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative pt-20 pb-24 sm:pt-28 sm:pb-32">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/8 blur-3xl rounded-full" />
          <div
            className="absolute inset-0 opacity-[0.4] dark:opacity-[0.15]"
            style={{
              backgroundImage: `linear-gradient(to right, rgb(184 134 11 / 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgb(184 134 11 / 0.04) 1px, transparent 1px)`,
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
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary-soft text-primary border border-primary-ring">
                <Sparkles className="w-3.5 h-3.5" />
                <ScrollReveal direction="up" delay={0.1}>
                  <span>{t("marketing.home.badge")}</span>
                </ScrollReveal>
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground leading-[1.05]"
            >
              {t("marketing.home.title_1")}
              <br />
              <span className="relative inline-block">
                <span className="relative z-10 text-primary">
                  {t("marketing.home.title_2")}
                </span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute bottom-1 left-0 w-full h-3 bg-primary/15 -z-0 origin-left rounded"
                />
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp}
              className="max-w-2xl text-base sm:text-lg text-foreground-muted leading-relaxed"
            >
              {t("marketing.home.subtitle")}
            </motion.p>

            {/* CTA buttons */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Link
                href="/pricing"
                className="group inline-flex h-12 px-7 bg-primary hover:bg-primary-hover text-primary-fg text-sm font-bold rounded-xl items-center gap-2 transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
              >
                <span>{t("marketing.home.cta_primary")}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-12 px-7 bg-surface text-foreground-muted text-sm font-bold rounded-xl items-center gap-2 transition-all border border-border hover:border-border-subtle hover:bg-hover hover:-translate-y-0.5"
              >
                <span>{t("marketing.home.cta_secondary")}</span>
              </Link>
            </motion.div>

            {/* Trust line */}
            <motion.div variants={fadeUp} className="flex items-center gap-2 pt-4 text-xs text-foreground-subtle">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>{t("marketing.home.trust")}</span>
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
          <div className="relative rounded-2xl border border-border bg-surface shadow-2xl shadow-foreground/10 overflow-hidden">
            {/* Browser bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border-subtle bg-layout">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-danger" />
                <div className="w-3 h-3 rounded-full bg-warning" />
                <div className="w-3 h-3 rounded-full bg-success" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 rounded-md bg-surface text-[11px] text-foreground-subtle font-medium">
                  director.edumrx.uz
                </div>
              </div>
            </div>
            {/* Dashboard content */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 bg-layout">
              {[
                { labelKey: "revenue", value: "₊245M", trend: "+12.5%", icon: TrendingUp },
                { labelKey: "active_students", value: "1,284", trend: "+8.2%", icon: Users },
                { labelKey: "month_payments", value: "892", trend: "+15.3%", icon: CreditCard },
              ].map((card, i) => (
                <motion.div
                  key={card.labelKey}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="p-4 rounded-xl bg-surface border border-border-subtle"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-soft flex items-center justify-center">
                      <card.icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-[10px] font-bold text-success bg-success-bg px-1.5 py-0.5 rounded">
                      {card.trend}
                    </span>
                  </div>
                  <p className="text-2xl font-black text-foreground">{card.value}</p>
                  <p className="text-xs text-foreground-muted mt-0.5">{t(`marketing.home.mockup.${card.labelKey}`)}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════ STATS ═══════════════ */}
      <section className="py-12 border-y border-border bg-layout">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto max-w-5xl px-4 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((stat) => (
            <motion.div key={stat.key} variants={fadeUp} className="text-center">
              <p className="text-3xl sm:text-4xl font-black text-primary">
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm text-foreground-muted font-medium mt-1">
                {t(`marketing.home.stats.${stat.key}`)}
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
            <motion.p variants={fadeUp} className="text-sm font-bold text-primary uppercase tracking-widest mb-3">
              {t("marketing.home.features_label")}
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              {t("marketing.home.features_title")}
            </motion.h2>
            <motion.p variants={fadeUp} className="text-base text-foreground-muted mt-4">
              {t("marketing.home.features_desc")}
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
                className="group p-6 rounded-2xl bg-surface border border-border hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-primary-soft flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                  <feature.icon className="w-5 h-5 text-primary group-hover:text-primary-fg transition-colors" />
                </div>
                <h3 className="font-bold text-base text-foreground mb-1.5">
                  {t(`marketing.home.features.${feature.key}.title`)}
                </h3>
                <p className="text-sm text-foreground-muted leading-relaxed">
                  {t(`marketing.home.features.${feature.key}.desc`)}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ PANELS ═══════════════ */}
      <section className="py-24 bg-layout border-y border-border">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <motion.p variants={fadeUp} className="text-sm font-bold text-primary uppercase tracking-widest mb-3">
              {t("marketing.home.panels_label")}
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              {t("marketing.home.panels_title")}
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
              const href = `${loginBase}/login?profile=${panel.profile}`;

              return (
                <motion.a
                  key={panel.key}
                  href={href}
                  variants={fadeUp}
                  whileHover={{ y: -6 }}
                  className="group relative p-6 rounded-2xl bg-surface border border-border overflow-hidden transition-all hover:shadow-xl hover:border-primary/40 cursor-pointer block"
                >
                  {/* Subtle gold glow on hover */}
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary opacity-0 group-hover:opacity-8 blur-2xl transition-opacity rounded-full" />

                  <div className="w-12 h-12 rounded-xl bg-primary-soft flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all">
                    <panel.icon className="w-6 h-6 text-primary group-hover:text-primary-fg transition-colors" />
                  </div>

                  <h3 className="font-bold text-lg text-foreground mb-2">
                    {t(`marketing.home.panels.${panel.key}.title`)}
                  </h3>
                  <p className="text-sm text-foreground-muted leading-relaxed mb-4">
                    {t(`marketing.home.panels.${panel.key}.desc`)}
                  </p>

                  <div className="flex items-center gap-1.5 text-sm font-bold text-primary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                    <span>{t("marketing.home.panels.enter")}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>

                  {/* Corner arrow badge */}
                  <div className="absolute top-5 right-5 w-8 h-8 rounded-lg bg-primary-soft flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
                    <ArrowRight className="w-4 h-4 text-primary -rotate-45" />
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
            <motion.p variants={fadeUp} className="text-sm font-bold text-primary uppercase tracking-widest mb-3">
              {t("marketing.home.why_label")}
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mb-8">
              {t("marketing.home.why_title")}
            </motion.h2>

            <div className="space-y-5">
              {benefits.map((benefit) => (
                <motion.div key={benefit.key} variants={fadeUp} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-soft flex items-center justify-center shrink-0">
                    <benefit.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-foreground">{t(`marketing.home.benefits.${benefit.key}.title`)}</h3>
                    <p className="text-sm text-foreground-muted mt-0.5">{t(`marketing.home.benefits.${benefit.key}.desc`)}</p>
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
            <div className="relative rounded-2xl bg-surface-raised border border-border p-8 overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(184,134,11,0.06),transparent_60%)]" />
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary-soft border border-primary-ring flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-foreground font-bold">{t("marketing.home.visual.ssl_title")}</p>
                    <p className="text-foreground-muted text-xs">{t("marketing.home.visual.ssl_desc")}</p>
                  </div>
                </div>

                {/* Mini stats */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Bell, key: "notifications" },
                    { icon: Calendar, key: "schedule" },
                    { icon: Coins, key: "coins" },
                    { icon: BarChart3, key: "reports" },
                  ].map((item) => (
                    <div key={item.key} className="p-3 rounded-xl bg-surface border border-border">
                      <item.icon className="w-4 h-4 text-foreground-muted mb-2" />
                      <p className="text-foreground text-sm font-bold">{t(`marketing.home.visual.${item.key}.value`)}</p>
                      <p className="text-foreground-subtle text-[10px]">{t(`marketing.home.visual.${item.key}.label`)}</p>
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
            className="relative rounded-3xl bg-surface-raised border border-border p-10 sm:p-16 text-center overflow-hidden"
          >
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: `linear-gradient(to right, rgb(184 134 11 / 0.3) 1px, transparent 1px), linear-gradient(to bottom, rgb(184 134 11 / 0.3) 1px, transparent 1px)`,
                backgroundSize: "32px 32px",
                maskImage: "radial-gradient(ellipse 80% 60% at 50% 50%, black, transparent)",
              }}
            />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-primary/10 blur-3xl rounded-full" />

            <div className="relative z-10 flex flex-col items-center gap-6">
              <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                {t("marketing.home.cta_title")}
              </h2>
              <p className="text-foreground-muted max-w-lg">
                {t("marketing.home.cta_desc")}
              </p>
              <Link
                href="/pricing"
                className="group inline-flex h-12 px-8 bg-primary hover:bg-primary-hover text-primary-fg text-sm font-bold rounded-xl items-center gap-2 transition-all shadow-lg shadow-primary/25 hover:-translate-y-0.5"
              >
                <span>{t("marketing.home.cta_button")}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
