"use client";

import { Group, lessonDaysLabel, parseLessonDays, STATUS_OPTIONS, toHHMM } from "@/types/group";
import { Users2, Pencil, Trash2, Clock, GraduationCap } from "lucide-react";

function StatusBadge({ status }: { status: Group["status"] }) {
    const opt = STATUS_OPTIONS.find((o) => o.value === status) ?? STATUS_OPTIONS[0];
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <span className={`h-1.5 w-1.5 rounded-full ${opt.color}`} />
            {opt.label}
        </span>
    );
}

interface Props {
    group: Group;
    onEdit: (g: Group) => void;
    onDelete: (g: Group) => void;
}

export default function GroupItem({ group, onEdit, onDelete }: Props) {
    const days = lessonDaysLabel(parseLessonDays(group.lesson_days));
    const time = `${toHHMM(group.lesson_start_time)}–${toHHMM(group.lesson_end_time)}`;

    return (
        <tr className="transition hover:bg-slate-50 dark:hover:bg-slate-800/50">
            {/* Guruh + kurs */}
            <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                        <Users2 className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                        <p className="font-medium text-slate-900 dark:text-slate-100">{group.name}</p>
                        <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">{group.course_name}</p>
                    </div>
                </div>
            </td>

            {/* O'qituvchi */}
            <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{group.teacher_name || "—"}</td>

            {/* Xona */}
            <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{group.room_name || "—"}</td>

            {/* Jadval */}
            <td className="px-5 py-3.5">
                <div className="text-slate-600 dark:text-slate-300">{days || "—"}</div>
                <div className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-400">
                    <Clock className="h-3 w-3" /> {time}
                </div>
            </td>

            {/* O'quvchilar */}
            <td className="px-5 py-3.5">
                <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <GraduationCap className="h-3.5 w-3.5 text-slate-400" />
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
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
                        title="Tahrirlash"
                    >
                        <Pencil className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onDelete(group)}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                        title="O'chirish"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
}