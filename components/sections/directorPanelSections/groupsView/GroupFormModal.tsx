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

interface Props {
    group?: Group | null; // berilsa — tahrirlash
    onClose: () => void;
}

export default function GroupFormModal({ group, onClose }: Props) {
    const queryClient = useQueryClient();
    const isEdit = !!group;
    const [isMounted, setIsMounted] = useState(false);

    const [formData, setFormData] = useState({
        name: group?.name ?? "",
        course: group?.course ?? "",
        teacher: group?.teacher ?? "",
        room: group?.room ?? "",
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
            };
            const res = isEdit
                ? await API.patch(`director/courses/${group!.id}/`, payload)
                : await API.post("director/courses/", payload);
            return res.data;
        },
        onSuccess: () => {
            toast.success(isEdit ? "Guruh yangilandi" : "Guruh qo'shildi");
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
            toast.error("Xatolik yuz berdi");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) return toast.error("Guruh nomini kiriting");
        if (!formData.course) return toast.error("Kursni tanlang");
        if (!formData.teacher) return toast.error("O'qituvchini tanlang");
        if (!formData.room) return toast.error("Xonani tanlang");
        if (!formData.start_date || !formData.end_date) return toast.error("Sanalarni kiriting");
        if (formData.lesson_days.length === 0) return toast.error("Dars kunlarini tanlang");
        if (!formData.lesson_start_time || !formData.lesson_end_time) return toast.error("Dars vaqtini kiriting");
        saveGroup();
    };

    const currentStatus = STATUS_OPTIONS.find((o) => o.value === formData.status) || STATUS_OPTIONS[0];
    const inputCls = "border rounded-lg w-full h-[40px] px-3 text-[14px] outline-none transition-all bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700 focus:border-indigo-400 dark:focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/20 placeholder:text-slate-400 dark:placeholder:text-slate-500";
    const labelCls = "text-[14px] text-slate-600 dark:text-slate-300 mb-1 block font-semibold";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-500 ${isMounted ? "opacity-100" : "opacity-0"}`}
                onClick={onClose}
            />

            <div
                className={`bg-white dark:bg-slate-900 p-6 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 transform transition-all duration-500 ease-out ${isMounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-12 scale-95"}`}
            >
                {/* Sticky close */}
                <div className="sticky top-0 z-50 h-0 w-full flex justify-end items-start pointer-events-none">
                    <button
                        type="button"
                        onClick={onClose}
                        className="pointer-events-auto -mt-2 -mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-md cursor-pointer transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Header */}
                <div className="mb-[10px] border border-slate-200 dark:border-slate-700 shadow-sm w-[44px] h-[44px] rounded-lg flex justify-center items-center text-indigo-600 bg-indigo-50/10 dark:bg-indigo-950/20">
                    <Users2 className="w-6 h-6" />
                </div>

                <h3 className="text-slate-900 dark:text-slate-100 text-[18px] font-semibold mb-4">
                    {isEdit ? "Guruhni tahrirlash" : "Yangi guruh qo'shish"}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Nom */}
                    <div>
                        <label className={labelCls}>Guruh nomi *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                            placeholder="Masalan: Frontend-01"
                            className={inputCls}
                            required
                        />
                    </div>

                    {/* Kurs + O'qituvchi */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SearchSelect
                            label="Kurs"
                            required
                            value={formData.course}
                            options={courses}
                            loading={coursesLoading}
                            onChange={(id) => setFormData((p) => ({ ...p, course: id }))}
                        />
                        <SearchSelect
                            label="O'qituvchi"
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
                            label="Xona"
                            required
                            value={formData.room}
                            options={rooms}
                            loading={roomsLoading}
                            onChange={(id) => setFormData((p) => ({ ...p, room: id }))}
                        />

                        <div ref={statusRef} className="relative">
                            <label className={labelCls}>Holati *</label>
                            <div
                                onClick={() => setIsStatusOpen(!isStatusOpen)}
                                className="border border-slate-200 dark:border-slate-700 rounded-lg w-full h-[40px] px-3 text-[14px] flex items-center justify-between cursor-pointer bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                            >
                                <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${currentStatus.color}`} />
                                    <span>{currentStatus.label}</span>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isStatusOpen ? "rotate-180" : ""}`} />
                            </div>
                            {isStatusOpen && (
                                <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden flex flex-col">
                                    {STATUS_OPTIONS.map((option) => {
                                        const isSel = option.value === formData.status;
                                        return (
                                            <div
                                                key={option.value}
                                                onClick={() => { setFormData((p) => ({ ...p, status: option.value })); setIsStatusOpen(false); }}
                                                className={`px-3 py-2.5 text-sm cursor-pointer transition-colors flex items-center justify-between ${isSel
                                                    ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-medium"
                                                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-2 h-2 rounded-full ${option.color}`} />
                                                    <span>{option.label}</span>
                                                </div>
                                                {isSel && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
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
                            <label className={labelCls}>Boshlanish sanasi *</label>
                            <input
                                type="date"
                                value={formData.start_date}
                                onChange={(e) => setFormData((p) => ({ ...p, start_date: e.target.value }))}
                                className={inputCls}
                                required
                            />
                        </div>
                        <div>
                            <label className={labelCls}>Tugash sanasi *</label>
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
                        <label className={labelCls}>Dars kunlari *</label>
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
                                            ? "bg-indigo-600 text-white border-indigo-600"
                                            : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700"
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
                            <label className={labelCls}>Dars boshlanishi *</label>
                            <input
                                type="time"
                                value={formData.lesson_start_time}
                                onChange={(e) => setFormData((p) => ({ ...p, lesson_start_time: e.target.value }))}
                                className={inputCls}
                                required
                            />
                        </div>
                        <div>
                            <label className={labelCls}>Dars tugashi *</label>
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
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="h-10 px-4 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-sm font-semibold rounded-lg cursor-pointer transition-colors"
                        >
                            Bekor qilish
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="inline-flex items-center justify-center gap-2 h-10 px-5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg disabled:opacity-60 cursor-pointer transition-colors"
                        >
                            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isEdit ? "Saqlash" : "Yaratish"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}