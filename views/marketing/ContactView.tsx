"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
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

import { API } from "@/services/api";
import { PhoneInput } from "@/components/ui/PhoneInput";

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

type FormData = {
  full_name: string;
  phone: string;
  center_name: string;
  message: string;
};

export default function ContactView() {
  const { t } = useTranslation();

  const schema = useMemo(
    () =>
      yup.object({
        full_name: yup.string().required(t("marketing.contact.validation.full_name_required")),
        phone: yup
          .string()
          .required(t("marketing.contact.validation.phone_required"))
          .test("len", t("marketing.contact.validation.phone_invalid"), (val) =>
            val?.replace(/\D/g, "").length === 12
          ),
        center_name: yup.string().default(""),
        message: yup
          .string()
          .required(t("marketing.contact.validation.message_required"))
          .min(5, t("marketing.contact.validation.message_min")),
      }),
    [t]
  );

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { full_name: "", phone: "", center_name: "", message: "" },
  });

  const { mutate: sendContact, isPending } = useMutation({
    mutationFn: (data: FormData) =>
      API.post("contact/", {
        full_name: data.full_name,
        phone: `+${data.phone}`,
        center_name: data.center_name,
        message: data.message,
      }),
    onSuccess: () => {
      toast.success(t("marketing.contact.success"));
      reset();
    },
    onError: () => {
      toast.error(t("marketing.contact.error"));
    },
  });

  const contactInfo = [
    { icon: Mail, key: "email", value: "edumrxm@gmail.com", href: "mailto:edumrxm@gmail.com" },
    { icon: Phone, key: "phone", value: "+998 90 818 22 99", href: "tel:+998908182299" },
    { icon: MessageCircle, key: "telegram", value: "@edumrx_support", href: "https://t.me/edumrx_support" },
    { icon: MapPin, key: "address", value: "Toshkent, O'zbekiston", href: "#" },
  ];

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
            {t("marketing.contact.label")}
          </motion.p>
          <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            {t("marketing.contact.title")}
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-slate-600 dark:text-slate-400 mt-5">
            {t("marketing.contact.subtitle")}
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
                key={info.key}
                href={info.href}
                variants={fadeUp}
                whileHover={{ x: 4 }}
                className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center shrink-0">
                  <info.icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">{t(`marketing.contact.info.${info.key}`)}</p>
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
                <p className="text-sm font-bold">{t("marketing.contact.hours_title")}</p>
              </div>
              <p className="text-xs text-indigo-100">{t("marketing.contact.hours")}</p>
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
              {t("marketing.contact.form_title")}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              {t("marketing.contact.form_desc")}
            </p>

            <form onSubmit={handleSubmit((d) => sendContact(d))} className="space-y-4">
              {/* Name */}
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  {t("marketing.contact.name")}
                </label>
                <input
                  {...register("full_name")}
                  placeholder={t("marketing.contact.name_ph")}
                  className={`w-full h-11 px-4 rounded-xl text-sm bg-white dark:bg-slate-900 border text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-indigo-500 transition-colors ${
                    errors.full_name
                      ? "border-red-500/50 focus:border-red-500"
                      : "border-slate-200 dark:border-slate-800"
                  }`}
                />
                {errors.full_name && (
                  <p className="text-red-500 dark:text-red-400 text-[11px] mt-1.5">{errors.full_name.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  {t("marketing.contact.phone")}
                </label>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <PhoneInput
                      value={field.value || ""}
                      onChange={field.onChange}
                      error={errors.phone?.message}
                    />
                  )}
                />
              </div>

              {/* Center */}
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  {t("marketing.contact.center")}
                </label>
                <input
                  {...register("center_name")}
                  placeholder={t("marketing.contact.center_ph")}
                  className="w-full h-11 px-4 rounded-xl text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Message */}
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5" />
                  {t("marketing.contact.message")}
                </label>
                <textarea
                  {...register("message")}
                  placeholder={t("marketing.contact.message_ph")}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-xl text-sm bg-white dark:bg-slate-900 border text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-indigo-500 transition-colors resize-none ${
                    errors.message
                      ? "border-red-500/50 focus:border-red-500"
                      : "border-slate-200 dark:border-slate-800"
                  }`}
                />
                {errors.message && (
                  <p className="text-red-500 dark:text-red-400 text-[11px] mt-1.5">{errors.message.message}</p>
                )}
              </div>

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={isPending}
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-60"
              >
                {isPending ? (
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <>
                    <span>{t("marketing.contact.send")}</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
