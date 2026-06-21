"use client";

import React, { useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  Sparkles,
  Shield,
  BarChart3,
  Zap,
  Lock,
  Building2,
  Clock,
  Sun,
  Moon,
  ArrowLeft,
} from "lucide-react";

import { getSubdomainUrl, getCookieOptions } from "@/utils/redirect";
import { API } from "@/services/api";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/useUIStore";
import Image from "next/image";
import { LogoIcons } from "@/constants/icons";
import Link from "next/link";

type StaffRole = "director" | "manager" | "teacher";

interface AxiosErrorResponse {
  response?: { data?: { non_field_errors?: string[];[key: string]: string[] | string | undefined } };
  message?: string;
}

type FormData = { phone: string; password: string };

interface Props {
  onBack?: () => void;
}

export default function StaffLoginView({ onBack }: Props) {
  const { t } = useTranslation();
  const { theme, setTheme } = useUIStore();
  const { login } = useAuthStore();

  const schema = useMemo(() =>
    yup.object({
      phone: yup
        .string()
        .required(t("auth.staff.validation.phone_required"))
        .test("len", t("auth.staff.validation.phone_invalid"), (val) => val?.replace(/\D/g, "").length === 12),
      password: yup.string().required(t("auth.staff.validation.password_required")),
    }),
    [t]
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { phone: "", password: "" },
  });

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const { mutate: loginStaff, isPending } = useMutation({
    mutationFn: (body: FormData) =>
      API.post("auth/login/", { ...body, phone: `+${body.phone}` }),
    onSuccess: (res) => {
      const { user, access_token, refresh_token, message } = res.data;

      const cookieOptions = getCookieOptions();
      document.cookie = `access_token=${access_token}; ${cookieOptions}`;
      document.cookie = `refresh_token=${refresh_token}; ${cookieOptions}`;
      document.cookie = `user=${encodeURIComponent(JSON.stringify(user))}; ${cookieOptions}`;

      login(user, { access_token, refresh_token });
      toast.success(message || t("auth.staff.success"));

      const targetRole = user?.role as StaffRole;
      const base = getSubdomainUrl(targetRole);
      const isLocal = window.location.hostname.includes("localhost");

      const url = isLocal
        ? `${base}/?at=${encodeURIComponent(access_token)}&rt=${encodeURIComponent(refresh_token)}`
        : base;

      window.location.replace(url);
    },
    onError: (err: AxiosErrorResponse) => {
      const e = err?.response?.data;
      if (e?.non_field_errors?.[0]) toast.error(e.non_field_errors[0]);
      else if (e && typeof e === "object") {
        const v = e[Object.keys(e)[0]];
        toast.error(Array.isArray(v) ? v[0] : t("auth.common.error_check"));
      } else toast.error(err?.message || t("auth.common.error_generic"));
    },
  });

  const features = [
    { icon: BarChart3, key: "analytics" },
    { icon: Building2, key: "multibranch" },
    { icon: Zap, key: "payments" },
    { icon: Lock, key: "security" },
  ];

  const stats = [
    { value: "20+", key: "centers" },
    { value: "1000+", key: "students" },
    { value: "24/7", key: "support", icon: Clock },
  ];

  return (
    <div className="min-h-screen w-full flex bg-white dark:bg-slate-950 overflow-hidden transition-colors">

      {/* LEFT: Branding (gradient) */}
      <div className="hidden lg:flex flex-1 relative flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-800 via-slate-900 to-violet-800" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(16,185,129,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.2),transparent_50%)]" />

        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"
        />

        <div className="relative z-10 space-y-20">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Image src={LogoIcons.logoDark} width={250} height={62} alt="EduMRX Logo" />
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h2 className="text-4xl font-black text-white leading-tight tracking-tight">
              {t("auth.staff.heading")}
            </h2>
            <p className="text-white/70 text-sm mt-4 max-w-md leading-relaxed">
              {t("auth.staff.desc")}
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            className="grid grid-cols-2 gap-3 max-w-lg"
          >
            {features.map((f) => (
              <motion.div
                key={f.key}
                variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
                className="flex items-center gap-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
              >
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <f.icon className="w-4 h-4 text-white/80" />
                </div>
                <span className="text-sm font-semibold text-white/90">
                  {t(`auth.staff.features.${f.key}`)}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative z-10 grid grid-cols-3 gap-3 max-w-lg"
        >
          {stats.map((s) => (
            <div key={s.key} className="p-5 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-center">
              <div className="flex items-center justify-center gap-1.5">
                {s.icon && <s.icon className="w-5 h-5 text-white/80" />}
                <span className="text-2xl font-black text-white">{s.value}</span>
              </div>
              <p className="text-[11px] text-white/60 mt-1">{t(`auth.staff.stats.${s.key}`)}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* RIGHT: Form */}
      <div className="w-full lg:w-[520px] flex flex-col justify-center p-8 sm:p-12 bg-white dark:bg-slate-950 relative transition-colors">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-3xl rounded-full pointer-events-none" />

        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="absolute top-6 left-6 z-20 flex items-center gap-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("auth.common.go_back")}
          </button>
        )}

        <button
          type="button"
          onClick={toggleTheme}
          className="absolute top-6 right-6 z-20 w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-sm mx-auto space-y-6"
        >
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-gradient-to-r dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700/50 flex items-center justify-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 tracking-widest">
              {t("auth.choose.staff.label")}
            </span>
          </div>

          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {t("auth.common.welcome")}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {t("auth.staff.heading")}
            </p>
          </div>

          <form onSubmit={handleSubmit((d) => loginStaff(d))} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {t("auth.common.phone_label")}
              </label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <PhoneInput value={field.value || ""} onChange={field.onChange} error={errors.phone?.message} />
                )}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {t("auth.common.password_label")}
              </label>
              <PasswordInput register={register("password")} error={errors.password?.message} />
            </div>

            <div className="text-right">
              <button type="button" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors">
                {t("auth.common.forgot_password")}
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isPending}
              className="w-full h-12 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/30 disabled:opacity-60"
            >
              {isPending ? (
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{t("auth.common.submit")}</span>
                </>
              )}
            </motion.button>
          </form>

          <p className="text-xs text-slate-400 dark:text-slate-500 text-center leading-relaxed">
            {t("auth.common.legal_prefix")}{" "}
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
              {t("auth.common.legal_terms")}
            </span>{" "}
            {t("auth.common.legal_and")}{" "}
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
              {t("auth.common.legal_privacy")}
            </span>
            {t("auth.common.legal_suffix")}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
