"use client";

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "@/services/api";
import { X, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import type { IStudent } from "@/types/student";
import { useTranslation } from "react-i18next";

interface Props {
    student: IStudent;
    onClose: () => void;
}

export default function DeleteStudentModal({ student, onClose }: Props) {
    const { t } = useTranslation();
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
            toast.success(t("director.students.toast.deleted"));
            queryClient.invalidateQueries({ queryKey: ["students-list"] });
            onClose();
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || t("director.students.toast.delete_error")),
    });

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay backdrop-blur-sm transition-opacity duration-200 ${isMounted ? "opacity-100" : "opacity-0"}`}>
            <div className="w-full max-w-md bg-surface rounded-xl border border-border-subtle shadow-xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle bg-hover/50">
                    <div className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="w-5 h-5" />
                        <h3 className="text-sm font-semibold text-foreground">{t("director.students.delete.title")}</h3>
                    </div>
                    <button onClick={onClose} disabled={isPending} className="p-1.5 rounded-lg text-foreground-subtle hover:text-foreground hover:bg-hover transition-colors disabled:opacity-50 cursor-pointer">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5">
                    <p className="text-sm text-foreground-muted leading-relaxed">
                        {t("director.students.delete.confirm", { name: student.full_name })}
                    </p>
                    <p className="text-xs text-danger font-medium mt-2 bg-red-50/50 dark:bg-red-950/20 border border-red-100/50 dark:border-red-900/30 rounded-md p-2">
                        {t("director.students.delete.warning")}
                    </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-2 px-5 py-3.5 bg-hover/50 border-t border-border-subtle">
                    <button type="button" onClick={onClose} disabled={isPending} className="h-9 px-3.5 text-xs font-semibold text-foreground bg-surface border border-border rounded-lg hover:bg-hover dark:hover:bg-hover transition-colors cursor-pointer disabled:opacity-50">
                        {t("common.cancel")}
                    </button>
                    <button type="button" onClick={() => deleteStudent()} disabled={isPending} className="inline-flex items-center justify-center gap-1.5 h-9 px-4 text-xs font-semibold text-white bg-danger hover:bg-danger/90 rounded-lg transition-colors cursor-pointer disabled:opacity-70 min-w-[100px]">
                        {isPending ? (<><Loader2 className="w-3.5 h-3.5 animate-spin" /> {t("common.deleting")}</>) : t("common.delete")}
                    </button>
                </div>
            </div>
        </div>
    );
}
