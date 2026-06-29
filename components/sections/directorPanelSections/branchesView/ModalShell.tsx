"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface Props {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}

export default function ModalShell({
  title,
  subtitle,
  onClose,
  children,
  maxWidth = "max-w-lg",
}: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto overscroll-contain">
      {/* Backdrop — fixed so it doesn't scroll with content */}
      <div
        className="fixed inset-0 bg-overlay backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Centering wrapper — min-h-full keeps it scrollable when keyboard opens */}
      <div className="flex min-h-full items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className={`relative z-10 w-full ${maxWidth} max-h-[85dvh] sm:max-h-[90dvh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-surface p-6 shadow-2xl`}
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-0.5 text-sm text-foreground-muted">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-foreground-subtle transition hover:bg-hover hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
      </div>
    </div>
  );
}