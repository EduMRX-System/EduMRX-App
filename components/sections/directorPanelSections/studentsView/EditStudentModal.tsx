"use client";

import { useState, useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "@/services/api";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { X, Loader2, ChevronDown, User, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import ScopeFormFields from "@/components/common/ScopeFormFields";
import { useActiveCenterStore } from "@/store/activeCenterStore";

export interface IStudent {
    id: string;
    student_id: string;
    full_name: string;
    avatar?: string;
    phone: string;
    email: string;
    center_name?: string;
    date_of_birth: string;
    notes?: string;
    status: "active" | "inactive" | "pending";
    enrolled_at: string;
}

interface EditStudentModalProps {
    student: IStudent;
    onClose: () => void;
}

interface IEditStudentPayload {
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    branch: string;
    date_of_birth: string;
    notes?: string;
    status: "active" | "inactive" | "pending";
}

function formatUzPhone(raw: string): string {
    const d = raw.slice(0, 9);
    if (d.length <= 2) return d;
    if (d.length <= 5) return `${d.slice(0, 2)}-${d.slice(2, 5)}`;
    if (d.length <= 7) return `${d.slice(0, 2)}-${d.slice(2, 5)}-${d.slice(5, 7)}`;
    return `${d.slice(0, 2)}-${d.slice(2, 5)}-${d.slice(5, 7)}-${d.slice(7)}`;
}

export default function EditStudentModal({ student, onClose }: EditStudentModalProps) {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    const [phoneDisplay, setPhoneDisplay] = useState("");
    const [isStatusOpen, setIsStatusOpen] = useState(false);

    const statusDropdownRef = useRef<HTMLDivElement>(null);
    const { activeCenter, isCentersLoaded } = useActiveCenterStore();

    const nameParts = student.full_name ? student.full_name.trim().split(" ") : [];
    const defaultFirstName = nameParts[0] || "";
    const defaultLastName = nameParts.slice(1).join(" ") || "";

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<IEditStudentPayload>({
        defaultValues: {
            first_name: defaultFirstName,
            last_name: defaultLastName,
            phone: student.phone || "",
            email: student.email || "",
            branch: (student as any)?.branch || "",
            date_of_birth: student.date_of_birth || "",
            status: student.status || "active",
            notes: student.notes || "",
        },
    });

    // Formdagi status qiymatini kuzatish (Badge uslubi uchun)
    const currentStatus = watch("status");

    // Status variantlari massivi
    const statusOptions = [
        { value: "active", label: t("students.status.active", "Active"), color: "bg-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-200/60 dark:border-emerald-500/20" },
        { value: "inactive", label: t("students.status.inactive", "Inactive"), color: "bg-rose-500", bg: "bg-rose-50 dark:bg-rose-500/10", text: "text-rose-600 dark:text-rose-400", border: "border-rose-200/60 dark:border-rose-500/20" },
    ] as const;

    const activeStatusConfig = statusOptions.find(opt => opt.value === currentStatus) || statusOptions[0];

    // Outside click handler
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
                setIsStatusOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Format phone
    useEffect(() => {
        if (student.phone) {
            const clean = student.phone.replace("+998", "").replace(/\D/g, "");
            setPhoneDisplay(formatUzPhone(clean));
            setValue("phone", student.phone);
        }
    }, [student.phone, setValue]);


    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\D/g, "");
        const local = raw.slice(0, 9);
        setPhoneDisplay(formatUzPhone(local));
        const full = "+998" + local;
        setValue("phone", full, { shouldValidate: true });
    };

    const { mutate: updateStudent, isPending } = useMutation({
        mutationFn: async (payload: IEditStudentPayload) => {
            if (!activeCenter) throw new Error("Hisobingizga markaz biriktirilmagan");
            return await API.put(`director/students/${student.id}/`, { ...payload, center: activeCenter });
        },
        onSuccess: () => {
            toast.success(t("students.toast.editSuccess", "Talaba ma'lumotlari muvaffaqiyatli yangilandi"));
            queryClient.invalidateQueries({ queryKey: ["students-list"] });
            onClose();
        },
        onError: (err: any) => {
            const errorData = err?.response?.data;
            if (errorData && typeof errorData.detail === 'string') {
                if (errorData.detail.includes("users_email_key")) {
                    return toast.error("Bu email bilan foydalanuvchi allaqachon mavjud!");
                }
                return toast.error(errorData.detail);
            }

            if (errorData && errorData.email) {
                const emailError = Array.isArray(errorData.email) ? errorData.email[0] : errorData.email;
                const cleanMessage = emailError.replace(/["']/g, "");
                return toast.error(cleanMessage);
            }

            if (errorData && typeof errorData === 'object') {
                const firstKey = Object.keys(errorData)[0];
                if (firstKey) {
                    const errorMessage = errorData[firstKey];
                    const text = Array.isArray(errorMessage) ? errorMessage[0] : errorMessage;
                    const cleanText = typeof text === 'string' ? text.replace(/["']/g, "") : text;
                    return toast.error(`${firstKey}: ${cleanText}`);
                }
            }

            toast.error("Tizimda xatolik yuz berdi, keyinroq urinib ko'ring.");
        }
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-150 border border-slate-100 dark:border-slate-800 flex flex-col my-auto max-h-[90vh]">

                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
                    <div>
                        <div className="mb-2 border-slate-200 dark:border-slate-700 border shadow-xs w-10 h-10 rounded-lg flex justify-center items-center text-indigo-600 dark:text-indigo-400 bg-indigo-50/30 dark:bg-indigo-500/10">
                            <User className="w-5 h-5" />
                        </div>
                        <h3 className="text-slate-800 dark:text-slate-100 text-lg font-semibold">
                            {t("students.modal.editTitle", "Talabani tahrirlash")}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Main Body */}
                <form
                    onSubmit={handleSubmit((data) => updateStudent(data))}
                    className="flex-1 overflow-y-auto p-6 space-y-5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-200 dark:[&::-webkit-scrollbar-thumb]:bg-slate-800 [&::-webkit-scrollbar-thumb]:rounded-full"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* Ism */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-1.5 tracking-wider">
                                {t("students.modal.firstName", "Ism")}
                            </label>
                            <input
                                type="text"
                                {...register("first_name", { required: t("students.validation.firstName", "Ism kiritilishi shart") })}
                                className="w-full h-11 px-3.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-slate-800 dark:text-slate-100 shadow-xs"
                            />
                            {errors.first_name && <p className="text-[11px] text-red-500 mt-1">{errors.first_name.message}</p>}
                        </div>

                        {/* Familiya */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-1.5 tracking-wider">
                                {t("students.modal.lastName", "Familiya")}
                            </label>
                            <input
                                type="text"
                                {...register("last_name", { required: t("students.validation.lastName", "Familiya kiritilishi shart") })}
                                className="w-full h-11 px-3.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-slate-800 dark:text-slate-100 shadow-xs"
                            />
                            {errors.last_name && <p className="text-[11px] text-red-500 mt-1">{errors.last_name.message}</p>}
                        </div>

                        {/* Telefon raqam */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-1.5 tracking-wider">
                                {t("students.modal.phone", "Telefon raqam")}
                            </label>
                            <div className="relative flex items-center">
                                <div className="absolute left-3.5 flex items-center gap-1.5 select-none pointer-events-none">
                                    <span className="text-base leading-none">🇺🇿</span>
                                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">+998</span>
                                </div>
                                <input
                                    type="tel"
                                    value={phoneDisplay}
                                    onChange={handlePhoneChange}
                                    placeholder="90-123-45-67"
                                    className="w-full h-11 pl-[92px] pr-3.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-slate-800 dark:text-slate-100 shadow-xs"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-1.5 tracking-wider">
                                {t("students.modal.email", "Email")}
                            </label>
                            <input
                                type="email"
                                {...register("email", { required: t("students.validation.email", "Email manzili shart") })}
                                className="w-full h-11 px-3.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-slate-800 dark:text-slate-100 shadow-xs"
                            />
                            {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email.message}</p>}
                        </div>

                        {/* Custom Status Dropdown */}
                        <div className="relative" ref={statusDropdownRef}>
                            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-1.5 tracking-wider">
                                {t("students.modal.status", "Status")}
                            </label>
                            <div
                                className="w-full h-11 px-3.5 flex items-center justify-between cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-indigo-500 transition-all text-sm text-slate-800 dark:text-slate-100 shadow-xs"
                                onClick={() => setIsStatusOpen(!isStatusOpen)}
                            >
                                <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${activeStatusConfig.color}`} />
                                    <span className={`text-sm font-medium px-2 py-0.5 rounded-md ${activeStatusConfig.bg} ${activeStatusConfig.text} border ${activeStatusConfig.border}`}>
                                        {activeStatusConfig.label}
                                    </span>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isStatusOpen ? "rotate-180" : ""}`} />
                            </div>

                            {/* Dropdown Menu */}
                            {isStatusOpen && (
                                <div className="absolute w-full top-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 p-1.5 animate-in fade-in slide-in-from-top-2 flex flex-col space-y-1">
                                    {statusOptions.map((option) => (
                                        <div
                                            key={option.value}
                                            className={`px-3 py-2.5 text-sm rounded-lg cursor-pointer transition-colors flex items-center justify-between 
                                            ${currentStatus === option.value
                                                    ? "bg-slate-50 dark:bg-slate-700/60 font-medium"
                                                    : "hover:bg-slate-50 dark:hover:bg-slate-700/40"}`}
                                            onClick={() => {
                                                setValue("status", option.value, { shouldValidate: true });
                                                setIsStatusOpen(false);
                                            }}
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <span className={`w-2 h-2 rounded-full ${option.color}`} />
                                                <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${option.bg} ${option.text} border ${option.border}`}>
                                                    {option.label}
                                                </span>
                                            </div>
                                            {currentStatus === option.value && (
                                                <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Filial */}
                        <div className="sm:col-span-2">
                            <ScopeFormFields
                                branchValue={watch("branch")}
                                onBranchChange={(id) => setValue("branch", id, { shouldValidate: true })}
                            />
                        </div>

                        {/* Tug'ilgan sana */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-1.5 tracking-wider">
                                {t("students.modal.dob", "Tug'ilgan sana")}
                            </label>
                            <input
                                type="date"
                                {...register("date_of_birth")}
                                className="w-full h-11 px-3.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-slate-800 dark:text-slate-100 shadow-xs dark:[color-scheme:dark]"
                            />
                        </div>
                    </div>

                    {/* Eslatmalar */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-1.5 tracking-wider">
                            {t("students.modal.notes", "Eslatmalar (Notes)")}
                        </label>
                        <textarea
                            rows={3}
                            placeholder={t("students.modal.placeholder.notes", "Additional notes about the student...")}
                            {...register("notes")}
                            className="w-full p-3.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-slate-800 dark:text-slate-100 resize-none shadow-xs"
                        />
                    </div>
                </form>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex-shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isPending}
                        className="h-10 px-4 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
                    >
                        {t("students.modal.cancel", "Bekor qilish")}
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit((data) => updateStudent(data))}
                        disabled={isPending || !activeCenter}
                        className="inline-flex items-center justify-center gap-2 h-10 px-5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg transition-colors cursor-pointer disabled:opacity-70 min-w-[120px] shadow-sm"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                {t("students.modal.savingStatus", "Saqlanmoqda...")}
                            </>
                        ) : (
                            t("students.modal.saveBtn", "Saqlash")
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}