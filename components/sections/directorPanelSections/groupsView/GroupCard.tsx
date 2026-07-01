"use client";

import {
    Users2, Clock, GraduationCap, Pencil, Trash2,
    User, Building2, AlertTriangle,
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
        <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium bg-hover text-foreground-muted">
            <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${opt.color}`} />
            {status === "active" ? t("common.active") : t("common.inactive")}
        </span>
    );
}

export default function GroupCard({ group, capacity, onEdit, onDelete }: Props) {
    const { t } = useTranslation();
    const days = lessonDaysLabel(parseLessonDays(group.lesson_days));
    const time = `${toHHMM(group.lesson_start_time)}–${toHHMM(group.lesson_end_time)}`;
    const ci = capacity && capacity > 0 ? capacityInfo(group.student_count, capacity) : null;

    return (
        <div className="bg-surface border border-border-subtle rounded-2xl p-5 flex flex-col gap-4 hover:border-border transition-colors group/card">
            {/* Header */}
            <div className="flex items-start gap-3">
                <div className="w-9 h-9 shrink-0 rounded-lg bg-primary-soft flex items-center justify-center text-primary">
                    <Users2 className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate leading-tight">{group.name}</p>
                    <p className="text-xs text-foreground-subtle truncate mt-0.5">{group.course_name || "—"}</p>
                </div>
                <StatusBadge status={group.status} />
            </div>

            {/* Meta */}
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-foreground-muted">
                    <User className="w-3.5 h-3.5 text-foreground-subtle shrink-0" />
                    <span className="truncate">{group.teacher_name || t("director.groups.card.no_teacher")}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-foreground-muted">
                    <Building2 className="w-3.5 h-3.5 text-foreground-subtle shrink-0" />
                    <span className="truncate">{group.room_name || t("director.groups.card.no_room")}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-foreground-muted">
                    <Clock className="w-3.5 h-3.5 text-foreground-subtle shrink-0" />
                    <span>{days || "—"} &bull; {time || "—"}</span>
                </div>
            </div>

            {/* Capacity */}
            <div className="border-t border-border-subtle pt-3 space-y-1.5">
                {ci ? (
                    <>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-foreground-muted flex items-center gap-1">
                                <GraduationCap className="w-3.5 h-3.5" />
                                {group.student_count} / {capacity} {t("director.groups.card.students")}
                            </span>
                            <span className={`text-xs font-bold flex items-center gap-1 ${ci.text}`}>
                                {ci.isOver && <AlertTriangle className="w-3 h-3" />}
                                {ci.pct}%
                            </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-hover overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all ${ci.bar}`}
                                style={{ width: `${ci.clampedPct}%` }}
                            />
                        </div>
                    </>
                ) : (
                    <div className="flex items-center gap-1.5 text-xs text-foreground-subtle">
                        <GraduationCap className="w-3.5 h-3.5" />
                        {group.room
                            ? <span>{group.student_count} {t("director.groups.card.students")}</span>
                            : <span>{t("director.groups.card.no_room")}</span>
                        }
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-1 -mt-1">
                <button
                    onClick={() => onEdit(group)}
                    className="p-1.5 rounded-lg text-foreground-subtle hover:text-primary hover:bg-primary-soft transition-colors"
                    title={t("common.edit")}
                >
                    <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                    onClick={() => onDelete(group)}
                    className="p-1.5 rounded-lg text-foreground-subtle hover:text-danger hover:bg-danger-bg transition-colors"
                    title={t("common.delete")}
                >
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
}
