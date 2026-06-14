"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Clock,
  MessageCircle,
  User,
  Building2,
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
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function ContactView() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", phone: "", center: "", message: "" });
  const [loading, setLoading] = useState(false);

  const contactInfo = [
    { icon: Mail, label: "Email", value: "info@edumrx.uz", href: "mailto:info@edumrx.uz" },
    { icon: Phone, label: "Telefon", value: "+998 90 123 45 67", href: "tel:+998901234567" },
    { icon: MessageCircle, label: "Telegram", value: "@edumrx_support", href: "https://t.me/edumrx_support" },
    { icon: MapPin, label: "Manzil", value: "Toshkent, O'zbekiston", href: "#" },
  ];

  const handleSubmit = () => {
    if (!form.name || !form.phone) {
      toast.error(t("contact.error", "Ism va telefon raqamni kiriting"));
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success(t("contact.success", "So'rovingiz qabul qilindi! Tez orada bog'lanamiz."));
      setForm({ name: "", phone: "", center: "", message: "" });
    }, 1000);
  };

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
            {t("contact.label", "Bog'lanish")}
          </motion.p>
          <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            {t("contact.title", "Keling, suhbatlashamiz")}
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-slate-600 dark:text-slate-400 mt-5">
            {t("contact.subtitle", "Savollaringiz bormi? Demo kerakmi? Bizga yozing — 24 soat ichida javob beramiz.")}
          </motion.p>
        </motion.div>
      </section>

      {/* CONTENT */}
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-4 grid lg:grid-cols-5 gap-8">
          {/* Left: Info cards */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-4"
          >
            {contactInfo.map((info) => (
              <motion.a
                key={info.label}
                href={info.href}
                variants={fadeUp}
                whileHover={{ x: 4 }}
                className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center shrink-0">
                  <info.icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">{info.label}</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{info.value}</p>
                </div>
              </motion.a>
            ))}

            {/* Working hours */}
            <motion.div
              variants={fadeUp}
              className="p-5 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white"
            >
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4" />
                <p className="text-sm font-bold">{t("contact.hours_title", "Ish vaqti")}</p>
              </div>
              <p className="text-xs text-indigo-100">{t("contact.hours", "Dushanba — Shanba: 9:00 — 18:00")}</p>
            </motion.div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3 p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
          >
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">
              {t("contact.form_title", "Demo so'rang")}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              {t("contact.form_desc", "Formani to'ldiring, mutaxassisimiz bog'lanadi")}
            </p>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  {t("contact.name", "Ismingiz")}
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder={t("contact.name_ph", "Ali Valiyev")}
                  className="w-full h-11 px-4 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  {t("contact.phone", "Telefon")}
                </label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+998 90 123 45 67"
                  className="w-full h-11 px-4 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Center */}
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  {t("contact.center", "Markaz nomi")}
                </label>
                <input
                  value={form.center}
                  onChange={(e) => setForm({ ...form, center: e.target.value })}
                  placeholder={t("contact.center_ph", "O'quv markazingiz nomi")}
                  className="w-full h-11 px-4 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Message */}
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5" />
                  {t("contact.message", "Xabar")}
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder={t("contact.message_ph", "Qanday yordam bera olamiz?")}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-indigo-500 transition-colors resize-none"
                />
              </div>

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleSubmit}
                disabled={loading}
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-60"
              >
                {loading ? (
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <>
                    <span>{t("contact.send", "Yuborish")}</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}