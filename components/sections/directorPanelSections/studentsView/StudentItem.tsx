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
    inactive: "bg-hover text-foreground-muted border-border-subtle",
    pending: "bg-warning-bg text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-warning dark:border-amber-900/40",
    new: "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/40",
    frozen: "bg-cyan-50 text-cyan-700 border-cyan-100 dark:bg-cyan-950/20 dark:text-cyan-400 dark:border-cyan-900/40",
    graduated: "bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/40",
    suspended: "bg-red-50 text-red-700 border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/40",
};

export default function StudentItem({ student, onEdit, onDelete }: Props) {
    const { t } = useTranslation();
    const router = useRouter();
    
    // JSON dagi strukturaga asosan ma'lumotlarni user obyektidan olish (fallback qilib o'zidan ham qidiriladi)
    const u = student.user;
    const fullName = u?.full_name || (student as any).full_name || "Noma'lum";
    const avatar = u?.avatar || (student as any).avatar;
    const phone = u?.phone || (student as any).phone || "";
    const email = u?.email || (student as any).email || "—";
    
    const initial = fullName.slice(0, 2).toUpperCase() || "ST";

    return (
        <tr
            onClick={() => router.push(`/students/${student.id}`)}
            className="hover:bg-hover/50 dark:hover:bg-hover/40 border-b border-border-subtle/60 transition-colors group cursor-pointer"
        >
            {/* Ism + avatar */}
            <td className="py-4 px-5">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary-soft border border-primary/20 flex items-center justify-center font-semibold text-primary shrink-0 uppercase text-xs overflow-hidden">
                        {avatar ? (
                            <Image src={avatar} alt={fullName} width={36} height={36} className="w-full h-full object-cover rounded-full" />
                        ) : (
                            <span>{initial}</span>
                        )}
                    </div>
                    <div>
                        <div className="font-semibold text-foreground leading-tight flex items-center gap-2">
                            {fullName}
                            {student.status && (
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-sm border uppercase font-bold tracking-wide ${statusStyles[student.status] || statusStyles.inactive}`}>
                                    {student.status}
                                </span>
                            )}
                        </div>
                        <div className="text-xs text-foreground-subtle mt-0.5 font-medium">
                            ID: {student.student_id || student.id.slice(0, 8)}
                        </div>
                    </div>
                </div>
            </td>

            {/* Aloqa */}
            <td className="py-4 px-5">
                <div className="space-y-1 text-xs font-medium">
                    <div className="flex items-center gap-2 text-foreground-muted">
                        <Phone className="w-3.5 h-3.5 text-foreground-subtle" />
                        <span>{phone ? formatPhoneView(phone) : "—"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground-muted">
                        <Mail className="w-3.5 h-3.5 text-foreground-subtle" />
                        <span className="truncate max-w-[160px]">{email}</span>
                    </div>
                </div>
            </td>

            {/* Filial */}
            <td className="py-4 px-5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-primary-soft/60 text-primary border border-primary/20">
                    <GraduationCap className="w-3.5 h-3.5" />
                    {student.center_name || "—"}
                </span>
            </td>

            {/* Tug'ilgan sana */}
            <td className="py-4 px-5">
                <div className="flex items-center gap-1.5 text-xs text-foreground-muted font-medium">
                    <Calendar className="w-3.5 h-3.5 text-foreground-subtle" />
                    <span>{student.date_of_birth || u?.date_of_birth || "—"}</span>
                </div>
            </td>

            {/* Amallar */}
            <td className="py-4 px-5 text-right">
                <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(student); }}
                        title={t("common.edit")}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-foreground-subtle hover:text-primary hover:bg-primary-soft border border-transparent hover:border-primary/20 transition-all cursor-pointer bg-transparent"
                    >
                        <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(student); }}
                        title={t("common.delete")}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-foreground-subtle hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 border border-transparent hover:border-red-100 dark:hover:border-red-900/50 transition-all cursor-pointer bg-transparent"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
}