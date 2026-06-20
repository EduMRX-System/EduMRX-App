"use client";

import { useState } from "react";
import { Plus, Search, GraduationCap, ChevronLeft, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import { useTeachers } from "@/hooks/useTeachers";
import type { ITeacher } from "@/types/teacher";
import TeacherFormModal from "@/components/sections/directorPanelSections/teachersView/TeacherFormModal";
import DeleteTeacherModal from "@/components/sections/directorPanelSections/teachersView/DeleteTeacherModal";
import TeacherRow from "@/components/sections/directorPanelSections/teachersView/TeacherRow";


const PAGE_SIZE = 10;

export default function TeachersView() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [addOpen, setAddOpen] = useState(false);
    const [editing, setEditing] = useState<ITeacher | null>(null);
    const [deleting, setDeleting] = useState<ITeacher | null>(null);

    const { data, isLoading, isError, isFetching } = useTeachers({ page, pageSize: PAGE_SIZE, search });

    const teachers = data?.results ?? [];
    const count = data?.count ?? 0;
    const showPagination = !!(data?.next || data?.previous);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">O'qituvchilar</h1>
                    <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{count} ta o'qituvchi</p>
                </div>
                <button
                    onClick={() => setAddOpen(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                >
                    <Plus className="h-4 w-4" /> Yangi o'qituvchi
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    placeholder="O'qituvchi qidirish..."
                    className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-600 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                                <th className="py-3.5 px-5 font-semibold">O'qituvchi</th>
                                <th className="py-3.5 px-5 font-semibold">Aloqa</th>
                                <th className="py-3.5 px-5 font-semibold">Mutaxassislik / Tajriba</th>
                                <th className="py-3.5 px-5 font-semibold">Maosh</th>
                                <th className="py-3.5 px-5 text-right font-semibold">Amallar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="py-16 text-center">
                                        <Loader2 className="mx-auto h-7 w-7 animate-spin text-indigo-600" />
                                        <p className="mt-3 text-sm text-slate-500">Yuklanmoqda...</p>
                                    </td>
                                </tr>
                            ) : isError ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center">
                                        <AlertCircle className="mx-auto h-9 w-9 text-rose-500" />
                                        <p className="mt-2 text-sm font-semibold text-rose-600">Ma'lumotlarni yuklab bo'lmadi</p>
                                    </td>
                                </tr>
                            ) : teachers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-16 text-center">
                                        <GraduationCap className="mx-auto mb-3 h-10 w-10 text-slate-300 dark:text-slate-600" />
                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">O'qituvchi topilmadi</p>
                                        <p className="mt-1 text-sm text-slate-400">Birinchi profilni yarating</p>
                                    </td>
                                </tr>
                            ) : (
                                teachers.map((t) => (
                                    <TeacherRow key={t.id} teacher={t} onEdit={setEditing} onDelete={setDeleting} />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!isLoading && teachers.length > 0 && showPagination && (
                    <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3 dark:border-slate-800">
                        <span className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                            {isFetching && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                            {page}-sahifa
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={!data?.previous}
                                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                                <ChevronLeft className="h-4 w-4" /> Oldingi
                            </button>
                            <button
                                onClick={() => setPage((p) => p + 1)}
                                disabled={!data?.next}
                                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                                Keyingi <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            {addOpen && <TeacherFormModal onClose={() => setAddOpen(false)} />}
            {editing && <TeacherFormModal teacher={editing} onClose={() => setEditing(null)} />}
            {deleting && <DeleteTeacherModal teacher={deleting} onClose={() => setDeleting(null)} />}
        </div>
    );
}