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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-72 bg-primary/8 blur-3xl rounded-full -z-10" />
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-3xl px-4"
        >
          <motion.p variants={fadeUp} className="text-sm font-bold text-primary uppercase tracking-widest mb-3">
            {t("marketing.contact.label")}
          </motion.p>
          <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl font-black tracking-tight text-foreground">
            {t("marketing.contact.title")}
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-foreground-muted mt-5">
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
                className="flex items-center gap-4 p-5 rounded-2xl bg-surface border border-border hover:border-primary/40 transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-primary-soft flex items-center justify-center shrink-0">
                  <info.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-foreground-subtle font-medium">{t(`marketing.contact.info.${info.key}`)}</p>
                  <p className="text-sm font-bold text-foreground">{info.value}</p>
                </div>
              </motion.a>
            ))}

            {/* Working hours */}
            <motion.div
              variants={fadeUp}
              className="p-5 rounded-2xl bg-surface-raised border border-border"
            >
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-primary" />
                <p className="text-sm font-bold text-foreground">{t("marketing.contact.hours_title")}</p>
              </div>
              <p className="text-xs text-foreground-muted">{t("marketing.contact.hours")}</p>
            </motion.div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3 p-7 rounded-2xl bg-surface border border-border"
          >
            <h3 className="text-xl font-black text-foreground mb-1">
              {t("marketing.contact.form_title")}
            </h3>
            <p className="text-sm text-foreground-muted mb-6">
              {t("marketing.contact.form_desc")}
            </p>

            <form onSubmit={handleSubmit((d) => sendContact(d))} className="space-y-4">
              {/* Name */}
              <div>
                <label className="text-xs font-bold text-foreground-muted mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  {t("marketing.contact.name")}
                </label>
                <input
                  {...register("full_name")}
                  placeholder={t("marketing.contact.name_ph")}
                  className={`w-full h-11 px-4 rounded-xl text-sm bg-surface border text-foreground placeholder:text-foreground-subtle outline-none focus:border-primary transition-colors ${
                    errors.full_name
                      ? "border-danger/50 focus:border-danger"
                      : "border-border"
                  }`}
                />
                {errors.full_name && (
                  <p className="text-danger text-[11px] mt-1.5">{errors.full_name.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="text-xs font-bold text-foreground-muted mb-1.5 flex items-center gap-1.5">
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
                <label className="text-xs font-bold text-foreground-muted mb-1.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  {t("marketing.contact.center")}
                </label>
                <input
                  {...register("center_name")}
                  placeholder={t("marketing.contact.center_ph")}
                  className="w-full h-11 px-4 rounded-xl text-sm bg-surface border border-border text-foreground placeholder:text-foreground-subtle outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* Message */}
              <div>
                <label className="text-xs font-bold text-foreground-muted mb-1.5 flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5" />
                  {t("marketing.contact.message")}
                </label>
                <textarea
                  {...register("message")}
                  placeholder={t("marketing.contact.message_ph")}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-xl text-sm bg-surface border text-foreground placeholder:text-foreground-subtle outline-none focus:border-primary transition-colors resize-none ${
                    errors.message
                      ? "border-danger/50 focus:border-danger"
                      : "border-border"
                  }`}
                />
                {errors.message && (
                  <p className="text-danger text-[11px] mt-1.5">{errors.message.message}</p>
                )}
              </div>

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={isPending}
                className="w-full h-12 bg-primary hover:bg-primary-hover text-primary-fg text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/25 disabled:opacity-60"
              >
                {isPending ? (
                  <div className="w-4 h-4 rounded-full border-2 border-primary-fg/30 border-t-primary-fg animate-spin" />
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
