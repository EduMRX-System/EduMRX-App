"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Users, Shield, BarChart3, MessageSquare } from "lucide-react";

interface PanelCard {
  slug: string;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function HomeView() {
  const panels: PanelCard[] = [
    { slug: "director", title: "Director Panel", desc: "O'quv markazining to'liq nazorati, moliya va hisobotlar auditi.", icon: Shield },
    { slug: "manager", title: "Manager Panel", desc: "Talabalar qabuli, guruhlarni boshqarish va kundalik operatsiyalar.", icon: Users },
    { slug: "teacher", title: "Teacher Panel", desc: "Dars jadvallari, elektron davomat va o'quvchilar reyting tizimi.", icon: BarChart3 },
    { slug: "student", title: "Student / Parent", desc: "O'zlashtirish ko'rsatkichlari, to'lovlar tarixi va uy vazifalari.", icon: MessageSquare },
  ];

  return (
    <div className="w-full">
      {/* HERO SECTION */}
      <section className="mx-auto max-w-4xl px-4 pt-16 pb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-200/40 dark:border-indigo-900/40">
            Premium Next-Gen CRM v1.0
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            Ta'lim markazingizni <br />
            <span className="text-indigo-600 dark:text-indigo-400">Raqamlashtiring</span>
          </h1>
          <p className="mx-auto max-w-lg text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            O'quv markazingiz boshqaruvini yangi bosqichga olib chiqing. Hisobotlar, davomat va barcha moliyaviy oqimlar endi bitta xavfsiz tizimda.
          </p>
          <div className="pt-2">
            <Link
              href="/pricing"
              className="inline-flex h-9 px-5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg items-center gap-1.5 transition-colors"
            >
              <span>Bepul sinab ko'rish</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* PANELS SECTION */}
      <section className="mx-auto max-w-6xl px-4 py-12 border-t border-slate-200/40 dark:border-slate-900/60">
        <div className="text-center space-y-1.5 mb-10">
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Sizning ishonchli panellaringiz
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Har bir foydalanuvchi guruhi uchun maxsus optimallashtirilgan interfeyslar.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {panels.map((panel, idx) => (
            <Link key={panel.slug} href={`/login?role=${panel.slug}`}>
              <motion.div
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="group p-5 rounded-xl border border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 flex flex-col justify-between min-h-[190px] transition-colors cursor-pointer"
              >
                <div className="space-y-3.5">
                  <div className="w-9 h-9 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/30">
                    <panel.icon className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {panel.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                      {panel.desc}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 mt-3">
                  <span>Kirish</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}