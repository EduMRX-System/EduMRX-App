"use client";

import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "@/services/api";
import { AlertTriangle, Loader2, X } from "lucide-react";
import { toast } from "react-toastify";
import type { Branch } from "@/types/branch";
import { useTranslation } from "react-i18next";
import { queryKeys } from "@/lib/queryKeys";
import FormModalShell from "@/components/common/FormModalShell";

interface Props {
    branch: Branch;
    onClose: () => void;
}

export default function DeleteBranchModal({ branch, onClose }: Props) {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    const { mutate: deleteBranch, isPending } = useMutation({
        mutationFn: async () => {
            await API.delete(`center/branches/${branch.id}/`);
        },
        onSuccess: () => {
            toast.success(t("director.branches.toast.deleted"));
            queryClient.invalidateQueries({ queryKey: queryKeys.branches.all });
            onClose();
        },
        onError: () => toast.error(t("director.branches.toast.delete_error")),
    });

    return (
        <FormModalShell onClose={onClose} variant="center" maxWidth="max-w-md">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-foreground-subtle hover:text-foreground cursor-pointer"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-100 dark:bg-danger-bg0/15">
                        <AlertTriangle className="h-5 w-5 text-danger" />
                    </div>
                    <div>
                        <h3 className="text-[18px] font-semibold text-foreground">
                            {t("director.branches.delete.title")}
                        </h3>
                        <p className="mt-1 text-sm text-foreground-muted">
                            {t("director.branches.delete.desc", { name: branch.name })}
                        </p>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isPending}
                        className="h-10 px-4 border border-border bg-surface text-foreground hover:bg-hover text-sm font-semibold rounded-lg cursor-pointer transition-colors disabled:opacity-50"
                    >
                        {t("common.cancel")}
                    </button>
                    <button
                        type="button"
                        onClick={() => deleteBranch()}
                        disabled={isPending}
                        className="inline-flex items-center justify-center gap-2 h-10 px-5 bg-danger hover:bg-danger/90 text-white text-sm font-semibold rounded-lg disabled:opacity-60 cursor-pointer transition-colors"
                    >
                        {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                        {t("common.delete")}
                    </button>
                </div>
        </FormModalShell>
    );
}