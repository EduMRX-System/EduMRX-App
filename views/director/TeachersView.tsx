"use client";

import { useState } from "react";
import { Plus, Search, GraduationCap, ChevronLeft, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import { useTeachers } from "@/hooks/useTeachers";
import type { ITeacher } from "@/types/teacher";
import TeacherFormModal from "@/components/sections/directorPanelSections/teachersView/TeacherFormModal";
import DeleteTeacherModal from "@/components/sections/directorPanelSections/teachersView/DeleteTeacherModal";
import TeacherRow from "@/components/sections/directorPanelSections/teachersView/TeacherRow";
import { useTranslation } from "react-i18next";

const PAGE_SIZE = 10;

export default function TeachersView() {
    const { t } = useTranslation();
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
                    <h1 className="text-xl font-semibold text-foreground">{t("director.teachers.title")}</h1>
                    <p className="mt-0.5 text-sm text-foreground-muted">{t("director.teachers.count", { count })}</p>
                </div>
                <button
                    onClick={() => setAddOpen(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-fg shadow-sm transition hover:bg-primary-hover"
                >
                    <Plus className="h-4 w-4" /> {t("director.teachers.add_btn")}
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-subtle" />
                <input
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    placeholder={t("director.teachers.search_placeholder")}
                    className="w-full rounded-lg border border-border bg-surface py-2.5 pl-9 pr-3 text-sm text-foreground outline-none transition placeholder:text-foreground-subtle focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20   "
                />
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-2xl border border-border bg-surface  ">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-border bg-surface-raised text-xs uppercase tracking-wider text-foreground-muted  /50 ">
                                <th className="py-3.5 px-5 font-semibold">{t("director.teachers.table.name")}</th>
                                <th className="py-3.5 px-5 font-semibold">{t("director.teachers.table.contact")}</th>
                                <th className="py-3.5 px-5 font-semibold">{t("director.teachers.table.specialization")}</th>
                                <th className="py-3.5 px-5 font-semibold">{t("director.teachers.table.salary")}</th>
                                <th className="py-3.5 px-5 text-right font-semibold">{t("director.teachers.table.actions")}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="py-16 text-center">
                                        <Loader2 className="mx-auto h-7 w-7 animate-spin text-primary" />
                                        <p className="mt-3 text-sm text-foreground-muted">{t("common.loading")}</p>
                                    </td>
                                </tr>
                            ) : isError ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center">
                                        <AlertCircle className="mx-auto h-9 w-9 text-danger" />
                                        <p className="mt-2 text-sm font-semibold text-rose-600">{t("common.error_failed")}</p>
                                    </td>
                                </tr>
                            ) : teachers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-16 text-center">
                                        <GraduationCap className="mx-auto mb-3 h-10 w-10 text-slate-300 dark:text-foreground-muted" />
                                        <p className="text-sm font-medium text-foreground-muted">{t("director.teachers.empty.title")}</p>
                                        <p className="mt-1 text-sm text-foreground-subtle">{t("director.teachers.empty.desc")}</p>
                                    </td>
                                </tr>
                            ) : (
                                teachers.map((teacher) => (
                                    <TeacherRow key={teacher.id} teacher={teacher} onEdit={setEditing} onDelete={setDeleting} />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!isLoading && teachers.length > 0 && showPagination && (
                    <div className="flex items-center justify-between border-t border-border px-5 py-3 ">
                        <span className="flex items-center gap-2 text-sm text-foreground-muted">
                            {isFetching && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                            {t("director.teachers.page_label", { page })}
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={!data?.previous}
                                className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm text-foreground-muted transition hover:bg-surface-raised disabled:cursor-not-allowed disabled:opacity-40   dark:hover:bg-slate-800"
                            >
                                <ChevronLeft className="h-4 w-4" /> {t("common.prev")}
                            </button>
                            <button
                                onClick={() => setPage((p) => p + 1)}
                                disabled={!data?.next}
                                className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm text-foreground-muted transition hover:bg-surface-raised disabled:cursor-not-allowed disabled:opacity-40   dark:hover:bg-slate-800"
                            >
                                {t("common.next")} <ChevronRight className="h-4 w-4" />
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