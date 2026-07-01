"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
    Plus, Search, Building2, ChevronLeft, ChevronRight, Loader2,
} from "lucide-react";
import { useBranches } from "@/hooks/useBranches";
import type { Branch } from "@/types/branch";
import BranchFormModal from "@/components/sections/directorPanelSections/branchesView/BranchFormModal";
import DeleteBranchModal from "@/components/sections/directorPanelSections/branchesView/DeleteBranchModal";
import BranchItem from "@/components/sections/directorPanelSections/branchesView/BranchItem";
import { useTranslation } from "react-i18next";

const PAGE_SIZE = 10;

export default function BranchesView() {
    const { t } = useTranslation();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [addOpen, setAddOpen] = useState(false);
    const [editing, setEditing] = useState<Branch | null>(null);
    const [deleting, setDeleting] = useState<Branch | null>(null);

    const { data, isLoading, isError, isFetching } = useBranches({
        page,
        pageSize: PAGE_SIZE,
        search,
    });

    const branches = data?.data ?? [];
    const count = data?.count ?? 0;
    const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-foreground">{t("director.branches.title")}</h1>
                    <p className="mt-0.5 text-sm text-foreground-muted">{t("director.branches.count", { count })}</p>
                </div>
                <button
                    onClick={() => setAddOpen(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-fg shadow-sm transition hover:bg-primary-hover"
                >
                    <Plus className="h-4 w-4" />
                    {t("director.branches.add_btn")}
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-subtle" />
                <input
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    placeholder={t("director.branches.search_placeholder")}
                    className="w-full rounded-lg border border-border bg-surface py-2.5 pl-9 pr-3 text-sm text-foreground outline-none transition placeholder:text-foreground-subtle focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-2xl border border-border bg-surface  ">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-border text-xs uppercase tracking-wide text-foreground-muted  ">
                                <th className="px-5 py-3 font-medium">{t("director.branches.table.name")}</th>
                                <th className="px-5 py-3 font-medium">{t("director.branches.table.status")}</th>
                                <th className="px-5 py-3 font-medium">{t("director.branches.table.phone")}</th>
                                <th className="px-5 py-3 font-medium">{t("director.branches.table.address")}</th>
                                <th className="px-5 py-3 text-right font-medium">{t("director.branches.table.actions")}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-subtle dark:divide-border">
                            {isLoading ? (
                                <SkeletonRows />
                            ) : isError ? (
                                <tr>
                                    <td colSpan={5} className="px-5 py-12 text-center text-sm text-danger">
                                        {t("common.error_load")}
                                    </td>
                                </tr>
                            ) : branches.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-5 py-16 text-center">
                                        <Building2 className="mx-auto mb-3 h-10 w-10 text-foreground-muted" />
                                        <p className="text-sm font-medium text-foreground-muted">{t("director.branches.empty.title")}</p>
                                        <p className="mt-1 text-sm text-foreground-subtle">{t("director.branches.empty.desc")}</p>
                                    </td>
                                </tr>
                            ) : (
                                branches.map((b) => (
                                    <BranchItem
                                        key={b.id}
                                        branch={b}
                                        onEdit={setEditing}
                                        onDelete={setDeleting}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!isLoading && branches.length > 0 && (
                    <div className="flex items-center justify-between border-t border-border px-5 py-3 ">
                        <span className="flex items-center gap-2 text-sm text-foreground-muted">
                            {isFetching && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                            {page} / {totalPages}
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page <= 1}
                                className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm text-foreground-muted transition hover:bg-surface-raised disabled:cursor-not-allowed disabled:opacity-40   dark:hover:bg-hover"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                {t("common.prev")}
                            </button>
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page >= totalPages}
                                className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm text-foreground-muted transition hover:bg-surface-raised disabled:cursor-not-allowed disabled:opacity-40   dark:hover:bg-hover"
                            >
                                {t("common.next")}
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            <AnimatePresence>
                {addOpen && <BranchFormModal key="add" onClose={() => setAddOpen(false)} />}
                {editing && <BranchFormModal key="edit" branch={editing} onClose={() => setEditing(null)} />}
                {deleting && <DeleteBranchModal key="delete" branch={deleting} onClose={() => setDeleting(null)} />}
            </AnimatePresence>
        </div>
    );
}

function SkeletonRows() {
    return (
        <>
            {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                    <td colSpan={5} className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 animate-pulse rounded-lg bg-hover " />
                            <div className="h-4 flex-1 animate-pulse rounded bg-hover " />
                        </div>
                    </td>
                </tr>
            ))}
        </>
    );
}