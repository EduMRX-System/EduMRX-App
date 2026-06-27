"use client";

import { Group, lessonDaysLabel, parseLessonDays, STATUS_OPTIONS, toHHMM } from "@/types/group";
import { Users2, Pencil, Trash2, Clock, GraduationCap } from "lucide-react";
import { useTranslation } from "react-i18next";

function StatusBadge({ status }: { status: Group["status"] }) {
    const { t } = useTranslation();
    const opt = STATUS_OPTIONS.find((o) => o.value === status) ?? STATUS_OPTIONS[0];
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium bg-slate-50 text-slate-600  ">
            <span className={`h-1.5 w-1.5 rounded-full ${opt.color}`} />
            {status === "active" ? t("common.active") : t("common.inactive")}
        </span>
    );
}

interface Props {
    group: Group;
    onEdit: (g: Group) => void;
    onDelete: (g: Group) => void;
}

export default function GroupItem({ group, onEdit, onDelete }: Props) {
    const { t } = useTranslation();
    const days = lessonDaysLabel(parseLessonDays(group.lesson_days));
    const time = `${toHHMM(group.lesson_start_time)}–${toHHMM(group.lesson_end_time)}`;

    return (
        <tr className="transition hover:bg-hover/50">
            {/* Guruh + kurs */}
            <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                        <Users2 className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                        <p className="font-medium text-foreground">{group.name}</p>
                        <p className="mt-0.5 text-[11px] text-foreground-subtle">{group.course_name}</p>
                    </div>
                </div>
            </td>

            {/* O'qituvchi */}
            <td className="px-5 py-3.5 text-foreground-muted">{group.teacher_name || "—"}</td>

            {/* Xona */}
            <td className="px-5 py-3.5 text-foreground-muted">{group.room_name || "—"}</td>

            {/* Jadval */}
            <td className="px-5 py-3.5">
                <div className="text-foreground-muted">{days || "—"}</div>
                <div className="mt-0.5 flex items-center gap-1 text-[11px] text-foreground-subtle">
                    <Clock className="h-3 w-3" /> {time}
                </div>
            </td>

            {/* O'quvchilar */}
            <td className="px-5 py-3.5">
                <span className="inline-flex items-center gap-1.5 text-foreground-muted">
                    <GraduationCap className="h-3.5 w-3.5 text-foreground-subtle" />
                    {group.student_count}
                </span>
            </td>

            {/* Status */}
            <td className="px-5 py-3.5"><StatusBadge status={group.status} /></td>

            {/* Amallar */}
            <td className="px-5 py-3.5">
                <div className="flex justify-end gap-1">
                    <button
                        onClick={() => onEdit(group)}
                        className="rounded-lg p-2 text-foreground-subtle transition hover:bg-hover hover:text-primary"
                        title={t("common.edit")}
                    >
                        <Pencil className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onDelete(group)}
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
