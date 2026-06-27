"use client";

import { useState, useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "@/services/api";
import { X, Loader2, BookOpen, ChevronDown, Check } from "lucide-react";
import { toast } from "react-toastify";
import { STATUS_OPTIONS, type Course, type CourseStatus, type CoursePayload } from "@/types/course";
import { useTranslation } from "react-i18next";

interface Props {
    course?: Course | null;
    onClose: () => void;
}

export default function CourseFormModal({ course, onClose }: Props) {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const isEdit = !!course;
    const [isMounted, setIsMounted] = useState(false);

    const [formData, setFormData] = useState({
        name: course?.name ?? "",
        description: course?.description ?? "",
        duration_months: course?.duration_months ? String(course.duration_months) : "",
        price: course?.price ?? "",
        status: (course?.status ?? "active") as CourseStatus,
    });

    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const statusRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsMounted(true);
        const onClick = (e: MouseEvent) => {
            if (statusRef.current && !statusRef.current.contains(e.target as Node)) setIsStatusOpen(false);
        };
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, []);

    const { mutate: saveCourse, isPending } = useMutation({
        mutationFn: async () => {
            const payload: CoursePayload = {
                name: formData.name.trim(),
                description: formData.description.trim(),
                duration_months: Number(formData.duration_months),
                price: String(formData.price),
                status: formData.status,
            };
            const res = isEdit
                ? await API.patch(`director/courses/${course!.id}/`, payload)
                : await API.post("director/courses/", payload);
            return res.data;
        },
        onSuccess: () => {
            toast.success(t(isEdit ? "director.courses.toast.updated" : "director.courses.toast.created"));
            queryClient.invalidateQueries({ queryKey: ["courses"] });
            onClose();
        },
        onError: (err: any) => {
            const errData = err?.response?.data;
            if (errData && typeof errData === "object") {
                const firstKey = Object.keys(errData)[0];
                if (firstKey) {
                    const text = Array.isArray(errData[firstKey]) ? errData[firstKey][0] : errData[firstKey];
                    return toast.error(`${firstKey}: ${typeof text === "string" ? text.replace(/["']/g, "") : text}`);
                }
            }
            toast.error(t("director.courses.toast.error_generic"));
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) return toast.error(t("director.courses.toast.error_name"));
        if (!formData.duration_months || Number(formData.duration_months) <= 0)
            return toast.error(t("director.courses.toast.error_duration"));
        if (formData.price === "" || Number(formData.price) < 0)
            return toast.error(t("director.courses.toast.error_price"));
        saveCourse();
    };

    const currentStatus = STATUS_OPTIONS.find((o) => o.value === formData.status) || STATUS_OPTIONS[0];
    const inputCls = "border rounded-lg w-full h-[40px] px-3 text-[14px] outline-none transition-all bg-surface text-foreground border-border focus:border-primary focus:ring-2 focus:ring-primary-ring placeholder:text-foreground-subtle";
    const labelCls = "text-[14px] text-foreground-muted mb-1 block font-semibold";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className={`fixed inset-0 bg-overlay backdrop-blur-sm transition-opacity duration-500 ${isMounted ? "opacity-100" : "opacity-0"}`}
                onClick={onClose}
            />

            <div
                className={`bg-surface p-6 rounded-xl max-w-xl w-full max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl border border-border-subtle transform transition-all duration-500 ease-out ${isMounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-12 scale-95"}`}
            >
                {/* Sticky close */}
                <div className="sticky top-0 z-50 h-0 w-full flex justify-end items-start pointer-events-none">
                    <button
                        type="button"
                        onClick={onClose}
                        className="pointer-events-auto -mt-2 -mr-2 text-foreground-subtle hover:text-foreground p-1.5 rounded-lg bg-surface/90 backdrop-blur-sm border border-border shadow-md cursor-pointer transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Header */}
                <div className="mb-[10px] border border-border shadow-sm w-[44px] h-[44px] rounded-lg flex justify-center items-center text-primary bg-primary-soft/10">
                    <BookOpen className="w-6 h-6" />
                </div>

                <h3 className="text-foreground text-[18px] font-semibold mb-4">
                    {isEdit ? t("director.courses.form.title_edit") : t("director.courses.form.title_add")}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Nom */}
                    <div>
                        <label className={labelCls}>{t("director.courses.form.name_label")}</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                            placeholder={t("director.courses.form.name_placeholder")}
                            className={inputCls}
                            required
                        />
                    </div>

                    {/* Tavsif */}
                    <div>
                        <label className={labelCls}>{t("director.courses.form.desc_label")}</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                            placeholder={t("director.courses.form.desc_placeholder")}
                            rows={3}
                            className="border rounded-lg w-full px-3 py-2.5 text-[14px] outline-none transition-all bg-surface text-foreground border-border focus:border-primary focus:ring-2 focus:ring-primary-ring placeholder:text-foreground-subtle resize-none"
                        />
                    </div>

                    {/* Davomiylik + Narx */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>{t("director.courses.form.duration_label")}</label>
                            <input
                                type="number"
                                min={1}
                                value={formData.duration_months}
                                onChange={(e) => setFormData((p) => ({ ...p, duration_months: e.target.value }))}
                                placeholder="6"
                                className={inputCls}
                                required
                            />
                        </div>
                        <div>
                            <label className={labelCls}>{t("director.courses.form.price_label")}</label>
                            <input
                                type="number"
                                min={0}
                                step="1000"
                                value={formData.price}
                                onChange={(e) => setFormData((p) => ({ ...p, price: e.target.value }))}
                                placeholder="500000"
                                className={inputCls}
                                required
                            />
                        </div>
                    </div>

                    {/* Status */}
                    <div ref={statusRef} className="relative">
                        <label className={labelCls}>{t("director.courses.form.status_label")}</label>
                        <div
                            onClick={() => setIsStatusOpen(!isStatusOpen)}
                            className="border border-border rounded-lg w-full h-[40px] px-3 text-[14px] flex items-center justify-between cursor-pointer bg-surface text-foreground"
                        >
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${currentStatus.color}`} />
                                <span>{currentStatus.value === "active" ? t("common.active") : t("common.inactive")}</span>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-foreground-subtle transition-transform ${isStatusOpen ? "rotate-180" : ""}`} />
                        </div>
                        {isStatusOpen && (
                            <div className="absolute left-0 right-0 mt-1 bg-surface border border-border rounded-lg shadow-xl z-50 overflow-hidden flex flex-col">
                                {STATUS_OPTIONS.map((option) => {
                                    const isSel = option.value === formData.status;
                                    return (
                                        <div
                                            key={option.value}
                                            onClick={() => { setFormData((p) => ({ ...p, status: option.value })); setIsStatusOpen(false); }}
                                            className={`px-3 py-2.5 text-sm cursor-pointer transition-colors flex items-center justify-between ${isSel
                                                ? "bg-primary-soft text-primary font-medium"
                                                : "text-foreground hover:bg-hover"
                                                }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${option.color}`} />
                                                <span>{option.value === "active" ? t("common.active") : t("common.inactive")}</span>
                                            </div>
                                            {isSel && <Check className="w-4 h-4 text-primary" />}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Tugmalar */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-subtle mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="h-10 px-4 border border-border bg-surface text-foreground hover:bg-hover text-sm font-semibold rounded-lg cursor-pointer transition-colors"
                        >
                            {t("common.cancel")}
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="inline-flex items-center justify-center gap-2 h-10 px-5 bg-primary hover:bg-primary-hover text-primary-fg text-sm font-semibold rounded-lg disabled:opacity-60 cursor-pointer transition-colors"
                        >
                            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isEdit ? t("common.save") : t("common.create")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}