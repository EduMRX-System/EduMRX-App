"use client";

import Image from "next/image";
import { Phone, Mail, Briefcase, Star, Wallet, Edit3, Trash2 } from "lucide-react";
import { formatPhoneView, type ITeacher } from "@/types/teacher";

function formatSalary(salary?: string): string {
    if (!salary) return "—";
    const n = Math.abs(Number(salary));
    if (Number.isNaN(n)) return salary;
    return new Intl.NumberFormat("uz-UZ").format(n) + " so'm";
}

interface Props {
    teacher: ITeacher;
    onEdit: (t: ITeacher) => void;
    onDelete: (t: ITeacher) => void;
}

export default function TeacherRow({ teacher, onEdit, onDelete }: Props) {
    // GET'da user nested; eski flat shaklni ham qo'llaymiz
    const u = teacher.user ?? (teacher as any);
    const initial = (u.full_name || "N").charAt(0).toUpperCase();

    return (
        <tr className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
            {/* Teacher */}
            <td className="py-4 px-5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                        {u.avatar ? (
                            <Image src={u.avatar} alt={u.full_name} width={40} height={40} className="w-full h-full object-cover" />
                        ) : (
                            <span className="font-semibold text-slate-500 dark:text-slate-400 text-sm">{initial}</span>
                        )}
                    </div>
                    <div className="min-w-0">
                        <div className="font-semibold text-slate-900 dark:text-slate-100 leading-tight">{u.full_name}</div>
                        <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">ID: {teacher.id.slice(0, 8)}</div>
                    </div>
                </div>
            </td>

            {/* Contact */}
            <td className="py-4 px-5">
                <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatPhoneView(u.phone)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate max-w-[160px]">{u.email}</span>
                    </div>
                </div>
            </td>

            {/* Specialization / Experience */}
            <td className="py-4 px-5">
                <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200 font-medium">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                        <span>{teacher.specialization || "—"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span>{teacher.experience ?? 0} yil tajriba</span>
                    </div>
                </div>
            </td>

            {/* Maosh */}
            <td className="py-4 px-5">
                <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                    <Wallet className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{formatSalary(teacher.salary)}</span>
                </div>
            </td>

            {/* Actions */}
            <td className="py-4 px-5 text-right">
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => onEdit(teacher)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400 transition-all cursor-pointer"
                        title="Tahrirlash"
                    >
                        <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(teacher)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 dark:hover:text-red-400 transition-all cursor-pointer"
                        title="O'chirish"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
}