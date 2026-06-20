"use client";

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "@/services/api";
import { X, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import type { IStudent } from "@/types/student";

interface Props {
    student: IStudent;
    onClose: () => void;
}

export default function DeleteStudentModal({ student, onClose }: Props) {
    const queryClient = useQueryClient();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    const { mutate: deleteStudent, isPending } = useMutation({
        mutationFn: async () => {
            await API.delete(`director/students/${student.id}/`);
        },
        onSuccess: () => {
            toast.success("Talaba o'chirildi");
            queryClient.invalidateQueries({ queryKey: ["students-list"] });
            onClose();
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || "O'chirishda xatolik"),
    });

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm transition-opacity duration-200 ${isMounted ? "opacity-100" : "opacity-0"}`}>
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="w-5 h-5" />
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Talabani o'chirish</h3>
                    </div>
                    <button onClick={onClose} disabled={isPending} className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5">
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        Rostdan ham <span className="font-semibold text-slate-900 dark:text-slate-100">"{student.full_name}"</span> ismli talabani tizimdan butunlay o'chirmoqchimisiz?
                    </p>
                    <p className="text-xs text-red-500 dark:text-red-400 font-medium mt-2 bg-red-50/50 dark:bg-red-950/20 border border-red-100/50 dark:border-red-900/30 rounded-md p-2">
                        Ogohlantirish: Bu amalni qaytarib bo'lmaydi va talabaga tegishli barcha ma'lumotlar o'chib ketadi.
                    </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-2 px-5 py-3.5 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
                    <button type="button" onClick={onClose} disabled={isPending} className="h-9 px-3.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer disabled:opacity-50">
                        Bekor qilish
                    </button>
                    <button type="button" onClick={() => deleteStudent()} disabled={isPending} className="inline-flex items-center justify-center gap-1.5 h-9 px-4 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer disabled:opacity-70 min-w-[100px]">
                        {isPending ? (<><Loader2 className="w-3.5 h-3.5 animate-spin" /> O'chirilmoqda...</>) : "O'chirish"}
                    </button>
                </div>
            </div>
        </div>
    );
}