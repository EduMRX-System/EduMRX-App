"use client";

import { useState } from "react";
import { Plus, Search, DoorOpen, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Room } from "@/types/room";
import { useRooms } from "@/hooks/useRooms";
import RoomRow from "@/components/sections/directorPanelSections/RoomsView/RoomRow";
import RoomFormModal from "@/components/sections/directorPanelSections/RoomsView/RoomFormModal";
import DeleteRoomModal from "@/components/sections/directorPanelSections/RoomsView/DeleteRoomModal";
import { useTranslation } from "react-i18next";


const PAGE_SIZE = 10;

export default function RoomsView() {
    const { t } = useTranslation();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [addOpen, setAddOpen] = useState(false);
    const [editing, setEditing] = useState<Room | null>(null);
    const [deleting, setDeleting] = useState<Room | null>(null);

    const { data, isLoading, isError, isFetching } = useRooms({ page, pageSize: PAGE_SIZE, search });
    const rooms = data?.results ?? [];
    const count = data?.count ?? 0;
    const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-foreground">{t("director.rooms.title")}</h1>
                    <p className="mt-0.5 text-sm text-foreground-muted">{t("director.rooms.count", { count })}</p>
                </div>
                <button
                    onClick={() => setAddOpen(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-fg shadow-sm transition hover:bg-primary-hover"
                >
                    <Plus className="h-4 w-4" /> {t("director.rooms.add_btn")}
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-subtle" />
                <input
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    placeholder={t("director.rooms.search_placeholder")}
                    className="w-full rounded-lg border border-border bg-surface py-2.5 pl-9 pr-3 text-sm text-foreground outline-none transition placeholder:text-foreground-subtle focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20   "
                />
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-2xl border border-border bg-surface  ">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-border text-xs uppercase tracking-wide text-foreground-muted  ">
                                <th className="px-5 py-3 font-medium">{t("director.rooms.table.name")}</th>
                                <th className="px-5 py-3 font-medium">{t("director.rooms.table.capacity")}</th>
                                <th className="px-5 py-3 text-right font-medium">{t("director.rooms.table.actions")}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}>
                                        <td colSpan={3} className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 animate-pulse rounded-lg bg-hover " />
                                                <div className="h-4 flex-1 animate-pulse rounded bg-hover " />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : isError ? (
                                <tr><td colSpan={3} className="px-5 py-12 text-center text-sm text-danger">{t("common.error_load")}</td></tr>
                            ) : rooms.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-5 py-16 text-center">
                                        <DoorOpen className="mx-auto mb-3 h-10 w-10 text-slate-300 dark:text-foreground-muted" />
                                        <p className="text-sm font-medium text-foreground-muted">{t("director.rooms.empty.title")}</p>
                                        <p className="mt-1 text-sm text-foreground-subtle">{t("director.rooms.empty.desc")}</p>
                                    </td>
                                </tr>
                            ) : (
                                rooms.map((r) => (
                                    <RoomRow key={r.id} room={r} onEdit={setEditing} onDelete={setDeleting} />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!isLoading && rooms.length > 0 && (
                    <div className="flex items-center justify-between border-t border-border px-5 py-3 ">
                        <span className="flex items-center gap-2 text-sm text-foreground-muted">
                            {isFetching && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                            {page} / {totalPages}
                        </span>
                        <div className="flex gap-2">
                            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={!data?.previous} className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm text-foreground-muted transition hover:bg-surface-raised disabled:cursor-not-allowed disabled:opacity-40   dark:hover:bg-slate-800">
                                <ChevronLeft className="h-4 w-4" /> {t("common.prev")}
                            </button>
                            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={!data?.next} className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm text-foreground-muted transition hover:bg-surface-raised disabled:cursor-not-allowed disabled:opacity-40   dark:hover:bg-slate-800">
                                {t("common.next")} <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            {addOpen && <RoomFormModal onClose={() => setAddOpen(false)} />}
            {editing && <RoomFormModal room={editing} onClose={() => setEditing(null)} />}
            {deleting && <DeleteRoomModal room={deleting} onClose={() => setDeleting(null)} />}
        </div>
    );
}