"use client";

import { CalendarDays, Users2, Clock, Pencil, Trash2 } from "lucide-react";
import { toHHMM, type Lesson } from "@/types/lesson";
import { useTranslation } from "react-i18next";

interface Props {
    lesson: Lesson;
    onEdit: (l: Lesson) => void;
    onDelete: (l: Lesson) => void;
}

export default function LessonRow({ lesson, onEdit, onDelete }: Props) {
    const { t } = useTranslation();
    const time = `${toHHMM(lesson.start_time)}–${toHHMM(lesson.end_time)}`;

    return (
        <tr className="transition hover:bg-slate-50 dark:hover:bg-slate-800/50">
            {/* Mavzu + izoh */}
            <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                        <CalendarDays className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                        <p className="font-medium text-slate-900 dark:text-slate-100">{lesson.topic || "—"}</p>
                        {lesson.notes && (
                            <p className="mt-0.5 line-clamp-1 max-w-[280px] text-[11px] text-slate-400 dark:text-slate-500">{lesson.notes}</p>
                        )}
                    </div>
                </div>
            </td>

            {/* Guruh */}
            <td className="px-5 py-3.5">
                <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <Users2 className="h-3.5 w-3.5 text-slate-400" />
                    {lesson.group_name || "—"}
                </span>
            </td>

            {/* Sana */}
            <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{lesson.date || "—"}</td>

            {/* Vaqt */}
            <td className="px-5 py-3.5">
                <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    {time}
                </span>
            </td>

            {/* Amallar */}
            <td className="px-5 py-3.5">
                <div className="flex justify-end gap-1">
                    <button onClick={() => onEdit(lesson)} className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800 dark:hover:text-indigo-400" title={t("common.edit")}>
                        <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => onDelete(lesson)} className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400" title={t("common.delete")}>
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
}
