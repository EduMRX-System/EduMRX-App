"use client";

import Image from "next/image";
import { Phone, Mail, Building2, FileText, Edit3, Trash2 } from "lucide-react";
import { formatPhoneView, type IManager } from "@/types/manager";
import { useTranslation } from "react-i18next";

interface Props {
    manager: IManager;
    onEdit: (m: IManager) => void;
    onDelete: (m: IManager) => void;
}

export default function ManagerRow({ manager, onEdit, onDelete }: Props) {
    const { t } = useTranslation();
    const u = manager.user ?? (manager as any);
    const initial = (u.full_name || "M").charAt(0).toUpperCase();

    return (
        <tr className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
            {/* Manager */}
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
                        <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">ID: {manager.id.slice(0, 8)}</div>
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

            {/* Filial */}
            <td className="py-4 px-5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-50/60 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/30">
                    <Building2 className="w-3.5 h-3.5" />
                    {manager.center_name || "—"}
                </span>
            </td>

            {/* Izoh */}
            <td className="py-4 px-5">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 max-w-[220px]">
                    <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{manager.notes || "—"}</span>
                </div>
            </td>

            {/* Actions */}
            <td className="py-4 px-5 text-right">
                <div className="flex items-center justify-end gap-2">
                    <button onClick={() => onEdit(manager)} className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400 transition-all cursor-pointer" title={t("common.edit")}>
                        <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(manager)} className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 dark:hover:text-red-400 transition-all cursor-pointer" title={t("common.delete")}>
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
}