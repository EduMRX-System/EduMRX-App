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
  Loader2,
  User,
  Shield,
  ArrowRight,
  Building2,
  Smartphone,
  KeyRound,
} from "lucide-react";

import { API } from "@/services/api";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { useAuthStore } from "@/store/authStore";

// 1. Roles & Multi-tenant state definitions
type MainRole = "student" | "staff" | null;
type SubRole = "director" | "manager" | "student_user" | "parent" | null;

// 2. Strict Axios Error Typing
interface AxiosErrorResponse {
  response?: {
    data?: {
      non_field_errors?: string[];
      [key: string]: string[] | string | undefined;
    };
  };
  message?: string;
}

// 3. Validation Schema
const schema = yup.object({
  phone: yup
    .string()
    .required("Phone number is mandatory")
    .test(
      "len",
      "Enter a full number",
      (val) => val?.replace(/\D/g, "").length === 12,
    ),
  password: yup.string().required("Password is required"),
});

type FormData = yup.InferType<typeof schema>;

// Framer Motion micro-interactions configs
const pageVariants = {
  initial: { opacity: 0, x: 10 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
  exit: { opacity: 0, x: -10, transition: { duration: 0.2 } },
};

export default function LoginView() {
  const { t } = useTranslation();
  const router = useRouter();
  const { login } = useAuthStore();

  // Multi-step flow state
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedMainRole, setSelectedMainRole] = useState<MainRole>(null);
  const [selectedSubRole, setSelectedSubRole] = useState<SubRole>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Form hooks setup
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  const { mutate: loginToProfile, isPending } = useMutation({
    mutationFn: (body: FormData) =>
      API.post("auth/login/", { ...body, phone: `+${body.phone}` }),
    onSuccess: (res) => {
      const { user, access_token, refresh_token, message } = res.data;

      // Localhost da domain yo'q, production da .edumrx.uz
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

      // Localhost da redirect yo'q
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
      if (
        serverErrors?.non_field_errors &&
        Array.isArray(serverErrors.non_field_errors)
      ) {
        toast.error(serverErrors.non_field_errors[0]);
      } else if (serverErrors && typeof serverErrors === "object") {
        const firstKey = Object.keys(serverErrors)[0];
        const errorValue = serverErrors[firstKey];
        if (Array.isArray(errorValue)) {
          toast.error(errorValue[0]);
        } else {
          toast.error(
            t("auth.error_invalid", "Ma'lumotlarni tekshiring xatolik mavjud."),
          );
        }
      } else {
        toast.error(
          err?.message || t("auth.error_generic", "Xatolik yuz berdi"),
        );
      }
    },
  });

  const handleNextStep = () => {
    if (selectedMainRole) {
      if (selectedMainRole === "staff") setSelectedSubRole("director");
      if (selectedMainRole === "student") setSelectedSubRole("student_user");
      setStep(2);
    }
  };

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-12 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-500 font-sans select-none">
      {/* CHAP TOMON: AUTH FORM CONTAINER */}
      <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-10 md:p-16 relative z-10 bg-white dark:bg-slate-950 border-r border-slate-200/50 dark:border-slate-900">
        {/* Top Header Logo row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center text-white font-black text-sm">
              E
            </div>
            <span className="font-bold text-sm tracking-tight">EduMRX</span>
          </div>
        </div>

        {/* Dynamic step cluster */}
        <div className="max-w-sm w-full mx-auto my-auto py-8">
          <div className="space-y-1.5 text-left mb-8">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              {step === 1
                ? t("login.title", "Choose profile")
                : t("login.auth_title", "Authorization")}
            </h1>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              {step === 1
                ? t(
                  "login.subtitle",
                  "Tizimga kirish uchun o'z guruhingizni belgilang.",
                )
                : t(
                  "login.auth_subtitle",
                  "Hisob ma'lumotlarini kiritib shaxsiy kabinetga ulaning.",
                )}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {/* STEP 1: ROLE ACQUISITION LAYER */}
            {step === 1 && (
              <motion.div
                key="step1"
                // variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-3"
              >
                {/* Student Select Block */}
                <div
                  onClick={() => setSelectedMainRole("student")}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-colors flex items-start gap-3.5 relative ${selectedMainRole === "student"
                    ? "border-indigo-600 bg-slate-50 dark:bg-slate-900"
                    : "border-slate-200/70 dark:border-slate-800/70 bg-white dark:bg-slate-950 hover:border-slate-300 dark:hover:border-slate-800"
                    }`}
                >
                  <div
                    className={`w-9 h-9 rounded-md flex items-center justify-center border transition-all ${selectedMainRole === "student"
                      ? "bg-indigo-600 border-indigo-600 text-white"
                      : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400"
                      }`}
                  >
                    <User className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5 text-left pr-6">
                    <h3 className="font-bold text-xs sm:text-sm tracking-tight">
                      {t("login.student_label", "Student & Parent")}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium leading-normal">
                      {t(
                        "login.student_desc",
                        "Dars jadvallari va reyting monitoringi",
                      )}
                    </p>
                  </div>
                  <div className="absolute top-5 right-4 w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center p-0.5">
                    {selectedMainRole === "student" && (
                      <div className="w-full h-full rounded-full bg-indigo-600" />
                    )}
                  </div>
                </div>

                {/* Staff Select Block */}
                <div
                  onClick={() => setSelectedMainRole("staff")}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-colors flex items-start gap-3.5 relative ${selectedMainRole === "staff"
                    ? "border-indigo-600 bg-slate-50 dark:bg-slate-900"
                    : "border-slate-200/70 dark:border-slate-800/70 bg-white dark:bg-slate-950 hover:border-slate-300 dark:hover:border-slate-800"
                    }`}
                >
                  <div
                    className={`w-9 h-9 rounded-md flex items-center justify-center border transition-all ${selectedMainRole === "staff"
                      ? "bg-indigo-600 border-indigo-600 text-white"
                      : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400"
                      }`}
                  >
                    <Shield className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5 text-left pr-6">
                    <h3 className="font-bold text-xs sm:text-sm tracking-tight">
                      {t("login.staff_label", "Staff Node")}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium leading-normal">
                      {t(
                        "login.staff_desc",
                        "O'quv markazini boshqarish zanjiri",
                      )}
                    </p>
                  </div>
                  <div className="absolute top-5 right-4 w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center p-0.5">
                    {selectedMainRole === "staff" && (
                      <div className="w-full h-full rounded-full bg-indigo-600" />
                    )}
                  </div>
                </div>

                <button
                  disabled={!selectedMainRole}
                  onClick={handleNextStep}
                  className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 dark:disabled:bg-slate-900 disabled:text-slate-400 dark:disabled:text-slate-600 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-all mt-5"
                >
                  <span>{t("login.next_btn", "Davom etish")}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            )}

            {/* STEP 2: CREDENTIAL VALIDATION LAYER */}
            {step === 2 && (
              <motion.div
                key="step2"
                // variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-3.5"
              >
                {/* Clean Tab Segment Switchers */}
                <div className="p-0.5 rounded-lg bg-slate-100 dark:bg-slate-900 flex gap-0.5 border border-slate-200/40 dark:border-slate-800/40">
                  {selectedMainRole === "staff" ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setSelectedSubRole("director")}
                        className={`flex-1 py-1.5 text-[11px] font-bold rounded-md transition-all ${selectedSubRole === "director" ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-white" : "text-slate-400 hover:text-slate-500"}`}
                      >
                        {t("login.roles.director", "Director")}
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedSubRole("manager")}
                        className={`flex-1 py-1.5 text-[11px] font-bold rounded-md transition-all ${selectedSubRole === "manager" ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-white" : "text-slate-400 hover:text-slate-500"}`}
                      >
                        {t("login.roles.manager", "Manager")}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setSelectedSubRole("student_user")}
                        className={`flex-1 py-1.5 text-[11px] font-bold rounded-md transition-all ${selectedSubRole === "student_user" ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-white" : "text-slate-400 hover:text-slate-500"}`}
                      >
                        {t("login.roles.student_user", "O'quvchi")}
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedSubRole("parent")}
                        className={`flex-1 py-1.5 text-[11px] font-bold rounded-md transition-all ${selectedSubRole === "parent" ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-white" : "text-slate-400 hover:text-slate-500"}`}
                      >
                        {t("login.roles.parent", "Ota-ona")}
                      </button>
                    </>
                  )}
                </div>

                {/* Form Processing */}
                <form
                  onSubmit={handleSubmit((data) => loginToProfile(data))}
                  className="space-y-3.5 text-left"
                >
                  {/* Phone Area */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Smartphone className="w-3 h-3 text-slate-400" />
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

                  {/* Password Area */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <KeyRound className="w-3 h-3 text-slate-400" />
                      <span>{t("login.pass_label", "Parol")}</span>
                    </label>
                    <PasswordInput
                      register={register("password")}
                      error={errors.password?.message}
                    />
                  </div>

                  {/* Navigation & Trigger Controls */}
                  <div className="flex gap-2 pt-1.5">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="h-10 px-3.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 font-bold text-xs rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {t("login.back_btn", "Orqaga")}
                    </button>
                    <button
                      type="submit"
                      disabled={isPending}
                      className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      {isPending ? (
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      ) : (
                        <span>{t("login.login_btn", "Kirish")}</span>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="text-[10px] text-slate-400 font-medium text-center">
          Secure Core Cloud Interface System Node.
        </div>
      </div>

      {/* RIGHT COLUMN: FLAT CINEMATIC MOCKUP LAYER (No Shadows) */}
      <div className="hidden lg:flex lg:col-span-7 bg-slate-950 relative items-center justify-center p-12 overflow-hidden border-l border-slate-900">
        <div className="w-full max-w-sm relative">
          {/* Main Frame Wrapper */}
          <div className="w-full bg-slate-900 p-2 rounded-xl border border-slate-800/60 backdrop-blur-xl">
            {/* Aspect Core Display Screen */}
            <div className="w-full rounded-lg bg-gradient-to-tr from-indigo-700 via-indigo-600 to-violet-600 aspect-square flex flex-col items-center justify-center p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.06),transparent_70%)]" />

              <div className="relative z-10 text-center text-white space-y-3 flex flex-col items-center">
                <div className="w-10 h-10 rounded-lg bg-white text-indigo-600 flex items-center justify-center font-black text-xl">
                  E
                </div>
                <h2 className="font-extrabold text-base tracking-tight pt-1">
                  EduMRX HQ Control
                </h2>
                <p className="text-[10px] text-indigo-100 max-w-[220px] opacity-75 leading-relaxed font-medium">
                  {t(
                    "login.branding_desc",
                    "Barcha filiallar, o'qituvchilar va moliya bitta xavfsiz boshqaruv panelida.",
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Minimal Branding Bottom Node */}
          <div className="flex items-center justify-center gap-1.5 text-[9px] text-slate-600 font-bold pt-5 uppercase tracking-widest">
            <Building2 className="w-3.5 h-3.5 text-indigo-500/50" />
            <span>EduMRX Corporate Edge System</span>
          </div>
        </div>
      </div>
    </div>
  );
}
