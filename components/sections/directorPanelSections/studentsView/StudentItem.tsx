"use client";

import { Trash2, Edit3, Mail, Phone, Calendar, GraduationCap } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatPhoneView, type IStudent } from "@/types/student";
import { useTranslation } from "react-i18next";

interface Props {
    student: IStudent;
    onEdit: (s: IStudent) => void;
    onDelete: (s: IStudent) => void;
}

const statusStyles: Record<string, string> = {
    active: "bg-green-50 text-green-700 border-green-100 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/40",
    inactive: "bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
    pending: "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/40",
};

export default function StudentItem({ student, onEdit, onDelete }: Props) {
    const { t } = useTranslation();
    const router = useRouter();
    const initial = student.full_name?.slice(0, 2) || "ST";

    return (
        <tr
            onClick={() => router.push(`/students/${student.id}`)}
            className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800/60 transition-colors group cursor-pointer"
        >
            {/* Ism + avatar */}
            <td className="py-4 px-5">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center font-semibold text-indigo-600 dark:text-indigo-400 shrink-0 uppercase text-xs overflow-hidden">
                        {student.avatar ? (
                            <Image src={student.avatar} alt={student.full_name} width={36} height={36} className="w-full h-full object-cover rounded-full" />
                        ) : (
                            <span>{initial}</span>
                        )}
                    </div>
                    <div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100 leading-tight flex items-center gap-2">
                            {student.full_name}
                            {student.status && (
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-sm border uppercase font-bold tracking-wide ${statusStyles[student.status]}`}>
                                    {student.status}
                                </span>
                            )}
                        </div>
                        <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 font-medium">
                            ID: {student.student_id || student.id.slice(0, 8)}
                        </div>
                    </div>
                </div>
            </td>

            {/* Aloqa */}
            <td className="py-4 px-5">
                <div className="space-y-1 text-xs font-medium">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <Phone className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                        <span>{formatPhoneView(student.phone)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <Mail className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                        <span className="truncate max-w-[160px]">{student.email}</span>
                    </div>
                </div>
            </td>

            {/* Filial */}
            <td className="py-4 px-5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-50/60 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/30">
                    <GraduationCap className="w-3.5 h-3.5" />
                    {student.center_name || "—"}
                </span>
            </td>

            {/* Tug'ilgan sana */}
            <td className="py-4 px-5">
                <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                    <span>{student.date_of_birth || "—"}</span>
                </div>
            </td>

            {/* Amallar */}
            <td className="py-4 px-5 text-right">
                <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(student); }}
                        title={t("common.edit")}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/50 transition-all cursor-pointer bg-transparent"
                    >
                        <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(student); }}
                        title={t("common.delete")}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 border border-transparent hover:border-red-100 dark:hover:border-red-900/50 transition-all cursor-pointer bg-transparent"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
}
