"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "@/services/api";
import { X, Loader2, CalendarDays } from "lucide-react";
import { toast } from "react-toastify";
import { useGroupOptions } from "@/hooks/useLessons";
import { toHHMM, type Lesson, type LessonPayload } from "@/types/lesson";
import SearchSelect from "@/components/ui/SearchSelect";

interface Props {
    lesson?: Lesson | null;
    onClose: () => void;
}

export default function LessonFormModal({ lesson, onClose }: Props) {
    const queryClient = useQueryClient();
    const isEdit = !!lesson;
    const [isMounted, setIsMounted] = useState(false);

    const [formData, setFormData] = useState({
        group: lesson?.group ?? "",
        date: lesson?.date ?? new Date().toISOString().split("T")[0],
        start_time: toHHMM(lesson?.start_time),
        end_time: toHHMM(lesson?.end_time),
        topic: lesson?.topic ?? "",
        notes: lesson?.notes ?? "",
    });

    const { data: groups = [], isLoading: groupsLoading } = useGroupOptions();

    useEffect(() => { setIsMounted(true); }, []);

    const { mutate: saveLesson, isPending } = useMutation({
        mutationFn: async () => {
            const payload: LessonPayload = {
                group: formData.group,
                date: formData.date,
                start_time: formData.start_time,
                end_time: formData.end_time,
                topic: formData.topic.trim(),
                notes: formData.notes.trim(),
            };
            return isEdit
                ? (await API.patch(`director/lessons/${lesson!.id}/`, payload)).data
                : (await API.post("director/lessons/", payload)).data;
        },
        onSuccess: () => {
            toast.success(isEdit ? "Dars yangilandi" : "Dars qo'shildi");
            queryClient.invalidateQueries({ queryKey: ["lessons"] });
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
            toast.error("Xatolik yuz berdi");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.group) return toast.error("Guruhni tanlang");
        if (!formData.date) return toast.error("Sanani kiriting");
        if (!formData.start_time || !formData.end_time) return toast.error("Vaqtni kiriting");
        if (!formData.topic.trim()) return toast.error("Mavzuni kiriting");
        saveLesson();
    };

    const inputCls = "border rounded-lg w-full h-[40px] px-3 text-[14px] outline-none transition-all bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700 focus:border-indigo-400 dark:focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/20 placeholder:text-slate-400 dark:placeholder:text-slate-500";
    const labelCls = "text-[14px] text-slate-600 dark:text-slate-300 mb-1 block font-semibold";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-500 ${isMounted ? "opacity-100" : "opacity-0"}`}
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
                    <CalendarDays className="w-6 h-6" />
                </div>

                <h3 className="text-slate-900 dark:text-slate-100 text-[18px] font-semibold mb-4">
                    {isEdit ? "Darsni tahrirlash" : "Yangi dars qo'shish"}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Guruh */}
                    <SearchSelect
                        label="Guruh"
                        required
                        value={formData.group}
                        options={groups}
                        loading={groupsLoading}
                        placeholder="Guruhni tanlang..."
                        onChange={(id) => setFormData((p) => ({ ...p, group: id }))}
                    />

                    {/* Sana + Mavzu */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>Sana *</label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))}
                                className={inputCls}
                                required
                            />
                        </div>
                        <div>
                            <label className={labelCls}>Mavzu *</label>
                            <input
                                type="text"
                                value={formData.topic}
                                onChange={(e) => setFormData((p) => ({ ...p, topic: e.target.value }))}
                                placeholder="Masalan: React Hooks"
                                className={inputCls}
                                required
                            />
                        </div>
                    </div>

                    {/* Vaqt */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>Boshlanish vaqti *</label>
                            <input
                                type="time"
                                value={formData.start_time}
                                onChange={(e) => setFormData((p) => ({ ...p, start_time: e.target.value }))}
                                className={inputCls}
                                required
                            />
                        </div>
                        <div>
                            <label className={labelCls}>Tugash vaqti *</label>
                            <input
                                type="time"
                                value={formData.end_time}
                                onChange={(e) => setFormData((p) => ({ ...p, end_time: e.target.value }))}
                                className={inputCls}
                                required
                            />
                        </div>
                    </div>

                    {/* Izoh */}
                    <div>
                        <label className={labelCls}>Izoh (ixtiyoriy)</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
                            rows={2}
                            placeholder="Dars haqida qo'shimcha..."
                            className="border rounded-lg w-full px-3 py-2.5 text-[14px] outline-none transition-all resize-none bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700 focus:border-indigo-400 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                        />
                    </div>

                    {/* Tugmalar */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
                        <button type="button" onClick={onClose} className="h-10 px-4 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-sm font-semibold rounded-lg cursor-pointer transition-colors">
                            Bekor qilish
                        </button>
                        <button type="submit" disabled={isPending} className="inline-flex items-center justify-center gap-2 h-10 px-5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg disabled:opacity-60 cursor-pointer transition-colors">
                            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isEdit ? "Saqlash" : "Yaratish"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}