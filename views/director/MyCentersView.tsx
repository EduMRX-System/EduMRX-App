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
                    ? "border-primary/40  bg-primary-soft  shadow-md  "
                    : "border-border bg-surface hover:border-border-subtle hover:shadow-sm"
            }`}
        >
            {/* Active badge */}
            {isActive && (
                <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-soft dark: text-primary  text-[11px] font-bold">
                    <CheckCircle2 className="w-3 h-3" />
                    {t("center.active")}
                </span>
            )}

            {/* Icon + Name */}
            <div className="flex items-start gap-3">
                <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                        isActive
                            ? "bg-primary-soft dark: text-primary"
                            : "bg-hover  text-foreground-muted"
                    }`}
                >
                    <Building2 className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                    <h3 className="font-bold text-foreground text-base leading-tight truncate pr-16">
                        {center.name || "—"}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1">
                        {center.is_active !== false ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                        ) : (
                            <Circle className="w-3.5 h-3.5 text-foreground-subtle" />
                        )}
                        <span
                            className={`text-xs font-medium ${
                                center.is_active !== false
                                    ? "text-success"
                                    : "text-foreground-subtle"
                            }`}
                        >
                            {center.is_active !== false ? t("common.active") : t("common.inactive")}
                        </span>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-surface-raised /60 px-4 py-3">
                    <div className="flex items-center gap-2 mb-1">
                        <Users className="w-3.5 h-3.5 text-primary" />
                        <span className="text-[11px] text-foreground-muted font-medium">
                            {t("center.students_count")}
                        </span>
                    </div>
                    <p className="text-lg font-black text-foreground">
                        {center.students_count ?? "—"}
                    </p>
                </div>
                <div className="rounded-xl bg-surface-raised /60 px-4 py-3">
                    <div className="flex items-center gap-2 mb-1">
                        <Wallet className="w-3.5 h-3.5 text-success" />
                        <span className="text-[11px] text-foreground-muted font-medium">
                            {t("center.revenue")}
                        </span>
                    </div>
                    <p className="text-lg font-black text-foreground">
                        {formatRevenue(center.revenue)}
                    </p>
                </div>
            </div>

            {/* Select button */}
            {!isActive && (
                <button
                    onClick={onSelect}
                    className="w-full h-9 rounded-lg border border-primary/30 text-primary text-sm font-semibold hover:bg-primary-soft  transition-colors cursor-pointer"
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
                    <div className="w-9 h-9 rounded-xl bg-primary-soft  flex items-center justify-center text-primary">
                        <Building2 className="w-5 h-5" />
                    </div>
                    <h1 className="text-xl font-black text-foreground">
                        {t("center.my_centers")}
                    </h1>
                </div>
                <p className="text-sm text-foreground-muted ml-12">
                    {t("center.my_centers_desc")}
                </p>
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[1, 2].map((i) => (
                        <div
                            key={i}
                            className="h-52 rounded-2xl bg-hover  animate-pulse"
                        />
                    ))}
                </div>
            )}

            {/* Empty */}
            {!isLoading && centers.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-hover  flex items-center justify-center mb-4">
                        <Building2 className="w-7 h-7 text-foreground-subtle" />
                    </div>
                    <p className="text-foreground-muted text-sm">
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
