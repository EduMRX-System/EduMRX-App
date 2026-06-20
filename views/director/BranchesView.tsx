"use client";

import { useState } from "react";
import {
    Plus, Search, Building2, ChevronLeft, ChevronRight, Loader2,
} from "lucide-react";
import { useBranches } from "@/hooks/useBranches";
import type { Branch } from "@/types/branch";
import BranchFormModal from "@/components/sections/directorPanelSections/branchesView/BranchFormModal";
import DeleteBranchModal from "@/components/sections/directorPanelSections/branchesView/DeleteBranchModal";
import BranchItem from "@/components/sections/directorPanelSections/branchesView/BranchItem";

const PAGE_SIZE = 10;

export default function BranchesView() {
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
                    <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Filiallar</h1>
                    <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{count} ta filial</p>
                </div>
                <button
                    onClick={() => setAddOpen(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                >
                    <Plus className="h-4 w-4" />
                    Yangi filial
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    placeholder="Filial qidirish..."
                    className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:text-slate-400">
                                <th className="px-5 py-3 font-medium">Filial</th>
                                <th className="px-5 py-3 font-medium">Holati</th>
                                <th className="px-5 py-3 font-medium">Telefon</th>
                                <th className="px-5 py-3 font-medium">Manzil</th>
                                <th className="px-5 py-3 text-right font-medium">Amallar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {isLoading ? (
                                <SkeletonRows />
                            ) : isError ? (
                                <tr>
                                    <td colSpan={5} className="px-5 py-12 text-center text-sm text-rose-500">
                                        Ma'lumotlarni yuklashda xatolik yuz berdi.
                                    </td>
                                </tr>
                            ) : branches.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-5 py-16 text-center">
                                        <Building2 className="mx-auto mb-3 h-10 w-10 text-slate-300 dark:text-slate-600" />
                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Filial topilmadi</p>
                                        <p className="mt-1 text-sm text-slate-400">Yangi filial qo'shib boshlang</p>
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
                    <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3 dark:border-slate-800">
                        <span className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                            {isFetching && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                            {page} / {totalPages}
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page <= 1}
                                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Oldingi
                            </button>
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page >= totalPages}
                                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                                Keyingi
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            {addOpen && <BranchFormModal onClose={() => setAddOpen(false)} />}
            {editing && <BranchFormModal branch={editing} onClose={() => setEditing(null)} />}
            {deleting && <DeleteBranchModal branch={deleting} onClose={() => setDeleting(null)} />}
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
                            <div className="h-9 w-9 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
                            <div className="h-4 flex-1 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
                        </div>
                    </td>
                </tr>
            ))}
        </>
    );
}