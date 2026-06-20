"use client";

import { useState } from "react";
import { Plus, Search, UserCog, ChevronLeft, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import { useManagers } from "@/hooks/useManagers";
import type { IManager } from "@/types/manager";
import ManagerFormModal from "@/components/sections/directorPanelSections/managerView/ManagerFormModal.tsx";
import DeleteManagerModal from "@/components/sections/directorPanelSections/managerView/DeleteAdminModal";
import ManagerRow from "@/components/sections/directorPanelSections/managerView/ManagerRow";


const PAGE_SIZE = 10;

export default function ManagersView() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [addOpen, setAddOpen] = useState(false);
    const [editing, setEditing] = useState<IManager | null>(null);
    const [deleting, setDeleting] = useState<IManager | null>(null);

    const { data, isLoading, isError, isFetching } = useManagers({ page, pageSize: PAGE_SIZE, search });
    const managers = data?.results ?? [];
    const count = data?.count ?? 0;
    const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Menejerlar</h1>
                    <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{count} ta menejer</p>
                </div>
                <button onClick={() => setAddOpen(true)} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">
                    <Plus className="h-4 w-4" /> Yangi menejer
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    placeholder="Menejer qidirish..."
                    className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-600 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                                <th className="py-3.5 px-5 font-semibold">Menejer</th>
                                <th className="py-3.5 px-5 font-semibold">Aloqa</th>
                                <th className="py-3.5 px-5 font-semibold">Filial</th>
                                <th className="py-3.5 px-5 font-semibold">Izoh</th>
                                <th className="py-3.5 px-5 text-right font-semibold">Amallar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="py-4 px-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-full" />
                                                <div className="space-y-2">
                                                    <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
                                                    <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-5" colSpan={4}>
                                            <div className="h-4 w-full max-w-md bg-slate-200 dark:bg-slate-800 rounded" />
                                        </td>
                                    </tr>
                                ))
                            ) : isError ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center">
                                        <AlertCircle className="mx-auto h-9 w-9 text-rose-500" />
                                        <p className="mt-2 text-sm font-semibold text-rose-600">Ma'lumotlarni yuklab bo'lmadi</p>
                                    </td>
                                </tr>
                            ) : managers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-16 text-center">
                                        <UserCog className="mx-auto mb-3 h-10 w-10 text-slate-300 dark:text-slate-600" />
                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Menejer topilmadi</p>
                                        <p className="mt-1 text-sm text-slate-400">Yangi menejer qo'shib boshlang</p>
                                    </td>
                                </tr>
                            ) : (
                                managers.map((m) => (
                                    <ManagerRow key={m.id} manager={m} onEdit={setEditing} onDelete={setDeleting} />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!isLoading && managers.length > 0 && (
                    <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3 dark:border-slate-800">
                        <span className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                            {isFetching && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                            {page} / {totalPages}
                        </span>
                        <div className="flex gap-2">
                            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={!data?.previous} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                                <ChevronLeft className="h-4 w-4" /> Oldingi
                            </button>
                            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={!data?.next} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                                Keyingi <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            {addOpen && <ManagerFormModal onClose={() => setAddOpen(false)} />}
            {editing && <ManagerFormModal manager={editing} onClose={() => setEditing(null)} />}
            {deleting && <DeleteManagerModal manager={deleting} onClose={() => setDeleting(null)} />}
        </div>
    );
}