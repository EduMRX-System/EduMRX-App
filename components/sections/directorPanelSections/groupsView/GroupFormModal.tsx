"use client";

import { useState, useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "@/services/api";
import { X, Loader2, Users2, ChevronDown, Check } from "lucide-react";
import { toast } from "react-toastify";
import {
    useCourseOptions,
    useTeacherOptions,
    useRoomOptions,
} from "@/hooks/useGroups";
import {
    STATUS_OPTIONS,
    WEEKDAYS,
    toHHMM,
    parseLessonDays,
    type Group,
    type GroupStatus,
    type GroupPayload,
} from "@/types/group";
import SearchSelect from "./SearchSelect";
import { useTranslation } from "react-i18next";
import AsyncBranchSelect from "@/components/common/AsyncBranchSelect";
import { useActiveCenterStore } from "@/store/activeCenterStore";

interface Props {
    group?: Group | null; // berilsa — tahrirlash
    onClose: () => void;
}

export default function GroupFormModal({ group, onClose }: Props) {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const isEdit = !!group;
    const [isMounted, setIsMounted] = useState(false);

    const { activeCenter } = useActiveCenterStore();

    const [formData, setFormData] = useState({
        name: group?.name ?? "",
        course: group?.course ?? "",
        teacher: group?.teacher ?? "",
        room: group?.room ?? "",
        branch: (group as any)?.branch ?? "",
        status: (group?.status ?? "active") as GroupStatus,
        start_date: group?.start_date ?? "",
        end_date: group?.end_date ?? "",
        lesson_days: parseLessonDays(group?.lesson_days) as number[],
        lesson_start_time: toHHMM(group?.lesson_start_time),
        lesson_end_time: toHHMM(group?.lesson_end_time),
    });

    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const statusRef = useRef<HTMLDivElement>(null);

    const { data: courses = [], isLoading: coursesLoading } = useCourseOptions();
    const { data: teachers = [], isLoading: teachersLoading } = useTeacherOptions();
    const { data: rooms = [], isLoading: roomsLoading } = useRoomOptions();

    useEffect(() => {
        setIsMounted(true);
        const onClick = (e: MouseEvent) => {
            if (statusRef.current && !statusRef.current.contains(e.target as Node)) setIsStatusOpen(false);
        };
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, []);

    const toggleDay = (value: number) =>
        setFormData((p) => ({
            ...p,
            lesson_days: p.lesson_days.includes(value)
                ? p.lesson_days.filter((d) => d !== value)
                : [...p.lesson_days, value].sort((a, b) => a - b),
        }));

    const { mutate: saveGroup, isPending } = useMutation({
        mutationFn: async () => {
            const payload: GroupPayload = {
                name: formData.name,
                course: formData.course,
                teacher: formData.teacher,
                room: formData.room,
                status: formData.status,
                start_date: formData.start_date,
                end_date: formData.end_date,
                lesson_days: formData.lesson_days,
                lesson_start_time: formData.lesson_start_time,
                lesson_end_time: formData.lesson_end_time,
                ...(activeCenter ? { center: activeCenter } : {}),
                ...(formData.branch ? { branch: formData.branch } : {}),
            };
            const res = isEdit
                ? await API.patch(`director/courses/${group!.id}/`, payload)
                : await API.post("director/courses/", payload);
            return res.data;
        },
        onSuccess: () => {
            toast.success(t(isEdit ? "director.groups.toast.updated" : "director.groups.toast.created"));
            queryClient.invalidateQueries({ queryKey: ["groups"] });
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
            toast.error(t("director.groups.toast.error_generic"));
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) return toast.error(t("director.groups.toast.error_name"));
        if (!formData.branch) return toast.error(t("director.rooms.toast.error_branch"));
        if (!formData.course) return toast.error(t("director.groups.toast.error_course"));
        if (!formData.teacher) return toast.error(t("director.groups.toast.error_teacher"));
        if (!formData.room) return toast.error(t("director.groups.toast.error_room"));
        if (!formData.start_date || !formData.end_date) return toast.error(t("director.groups.toast.error_dates"));
        if (formData.lesson_days.length === 0) return toast.error(t("director.groups.toast.error_days"));
        if (!formData.lesson_start_time || !formData.lesson_end_time) return toast.error(t("director.groups.toast.error_time"));
        saveGroup();
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
                className={`bg-surface p-6 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl border border-border-subtle transform transition-all duration-500 ease-out ${isMounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-12 scale-95"}`}
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
                    <Users2 className="w-6 h-6" />
                </div>

                <h3 className="text-foreground text-[18px] font-semibold mb-4">
                    {isEdit ? t("director.groups.form.title_edit") : t("director.groups.form.title_add")}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Nom */}
                    <div>
                        <label className={labelCls}>{t("director.groups.form.name_label")}</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                            placeholder={t("director.groups.form.name_placeholder")}
                            className={inputCls}
                            required
                        />
                    </div>

                    {/* Filial */}
                    <AsyncBranchSelect
                        centerId={activeCenter}
                        value={formData.branch}
                        onChange={(id) => setFormData((p) => ({ ...p, branch: id }))}
                        required
                    />

                    {/* Kurs + O'qituvchi */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SearchSelect
                            label={t("director.groups.form.course_label")}
                            required
                            value={formData.course}
                            options={courses}
                            loading={coursesLoading}
                            onChange={(id) => setFormData((p) => ({ ...p, course: id }))}
                        />
                        <SearchSelect
                            label={t("director.groups.form.teacher_label")}
                            required
                            value={formData.teacher}
                            options={teachers}
                            loading={teachersLoading}
                            onChange={(id) => setFormData((p) => ({ ...p, teacher: id }))}
                        />
                    </div>

                    {/* Xona + Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SearchSelect
                            label={t("director.groups.form.room_label")}
                            required
                            value={formData.room}
                            options={rooms}
                            loading={roomsLoading}
                            onChange={(id) => setFormData((p) => ({ ...p, room: id }))}
                        />

                        <div ref={statusRef} className="relative">
                            <label className={labelCls}>{t("director.groups.form.status_label")}</label>
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
                    </div>

                    {/* Sanalar */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>{t("director.groups.form.start_date_label")}</label>
                            <input
                                type="date"
                                value={formData.start_date}
                                onChange={(e) => setFormData((p) => ({ ...p, start_date: e.target.value }))}
                                className={inputCls}
                                required
                            />
                        </div>
                        <div>
                            <label className={labelCls}>{t("director.groups.form.end_date_label")}</label>
                            <input
                                type="date"
                                value={formData.end_date}
                                onChange={(e) => setFormData((p) => ({ ...p, end_date: e.target.value }))}
                                className={inputCls}
                                required
                            />
                        </div>
                    </div>

                    {/* Dars kunlari */}
                    <div>
                        <label className={labelCls}>{t("director.groups.form.lesson_days_label")}</label>
                        <div className="flex flex-wrap gap-2">
                            {WEEKDAYS.map((d) => {
                                const active = formData.lesson_days.includes(d.value);
                                return (
                                    <button
                                        key={d.value}
                                        type="button"
                                        onClick={() => toggleDay(d.value)}
                                        title={d.full}
                                        className={`h-9 min-w-[44px] px-3 rounded-lg text-[13px] font-semibold border transition-colors cursor-pointer ${active
                                            ? "bg-primary text-primary-fg border-primary"
                                            : "bg-surface text-foreground-muted border-border hover:border-primary/50"
                                            }`}
                                    >
                                        {d.short}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Vaqt */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>{t("director.groups.form.lesson_start_label")}</label>
                            <input
                                type="time"
                                value={formData.lesson_start_time}
                                onChange={(e) => setFormData((p) => ({ ...p, lesson_start_time: e.target.value }))}
                                className={inputCls}
                                required
                            />
                        </div>
                        <div>
                            <label className={labelCls}>{t("director.groups.form.lesson_end_label")}</label>
                            <input
                                type="time"
                                value={formData.lesson_end_time}
                                onChange={(e) => setFormData((p) => ({ ...p, lesson_end_time: e.target.value }))}
                                className={inputCls}
                                required
                            />
                        </div>
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
