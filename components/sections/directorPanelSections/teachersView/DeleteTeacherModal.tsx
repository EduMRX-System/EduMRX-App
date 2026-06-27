"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "@/services/api";
import { AlertTriangle, X, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import type { ITeacher } from "@/types/teacher";
import { useTranslation } from "react-i18next";

interface Props {
    teacher: ITeacher;
    onClose: () => void;
}

export default function DeleteTeacherModal({ teacher, onClose }: Props) {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    const { mutate: deleteTeacher, isPending } = useMutation({
        mutationFn: async () => {
            await API.delete(`director/teachers/${teacher.id}/`);
        },
        onSuccess: () => {
            toast.success(t("director.teachers.toast.deleted"));
            queryClient.invalidateQueries({ queryKey: ["teachers"] });
            onClose();
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || t("director.teachers.toast.delete_error")),
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className={`fixed inset-0 bg-overlay backdrop-blur-sm transition-opacity duration-300 ${isMounted ? "opacity-100" : "opacity-0"}`}
                onClick={!isPending ? onClose : undefined}
            />

            <div
                className={`bg-surface p-6 rounded-xl max-w-md w-full relative z-10 shadow-2xl border border-border-subtle transform transition-all duration-300 ease-out ${isMounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-8 scale-95"}`}
            >
                {!isPending && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute top-4 right-4 text-foreground-subtle hover:text-foreground p-1 rounded-lg hover:bg-hover transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}

                <div className="mb-4 border border-red-100 dark:border-red-900/50 shadow-sm w-11 h-11 rounded-lg flex justify-center items-center text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-950/30">
                    <AlertTriangle className="w-5 h-5" />
                </div>

                <h3 className="text-foreground text-[18px] font-semibold mb-2">{t("director.teachers.delete.title")}</h3>
                <p className="text-foreground-muted text-sm mb-6 leading-relaxed">
                    {t("director.teachers.delete.desc", { name: teacher.user?.full_name })}
                </p>

                <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
                    <button
                        type="button"
                        disabled={isPending}
                        onClick={onClose}
                        className="h-10 px-4 bg-surface border border-border hover:bg-hover text-foreground rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer order-2 sm:order-1"
                    >
                        {t("common.cancel")}
                    </button>
                    <button
                        type="button"
                        disabled={isPending}
                        onClick={() => deleteTeacher()}
                        className="h-10 px-4 bg-danger hover:bg-danger/90 disabled:bg-red-400 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer order-1 sm:order-2"
                    >
                        {isPending ? (<><Loader2 className="w-4 h-4 animate-spin" /> {t("common.deleting")}</>) : t("common.delete")}
                    </button>
                </div>
            </div>
        </div>
    );
}
