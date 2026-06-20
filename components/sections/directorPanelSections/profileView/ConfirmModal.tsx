"use client";

// components/profile/ConfirmModal.tsx — umumiy tasdiqlash modali
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { LucideIcon, Loader2 } from "lucide-react";

interface ConfirmModalProps {
    icon: LucideIcon;
    iconBg?: string;          // masalan "bg-red-500"
    title: string;
    desc: string;
    confirmText?: string;
    cancelText?: string;
    confirmClass?: string;    // tugma rangi
    loading?: boolean;
    onConfirm: () => void;
    onClose: () => void;
}

export default function ConfirmModal({
    icon: Icon,
    iconBg = "bg-red-500",
    title,
    desc,
    confirmText = "Tasdiqlash",
    cancelText = "Bekor qilish",
    confirmClass = "bg-red-600 hover:bg-red-700",
    loading = false,
    onConfirm,
    onClose,
}: ConfirmModalProps) {
    useEffect(() => {
        const onEsc = (e: KeyboardEvent) => e.key === "Escape" && !loading && onClose();
        document.addEventListener("keydown", onEsc);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onEsc);
            document.body.style.overflow = "";
        };
    }, [onClose, loading]);

    if (typeof document === "undefined") return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-[cfFadeIn_0.2s_ease-out]"
                onClick={() => !loading && onClose()}
            />

            {/* Modal */}
            <div className="relative w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl animate-[cfModalIn_0.25s_cubic-bezier(0.16,1,0.3,1)] overflow-hidden">
                <div className="pt-8 pb-5 px-6 text-center">
                    <div className={`w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center text-white mx-auto shadow-lg`}>
                        <Icon className="w-7 h-7" />
                    </div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white mt-4">{title}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-xs mx-auto leading-relaxed">
                        {desc}
                    </p>
                </div>

                <div className="px-6 pb-6 flex items-center gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`flex-1 h-11 rounded-xl text-white text-sm font-bold transition-colors disabled:opacity-60 flex items-center justify-center gap-2 ${confirmClass}`}
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {confirmText}
                    </button>
                </div>
            </div>

            <style jsx>{`
        @keyframes cfFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes cfModalIn {
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
        </div>,
        document.body,
    );
}