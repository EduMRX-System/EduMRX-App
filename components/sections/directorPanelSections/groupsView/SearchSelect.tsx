"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check, Search, Loader2 } from "lucide-react";
import type { Option } from "@/hooks/useGroups";

interface Props {
    label: string;
    value: string;
    options: Option[];
    loading?: boolean;
    placeholder?: string;
    required?: boolean;
    error?: string;
    onChange: (id: string) => void;
}

export default function SearchSelect({
    label,
    value,
    options,
    loading,
    placeholder = "Tanlang...",
    required,
    error,
    onChange,
}: Props) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, []);

    const selected = options.find((o) => o.id === value);
    const filtered = query
        ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
        : options;

    return (
        <div ref={ref} className="relative">
            <label className="text-[14px] text-slate-600 dark:text-slate-300 mb-1 block font-semibold">
                {label} {required && "*"}
            </label>

            <div
                onClick={() => setOpen((v) => !v)}
                className={`border rounded-lg w-full h-[40px] px-3 text-[14px] flex items-center justify-between cursor-pointer bg-white dark:bg-slate-800 transition-colors ${error ? "border-red-300 dark:border-red-800" : "border-slate-200 dark:border-slate-700"
                    } ${selected ? "text-slate-900 dark:text-slate-100" : "text-slate-400 dark:text-slate-500"}`}
            >
                <span className="truncate">{selected ? selected.label : placeholder}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
            </div>

            {open && (
                <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden flex flex-col">
                    <div className="relative p-2 border-b border-slate-100 dark:border-slate-700/60">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input
                            autoFocus
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Qidirish..."
                            className="w-full h-8 pl-7 pr-2 text-[13px] rounded-md bg-slate-50 dark:bg-slate-900/50 border border-transparent outline-none focus:border-indigo-400 text-slate-900 dark:text-slate-100"
                        />
                    </div>

                    <div className="max-h-52 overflow-y-auto py-1">
                        {loading ? (
                            <div className="flex items-center justify-center py-4 text-slate-400">
                                <Loader2 className="w-4 h-4 animate-spin" />
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="px-3 py-4 text-xs text-center text-slate-400">Topilmadi</div>
                        ) : (
                            filtered.map((o) => {
                                const isSel = o.id === value;
                                return (
                                    <div
                                        key={o.id}
                                        onClick={() => { onChange(o.id); setOpen(false); setQuery(""); }}
                                        className={`px-3 py-2 text-[13px] cursor-pointer flex items-center justify-between transition-colors ${isSel
                                            ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-medium"
                                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60"
                                            }`}
                                    >
                                        <span className="truncate">{o.label}</span>
                                        {isSel && <Check className="w-4 h-4 shrink-0" />}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}

            {error && <p className="text-red-400 dark:text-red-500 text-[11px] mt-1">{error}</p>}
        </div>
    );
}