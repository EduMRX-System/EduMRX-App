"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "@/services/api";
import { AlertTriangle, Loader2, X } from "lucide-react";
import { toast } from "react-toastify";
import { Course } from "@/types/course";

interface Props {
    course: Course;
    onClose: () => void;
}

export default function DeleteCourseModal({ course, onClose }: Props) {
    const queryClient = useQueryClient();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    const { mutate: deleteCourse, isPending } = useMutation({
        mutationFn: async () => {
            await API.delete(`director/courses/${course.id}/`);
        },
        onSuccess: () => {
            toast.success("Kurs o'chirildi");
            queryClient.invalidateQueries({ queryKey: ["courses"] });
            onClose();
        },
        onError: () => toast.error("O'chirishda xatolik yuz berdi"),
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${isMounted ? "opacity-100" : "opacity-0"}`}
                onClick={onClose}
            />
            <div
                className={`bg-white dark:bg-slate-900 p-6 rounded-xl max-w-md w-full relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 transform transition-all duration-300 ${isMounted ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-500/15">
                        <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                    </div>
                    <div>
                        <h3 className="text-[18px] font-semibold text-slate-900 dark:text-slate-100">Kursni o'chirish</h3>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                            <span className="font-semibold text-slate-900 dark:text-slate-100">{course.name}</span> kursini o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.
                        </p>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isPending}
                        className="h-10 px-4 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-sm font-semibold rounded-lg cursor-pointer transition-colors disabled:opacity-50"
                    >
                        Bekor qilish
                    </button>
                    <button
                        type="button"
                        onClick={() => deleteCourse()}
                        disabled={isPending}
                        className="inline-flex items-center justify-center gap-2 h-10 px-5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-lg disabled:opacity-60 cursor-pointer transition-colors"
                    >
                        {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                        O'chirish
                    </button>
                </div>
            </div>
        </div>
    );
}