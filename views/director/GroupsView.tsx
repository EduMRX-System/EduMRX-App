"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
    Plus, Search, Users2, ChevronLeft, ChevronRight,
    Loader2, LayoutGrid, List,
} from "lucide-react";
import GroupCard from "@/components/sections/directorPanelSections/groupsView/GroupCard";
import GroupItem from "@/components/sections/directorPanelSections/groupsView/GroupItem";
import DeleteGroupModal from "@/components/sections/directorPanelSections/groupsView/DeleteGroupModal";
import GroupFormModal from "@/components/sections/directorPanelSections/groupsView/GroupFormModal";
import { Group, parseLessonDays } from "@/types/group";
import { useGroups } from "@/hooks/useGroups";
import { useRoomCapacities } from "@/hooks/useRooms";
import { useUIStore } from "@/store/useUIStore";
import { useTranslation } from "react-i18next";

// Toq kunlar: 1(Du), 3(Ch), 5(Ju) — Juft kunlar: 2(Se), 4(Pa), 6(Sha)
// Filter mantiq: group'ning BARCHA kunlari shu toifaga tegishli bo'lsa ko'rinadi.
// Aralash jadvallar (masalan Du+Se) "Barchasi"da ko'rinadi, ikki filtrda ham yo'q.
const ODD_DAYS = new Set([1, 3, 5]);
const EVEN_DAYS = new Set([2, 4, 6]);

type DayFilter = "all" | "odd" | "even";

const PAGE_SIZE = 10;

interface Props {
    role?: "director" | "manager";
}

export default function GroupsView({ role = "director" }: Props) {
    const { t } = useTranslation();
    const { groupViewMode, setGroupViewMode } = useUIStore();

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [dayFilter, setDayFilter] = useState<DayFilter>("all");
    const [addOpen, setAddOpen] = useState(false);
    const [editing, setEditing] = useState<Group | null>(null);
    const [deleting, setDeleting] = useState<Group | null>(null);

    const { data, isLoading, isError, isFetching } = useGroups({ page, pageSize: PAGE_SIZE, search, role });
    const { data: roomCapacities } = useRoomCapacities(role);

    const rawGroups = data?.results ?? [];
    const count = data?.count ?? 0;
    const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

    const groups = dayFilter === "all"
        ? rawGroups
        : rawGroups.filter((g) => {
              const days = parseLessonDays(g.lesson_days);
              if (days.length === 0) return false;
              return dayFilter === "odd"
                  ? days.every((d) => ODD_DAYS.has(d))
                  : days.every((d) => EVEN_DAYS.has(d));
          });

    const isGrid = groupViewMode === "grid";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-foreground">{t("director.groups.title")}</h1>
                    <p className="mt-0.5 text-sm text-foreground-muted">{t("director.groups.count", { count })}</p>
                </div>
                <button
                    onClick={() => setAddOpen(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-fg shadow-sm transition hover:bg-primary-hover"
                >
                    <Plus className="h-4 w-4" />
                    {t("director.groups.add_btn")}
                </button>
            </div>

            {/* Toolbar: Search + Day filter + View toggle */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                {/* Search */}
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-subtle" />
                    <input
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        placeholder={t("director.groups.search_placeholder")}
                        className="w-full rounded-lg border border-border bg-surface py-2.5 pl-9 pr-3 text-sm text-foreground outline-none transition placeholder:text-foreground-subtle focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                </div>

                <div className="flex items-center gap-2 ml-auto">
                    {/* Day filter */}
                    <div className="flex items-center gap-0.5 rounded-lg border border-border bg-surface p-1">
                        {(["all", "odd", "even"] as DayFilter[]).map((f) => (
                            <button
                                key={f}
                                type="button"
                                onClick={() => { setDayFilter(f); setPage(1); }}
                                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all whitespace-nowrap ${
                                    dayFilter === f
                                        ? "bg-primary text-primary-fg shadow-sm"
                                        : "text-foreground-muted hover:bg-hover"
                                }`}
                            >
                                {f === "all"
                                    ? t("common.all")
                                    : f === "odd"
                                    ? t("director.groups.filter.odd_days")
                                    : t("director.groups.filter.even_days")}
                            </button>
                        ))}
                    </div>

                    {/* View toggle */}
                    <div className="flex items-center gap-0.5 rounded-lg border border-border bg-surface p-1">
                        <button
                            type="button"
                            onClick={() => setGroupViewMode("grid")}
                            className={`p-1.5 rounded-md transition-all ${
                                isGrid
                                    ? "bg-primary text-primary-fg shadow-sm"
                                    : "text-foreground-muted hover:bg-hover"
                            }`}
                            title={t("director.groups.view.grid")}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setGroupViewMode("list")}
                            className={`p-1.5 rounded-md transition-all ${
                                !isGrid
                                    ? "bg-primary text-primary-fg shadow-sm"
                                    : "text-foreground-muted hover:bg-hover"
                            }`}
                            title={t("director.groups.view.list")}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                isGrid ? <GridSkeleton /> : <ListSkeleton />
            ) : isError ? (
                <div className="flex flex-col items-center justify-center py-16 rounded-2xl border border-border bg-surface">
                    <p className="text-sm text-danger">{t("common.error_load")}</p>
                </div>
            ) : groups.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 rounded-2xl border border-border bg-surface">
                    <Users2 className="mb-3 h-10 w-10 text-foreground-muted" />
                    <p className="text-sm font-medium text-foreground-muted">{t("director.groups.empty.title")}</p>
                    <p className="mt-1 text-sm text-foreground-subtle">{t("director.groups.empty.desc")}</p>
                </div>
            ) : isGrid ? (
                /* Grid view */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {groups.map((g) => (
                        <GroupCard
                            key={g.id}
                            group={g}
                            capacity={roomCapacities?.[g.room]}
                            onEdit={setEditing}
                            onDelete={setDeleting}
                        />
                    ))}
                </div>
            ) : (
                /* List view */
                <div className="overflow-hidden rounded-2xl border border-border bg-surface">
                    <div className="divide-y divide-border-subtle dark:divide-border">
                        {groups.map((g) => (
                            <GroupItem
                                key={g.id}
                                group={g}
                                capacity={roomCapacities?.[g.room]}
                                onEdit={setEditing}
                                onDelete={setDeleting}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Pagination */}
            {!isLoading && groups.length > 0 && (
                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-foreground-muted">
                        {isFetching && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                        {page} / {totalPages}
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={!data?.previous}
                            className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm text-foreground-muted transition hover:bg-surface-raised disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-hover"
                        >
                            <ChevronLeft className="h-4 w-4" /> {t("common.prev")}
                        </button>
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={!data?.next}
                            className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm text-foreground-muted transition hover:bg-surface-raised disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-hover"
                        >
                            {t("common.next")} <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Modals */}
            <AnimatePresence>
                {addOpen && <GroupFormModal key="add" onClose={() => setAddOpen(false)} role={role} />}
                {editing && <GroupFormModal key="edit" group={editing} onClose={() => setEditing(null)} role={role} />}
                {deleting && <DeleteGroupModal key="delete" group={deleting} onClose={() => setDeleting(null)} role={role} />}
            </AnimatePresence>
        </div>
    );
}

function GridSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-surface border border-border-subtle rounded-2xl p-5 space-y-4 animate-pulse">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-hover shrink-0" />
                        <div className="flex-1 space-y-1.5">
                            <div className="h-4 bg-hover rounded w-3/4" />
                            <div className="h-3 bg-hover rounded w-1/2" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-3 bg-hover rounded w-full" />
                        <div className="h-3 bg-hover rounded w-4/5" />
                        <div className="h-3 bg-hover rounded w-2/3" />
                    </div>
                    <div className="space-y-1.5 pt-3 border-t border-border-subtle">
                        <div className="h-1.5 bg-hover rounded-full w-full" />
                        <div className="h-3 bg-hover rounded w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    );
}

function ListSkeleton() {
    return (
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
            <div className="divide-y divide-border-subtle">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 px-5 py-4 animate-pulse">
                        <div className="w-8 h-8 rounded-lg bg-hover shrink-0" />
                        <div className="flex-[2] space-y-1.5">
                            <div className="h-4 bg-hover rounded w-2/3" />
                            <div className="h-3 bg-hover rounded w-1/3" />
                        </div>
                        <div className="flex-1 hidden sm:block">
                            <div className="h-3 bg-hover rounded w-3/4" />
                        </div>
                        <div className="flex-1 hidden md:block space-y-1.5">
                            <div className="h-3 bg-hover rounded w-1/2" />
                            <div className="h-3 bg-hover rounded w-2/3" />
                        </div>
                        <div className="w-36 hidden lg:block space-y-1.5">
                            <div className="h-1.5 bg-hover rounded-full" />
                            <div className="h-3 bg-hover rounded w-1/2" />
                        </div>
                        <div className="w-20 hidden sm:block">
                            <div className="h-6 bg-hover rounded-full" />
                        </div>
                        <div className="flex gap-1 shrink-0">
                            <div className="w-7 h-7 bg-hover rounded-lg" />
                            <div className="w-7 h-7 bg-hover rounded-lg" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
