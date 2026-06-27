"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Check, ChevronDown, Loader2, MapPin, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { API } from "@/services/api";

interface BranchOption {
    id: string;
    name: string;
}

interface Page {
    items: BranchOption[];
    nextPage: number | undefined;
}

const PAGE_SIZE = 20;

async function fetchBranchPage(centerId: string, search: string, page: number): Promise<Page> {
    const res = await API.get("center/branches/", {
        params: {
            center_id: centerId,
            search: search || undefined,
            page,
            page_size: PAGE_SIZE,
        },
    });
    const d = res.data;
    const list: any[] = Array.isArray(d) ? d : d?.results ?? d?.data ?? [];
    const count: number = d?.count ?? list.length;
    return {
        items: list.map((b: any) => ({ id: String(b.id), name: String(b.name ?? "") })),
        nextPage: page * PAGE_SIZE < count ? page + 1 : undefined,
    };
}

interface Props {
    centerId: string | null | undefined;
    value: string;
    onChange: (id: string) => void;
    label?: string;
    required?: boolean;
    error?: string;
}

export default function AsyncBranchSelect({ centerId, value, onChange, label, required, error }: Props) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [selectedLabel, setSelectedLabel] = useState("");

    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 350);
        return () => clearTimeout(timer);
    }, [search]);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Auto-focus search when dropdown opens
    useEffect(() => {
        if (open) {
            const timer = setTimeout(() => searchRef.current?.focus(), 50);
            return () => clearTimeout(timer);
        }
    }, [open]);

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
        useInfiniteQuery<Page>({
            queryKey: ["async-branches", centerId, debouncedSearch],
            queryFn: ({ pageParam }) =>
                fetchBranchPage(centerId!, debouncedSearch, (pageParam as number) ?? 1),
            initialPageParam: 1,
            getNextPageParam: (last) => last.nextPage,
            enabled: !!centerId,
            staleTime: 5 * 60 * 1000,
        });

    const allItems: BranchOption[] = data?.pages.flatMap((p) => p.items) ?? [];

    // Resolve selected label from loaded items
    useEffect(() => {
        if (!value) {
            setSelectedLabel("");
            return;
        }
        const found = allItems.find((i) => i.id === value);
        if (found) setSelectedLabel(found.name);
    }, [value, allItems]);

    // Infinite scroll: fetch next page when near bottom
    const handleScroll = useCallback(() => {
        const el = listRef.current;
        if (!el || !hasNextPage || isFetchingNextPage) return;
        if (el.scrollHeight - el.scrollTop - el.clientHeight < 60) fetchNextPage();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const displayLabel = label ?? t("branch.label");

    const triggerCls = [
        "border rounded-lg w-full h-[40px] px-3 text-[14px] flex items-center justify-between cursor-pointer bg-surface transition-colors",
        error
            ? "border-red-300 dark:border-red-800"
            : open
            ? "border-indigo-400 dark:border-indigo-600 ring-2 ring-indigo-100 dark:ring-indigo-900/20"
            : "border-border",
        value && selectedLabel
            ? "text-foreground"
            : "text-foreground-subtle",
    ].join(" ");

    return (
        <div ref={containerRef} className="relative">
            <label className="text-[14px] text-foreground-muted mb-1 block font-semibold">
                <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    {displayLabel} {required && "*"}
                </span>
            </label>

            {!centerId ? (
                <div className="flex items-center gap-2 px-3 h-[40px] rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-sm text-amber-700 dark:text-amber-400">
                    {t("branch.no_center")}
                </div>
            ) : (
                <div role="combobox" aria-expanded={open} onClick={() => setOpen((v) => !v)} className={triggerCls}>
                    <span className="truncate">
                        {value && selectedLabel
                            ? selectedLabel
                            : isLoading
                            ? `${t("common.loading")}...`
                            : t("branch.select_label")}
                    </span>
                    {isLoading && !open ? (
                        <Loader2 className="w-4 h-4 text-foreground-subtle shrink-0 animate-spin" />
                    ) : (
                        <ChevronDown
                            className={`w-4 h-4 text-foreground-subtle shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
                        />
                    )}
                </div>
            )}

            {open && centerId && (
                <div className="absolute left-0 right-0 mt-1 bg-surface border border-border rounded-lg shadow-xl z-50 overflow-hidden flex flex-col">
                    {/* Search */}
                    <div className="relative p-2 border-b border-border-subtle/60">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground-subtle pointer-events-none" />
                        <input
                            ref={searchRef}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={t("branch.search_placeholder")}
                            className="w-full h-8 pl-7 pr-2 text-[13px] rounded-md bg-slate-50 /50 border border-transparent outline-none focus:border-indigo-400 text-foreground placeholder:text-foreground-subtle dark:placeholder:text-foreground-muted"
                        />
                    </div>

                    {/* List */}
                    <div ref={listRef} className="max-h-52 overflow-y-auto py-1" onScroll={handleScroll}>
                        {isLoading ? (
                            <div className="flex items-center justify-center py-4 text-foreground-subtle">
                                <Loader2 className="w-4 h-4 animate-spin" />
                            </div>
                        ) : isError ? (
                            <div className="px-3 py-4 text-xs text-center text-red-400">
                                {t("branch.load_error")}
                            </div>
                        ) : allItems.length === 0 ? (
                            <div className="px-3 py-4 text-xs text-center text-foreground-subtle">
                                {t("branch.not_found")}
                            </div>
                        ) : (
                            <>
                                {allItems.map((item) => {
                                    const isSel = item.id === value;
                                    return (
                                        <div
                                            key={item.id}
                                            onClick={() => {
                                                onChange(item.id);
                                                setSelectedLabel(item.name);
                                                setOpen(false);
                                                setSearch("");
                                            }}
                                            className={`px-3 py-2 text-[13px] cursor-pointer flex items-center justify-between transition-colors ${
                                                isSel
                                                    ? "bg-primary-soft text-primary font-medium"
                                                    : "text-foreground hover:bg-hover"
                                            }`}
                                        >
                                            <span className="truncate">{item.name}</span>
                                            {isSel && <Check className="w-4 h-4 shrink-0" />}
                                        </div>
                                    );
                                })}
                                {isFetchingNextPage && (
                                    <div className="flex items-center justify-center py-2 text-foreground-subtle">
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}

            {error && <p className="text-red-400 dark:text-danger text-[11px] mt-1">{error}</p>}
        </div>
    );
}
