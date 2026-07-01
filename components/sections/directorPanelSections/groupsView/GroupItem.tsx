"use client";

import {
    Users2, Clock, GraduationCap, Pencil, Trash2, AlertTriangle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import {
    Group, STATUS_OPTIONS, lessonDaysLabel, parseLessonDays, toHHMM,
} from "@/types/group";

interface Props {
    group: Group;
    capacity?: number;
    onEdit: (g: Group) => void;
    onDelete: (g: Group) => void;
}

function capacityInfo(studentCount: number, capacity: number) {
    const pct = Math.round((studentCount / capacity) * 100);
    const clampedPct = Math.min(pct, 100);
    const isOver = pct > 100;
    if (pct >= 90) return { pct, clampedPct, isOver, bar: "bg-danger", text: "text-danger" };
    if (pct >= 70) return { pct, clampedPct, isOver, bar: "bg-warning", text: "text-warning" };
    return { pct, clampedPct, isOver, bar: "bg-success", text: "text-success" };
}

function StatusBadge({ status }: { status: Group["status"] }) {
    const { t } = useTranslation();
    const opt = STATUS_OPTIONS.find((o) => o.value === status) ?? STATUS_OPTIONS[0];
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium bg-hover text-foreground-muted whitespace-nowrap">
            <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${opt.color}`} />
            {status === "active" ? t("common.active") : t("common.inactive")}
        </span>
    );
}

export default function GroupItem({ group, capacity, onEdit, onDelete }: Props) {
    const { t } = useTranslation();
    const days = lessonDaysLabel(parseLessonDays(group.lesson_days));
    const time = `${toHHMM(group.lesson_start_time)}–${toHHMM(group.lesson_end_time)}`;
    const ci = capacity && capacity > 0 ? capacityInfo(group.student_count, capacity) : null;

    return (
        <div className="flex items-center gap-4 px-5 py-3.5 hover:bg-hover/40 transition-colors">
            {/* Icon + Name */}
            <div className="flex items-center gap-3 min-w-0 flex-[2]">
                <div className="w-8 h-8 shrink-0 rounded-lg bg-primary-soft flex items-center justify-center text-primary">
                    <Users2 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{group.name}</p>
                    <p className="text-xs text-foreground-subtle truncate">{group.course_name || "—"}</p>
                </div>
            </div>

            {/* Teacher */}
            <div className="flex-1 min-w-0 hidden sm:block">
                <p className="text-sm text-foreground-muted truncate">{group.teacher_name || "—"}</p>
            </div>

            {/* Room + Schedule */}
            <div className="flex-1 min-w-0 hidden md:block">
                <p className="text-sm text-foreground-muted truncate">{group.room_name || "—"}</p>
                <p className="text-xs text-foreground-subtle flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3 shrink-0" />
                    {days || "—"} &bull; {time || "—"}
                </p>
            </div>

            {/* Capacity bar */}
            <div className="w-36 shrink-0 hidden lg:block">
                {ci ? (
                    <div className="space-y-1">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] text-foreground-subtle flex items-center gap-1">
                                <GraduationCap className="w-3 h-3" />
                                {group.student_count}/{capacity}
                            </span>
                            <span className={`text-[11px] font-bold flex items-center gap-0.5 ${ci.text}`}>
                                {ci.isOver && <AlertTriangle className="w-3 h-3" />}
                                {ci.pct}%
                            </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-hover overflow-hidden">
                            <div
                                className={`h-full rounded-full ${ci.bar}`}
                                style={{ width: `${ci.clampedPct}%` }}
                            />
                        </div>
                    </div>
                ) : (
                    <span className="text-xs text-foreground-subtle flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5" />
                        {group.student_count} ta
                    </span>
                )}
            </div>

            {/* Status */}
            <div className="shrink-0 hidden sm:block">
                <StatusBadge status={group.status} />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0">
                <button
                    onClick={() => onEdit(group)}
                    className="p-1.5 rounded-lg text-foreground-subtle hover:text-primary hover:bg-primary-soft transition-colors"
                    title={t("common.edit")}
                >
                    <Pencil className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onDelete(group)}
                    className="p-1.5 rounded-lg text-foreground-subtle hover:text-danger hover:bg-danger-bg dark:hover:bg-danger/10 dark:hover:text-danger transition-colors"
                    title={t("common.delete")}
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
