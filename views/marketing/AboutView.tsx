"use client";

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
    { icon: Target, key: "mission" },
    { icon: Eye, key: "vision" },
    { icon: Heart, key: "values" },
  ];

  const stats = [
    { icon: Users, value: "10,000+", key: "users" },
    { icon: Building2, value: "200+", key: "centers" },
    { icon: Award, value: "99.9%", key: "satisfaction" },
    { icon: TrendingUp, value: "3x", key: "growth" },
  ];

  const timeline = [
    { year: "2024", key: "start" },
    { year: "2025", key: "first_clients" },
    { year: "2026", key: "expansion" },
  ];

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
            {t("marketing.about.label")}
          </motion.p>
          <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl font-black tracking-tight text-foreground leading-tight">
            {t("marketing.about.title")}
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-foreground-muted mt-5">
            {t("marketing.about.subtitle")}
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
              key={stat.key}
              variants={fadeUp}
              className="p-6 rounded-2xl bg-surface border border-border text-center"
            >
              <div className="w-11 h-11 rounded-xl bg-primary-soft flex items-center justify-center mx-auto mb-3">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <p className="text-2xl font-black text-foreground">{stat.value}</p>
              <p className="text-xs text-foreground-muted mt-1">{t(`marketing.about.stats.${stat.key}`)}</p>
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
                key={value.key}
                variants={fadeUp}
                className="p-7 rounded-2xl bg-surface border border-border"
              >
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
                  <value.icon className="w-6 h-6 text-primary-fg" />
                </div>
                <h3 className="text-lg font-black text-foreground mb-2">{t(`marketing.about.values.${value.key}.title`)}</h3>
                <p className="text-sm text-foreground-muted leading-relaxed">{t(`marketing.about.values.${value.key}.desc`)}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-16 bg-layout border-y border-border">
        <div className="mx-auto max-w-3xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-black text-foreground">
              {t("marketing.about.journey")}
            </h2>
          </motion.div>

          <div className="relative">
            {/* Line */}
            <div className="absolute left-[27px] top-2 bottom-2 w-0.5 bg-border" />

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
                  <div className="relative z-10 w-14 h-14 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/25">
                    <Rocket className="w-6 h-6 text-primary-fg" />
                  </div>
                  <div className="pt-1">
                    <span className="text-xs font-bold text-primary">{item.year}</span>
                    <h3 className="text-lg font-black text-foreground">{t(`marketing.about.timeline.${item.key}.title`)}</h3>
                    <p className="text-sm text-foreground-muted mt-1">{t(`marketing.about.timeline.${item.key}.desc`)}</p>
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
            <h2 className="text-3xl font-black text-foreground">
              {t("marketing.about.cta_title")}
            </h2>
            <Link
              href="/contact"
              className="group inline-flex h-12 px-8 bg-primary hover:bg-primary-hover text-primary-fg text-sm font-bold rounded-xl items-center gap-2 transition-all shadow-lg shadow-primary/25 hover:-translate-y-0.5"
            >
              <span>{t("marketing.about.cta_button")}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
