"use client";

import { Check, X } from "lucide-react";
import type { AttendanceStatus, ViewMode, AttendanceMark } from "@/types/attendance";

interface Props {
  mark: AttendanceMark | undefined;
  mode: ViewMode;
  onClick: () => void;
  /** true = kelajak dars yoki dars mavjud emas → bosilmaydi */
  disabled?: boolean;
}

const CIRCLE = "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-150 select-none";

export default function AttendanceCell({ mark, mode, onClick, disabled }: Props) {
  // ── Disabled (future / no-lesson) ────────────────────────────────
  if (disabled) {
    return (
      <div
        className={`${CIRCLE} bg-hover/70 cursor-not-allowed`}
        aria-hidden
      />
    );
  }

  // ── Homework mode ─────────────────────────────────────────────────
  if (mode === "homework") {
    const pct = mark?.homework_percent;

    if (pct == null) {
      return (
        <button
          onClick={onClick}
          title="Belgilanmagan — bosing"
          className={`${CIRCLE} border-2 border-dashed border-border hover:border-primary/40 hover:bg-primary-soft/40 cursor-pointer hover:scale-110 active:scale-95`}
        />
      );
    }

    const color =
      pct >= 90 ? "bg-success-bg border border-success/20 text-success"
      : pct >= 80 ? "bg-warning-bg border border-warning/20 text-warning"
      : "bg-danger-bg dark:bg-danger/10 border border-danger/20 dark:border-danger/25 text-danger";

    return (
      <button
        onClick={onClick}
        title={`${pct}%`}
        className={`${CIRCLE} ${color} text-[11px] font-bold cursor-pointer hover:scale-110 active:scale-95`}
      >
        {pct}
      </button>
    );
  }

  // ── Attendance mode ───────────────────────────────────────────────
  const status: AttendanceStatus = mark?.status ?? null;

  if (status === null) {
    return (
      <button
        onClick={onClick}
        title="Belgilanmagan — bosing"
        className={`${CIRCLE} border-2 border-dashed border-border hover:border-primary/40 hover:bg-primary-soft/40 cursor-pointer hover:scale-110 active:scale-95`}
      />
    );
  }

  if (status === "present") {
    return (
      <button
        onClick={onClick}
        title="Keldi"
        className={`${CIRCLE} bg-success-bg border border-success/20 cursor-pointer hover:scale-110 active:scale-95`}
      >
        <Check className="w-[15px] h-[15px] text-success" strokeWidth={2.5} />
      </button>
    );
  }

  if (status === "absent") {
    return (
      <button
        onClick={onClick}
        title="Kelmadi"
        className={`${CIRCLE} bg-danger-bg dark:bg-danger/10 border border-danger/20 dark:border-danger/30 cursor-pointer hover:scale-110 active:scale-95`}
      >
        <X className="w-[15px] h-[15px] text-danger dark:text-danger" strokeWidth={2.5} />
      </button>
    );
  }

  // excused
  return (
    <button
      onClick={onClick}
      title="Sababli"
      className={`${CIRCLE} bg-warning-bg border border-warning/20 cursor-pointer hover:scale-110 active:scale-95`}
    >
      <X className="w-[15px] h-[15px] text-warning dark:text-warning" strokeWidth={2.5} />
    </button>
  );
}
