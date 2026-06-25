"use client";

import { useRef, useState, useEffect } from "react";
import { Building2, ChevronDown, Check } from "lucide-react";
import { useActiveCenters } from "@/hooks/useActiveCenters";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

export default function CenterSwitcher() {
    const { t } = useTranslation();
    const qc = useQueryClient();
    const { centers, activeCenter, activeCenterInfo, isCentersLoading: isLoading, setActiveCenter } =
        useActiveCenters();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function onOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        }
        if (open) document.addEventListener("mousedown", onOutside);
        return () => document.removeEventListener("mousedown", onOutside);
    }, [open]);

    if (isLoading) {
        return (
            <div className="h-8 w-32 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
        );
    }

    if (!activeCenterInfo) return null;

    const hasMultiple = centers.length > 1;

    const handleSelect = (id: string) => {
        setActiveCenter(id);
        setOpen(false);
        // Barcha listlarni yangilash — queryKey'da centerId bor
        qc.invalidateQueries();
    };

    if (!hasMultiple) {
        return (
            <div className="flex items-center gap-1.5 px-3 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                <Building2 className="w-3.5 h-3.5 shrink-0" />
                <span className="max-w-[140px] truncate">{activeCenterInfo.name}</span>
            </div>
        );
    }

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen((o) => !o)}
                className={`flex items-center gap-1.5 px-3 h-8 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                    open
                        ? "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300"
                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-700 dark:hover:text-indigo-300"
                }`}
            >
                <Building2 className="w-3.5 h-3.5 shrink-0" />
                <span className="max-w-[140px] truncate">{activeCenterInfo.name}</span>
                <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
                <div className="absolute left-0 top-full mt-1.5 w-64 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-900/10 dark:shadow-black/40 z-50 overflow-hidden animate-[fadeIn_0.12s_ease-out]">
                    <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            {t("center.select_label")}
                        </p>
                    </div>
                    <div className="py-1 max-h-64 overflow-y-auto">
                        {centers.map((c) => {
                            const isActive = c.id === activeCenter;
                            return (
                                <button
                                    key={c.id}
                                    onClick={() => handleSelect(c.id)}
                                    className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-sm text-left transition-colors cursor-pointer ${
                                        isActive
                                            ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold"
                                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                                    }`}
                                >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <span
                                            className={`w-2 h-2 rounded-full shrink-0 ${
                                                isActive ? "bg-indigo-500" : "bg-slate-300 dark:bg-slate-600"
                                            }`}
                                        />
                                        <span className="truncate">{c.name}</span>
                                    </div>
                                    {isActive && (
                                        <Check className="w-4 h-4 text-indigo-500 shrink-0" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-6px) scale(0.97); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </div>
    );
}
