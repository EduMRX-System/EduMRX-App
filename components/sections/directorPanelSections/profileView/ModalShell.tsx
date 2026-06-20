"use client";

// components/profile/ModalShell.tsx — umumiy modal qobig'i
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export default function ModalShell({
    icon,
    iconBg,
    title,
    desc,
    children,
    footer,
    onClose,
}: {
    icon: React.ReactNode;
    iconBg: string;
    title: string;
    desc: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    onClose: () => void;
}) {
    useEffect(() => {
        const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onEsc);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onEsc);
            document.body.style.overflow = "";
        };
    }, [onClose]);

    if (typeof document === "undefined") return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl animate-[modalIn_0.25s_cubic-bezier(0.16,1,0.3,1)] overflow-hidden">
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-10"
                    aria-label="Close"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="pt-8 pb-5 px-6 text-center">
                    <div className={`w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center text-white mx-auto shadow-lg`}>
                        {icon}
                    </div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white mt-4">{title}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-xs mx-auto">{desc}</p>
                </div>

                {/* Body */}
                <div className="px-6 pb-2">{children}</div>

                {/* Footer */}
                {footer && (
                    <div className="px-6 py-5 flex items-center justify-end gap-3">{footer}</div>
                )}
            </div>

            <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
        </div>,
        document.body,
    );
}