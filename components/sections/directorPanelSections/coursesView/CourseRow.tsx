"use client";

import { Course, formatPrice, STATUS_OPTIONS } from "@/types/course";
import { BookOpen, Pencil, Trash2, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

function StatusBadge({ status }: { status: Course["status"] }) {
    const { t } = useTranslation();
    const opt = STATUS_OPTIONS.find((o) => o.value === status) ?? STATUS_OPTIONS[0];
    const active = status === "active";
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${active
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                : "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
                }`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${opt.color}`} />
            {active ? t("common.active") : t("common.inactive")}
        </span>
    );
}

interface Props {
    course: Course;
    onEdit: (c: Course) => void;
    onDelete: (c: Course) => void;
}

export default function CourseRow({ course, onEdit, onDelete }: Props) {
    const { t } = useTranslation();
    return (
        <tr className="transition hover:bg-hover/50">
            {/* Kurs + tavsif */}
            <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                        <BookOpen className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                        <p className="font-medium text-foreground">{course.name}</p>
                        {course.description && (
                            <p className="mt-0.5 line-clamp-1 max-w-[320px] text-[11px] text-foreground-subtle">
                                {course.description}
                            </p>
                        )}
                    </div>
                </div>
            </td>

            {/* Davomiylik */}
            <td className="px-5 py-3.5">
                <span className="inline-flex items-center gap-1.5 text-foreground-muted">
                    <Clock className="h-3.5 w-3.5 text-foreground-subtle" />
                    {t("director.courses.duration_months", { count: course.duration_months })}
                </span>
            </td>

            {/* Narx */}
            <td className="px-5 py-3.5 font-medium text-foreground">
                {formatPrice(course.price)}
            </td>

            {/* Status */}
            <td className="px-5 py-3.5"><StatusBadge status={course.status} /></td>

            {/* Amallar */}
            <td className="px-5 py-3.5">
                <div className="flex justify-end gap-1">
                    <button
                        onClick={() => onEdit(course)}
                        className="rounded-lg p-2 text-foreground-subtle transition hover:bg-hover hover:text-primary"
                        title={t("common.edit")}
                    >
                        <Pencil className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onDelete(course)}
                        className="rounded-lg p-2 text-foreground-subtle transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                        title={t("common.delete")}
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
}