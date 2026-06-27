"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "@/services/api";
import { 
    User, X, Eye, EyeOff, Loader2, ChevronDown, Check, Notebook, 
    CalendarDays, ChevronLeft, ChevronRight 
} from "lucide-react";
import { toast } from "react-toastify";
import { STATUS_OPTIONS, formatUzPhone, splitFullName, type IStudent } from "@/types/student";
import { useTranslation } from "react-i18next";
import ScopeFormFields from "@/components/common/ScopeFormFields";
import { useActiveCenterStore } from "@/store/activeCenterStore";

// ── Calendar helpers ──────────────────────────────────────────────
function daysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}

function firstWeekday(year: number, month: number) {
    const d = new Date(year, month, 1).getDay();
    return d === 0 ? 6 : d - 1; // Dushanba = 0
}

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
        then: (s) => s.required("Parol majburiy").min(6, "Kamida 6 belgi"),
        otherwise: (s) => s.optional().test(
            "min-length",
            "Kamida 6 belgi kiriting",
            (val) => !val || val.trim().length >= 6 // Agar bo'sh bo'lsa o'tkazadi, yozilsa min 6 ta so'raydi
        ),
    }),
    branch: yup.string().uuid("Filial UUID noto'g'ri").required("Filialni tanlang"),
    date_of_birth: yup.string().required("Tug'ilgan sana majburiy"),
    notes: yup.string().optional(),
    status: yup.string().oneOf(["active", "inactive", "frozen", "new", "graduated", "suspended"]).required("Status majburiy"),
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
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [calendarView, setCalendarView] = useState<"days" | "months" | "years">("days");
    
    const statusRef = useRef<HTMLDivElement>(null);
    const datePickerRef = useRef<HTMLDivElement>(null);
    
    const { activeCenter, isCentersLoaded } = useActiveCenterStore();
    
    const u = student?.user;
    const fullName = u?.full_name || (student as any)?.full_name || "";
    const nameFromFull = splitFullName(fullName);

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
            first_name: u?.first_name || (student as any)?.first_name || nameFromFull.first,
            last_name: u?.last_name || (student as any)?.last_name || nameFromFull.last,
            phone: u?.phone || (student as any)?.phone || "998",
            email: u?.email || (student as any)?.email || "",
            password: "", // Dastlab doim bo'sh turadi
            branch: (student as any)?.branch || "",
            date_of_birth: student?.date_of_birth || u?.date_of_birth ? (student?.date_of_birth || u?.date_of_birth)?.slice(0, 10) : new Date().toISOString().split("T")[0],
            notes: student?.notes || "",
            status: (student?.status === "inactive" ? "inactive" : "active"),
        },
    });

    const dobValue = watch("date_of_birth");
    const initDate = dobValue ? new Date(dobValue) : new Date();
    const [calYear, setCalYear] = useState(initDate.getFullYear());
    const [calMonth, setCalMonth] = useState(initDate.getMonth());

    useEffect(() => {
        setIsMounted(true);
        const currentPhone = u?.phone || (student as any)?.phone;
        if (currentPhone) setPhoneDisplay(formatUzPhone(currentPhone));
        
        const onClick = (e: MouseEvent) => {
            if (statusRef.current && !statusRef.current.contains(e.target as Node)) setIsStatusOpen(false);
            if (datePickerRef.current && !datePickerRef.current.contains(e.target as Node)) {
                setIsDatePickerOpen(false);
                setCalendarView("days");
            }
        };
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, [student, u]);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\D/g, "");
        const local = (raw.startsWith("998") ? raw.slice(3) : raw).slice(0, 9);
        setPhoneDisplay(formatUzPhone(local));
        setValue("phone", "998" + local, { shouldValidate: true });
    };

    const { mutate: saveStudent, isPending } = useMutation({
        mutationFn: async (body: FormData) => {
            if (!activeCenter) throw new Error(t("center.no_active_center"));
            const { password, ...rest } = body;
            
            // Asosiy yuboriladigan payload (password dan tashqari)
            const payload: any = { ...rest, center: activeCenter };
            
            // 🟢 Agar parol maydoniga nimadir yozilgan bo'lsa, uni qo'shamiz (bo'sh bo'lsa serverga yuborilmaydi)
            if (password && password.trim().length > 0) {
                payload.password = password;
            }

            return isEdit
                ? (await API.patch(`director/students/${student!.id}/`, payload)).data // Qisman yangilash uchun PATCH ishlatamiz
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
        `border rounded-lg w-full h-[40px] px-3 text-[14px] outline-none transition-all bg-surface text-foreground focus:ring-2 focus:ring-primary-ring ${hasError ? "border-danger/50" : "border-border focus:border-primary"}`;
    
    const labelCls = "text-[14px] text-foreground-muted mb-1 block font-semibold";
    const errCls = "text-red-400 dark:text-danger text-[11px] mt-1";

    const monthsRaw = t("director.tools.months", { returnObjects: true });
    const months: string[] = Array.isArray(monthsRaw) ? monthsRaw : ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const weekdaysRaw = t("director.tools.weekdays", { returnObjects: true });
    const weekdays: string[] = Array.isArray(weekdaysRaw) ? weekdaysRaw : ["Mo","Tu","We","Th","Fr","Sa","Su"];
    
    const totalDays = daysInMonth(calYear, calMonth);
    const startOffset = firstWeekday(calYear, calMonth);

    const prevMonth = () => {
        if (calMonth === 0) { setCalMonth(11); setCalYear((y) => y - 1); }
        else setCalMonth((m) => m - 1);
    };
    
    const nextMonth = () => {
        if (calMonth === 11) { setCalMonth(0); setCalYear((y) => y + 1); }
        else setCalMonth((m) => m + 1);
    };

    const handleDateSelect = (day: number) => {
        const y = calYear;
        const m = String(calMonth + 1).padStart(2, "0");
        const d = String(day).padStart(2, "0");
        setValue("date_of_birth", `${y}-${m}-${d}`, { shouldValidate: true });
        setIsDatePickerOpen(false);
    };

    let displayDob = dobValue || "";
    if (displayDob && displayDob.includes("-")) {
        const parts = displayDob.split("-");
        if (parts.length === 3) displayDob = `${parts[2]}.${parts[1]}.${parts[0]}`;
    }

    const yearStartGrid = Math.floor(calYear / 12) * 12;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className={`fixed inset-0 bg-overlay backdrop-blur-sm transition-opacity duration-500 ${isMounted ? "opacity-100" : "opacity-0"}`}
                onClick={onClose}
            />

            <div
                className={`bg-surface p-6 rounded-xl max-w-xl w-full max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl border border-border-subtle transform transition-all duration-500 ease-out ${isMounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-12 scale-95"}`}
            >
                <div className="sticky top-0 z-50 h-0 w-full flex justify-end items-start pointer-events-none">
                    <button
                        type="button"
                        onClick={onClose}
                        className="pointer-events-auto -mt-2 -mr-2 text-foreground-subtle hover:text-foreground p-1.5 rounded-lg bg-surface/90 backdrop-blur-sm border border-border shadow-md cursor-pointer transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="mb-[10px] border border-border shadow-sm w-[44px] h-[44px] rounded-lg flex justify-center items-center text-primary bg-primary-soft/10">
                    <User className="w-6 h-6" />
                </div>

                <h3 className="text-foreground text-[18px] font-semibold mb-4">
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
                                <span className="absolute left-3 text-sm font-semibold text-foreground pointer-events-none select-none">+998</span>
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

                    {/* Parol va Tug'ilgan sana */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Parolni endi Edit qilganda ham ko'rsatamiz */}
                        <div>
                            <label className={labelCls}>
                                {t("common.password")} {!isEdit ? "*" : <span className="text-foreground-subtle font-normal text-xs ml-1">(Ixtiyoriy)</span>}
                            </label>
                            <div className="relative flex items-center">
                                <input {...register("password")} type={showPassword ? "text" : "password"} placeholder="••••••" className={`${fieldCls(!!errors.password)} pr-10`} />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 text-foreground-subtle hover:text-foreground cursor-pointer">
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && <p className={errCls}>{errors.password.message}</p>}
                        </div>
                        
                        <div ref={datePickerRef}>
                            <label className={labelCls}>{t("director.students.form.dob_label")} *</label>
                            <div className="relative">
                                <div
                                    onClick={() => { setIsDatePickerOpen(!isDatePickerOpen); setCalendarView("days"); }}
                                    className={`${fieldCls(!!errors.date_of_birth)} flex items-center justify-between cursor-pointer`}
                                >
                                    <span className={dobValue ? "text-foreground" : "text-foreground-subtle"}>
                                        {displayDob || "YYYY-MM-DD"}
                                    </span>
                                    <CalendarDays className="w-4 h-4 text-foreground-subtle" />
                                </div>
                                
                                {isDatePickerOpen && (
                                    <div className="absolute top-full left-0 mt-1 w-[280px] bg-surface border border-border rounded-xl shadow-xl z-[60] p-3 animate-in fade-in slide-in-from-top-2 duration-200">
                                        
                                        {calendarView === "days" && (
                                            <>
                                                <div className="flex items-center justify-between mb-2">
                                                    <button type="button" onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-hover text-foreground-muted cursor-pointer transition-colors">
                                                        <ChevronLeft className="w-4 h-4" />
                                                    </button>
                                                    <div className="flex gap-1 text-[14px] font-semibold">
                                                        <span onClick={() => setCalendarView("months")} className="hover:bg-hover px-2 py-0.5 rounded cursor-pointer text-primary transition-colors">
                                                            {months[calMonth]}
                                                        </span>
                                                        <span onClick={() => setCalendarView("years")} className="hover:bg-hover px-2 py-0.5 rounded cursor-pointer text-primary transition-colors">
                                                            {calYear}
                                                        </span>
                                                    </div>
                                                    <button type="button" onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-hover text-foreground-muted cursor-pointer transition-colors">
                                                        <ChevronRight className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-7 mb-1">
                                                    {weekdays.map((d) => (
                                                        <div key={d} className="text-[11px] font-semibold text-foreground-subtle text-center py-1">{d}</div>
                                                    ))}
                                                </div>

                                                <div className="grid grid-cols-7 gap-y-0.5">
                                                    {Array.from({ length: startOffset }).map((_, i) => (
                                                        <div key={`empty-${i}`} />
                                                    ))}
                                                    {Array.from({ length: totalDays }).map((_, i) => {
                                                        const day = i + 1;
                                                        const formattedVal = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                                                        const isSel = dobValue === formattedVal;
                                                        
                                                        return (
                                                            <button
                                                                key={day}
                                                                type="button"
                                                                onClick={() => handleDateSelect(day)}
                                                                className={`w-full aspect-square flex items-center justify-center text-[12px] rounded-lg transition-colors cursor-pointer font-medium ${isSel ? "bg-primary text-primary-fg" : "text-foreground hover:bg-hover"}`}
                                                            >
                                                                {day}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </>
                                        )}

                                        {calendarView === "months" && (
                                            <>
                                                <div className="flex items-center justify-between mb-3 border-b border-border-subtle pb-2">
                                                    <span className="text-[14px] font-bold text-foreground">Oyni tanlang</span>
                                                    <span onClick={() => setCalendarView("years")} className="text-[13px] text-primary font-semibold cursor-pointer hover:underline">{calYear}</span>
                                                </div>
                                                <div className="grid grid-cols-3 gap-1.5">
                                                    {months.map((mName, index) => (
                                                        <button
                                                            key={mName}
                                                            type="button"
                                                            onClick={() => { setCalMonth(index); setCalendarView("days"); }}
                                                            className={`py-2 text-[12px] font-medium rounded-lg transition-colors cursor-pointer ${calMonth === index ? "bg-primary text-primary-fg" : "text-foreground hover:bg-hover border border-border-subtle"}`}
                                                        >
                                                            {mName}
                                                        </button>
                                                    ))}
                                                </div>
                                            </>
                                        )}

                                        {calendarView === "years" && (
                                            <>
                                                <div className="flex items-center justify-between mb-3 border-b border-border-subtle pb-2">
                                                    <button type="button" onClick={() => setCalYear(y => y - 12)} className="p-1 rounded hover:bg-hover text-foreground-muted cursor-pointer">
                                                        <ChevronLeft className="w-4 h-4" />
                                                    </button>
                                                    <span className="text-[13px] font-bold text-foreground">
                                                        {yearStartGrid} - {yearStartGrid + 11}
                                                    </span>
                                                    <button type="button" onClick={() => setCalYear(y => y + 12)} className="p-1 rounded hover:bg-hover text-foreground-muted cursor-pointer">
                                                        <ChevronRight className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-3 gap-1.5 max-h-[180px] overflow-y-auto">
                                                    {Array.from({ length: 12 }).map((_, idx) => {
                                                        const targetYear = yearStartGrid + idx;
                                                        const isCurrentSelected = calYear === targetYear;
                                                        return (
                                                            <button
                                                                key={targetYear}
                                                                type="button"
                                                                onClick={() => { setCalYear(targetYear); setCalendarView("days"); }}
                                                                className={`py-2 text-[12px] font-medium rounded-lg transition-colors cursor-pointer ${isCurrentSelected ? "bg-primary text-primary-fg" : "text-foreground hover:bg-hover border border-border-subtle"}`}
                                                            >
                                                                {targetYear}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                            {errors.date_of_birth && <p className={errCls}>{errors.date_of_birth.message}</p>}
                        </div>
                    </div>

                    {/* Filial selection */}
                    <ScopeFormFields
                        branchValue={watch("branch")}
                        onBranchChange={(id) => setValue("branch", id, { shouldValidate: true })}
                        branchError={(errors as any).branch?.message}
                    />

                    {/* Status selection */}
                    <div>
                        <div ref={statusRef} className="relative">
                            <label className={labelCls}>{t("director.students.form.status_label")}</label>
                            <div
                                onClick={() => setIsStatusOpen(!isStatusOpen)}
                                className="border border-border rounded-lg w-full h-[40px] px-3 text-[14px] flex items-center justify-between cursor-pointer bg-surface text-foreground"
                            >
                                <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${currentStatus.color}`} />
                                    <span>{t(`common.${currentStatus.value}`)}</span>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-foreground-subtle transition-transform ${isStatusOpen ? "rotate-180" : ""}`} />
                            </div>
                            {isStatusOpen && (
                                <div className="absolute left-0 right-0 mt-1 bg-surface border border-border rounded-lg shadow-xl z-50 overflow-hidden flex flex-col">
                                    {STATUS_OPTIONS.map((option) => {
                                        const isSel = option.value === watch("status");
                                        return (
                                            <div
                                                key={option.value}
                                                onClick={() => { setValue("status", option.value, { shouldValidate: true }); setIsStatusOpen(false); }}
                                                className={`px-3 py-2.5 text-sm cursor-pointer transition-colors flex items-center justify-between ${isSel ? "bg-primary-soft text-primary font-medium" : "text-foreground hover:bg-hover"}`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-2 h-2 rounded-full ${option.color}`} />
                                                    {t(`common.${option.value}`)}
                                                </div>
                                                {isSel && <Check className="w-4 h-4 text-primary" />}
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
                            <Notebook className="absolute left-3 top-3 w-4 h-4 text-foreground-subtle pointer-events-none" />
                            <textarea
                                {...register("notes")}
                                rows={2}
                                placeholder={t("director.students.form.note_placeholder")}
                                className="border rounded-lg w-full pl-10 pr-3 py-2.5 text-[14px] outline-none transition-all resize-none bg-surface text-foreground border-border focus:border-primary"
                            />
                        </div>
                    </div>

                    {/* Pastki tugmalar */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-subtle mt-6">
                        <button type="button" onClick={onClose} className="h-10 px-4 border border-border bg-surface text-foreground hover:bg-hover text-sm font-semibold rounded-lg cursor-pointer transition-colors">
                            {t("common.cancel")}
                        </button>
                        <button type="submit" disabled={isPending || !activeCenter} className="inline-flex items-center justify-center gap-2 h-10 px-5 bg-primary hover:bg-primary-hover text-primary-fg text-sm font-semibold rounded-lg disabled:opacity-60 cursor-pointer transition-colors">
                            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isEdit ? t("common.save") : t("common.create")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}