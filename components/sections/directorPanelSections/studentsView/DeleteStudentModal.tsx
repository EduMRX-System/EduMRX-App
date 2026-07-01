"use client";

import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "@/services/api";
import { X, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import type { IStudent } from "@/types/student";
import { useTranslation } from "react-i18next";
import { queryKeys } from "@/lib/queryKeys";
import FormModalShell from "@/components/common/FormModalShell";

interface Props {
    student: IStudent;
    onClose: () => void;
    role?: "director" | "manager";
}

export default function DeleteStudentModal({ student, onClose, role = "director" }: Props) {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    const { mutate: deleteStudent, isPending } = useMutation({
        mutationFn: async () => {
            await API.delete(`${role}/students/${student.id}/`);
        },
        onSuccess: () => {
            toast.success(t("director.students.toast.deleted"));
            queryClient.invalidateQueries({ queryKey: queryKeys.students.listAll });
            onClose();
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || t("director.students.toast.delete_error")),
    });

    return (
        <FormModalShell onClose={onClose} variant="center" maxWidth="max-w-md">
            <div className="-m-6 rounded-xl overflow-hidden">
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
                        {t("director.students.delete.confirm", { name: [student.user?.first_name, student.user?.last_name].filter(Boolean).join(" ") })}
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
        </FormModalShell>
    );
}
