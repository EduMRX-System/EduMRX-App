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
        <tr className="transition-colors hover:bg-hover/50">
            {/* Manager */}
            <td className="py-4 px-5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100  border border-border flex items-center justify-center overflow-hidden shrink-0">
                        {u.avatar ? (
                            <Image src={u.avatar} alt={u.full_name} width={40} height={40} className="w-full h-full object-cover" />
                        ) : (
                            <span className="font-semibold text-foreground-muted text-sm">{initial}</span>
                        )}
                    </div>
                    <div className="min-w-0">
                        <div className="font-semibold text-foreground leading-tight">{u.full_name}</div>
                        <div className="text-[11px] text-foreground-subtle mt-0.5">ID: {manager.id.slice(0, 8)}</div>
                    </div>
                </div>
            </td>

            {/* Contact */}
            <td className="py-4 px-5">
                <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2 text-foreground-muted">
                        <Phone className="w-3.5 h-3.5 text-foreground-subtle" />
                        <span>{formatPhoneView(u.phone)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground-muted">
                        <Mail className="w-3.5 h-3.5 text-foreground-subtle" />
                        <span className="truncate max-w-[160px]">{u.email}</span>
                    </div>
                </div>
            </td>

            {/* Filial */}
            <td className="py-4 px-5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-primary-soft/60 text-primary border border-primary/20">
                    <Building2 className="w-3.5 h-3.5" />
                    {manager.center_name || "—"}
                </span>
            </td>

            {/* Izoh */}
            <td className="py-4 px-5">
                <div className="flex items-center gap-1.5 text-xs text-foreground-muted max-w-[220px]">
                    <FileText className="w-3.5 h-3.5 text-foreground-subtle shrink-0" />
                    <span className="truncate">{manager.notes || "—"}</span>
                </div>
            </td>

            {/* Actions */}
            <td className="py-4 px-5 text-right">
                <div className="flex items-center justify-end gap-2">
                    <button onClick={() => onEdit(manager)} className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-foreground-subtle hover:text-primary hover:bg-primary-soft transition-all cursor-pointer" title={t("common.edit")}>
                        <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(manager)} className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-foreground-subtle hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 dark:hover:text-red-400 transition-all cursor-pointer" title={t("common.delete")}>
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
}