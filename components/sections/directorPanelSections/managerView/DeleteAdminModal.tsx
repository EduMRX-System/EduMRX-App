"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "@/services/api";
import { AlertTriangle, X, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import type { IManager } from "@/types/manager";

interface Props {
    manager: IManager;
    onClose: () => void;
}

export default function DeleteManagerModal({ manager, onClose }: Props) {
    const queryClient = useQueryClient();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    const { mutate: deleteManager, isPending } = useMutation({
        mutationFn: async () => {
            await API.delete(`director/admins/${manager.id}/`);
        },
        onSuccess: () => {
            toast.success("Menejer o'chirildi");
            queryClient.invalidateQueries({ queryKey: ["managers"] });
            onClose();
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || "O'chirishda xatolik"),
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className={`fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 ${isMounted ? "opacity-100" : "opacity-0"}`} onClick={!isPending ? onClose : undefined} />
            <div className={`bg-white dark:bg-slate-900 p-6 rounded-xl max-w-md w-full relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 transform transition-all duration-300 ${isMounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-8 scale-95"}`}>
                {!isPending && (
                    <button type="button" onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                        <X className="w-5 h-5" />
                    </button>
                )}

                <div className="mb-4 border border-red-100 dark:border-red-900/50 shadow-sm w-11 h-11 rounded-lg flex justify-center items-center text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-950/30">
                    <AlertTriangle className="w-5 h-5" />
                </div>

                <h3 className="text-slate-900 dark:text-slate-100 text-[18px] font-semibold mb-2">Menejerni o'chirish</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">
                    Rostdan ham <span className="font-semibold text-slate-800 dark:text-slate-200">"{manager.user?.full_name}"</span> menejerini o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.
                </p>

                <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
                    <button type="button" disabled={isPending} onClick={onClose} className="h-10 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer order-2 sm:order-1">
                        Bekor qilish
                    </button>
                    <button type="button" disabled={isPending} onClick={() => deleteManager()} className="h-10 px-4 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer order-1 sm:order-2">
                        {isPending ? (<><Loader2 className="w-4 h-4 animate-spin" /> O'chirilmoqda...</>) : "O'chirish"}
                    </button>
                </div>
            </div>
        </div>
    );
}