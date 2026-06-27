"use client";

import { useEffect, useState } from "react";
import { Plus, Search, User, X, ChevronLeft, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import { useStudents } from "@/hooks/useStudents";
import type { IStudent } from "@/types/student";
import StudentFormModal from "@/components/sections/directorPanelSections/studentsView/StudentFormModal";
import DeleteStudentModal from "@/components/sections/directorPanelSections/studentsView/DeleteStudentModal";
import StudentItem from "@/components/sections/directorPanelSections/studentsView/StudentItem";
import { useTranslation } from "react-i18next";

const PAGE_SIZE = 10;

export default function StudentsView() {
    const { t } = useTranslation();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [debounced, setDebounced] = useState("");
    const [addOpen, setAddOpen] = useState(false);
    const [editing, setEditing] = useState<IStudent | null>(null);
    const [deleting, setDeleting] = useState<IStudent | null>(null);

    useEffect(() => {
        const h = setTimeout(() => { setDebounced(search.trim()); setPage(1); }, 500);
        return () => clearTimeout(h);
    }, [search]);

    const { data, isLoading, isError, isFetching } = useStudents({ page, pageSize: PAGE_SIZE, search: debounced });
    const students = data?.results ?? [];
    const count = data?.count ?? 0;
    const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

    return (
        <div className="w-full space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-foreground">{t("director.students.title")}</h1>
                    <p className="mt-0.5 text-sm text-foreground-muted">{t("director.students.count", { count })}</p>
                </div>
                <button
                    onClick={() => setAddOpen(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-fg shadow-sm transition hover:bg-primary-hover"
                >
                    <Plus className="h-4 w-4" /> {t("director.students.add_btn")}
                </button>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-subtle" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t("director.students.search_placeholder")}
                    className="w-full rounded-lg border border-border bg-surface py-2.5 pl-9 pr-8 text-sm text-foreground outline-none transition placeholder:text-foreground-subtle focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                {search && (
                    <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground-subtle hover:text-foreground-muted dark:hover:text-foreground-muted cursor-pointer">
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-border-subtle bg-surface">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-border-subtle bg-surface-raised text-xs uppercase tracking-wider text-foreground-muted">
                                <th className="py-3.5 px-5 font-semibold">{t("director.students.table.name")}</th>
                                <th className="py-3.5 px-5 font-semibold">{t("director.students.table.contact")}</th>
                                <th className="py-3.5 px-5 font-semibold">{t("director.students.table.branch")}</th>
                                <th className="py-3.5 px-5 font-semibold">{t("director.students.table.dob")}</th>
                                <th className="py-3.5 px-5 text-right font-semibold">{t("director.students.table.actions")}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-subtle dark:divide-border">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="py-4 px-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-border  rounded-full" />
                                                <div className="space-y-2">
                                                    <div className="h-4 w-32 bg-border  rounded" />
                                                    <div className="h-3 w-16 bg-border  rounded" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-5" colSpan={4}>
                                            <div className="h-4 w-full max-w-md bg-border  rounded" />
                                        </td>
                                    </tr>
                                ))
                            ) : isError ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center">
                                        <AlertCircle className="mx-auto h-9 w-9 text-danger" />
                                        <p className="mt-2 text-sm font-semibold text-danger">{t("common.error_failed")}</p>
                                    </td>
                                </tr>
                            ) : students.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-16 text-center">
                                        <User className="mx-auto mb-3 h-10 w-10 text-foreground-muted" />
                                        <p className="text-sm font-medium text-foreground-muted">{t("director.students.empty.title")}</p>
                                        <p className="mt-1 text-sm text-foreground-subtle">{t("director.students.empty.desc")}</p>
                                    </td>
                                </tr>
                            ) : (
                                students.map((s) => (
                                    <StudentItem key={s.id} student={s} onEdit={setEditing} onDelete={setDeleting} />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!isLoading && students.length > 0 && (
                    <div className="flex items-center justify-between border-t border-border-subtle px-5 py-3 ">
                        <span className="flex items-center gap-2 text-sm text-foreground-muted">
                            {isFetching && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                            {page} / {totalPages}
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={!data?.previous}
                                className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm text-foreground-muted transition hover:bg-surface-raised disabled:cursor-not-allowed disabled:opacity-40   dark:hover:bg-hover"
                            >
                                <ChevronLeft className="h-4 w-4" /> {t("common.prev")}
                            </button>
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={!data?.next}
                                className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm text-foreground-muted transition hover:bg-surface-raised disabled:cursor-not-allowed disabled:opacity-40   dark:hover:bg-hover"
                            >
                                {t("common.next")} <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            {addOpen && <StudentFormModal onClose={() => setAddOpen(false)} />}
            {editing && <StudentFormModal student={editing} onClose={() => setEditing(null)} />}
            {deleting && <DeleteStudentModal student={deleting} onClose={() => setDeleting(null)} />}
        </div>
    );
}