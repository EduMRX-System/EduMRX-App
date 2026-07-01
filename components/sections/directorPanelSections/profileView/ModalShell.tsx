"use client";

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
    closeOnBackdropClick = false,
}: {
    icon: React.ReactNode;
    iconBg: string;
    title: string;
    desc: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    onClose: () => void;
    closeOnBackdropClick?: boolean;
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
        <div className="fixed inset-0 z-[100] overflow-y-auto overscroll-contain">
            {/* Backdrop — fixed, doesn't scroll with overlay */}
            <div
                className="fixed inset-0 bg-overlay backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
                onClick={closeOnBackdropClick ? onClose : undefined}
            />

            {/* Centering wrapper — scrollable when keyboard opens */}
            <div className="flex min-h-full items-end sm:items-center justify-center p-0 sm:p-4">

                {/* Modal panel */}
                <div className="relative w-full sm:max-w-md max-h-[92dvh] sm:max-h-[90dvh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-surface border border-border shadow-2xl animate-[modalIn_0.25s_cubic-bezier(0.16,1,0.3,1)]">
                    {/* Close */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-foreground-subtle hover:text-foreground hover:bg-hover transition-colors z-10"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Header */}
                    <div className="pt-8 pb-5 px-6 text-center">
                        <div className={`w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center text-white mx-auto shadow-lg`}>
                            {icon}
                        </div>
                        <h2 className="text-xl font-black text-foreground mt-4">{title}</h2>
                        <p className="text-sm text-foreground-muted mt-1.5 max-w-xs mx-auto">{desc}</p>
                    </div>

                    {/* Body */}
                    <div className="px-6 pb-2">{children}</div>

                    {/* Footer */}
                    {footer && (
                        <div className="px-6 py-5 flex items-center justify-end gap-3">{footer}</div>
                    )}
                </div>

            </div>

            <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
        </div>,
        document.body,
    );
}
