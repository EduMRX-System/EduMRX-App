"use client";

import { Building2, MapPin, Pencil, Trash2, Users, GraduationCap, DoorOpen } from "lucide-react";
import type { Branch } from "@/types/branch";

function StatusBadge({ status }: { status: Branch["status"] }) {
    const active = status === "active";
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${active
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                : "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
                }`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-rose-500"}`} />
            {active ? "Faol" : "Nofaol"}
        </span>
    );
}

interface Props {
    branch: Branch;
    onEdit: (b: Branch) => void;
    onDelete: (b: Branch) => void;
}

export default function BranchItem({ branch, onEdit, onDelete }: Props) {
    const s = branch.stats;

    return (
        <tr className="transition hover:bg-slate-50 dark:hover:bg-slate-800/50">
            {/* Filial + stats */}
            <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                        <Building2 className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                        <p className="font-medium text-slate-900 dark:text-slate-100">{branch.name}</p>
                        {s && (
                            <div className="mt-0.5 flex items-center gap-3 text-[11px] text-slate-400 dark:text-slate-500">
                                <span className="flex items-center gap-1">
                                    <GraduationCap className="h-3 w-3" /> {s.students_count}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Users className="h-3 w-3" /> {s.teachers_count}
                                </span>
                                <span className="flex items-center gap-1">
                                    <DoorOpen className="h-3 w-3" /> {s.rooms_count}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </td>

            {/* Holati */}
            <td className="px-5 py-3.5">
                <StatusBadge status={branch.status} />
            </td>

            {/* Telefon */}
            <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">
                {branch.phone ? `+${branch.phone}` : "—"}
            </td>

            {/* Manzil */}
            <td className="px-5 py-3.5">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span className="line-clamp-1 max-w-[260px]">{branch.address || "—"}</span>
                </span>
            </td>

            {/* Amallar */}
            <td className="px-5 py-3.5">
                <div className="flex justify-end gap-1">
                    <button
                        onClick={() => onEdit(branch)}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
                        title="Tahrirlash"
                    >
                        <Pencil className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onDelete(branch)}
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