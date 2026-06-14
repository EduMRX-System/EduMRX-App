"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
    Sparkles,
    GraduationCap,
    Users,
    BookOpen,
    ClipboardCheck,
    Star,
    CreditCard,
    Clock,
} from "lucide-react";

import { API } from "@/services/api";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/useUIStore";
import { LogoIcons } from "@/constants/icons";
import Link from "next/link";
import Image from "next/image";

type StudentRole = "student_user" | "parent" | "teacher";

interface AxiosErrorResponse {
    response?: { data?: { non_field_errors?: string[];[key: string]: string[] | string | undefined } };
    message?: string;
}

const schema = yup.object({
    phone: yup
        .string()
        .required("Telefon raqam majburiy")
        .test("len", "To'liq raqam kiriting", (val) => val?.replace(/\D/g, "").length === 12),
    password: yup.string().required("Parol majburiy"),
});

type FormData = yup.InferType<typeof schema>;

const ROLE_INFO: Record<StudentRole, { label: string; uz: string; icon: any }> = {
    student_user: { label: "O'QUVCHI PANEL", uz: "O'quvchi", icon: GraduationCap },
    parent: { label: "OTA-ONA PANEL", uz: "Ota-ona", icon: Users },
    teacher: { label: "O'QITUVCHI PANEL", uz: "O'qituvchi", icon: BookOpen },
};

export default function StudentLoginView() {
    const { t } = useTranslation();
    const { theme, setTheme } = useUIStore();

    const { login } = useAuthStore();

    const [role, setRole] = useState<StudentRole>("student_user");

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: { phone: "", password: "" },
    });

    const { mutate: loginUser, isPending } = useMutation({
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
            document.cookie = `user=${encodeURIComponent(JSON.stringify({ ...user, role: user?.role || role }))}; ${cookieOptions}`;

            login({ ...user, role: user?.role || role }, { access_token, refresh_token });
            toast.success(message || "Muvaffaqiyatli kirdingiz");

            if (isLocalhost) {
                toast.info(`✅ Role: ${role}`);
                return;
            }

            const redirectMap: Record<StudentRole, string> = {
                student_user: "https://student.edumrx.uz",
                parent: "https://parent.edumrx.uz",
                teacher: "https://teacher.edumrx.uz",
            };
            window.location.href = redirectMap[role];
        },
        onError: (err: AxiosErrorResponse) => {
            const e = err?.response?.data;
            if (e?.non_field_errors?.[0]) toast.error(e.non_field_errors[0]);
            else if (e && typeof e === "object") {
                const v = e[Object.keys(e)[0]];
                toast.error(Array.isArray(v) ? v[0] : "Ma'lumotlarni tekshiring");
            } else toast.error(err?.message || "Xatolik yuz berdi");
        },
    });

    const features = [
        { icon: ClipboardCheck, text: "Davomat monitoringi" },
        { icon: Star, text: "Baholar va reyting" },
        { icon: BookOpen, text: "Uy vazifalari" },
        { icon: CreditCard, text: "To'lovlar tarixi" },
    ];

    const stats = [
        { value: "10K+", label: "O'quvchilar" },
        { value: "500+", label: "Ustozlar" },
        { value: "24/7", label: "Yordam", icon: Clock },
    ];

    const RoleIcon = ROLE_INFO[role].icon;

    return (
        <div className="min-h-screen w-full flex bg-slate-950 overflow-hidden">

            {/* LEFT: Branding (gradient) */}
            <div className="hidden lg:flex flex-1 relative flex-col justify-between p-12 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-800 via-slate-900 to-cyan-800" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(99,102,241,0.18),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(6,182,212,0.18),transparent_50%)]" />

                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/3 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"
                />




                <div className="relative z-10 space-y-20">
                    <div className="">
                        <Link href="/" className="">
                            {theme == "dark" ? (
                                <Image
                                    src={LogoIcons.logoDark}
                                    width={250}
                                    height={62}
                                    alt="EduMRX Logo"
                                />
                            ) : (
                                <Image
                                    src={LogoIcons.logo}
                                    width={250}
                                    height={62}
                                    alt="EduMRX Logo"
                                />
                            )}
                        </Link>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <h2 className="text-4xl font-black text-white leading-tight tracking-tight">
                            Bilimingizni<br />kuzatib boring
                        </h2>
                        <p className="text-white/70 text-sm mt-4 max-w-md leading-relaxed">
                            Dars jadvali, davomat, baholar va to'lovlar — barchasi bir joyda. O'qish jarayonini real vaqtda kuzating.
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
                                key={f.text}
                                variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
                                className="flex items-center gap-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
                            >
                                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                                    <f.icon className="w-4 h-4 text-white/80" />
                                </div>
                                <span className="text-sm font-semibold text-white/90">{f.text}</span>
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
                        <div key={s.label} className="p-5 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                                {s.icon && <s.icon className="w-5 h-5 text-white/80" />}
                                <span className="text-2xl font-black text-white">{s.value}</span>
                            </div>
                            <p className="text-[11px] text-white/60 mt-1">{s.label}</p>
                        </div>
                    ))}
                </motion.div>
            </div>



            {/* RIGHT: Form */}
            <div className="w-full lg:w-[520px] flex flex-col justify-center p-8 sm:p-12 bg-slate-950 relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-3xl rounded-full" />

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10 w-full max-w-sm mx-auto space-y-6"
                >
                    {/* Role badge */}
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700/50 flex items-center justify-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
                            <RoleIcon className="w-[18px] h-[18px] text-white" />
                        </div>
                        <span className="text-sm font-black text-indigo-400 tracking-widest">
                            {ROLE_INFO[role].label}
                        </span>
                    </div>

                    {/* Role tabs */}
                    <div className="p-1 rounded-xl bg-slate-900 flex gap-1 border border-slate-800">
                        {(["student_user", "parent", "teacher"] as StudentRole[]).map((r) => (
                            <button
                                key={r}
                                onClick={() => setRole(r)}
                                className={`flex-1 py-2.5 text-[13px] font-bold rounded-lg transition-all ${role === r
                                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                                    : "text-slate-500 hover:text-slate-300"
                                    }`}
                            >
                                {ROLE_INFO[r].uz}
                            </button>
                        ))}
                    </div>

                    {/* Welcome */}
                    <div>
                        <h2 className="text-3xl font-black text-white tracking-tight">Xush kelibsiz!</h2>
                        <p className="text-sm text-slate-400 mt-1">
                            <span className="text-indigo-400 font-bold">{ROLE_INFO[role].uz}</span> sifatida tizimga kiring
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit((d) => loginUser(d))} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-300">Telefon raqami</label>
                            <Controller
                                name="phone"
                                control={control}
                                render={({ field }) => (
                                    <PhoneInput value={field.value || ""} onChange={field.onChange} error={errors.phone?.message} />
                                )}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-300">Parol</label>
                            <PasswordInput register={register("password")} error={errors.password?.message} />
                        </div>

                        <div className="text-right">
                            <button type="button" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                                Parolni unutdingizmi?
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
                                    <span>Tizimga kirish</span>
                                </>
                            )}
                        </motion.button>
                    </form>

                    <p className="text-xs text-slate-500 text-center leading-relaxed">
                        Tizimga kirish orqali siz bizning{" "}
                        <span className="text-indigo-400 font-semibold">shartlar</span> va{" "}
                        <span className="text-indigo-400 font-semibold">maxfiylik siyosati</span>ni qabul qilasiz
                    </p>
                </motion.div>
            </div>
        </div>
    );
}