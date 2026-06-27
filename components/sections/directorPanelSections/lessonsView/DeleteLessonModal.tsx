"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "@/services/api";
import { AlertTriangle, Loader2, X } from "lucide-react";
import { toast } from "react-toastify";
import type { Lesson } from "@/types/lesson";
import { useTranslation } from "react-i18next";

interface Props {
    lesson: Lesson;
    onClose: () => void;
}

export default function DeleteLessonModal({ lesson, onClose }: Props) {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    const { mutate: deleteLesson, isPending } = useMutation({
        mutationFn: async () => {
            await API.delete(`director/lessons/${lesson.id}/`);
        },
        onSuccess: () => {
            toast.success(t("director.lessons.toast.deleted"));
            queryClient.invalidateQueries({ queryKey: ["lessons"] });
            onClose();
        },
        onError: () => toast.error(t("director.lessons.toast.delete_error")),
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className={`fixed inset-0 bg-overlay backdrop-blur-sm transition-opacity duration-300 ${isMounted ? "opacity-100" : "opacity-0"}`} onClick={onClose} />
            <div className={`bg-surface p-6 rounded-xl max-w-md w-full relative z-10 shadow-2xl border border-border-subtle transform transition-all duration-300 ${isMounted ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
                <button type="button" onClick={onClose} className="absolute top-4 right-4 text-foreground-subtle hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
                    <X className="w-5 h-5" />
                </button>

                <div className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-500/15">
                        <AlertTriangle className="h-5 w-5 text-danger" />
                    </div>
                    <div>
                        <h3 className="text-[18px] font-semibold text-foreground">{t("director.lessons.delete.title")}</h3>
                        <p className="mt-1 text-sm text-foreground-muted">
                            {t("director.lessons.delete.desc", { name: lesson.topic || lesson.group_name })}
                        </p>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-3">
                    <button type="button" onClick={onClose} disabled={isPending} className="h-10 px-4 border border-border bg-surface text-foreground hover:bg-hover text-sm font-semibold rounded-lg cursor-pointer transition-colors disabled:opacity-50">
                        {t("common.cancel")}
                    </button>
                    <button type="button" onClick={() => deleteLesson()} disabled={isPending} className="inline-flex items-center justify-center gap-2 h-10 px-5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-lg disabled:opacity-60 cursor-pointer transition-colors">
                        {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isPending ? t("common.deleting") : t("common.delete")}
                    </button>
                </div>
            </div>
        </div>
    );
}
