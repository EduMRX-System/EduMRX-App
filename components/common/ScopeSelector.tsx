"use client";

import { useRef, useState, useEffect } from "react";
import { Building2, MapPin, ChevronDown, Check } from "lucide-react";
import { useActiveScope } from "@/hooks/useActiveScope";
import { useTranslation } from "react-i18next";

// ─── Generic dropdown ─────────────────────────────────────
function ScopeDropdown({
    label,
    icon: Icon,
    value,
    options,
    onSelect,
    loading,
    disabled,
}: {
    label: string;
    icon: React.ElementType;
    value: string;
    options: { id: string; name: string }[];
    onSelect: (id: string) => void;
    loading?: boolean;
    disabled?: boolean;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function onOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        }
        if (open) document.addEventListener("mousedown", onOutside);
        return () => document.removeEventListener("mousedown", onOutside);
    }, [open]);

    if (loading) {
        return <div className="h-8 w-28 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />;
    }

    const selected = options.find((o) => o.id === value);

    if (disabled || options.length <= 1) {
        return (
            <div className="flex items-center gap-1.5 px-2.5 h-8 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <Icon className="w-3.5 h-3.5 shrink-0 text-indigo-500" />
                <span className="max-w-[120px] truncate">{selected?.name ?? label}</span>
            </div>
        );
    }

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen((o) => !o)}
                className={`flex items-center gap-1.5 px-2.5 h-8 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                    open
                        ? "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300"
                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-700 dark:hover:text-indigo-300"
                }`}
            >
                <Icon className="w-3.5 h-3.5 shrink-0 text-indigo-500" />
                <span className="max-w-[120px] truncate">{selected?.name ?? label}</span>
                <ChevronDown
                    className={`w-3 h-3 shrink-0 transition-transform text-slate-400 ${open ? "rotate-180" : ""}`}
                />
            </button>

            {open && (
                <div className="absolute left-0 top-full mt-1.5 min-w-[180px] w-max max-w-[240px] rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 overflow-hidden">
                    <div className="py-1 max-h-60 overflow-y-auto">
                        {options.map((opt) => {
                            const isActive = opt.id === value;
                            return (
                                <button
                                    key={opt.id}
                                    onClick={() => { onSelect(opt.id); setOpen(false); }}
                                    className={`w-full flex items-center justify-between gap-3 px-3.5 py-2 text-sm text-left transition-colors cursor-pointer ${
                                        isActive
                                            ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold"
                                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                                    }`}
                                >
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? "bg-indigo-500" : "bg-slate-300 dark:bg-slate-600"}`} />
                                        <span className="truncate">{opt.name}</span>
                                    </div>
                                    {isActive && <Check className="w-3.5 h-3.5 text-indigo-500 shrink-0" />}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Main: 2 ta selector yonma-yon ───────────────────────
export default function ScopeSelector() {
    const { t } = useTranslation();
    const {
        centers, activeCenter, isCentersLoading, setActiveCenter,
        branches, activeBranch, isBranchesLoading, setActiveBranch,
    } = useActiveScope();

    if (isCentersLoading && !activeCenter) {
        return (
            <div className="flex items-center gap-1.5">
                <div className="h-8 w-28 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
                <div className="h-8 w-24 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
            </div>
        );
    }

    if (!activeCenter) return null;

    const centerOptions = centers.map((c) => ({ id: c.id, name: c.name }));
    const branchOptions = branches.map((b) => ({ id: b.id, name: b.name }));

    return (
        <div className="flex items-center gap-1.5">
            {/* Center */}
            <ScopeDropdown
                label={t("center.select_label")}
                icon={Building2}
                value={activeCenter}
                options={centerOptions}
                onSelect={setActiveCenter}
                loading={isCentersLoading}
                disabled={centers.length <= 1}
            />

            {/* Branch */}
            {(activeBranch || isBranchesLoading) && (
                <>
                    <span className="text-slate-300 dark:text-slate-600 text-xs">›</span>
                    <ScopeDropdown
                        label={t("branch.select_label")}
                        icon={MapPin}
                        value={activeBranch ?? ""}
                        options={branchOptions}
                        onSelect={setActiveBranch}
                        loading={isBranchesLoading && branches.length === 0}
                        disabled={branchOptions.length <= 1}
                    />
                </>
            )}
        </div>
    );
}
