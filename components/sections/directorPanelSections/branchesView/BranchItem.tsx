"use client";

import { Building2, MapPin, Pencil, Trash2, Users, GraduationCap, DoorOpen } from "lucide-react";
import type { Branch } from "@/types/branch";
import { useTranslation } from "react-i18next";

function StatusBadge({ status }: { status: Branch["status"] }) {
    const { t } = useTranslation();
    const active = status === "active";
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${active
                ? "bg-success-bg text-success dark:bg-success-bg0/10 dark:text-success"
                : "bg-danger-bg text-danger dark:bg-danger-bg0/10 dark:text-danger"
                }`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-success-bg0" : "bg-danger-bg0"}`} />
            {active ? t("common.active") : t("common.inactive")}
        </span>
    );
}

interface Props {
    branch: Branch;
    onEdit: (b: Branch) => void;
    onDelete: (b: Branch) => void;
}

export default function BranchItem({ branch, onEdit, onDelete }: Props) {
    const { t } = useTranslation();
    const s = branch.stats;

    return (
        <tr className="transition hover:bg-hover/50">
            {/* Filial + stats */}
            <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                        <Building2 className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                        <p className="font-medium text-foreground">{branch.name}</p>
                        {s && (
                            <div className="mt-0.5 flex items-center gap-3 text-[11px] text-foreground-subtle">
                                <span className="flex items-center gap-1">
                                    <GraduationCap className="h-3 w-3" /> {s.students_count}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Users className="h-3 w-3" /> {s.teachers_count}
                                </span>
                                <span className="flex items-center gap-1">
                                    <DoorOpen className="h-3 w-3" /> {s.rooms_count}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </td>

            {/* Holati */}
            <td className="px-5 py-3.5">
                <StatusBadge status={branch.status} />
            </td>

            {/* Telefon */}
            <td className="px-5 py-3.5 text-foreground-muted">
                {branch.phone ? `+${branch.phone}` : "—"}
            </td>

            {/* Manzil */}
            <td className="px-5 py-3.5">
                <span className="flex items-center gap-1.5 text-foreground-muted">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-foreground-subtle" />
                    <span className="line-clamp-1 max-w-[260px]">{branch.address || "—"}</span>
                </span>
            </td>

            {/* Amallar */}
            <td className="px-5 py-3.5">
                <div className="flex justify-end gap-1">
                    <button
                        onClick={() => onEdit(branch)}
                        className="rounded-lg p-2 text-foreground-subtle transition hover:bg-hover hover:text-primary"
                        title={t("common.edit")}
                    >
                        <Pencil className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onDelete(branch)}
                        className="rounded-lg p-2 text-foreground-subtle transition hover:bg-danger-bg hover:text-danger dark:hover:bg-danger-bg0/10 dark:hover:text-danger"
                        title={t("common.delete")}
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
}