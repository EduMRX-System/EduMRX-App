"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  GraduationCap,
  Shield,
  ArrowRight,
  CheckCircle2,
  Sun,
  Moon,
  Sparkles,
  BarChart3,
  BookOpen,
  Users,
  Check,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { LogoIcons } from "@/constants/icons";
import { useUIStore } from "@/store/useUIStore";

type ProfileType = "student" | "staff";

interface Props {
  onChoose: (type: ProfileType) => void;
}

export default function ChooseProfileView({ onChoose }: Props) {
  const { t } = useTranslation();
  const { theme, setTheme } = useUIStore();
  const [selected, setSelected] = useState<ProfileType | null>(null);

  const profiles: { type: ProfileType; icon: React.ElementType; color: string; ring: string; bg: string }[] = [
    {
      type: "student",
      icon: GraduationCap,
      color: "text-cyan-600 dark:text-cyan-400",
      ring: "border-cyan-500",
      bg: "bg-cyan-50 dark:bg-cyan-950/30",
    },
    {
      type: "staff",
      icon: Shield,
      color: "text-violet-600 dark:text-violet-400",
      ring: "border-violet-500",
      bg: "bg-violet-50 dark:bg-violet-950/30",
    },
  ];

  const leftFeatures = [
    { icon: GraduationCap, key: "students" },
    { icon: BarChart3, key: "analytics" },
    { icon: BookOpen, key: "homework" },
    { icon: Users, key: "staff" },
  ];

  const handleNext = () => {
    if (selected) onChoose(selected);
  };

  return (
    <div className="min-h-screen w-full flex bg-white dark:bg-slate-950 overflow-hidden transition-colors">
      {/* ───────── LEFT: Branding ───────── */}
      <div className="hidden lg:flex flex-1 relative flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-800 via-slate-900 to-violet-800" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.22),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_85%,rgba(139,92,246,0.22),transparent_55%)]" />

        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.45, 0.25] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"
        />

        {/* Logo */}
        <Link href="/" className="relative z-10">
          <Image src={LogoIcons.logoDark} width={220} height={55} alt="EduMRX Logo" />
        </Link>

        {/* Headline + features */}
        <div className="relative z-10 space-y-10 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h2 className="text-[2.6rem] font-black text-white leading-[1.1] tracking-tight">
              {t("auth.choose.title")}
            </h2>
            <p className="text-white/65 text-sm mt-4 leading-relaxed">
              {t("auth.choose.subtitle")}
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } } }}
            className="grid grid-cols-2 gap-3"
          >
            {leftFeatures.map((f) => (
              <motion.div
                key={f.key}
                variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.07] backdrop-blur-sm border border-white/10"
              >
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <f.icon className="w-4 h-4 text-white/80" />
                </div>
                <span className="text-[13px] font-semibold text-white/90">
                  {t(`auth.choose.features.${f.key}`, { defaultValue: f.key })}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <p className="text-xs text-white/50">EduMRX — ta&apos;lim markazi boshqaruv platformasi</p>
        </div>
      </div>

      {/* ───────── RIGHT: Choose form ───────── */}
      <div className="w-full lg:w-[520px] flex flex-col justify-center p-6 sm:p-12 bg-white dark:bg-slate-950 relative transition-colors">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-3xl rounded-full pointer-events-none" />

        {/* Theme toggle */}
        <button
          type="button"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="absolute top-6 right-6 z-20 w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-sm mx-auto space-y-8"
        >
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden inline-block">
            <Image
              src={theme === "dark" ? LogoIcons.logoDark : LogoIcons.logo}
              width={150}
              height={38}
              alt="EduMRX Logo"
            />
          </Link>

          {/* Header */}
          <div>
            <h1 className="text-[1.75rem] font-black text-slate-900 dark:text-white tracking-tight">
              {t("auth.choose.title")}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
              {t("auth.choose.subtitle")}
            </p>
          </div>

          {/* Profile cards */}
          <div className="space-y-3">
            {profiles.map(({ type, icon: Icon, color, ring, bg, iconBg }) => {
              const active = selected === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelected(type)}
                  aria-pressed={active}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left ${active
                      ? `${ring} ${bg} shadow-sm`
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                    }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${active ? iconBg : "bg-slate-100 dark:bg-slate-800"}`}>
                    <Icon className={`w-6 h-6 transition-colors ${active ? color : "text-slate-400 dark:text-slate-500"}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold transition-colors ${active ? color : "text-slate-800 dark:text-white"}`}>
                      {t(`auth.choose.${type}.label`)}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {t(`auth.choose.${type}.desc`)}
                    </p>
                  </div>

                  {/* Radio / check — bitta toza indikator */}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${active
                        ? `${color.replace("text-", "bg-").split(" ")[0]} text-white`
                        : "border-2 border-slate-300 dark:border-slate-600"
                      }`}
                  >
                    {active && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Next button */}
          <motion.button
            whileHover={{ scale: selected ? 1.01 : 1 }}
            whileTap={{ scale: selected ? 0.99 : 1 }}
            type="button"
            onClick={handleNext}
            disabled={!selected}
            className="w-full h-12 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/30 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
          >
            <span>{t("auth.choose.next")}</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
