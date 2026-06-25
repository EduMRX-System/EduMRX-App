"use client";

import { Building2, Users, Wallet, CheckCircle2, Circle } from "lucide-react";
import { useActiveCenters } from "@/hooks/useActiveCenters";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import type { CenterInfo } from "@/store/activeCenterStore";

function formatRevenue(amount?: number): string {
    if (amount == null) return "—";
    if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)} mln`;
    if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)} ming`;
    return String(amount);
}

function CenterCard({
    center,
    isActive,
    onSelect,
}: {
    center: CenterInfo;
    isActive: boolean;
    onSelect: () => void;
}) {
    const { t } = useTranslation();

    return (
        <div
            className={`relative rounded-2xl border transition-all duration-200 p-5 flex flex-col gap-4 ${
                isActive
                    ? "border-indigo-300 dark:border-indigo-700 bg-indigo-50/60 dark:bg-indigo-950/20 shadow-md shadow-indigo-100 dark:shadow-indigo-950/30"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md hover:shadow-slate-100 dark:hover:shadow-slate-950/30"
            }`}
        >
            {/* Active badge */}
            {isActive && (
                <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold">
                    <CheckCircle2 className="w-3 h-3" />
                    {t("center.active")}
                </span>
            )}

            {/* Icon + Name */}
            <div className="flex items-start gap-3">
                <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                        isActive
                            ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                    }`}
                >
                    <Building2 className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base leading-tight truncate pr-16">
                        {center.name || "—"}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1">
                        {center.is_active !== false ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                            <Circle className="w-3.5 h-3.5 text-slate-400" />
                        )}
                        <span
                            className={`text-xs font-medium ${
                                center.is_active !== false
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : "text-slate-400"
                            }`}
                        >
                            {center.is_active !== false ? t("common.active") : t("common.inactive")}
                        </span>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 px-4 py-3">
                    <div className="flex items-center gap-2 mb-1">
                        <Users className="w-3.5 h-3.5 text-indigo-500" />
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                            {t("center.students_count")}
                        </span>
                    </div>
                    <p className="text-lg font-black text-slate-900 dark:text-slate-100">
                        {center.students_count ?? "—"}
                    </p>
                </div>
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 px-4 py-3">
                    <div className="flex items-center gap-2 mb-1">
                        <Wallet className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                            {t("center.revenue")}
                        </span>
                    </div>
                    <p className="text-lg font-black text-slate-900 dark:text-slate-100">
                        {formatRevenue(center.revenue)}
                    </p>
                </div>
            </div>

            {/* Select button */}
            {!isActive && (
                <button
                    onClick={onSelect}
                    className="w-full h-9 rounded-lg border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-sm font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors cursor-pointer"
                >
                    {t("center.select")}
                </button>
            )}
        </div>
    );
}

export default function MyCentersView() {
    const { t } = useTranslation();
    const qc = useQueryClient();
    const { centers, activeCenter, isCentersLoading: isLoading, setActiveCenter } = useActiveCenters();

    const handleSelect = (id: string) => {
        setActiveCenter(id);
        qc.invalidateQueries();
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Page header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <Building2 className="w-5 h-5" />
                    </div>
                    <h1 className="text-xl font-black text-slate-900 dark:text-slate-100">
                        {t("center.my_centers")}
                    </h1>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 ml-12">
                    {t("center.my_centers_desc")}
                </p>
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[1, 2].map((i) => (
                        <div
                            key={i}
                            className="h-52 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse"
                        />
                    ))}
                </div>
            )}

            {/* Empty */}
            {!isLoading && centers.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                        <Building2 className="w-7 h-7 text-slate-400" />
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                        {t("center.no_centers")}
                    </p>
                </div>
            )}

            {/* Centers grid */}
            {!isLoading && centers.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {centers.map((c) => (
                        <CenterCard
                            key={c.id}
                            center={c}
                            isActive={c.id === activeCenter}
                            onSelect={() => handleSelect(c.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
