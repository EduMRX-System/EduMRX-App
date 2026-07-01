"use client";

import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "@/services/api";
import { AlertTriangle, X, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import type { ITeacher } from "@/types/teacher";
import { useTranslation } from "react-i18next";
import { queryKeys } from "@/lib/queryKeys";
import FormModalShell from "@/components/common/FormModalShell";

interface Props {
    teacher: ITeacher;
    onClose: () => void;
    role?: "director" | "manager";
}

export default function DeleteTeacherModal({ teacher, onClose, role = "director" }: Props) {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    const { mutate: deleteTeacher, isPending } = useMutation({
        mutationFn: async () => {
            await API.delete(`${role}/teachers/${teacher.id}/`);
        },
        onSuccess: () => {
            toast.success(t("director.teachers.toast.deleted"));
            queryClient.invalidateQueries({ queryKey: queryKeys.teachers.all });
            onClose();
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || t("director.teachers.toast.delete_error")),
    });

    return (
        <FormModalShell onClose={onClose} variant="center" maxWidth="max-w-md">
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
        </FormModalShell>
    );
}
