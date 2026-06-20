"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "@/services/api";
import { User, X, Eye, EyeOff, Loader2, ChevronDown, Check, Notebook } from "lucide-react";
import { toast } from "react-toastify";
import { STATUS_OPTIONS, formatUzPhone, splitFullName, type IStudent } from "@/types/student";
import SearchSelect from "@/components/ui/SearchSelect";
import { useBranchOptions } from "@/hooks/useBranches";
import { useTranslation } from "react-i18next";

const schema = yup.object({
    first_name: yup.string().required("Ism majburiy"),
    last_name: yup.string().required("Familiya majburiy"),
    phone: yup
        .string()
        .required("Telefon majburiy")
        .test("phone-complete", "Telefon to'liq emas", (val) => (val?.replace(/\D/g, "") ?? "").length === 12),
    email: yup.string().email("Email noto'g'ri").required("Email majburiy"),
    password: yup.string().when("$isEdit", {
        is: false,
        then: (s) => s.min(6, "Kamida 6 belgi").required("Parol majburiy"),
        otherwise: (s) => s.optional(),
    }),
    center: yup.string().uuid("Filial UUID noto'g'ri").required("Filialni tanlang"),
    date_of_birth: yup.string().required("Tug'ilgan sana majburiy"),
    notes: yup.string().optional(),
    status: yup.string().oneOf(["active", "inactive"]).required("Status majburiy"),
});

type FormData = yup.InferType<typeof schema>;

interface Props {
    student?: IStudent | null;
    onClose: () => void;
}

export default function StudentFormModal({ student, onClose }: Props) {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const isEdit = !!student;
    const [isMounted, setIsMounted] = useState(false);
    const [phoneDisplay, setPhoneDisplay] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const statusRef = useRef<HTMLDivElement>(null);

    const { data: branches = [], isLoading: branchesLoading } = useBranchOptions();
    const nameFromFull = splitFullName(student?.full_name);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        context: { isEdit },
        defaultValues: {
            first_name: student?.first_name || nameFromFull.first,
            last_name: student?.last_name || nameFromFull.last,
            phone: student?.phone || "998",
            email: student?.email || "",
            password: "",
            center: student?.center || "",
            date_of_birth: student?.date_of_birth ? student.date_of_birth.slice(0, 10) : new Date().toISOString().split("T")[0],
            notes: student?.notes || "",
            status: (student?.status === "inactive" ? "inactive" : "active"),
        },
    });

    useEffect(() => {
        setIsMounted(true);
        if (student?.phone) setPhoneDisplay(formatUzPhone(student.phone));
        const onClick = (e: MouseEvent) => {
            if (statusRef.current && !statusRef.current.contains(e.target as Node)) setIsStatusOpen(false);
        };
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, [student]);

    // Edit: center id GET'da yo'q bo'lsa, center_name bo'yicha filialni topib tanlash
    useEffect(() => {
        if (!isEdit || watch("center") || !student?.center_name || branches.length === 0) return;
        const found = branches.find((b) => b.label.toLowerCase() === student.center_name!.toLowerCase());
        if (found) setValue("center", found.id, { shouldValidate: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [branches, student?.center_name, isEdit]);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\D/g, "");
        const local = (raw.startsWith("998") ? raw.slice(3) : raw).slice(0, 9);
        setPhoneDisplay(formatUzPhone(local));
        setValue("phone", "998" + local, { shouldValidate: true });
    };

    const { mutate: saveStudent, isPending } = useMutation({
        mutationFn: async (body: FormData) => {
            const { password, ...rest } = body;
            const payload = isEdit ? rest : body;
            return isEdit
                ? (await API.put(`director/students/${student!.id}/`, payload)).data
                : (await API.post("director/students/", payload)).data;
        },
        onSuccess: (data: any) => {
            toast.success(data?.message || t(isEdit ? "director.students.toast.updated" : "director.students.toast.created"));
            queryClient.invalidateQueries({ queryKey: ["students-list"] });
            onClose();
        },
        onError: (err: any) => {
            const e = err?.response?.data;
            if (e && typeof e === "object") {
                const k = Object.keys(e)[0];
                if (k) {
                    const text = Array.isArray(e[k]) ? e[k][0] : e[k];
                    return toast.error(`${k}: ${typeof text === "string" ? text.replace(/["']/g, "") : text}`);
                }
            }
            toast.error(t("director.students.toast.error_generic"));
        },
    });

    const currentStatus = STATUS_OPTIONS.find((o) => o.value === watch("status")) || STATUS_OPTIONS[0];
    const fieldCls = (hasError?: boolean) =>
        `border rounded-lg w-full h-[40px] px-3 text-[14px] outline-none transition-all bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/20 ${hasError ? "border-red-300 dark:border-red-800" : "border-slate-200 dark:border-slate-700 focus:border-indigo-400"}`;
    const labelCls = "text-[14px] text-slate-600 dark:text-slate-300 mb-1 block font-semibold";
    const errCls = "text-red-400 dark:text-red-500 text-[11px] mt-1";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className={`fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm transition-opacity duration-500 ${isMounted ? "opacity-100" : "opacity-0"}`}
                onClick={onClose}
            />

            <div
                className={`bg-white dark:bg-slate-900 p-6 rounded-xl max-w-xl w-full max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 transform transition-all duration-500 ease-out ${isMounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-12 scale-95"}`}
            >
                <div className="sticky top-0 z-50 h-0 w-full flex justify-end items-start pointer-events-none">
                    <button
                        type="button"
                        onClick={onClose}
                        className="pointer-events-auto -mt-2 -mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-md cursor-pointer transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="mb-[10px] border border-slate-200 dark:border-slate-700 shadow-sm w-[44px] h-[44px] rounded-lg flex justify-center items-center text-indigo-600 bg-indigo-50/10 dark:bg-indigo-950/20">
                    <User className="w-6 h-6" />
                </div>

                <h3 className="text-slate-900 dark:text-slate-100 text-[18px] font-semibold mb-4">
                    {isEdit ? t("director.students.form.title_edit") : t("director.students.form.title_add")}
                </h3>

                <form onSubmit={handleSubmit((d) => saveStudent(d))} className="space-y-4">
                    {/* Ism + Familiya */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>{t("common.first_name")} *</label>
                            <input {...register("first_name")} placeholder="Ali" className={fieldCls(!!errors.first_name)} />
                            {errors.first_name && <p className={errCls}>{errors.first_name.message}</p>}
                        </div>
                        <div>
                            <label className={labelCls}>{t("common.last_name")} *</label>
                            <input {...register("last_name")} placeholder="Valiyev" className={fieldCls(!!errors.last_name)} />
                            {errors.last_name && <p className={errCls}>{errors.last_name.message}</p>}
                        </div>
                    </div>

                    {/* Telefon + Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>{t("common.phone")} *</label>
                            <div className="relative flex items-center">
                                <span className="absolute left-3 text-sm font-semibold text-slate-700 dark:text-slate-300 pointer-events-none select-none">+998</span>
                                <input type="tel" value={phoneDisplay} onChange={handlePhoneChange} placeholder="90-123-45-67" className={`${fieldCls(!!errors.phone)} pl-[55px]`} />
                            </div>
                            {errors.phone && <p className={errCls}>{errors.phone.message}</p>}
                        </div>
                        <div>
                            <label className={labelCls}>{t("common.email")} *</label>
                            <input {...register("email")} type="email" placeholder="student@example.com" className={fieldCls(!!errors.email)} />
                            {errors.email && <p className={errCls}>{errors.email.message}</p>}
                        </div>
                    </div>

                    {/* Parol (add) + Tug'ilgan sana */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {!isEdit && (
                            <div>
                                <label className={labelCls}>{t("common.password")} *</label>
                                <div className="relative flex items-center">
                                    <input {...register("password")} type={showPassword ? "text" : "password"} placeholder="••••••" className={`${fieldCls(!!errors.password)} pr-10`} />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer">
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.password && <p className={errCls}>{errors.password.message}</p>}
                            </div>
                        )}
                        <div className={isEdit ? "md:col-span-2" : ""}>
                            <label className={labelCls}>{t("director.students.form.dob_label")}</label>
                            <input {...register("date_of_birth")} type="date" className={fieldCls(!!errors.date_of_birth)} />
                            {errors.date_of_birth && <p className={errCls}>{errors.date_of_birth.message}</p>}
                        </div>
                    </div>

                    {/* Filial + Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SearchSelect
                            label={t("common.branch")}
                            required
                            value={watch("center") || ""}
                            options={branches}
                            loading={branchesLoading}
                            placeholder={t("director.students.form.branch_placeholder")}
                            error={errors.center?.message}
                            onChange={(id) => setValue("center", id, { shouldValidate: true })}
                        />

                        <div ref={statusRef} className="relative">
                            <label className={labelCls}>{t("director.students.form.status_label")}</label>
                            <div
                                onClick={() => setIsStatusOpen(!isStatusOpen)}
                                className="border border-slate-200 dark:border-slate-700 rounded-lg w-full h-[40px] px-3 text-[14px] flex items-center justify-between cursor-pointer bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                            >
                                <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${currentStatus.color}`} />
                                    <span>{currentStatus.value === "active" ? t("common.active") : t("common.inactive")}</span>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isStatusOpen ? "rotate-180" : ""}`} />
                            </div>
                            {isStatusOpen && (
                                <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden flex flex-col">
                                    {STATUS_OPTIONS.map((option) => {
                                        const isSel = option.value === watch("status");
                                        return (
                                            <div
                                                key={option.value}
                                                onClick={() => { setValue("status", option.value, { shouldValidate: true }); setIsStatusOpen(false); }}
                                                className={`px-3 py-2.5 text-sm cursor-pointer transition-colors flex items-center justify-between ${isSel ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-medium" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"}`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-2 h-2 rounded-full ${option.color}`} />
                                                    <span>{option.value === "active" ? t("common.active") : t("common.inactive")}</span>
                                                </div>
                                                {isSel && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Izoh */}
                    <div>
                        <label className={labelCls}>{t("director.students.form.note_label")}</label>
                        <div className="relative">
                            <Notebook className="absolute left-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                            <textarea
                                {...register("notes")}
                                rows={2}
                                placeholder={t("director.students.form.note_placeholder")}
                                className="border rounded-lg w-full pl-10 pr-3 py-2.5 text-[14px] outline-none transition-all resize-none bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700 focus:border-indigo-400"
                            />
                        </div>
                    </div>

                    {/* Tugmalar */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
                        <button type="button" onClick={onClose} className="h-10 px-4 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-sm font-semibold rounded-lg cursor-pointer transition-colors">
                            {t("common.cancel")}
                        </button>
                        <button type="submit" disabled={isPending} className="inline-flex items-center justify-center gap-2 h-10 px-5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg disabled:opacity-60 cursor-pointer transition-colors">
                            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isEdit ? t("common.save") : t("common.create")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}