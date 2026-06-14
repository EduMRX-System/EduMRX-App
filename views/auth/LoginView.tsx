"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  User,
  Shield,
  ArrowRight,
  ArrowLeft,
  Building2,
  Smartphone,
  KeyRound,
  GraduationCap,
  Users,
  CheckCircle2,
} from "lucide-react";

import { API } from "@/services/api";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { useAuthStore } from "@/store/authStore";

type MainRole = "student" | "staff" | null;
type SubRole = "director" | "manager" | "student_user" | "parent" | null;

interface AxiosErrorResponse {
  response?: {
    data?: {
      non_field_errors?: string[];
      [key: string]: string[] | string | undefined;
    };
  };
  message?: string;
}

const schema = yup.object({
  phone: yup
    .string()
    .required("Phone number is mandatory")
    .test("len", "Enter a full number", (val) => val?.replace(/\D/g, "").length === 12),
  password: yup.string().required("Password is required"),
});

type FormData = yup.InferType<typeof schema>;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
};

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -40 : 40,
    opacity: 0,
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
  }),
};

const floatVariants = {
  animate: {
    y: [-8, 8, -8],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
  },
};

const pulseVariants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.5, 0.8, 0.5],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  },
};

export default function LoginView() {
  const { t } = useTranslation();
  const router = useRouter();
  const { login } = useAuthStore();

  const [step, setStep] = useState<1 | 2>(1);
  const [direction, setDirection] = useState(1);
  const [selectedMainRole, setSelectedMainRole] = useState<MainRole>(null);
  const [selectedSubRole, setSelectedSubRole] = useState<SubRole>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { phone: "", password: "" },
  });

  const { mutate: loginToProfile, isPending } = useMutation({
    mutationFn: (body: FormData) =>
      API.post("auth/login/", { ...body, phone: `+${body.phone}` }),
    onSuccess: (res) => {
      const { user, access_token, refresh_token, message } = res.data;

      const isLocalhost = window.location.hostname === "localhost";
      const cookieOptions = isLocalhost
        ? `path=/; max-age=${7 * 24 * 60 * 60}; samesite=lax`
        : `path=/; domain=.edumrx.uz; secure; samesite=none; max-age=${7 * 24 * 60 * 60}`;

      document.cookie = `access_token=${access_token}; ${cookieOptions}`;
      document.cookie = `refresh_token=${refresh_token}; ${cookieOptions}`;
      document.cookie = `user=${encodeURIComponent(JSON.stringify({ ...user, role: user?.role || selectedSubRole }))}; ${cookieOptions}`;

      login(
        { ...user, role: user?.role || selectedSubRole || "super_admin" },
        { access_token, refresh_token }
      );

      toast.success(message || t("auth.success_msg", "Login successfully"));

      if (isLocalhost) {
        toast.info(`✅ Role: ${selectedSubRole}`);
        return;
      }

      const redirectMap: Record<string, string> = {
        director: "https://director.edumrx.uz",
        manager: "https://manager.edumrx.uz",
        student_user: "https://student.edumrx.uz",
        parent: "https://parent.edumrx.uz",
      };

      const redirectUrl = selectedSubRole ? redirectMap[selectedSubRole] ?? "/" : "/";

      if (redirectUrl.startsWith("/")) {
        router.push(redirectUrl);
      } else {
        window.location.href = redirectUrl;
      }
    },
    onError: (err: AxiosErrorResponse) => {
      const serverErrors = err?.response?.data;
      if (serverErrors?.non_field_errors && Array.isArray(serverErrors.non_field_errors)) {
        toast.error(serverErrors.non_field_errors[0]);
      } else if (serverErrors && typeof serverErrors === "object") {
        const firstKey = Object.keys(serverErrors)[0];
        const errorValue = serverErrors[firstKey];
        if (Array.isArray(errorValue)) {
          toast.error(errorValue[0]);
        } else {
          toast.error(t("auth.error_invalid", "Ma'lumotlarni tekshiring xatolik mavjud."));
        }
      } else {
        toast.error(err?.message || t("auth.error_generic", "Xatolik yuz berdi"));
      }
    },
  });

  const handleNextStep = () => {
    if (selectedMainRole) {
      if (selectedMainRole === "staff") setSelectedSubRole("director");
      if (selectedMainRole === "student") setSelectedSubRole("student_user");
      setDirection(1);
      setStep(2);
    }
  };

  const handleBack = () => {
    setDirection(-1);
    setStep(1);
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-950 text-slate-100 overflow-hidden">

      {/* LEFT: Form */}
      <div className="relative z-10 w-full lg:w-[480px] flex flex-col min-h-screen bg-slate-950 border-r border-slate-800/50">

        {/* Subtle noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Top glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-indigo-600/20 blur-3xl rounded-full pointer-events-none" />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 flex items-center justify-between px-8 pt-8"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm tracking-tight text-white">EduMRX</span>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-1.5">
            {[1, 2].map((s) => (
              <motion.div
                key={s}
                animate={{
                  width: step === s ? 20 : 6,
                  backgroundColor: step === s ? "#6366f1" : step > s ? "#4ade80" : "#334155",
                }}
                transition={{ duration: 0.3 }}
                className="h-1.5 rounded-full"
              />
            ))}
          </div>
        </motion.div>

        {/* Form area */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-8 py-12">
          <AnimatePresence mode="wait" custom={direction}>
            {/* STEP 1 */}
            {step === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-6"
                >
                  {/* Title */}
                  <motion.div variants={itemVariants} className="space-y-2">
                    <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">
                      {t("login.welcome", "Xush kelibsiz")}
                    </p>
                    <h1 className="text-2xl font-black tracking-tight text-white leading-tight">
                      {t("login.title", "Profilingizni\ntanlang")}
                    </h1>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {t("login.subtitle", "Tizimga kirish uchun o'z guruhingizni belgilang.")}
                    </p>
                  </motion.div>

                  {/* Role cards */}
                  <motion.div variants={itemVariants} className="space-y-3">
                    {/* Student card */}
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setSelectedMainRole("student")}
                      className={`w-full relative flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 text-left ${selectedMainRole === "student"
                        ? "bg-indigo-600/10 border-indigo-500/50 shadow-lg shadow-indigo-500/10"
                        : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                        }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${selectedMainRole === "student" ? "bg-indigo-600" : "bg-slate-800"
                        }`}>
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-sm text-white">
                          {t("login.student_label", "O'quvchi & Ota-ona")}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {t("login.student_desc", "Dars jadvali va reyting monitoringi")}
                        </p>
                      </div>
                      <motion.div
                        animate={selectedMainRole === "student" ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }}
                        className="shrink-0"
                      >
                        <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                      </motion.div>
                    </motion.button>

                    {/* Staff card */}
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setSelectedMainRole("staff")}
                      className={`w-full relative flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 text-left ${selectedMainRole === "staff"
                        ? "bg-indigo-600/10 border-indigo-500/50 shadow-lg shadow-indigo-500/10"
                        : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                        }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${selectedMainRole === "staff" ? "bg-indigo-600" : "bg-slate-800"
                        }`}>
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-sm text-white">
                          {t("login.staff_label", "Staff Node")}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {t("login.staff_desc", "O'quv markazini boshqarish zanjiri")}
                        </p>
                      </div>
                      <motion.div
                        animate={selectedMainRole === "staff" ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }}
                        className="shrink-0"
                      >
                        <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                      </motion.div>
                    </motion.button>
                  </motion.div>

                  {/* Next button */}
                  <motion.div variants={itemVariants}>
                    <motion.button
                      whileHover={selectedMainRole ? { scale: 1.01 } : {}}
                      whileTap={selectedMainRole ? { scale: 0.99 } : {}}
                      disabled={!selectedMainRole}
                      onClick={handleNextStep}
                      className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-indigo-500/20 disabled:shadow-none"
                    >
                      <span>{t("login.next_btn", "Davom etish")}</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-6"
                >
                  {/* Title */}
                  <motion.div variants={itemVariants} className="space-y-2">
                    <button
                      onClick={handleBack}
                      className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors mb-4"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>{t("login.back_btn", "Orqaga")}</span>
                    </button>
                    <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">
                      {t("login.step2_label", "2-qadam")}
                    </p>
                    <h1 className="text-2xl font-black tracking-tight text-white">
                      {t("login.auth_title", "Kirish")}
                    </h1>
                    <p className="text-sm text-slate-500">
                      {t("login.auth_subtitle", "Telefon va parolingizni kiriting")}
                    </p>
                  </motion.div>

                  {/* Sub role tabs */}
                  <motion.div variants={itemVariants}>
                    <div className="p-1 rounded-xl bg-slate-900 flex gap-1 border border-slate-800">
                      {selectedMainRole === "staff" ? (
                        <>
                          {["director", "manager"].map((role) => (
                            <button
                              key={role}
                              type="button"
                              onClick={() => setSelectedSubRole(role as SubRole)}
                              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${selectedSubRole === role
                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                                : "text-slate-500 hover:text-slate-300"
                                }`}
                            >
                              {t(`login.roles.${role}`, role.charAt(0).toUpperCase() + role.slice(1))}
                            </button>
                          ))}
                        </>
                      ) : (
                        <>
                          {[
                            { key: "student_user", label: "O'quvchi" },
                            { key: "parent", label: "Ota-ona" },
                          ].map((item) => (
                            <button
                              key={item.key}
                              type="button"
                              onClick={() => setSelectedSubRole(item.key as SubRole)}
                              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${selectedSubRole === item.key
                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                                : "text-slate-500 hover:text-slate-300"
                                }`}
                            >
                              {t(`login.roles.${item.key}`, item.label)}
                            </button>
                          ))}
                        </>
                      )}
                    </div>
                  </motion.div>

                  {/* Form */}
                  <motion.form
                    variants={itemVariants}
                    onSubmit={handleSubmit((data) => loginToProfile(data))}
                    className="space-y-4"
                  >
                    {/* Phone */}
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        <Smartphone className="w-3 h-3" />
                        <span>{t("login.phone_label", "Telefon raqam")}</span>
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

                    {/* Password */}
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        <KeyRound className="w-3 h-3" />
                        <span>{t("login.pass_label", "Parol")}</span>
                      </label>
                      <PasswordInput
                        register={register("password")}
                        error={errors.password?.message}
                      />
                    </div>

                    {/* Submit */}
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      type="submit"
                      disabled={isPending}
                      className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-indigo-500/20 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                    >
                      {isPending ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white"
                        />
                      ) : (
                        <>
                          <span>{t("login.login_btn", "Kirish")}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </motion.button>
                  </motion.form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="relative z-10 px-8 pb-8 text-center"
        >
          <p className="text-[10px] text-slate-700 font-medium tracking-wider uppercase">
            Secure Core Cloud Interface · EduMRX
          </p>
        </motion.div>
      </div>

      {/* RIGHT: Visual */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden">

        {/* Background grid */}
        <div className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Glow orbs */}
        <motion.div
          variants={pulseVariants}
          animate="animate"
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"
        />
        <motion.div
          variants={pulseVariants}
          animate="animate"
          style={{ animationDelay: "1.5s" }}
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl"
        />

        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-md px-8"
        >
          <motion.div
            variants={floatVariants}
            animate="animate"
            className="w-full"
          >
            {/* Card */}
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800/60 overflow-hidden shadow-2xl">

              {/* Card header */}
              <div className="relative bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-600 p-8">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_60%)]" />
                <div className="relative z-10 flex flex-col items-center text-center gap-4">
                  <motion.div
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                    className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center"
                  >
                    <GraduationCap className="w-8 h-8 text-white" />
                  </motion.div>
                  <div>
                    <h2 className="text-xl font-black text-white tracking-tight">EduMRX Platform</h2>
                    <p className="text-indigo-200 text-xs mt-1 opacity-80">
                      {t("login.branding_desc", "Barcha filiallar, o'qituvchilar va moliya bitta xavfsiz boshqaruv panelida.")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 divide-x divide-slate-800 border-t border-slate-800">
                {[
                  { label: "O'quvchilar", value: "10K+" },
                  { label: "Filiallar", value: "200+" },
                  { label: "Ustozlar", value: "500+" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="flex flex-col items-center py-4 gap-0.5"
                  >
                    <span className="text-lg font-black text-white">{stat.value}</span>
                    <span className="text-[10px] text-slate-500 font-medium">{stat.label}</span>
                  </motion.div>
                ))}
              </div>

              {/* Features */}
              <div className="p-5 space-y-3">
                {[
                  { icon: Shield, text: "Xavfsiz autentifikatsiya" },
                  { icon: Users, text: "Ko'p rol qo'llab-quvvatlash" },
                  { icon: Building2, text: "Multi-tenant arxitektura" },
                ].map((feature, i) => (
                  <motion.div
                    key={feature.text}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-7 h-7 rounded-lg bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                      <feature.icon className="w-3.5 h-3.5 text-indigo-400" />
                    </div>
                    <span className="text-xs text-slate-400 font-medium">{feature.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Bottom label */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex items-center justify-center gap-2 mt-6 text-[10px] text-slate-700 font-bold uppercase tracking-widest"
          >
            <div className="w-1 h-1 rounded-full bg-indigo-500/50" />
            <span>EduMRX Corporate Edge System</span>
            <div className="w-1 h-1 rounded-full bg-indigo-500/50" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}