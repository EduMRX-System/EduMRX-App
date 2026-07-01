"use client";

import { useEffect, useRef, useState } from "react";
import { X, Check, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { type AttendanceStatus, type ReasonValue, REASON_OPTIONS } from "@/types/attendance";

interface Props {
  initialStatus?: AttendanceStatus;
  initialReason?: string;
  studentName: string;
  lessonTopic: string;
  onSave: (status: AttendanceStatus, reason?: string) => void;
  onClose: () => void;
}

export default function ReasonPopover({
  initialStatus, initialReason, studentName, lessonTopic, onSave, onClose,
}: Props) {
  const [status, setStatus] = useState<AttendanceStatus>(initialStatus ?? null);
  const [reason, setReason] = useState<string>(initialReason ?? "");
  const [customText, setCustomText] = useState(
    initialReason && !REASON_OPTIONS.find((r) => r.value === initialReason) ? initialReason : ""
  );
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleSave() {
    const finalReason = status === "absent" || status === "excused"
      ? (reason === "other" ? customText.trim() : reason) || undefined
      : undefined;
    onSave(status, finalReason);
    onClose();
  }

  const statusBtns: { value: AttendanceStatus; label: string; icon: React.ReactNode; cls: string; active: string }[] = [
    {
      value: "present",
      label: "Keldi",
      icon: <CheckCircle className="w-4 h-4" />,
      cls: "border-border text-foreground-muted hover:border-emerald-400 hover:text-success",
      active: "bg-success border-success text-white",
    },
    {
      value: "absent",
      label: "Kelmadi",
      icon: <AlertCircle className="w-4 h-4" />,
      cls: "border-border text-foreground-muted hover:border-rose-400 hover:text-danger",
      active: "bg-danger border-danger text-white",
    },
    {
      value: "excused",
      label: "Sababli",
      icon: <Clock className="w-4 h-4" />,
      cls: "border-border text-foreground-muted hover:border-amber-400 hover:text-warning",
      active: "bg-warning border-amber-400 text-white",
    },
  ];

  const showReason = status === "absent" || status === "excused";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className={`fixed inset-0 bg-overlay/60 backdrop-blur-[2px] transition-opacity ${mounted ? "opacity-100" : "opacity-0"}`}
      />
      <div
        ref={ref}
        className={`bg-surface rounded-2xl shadow-2xl border border-border-subtle w-full max-w-sm relative z-10 transition-all duration-200 ${mounted ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-4 pb-3 border-b border-border-subtle">
          <div>
            <p className="text-[13px] font-semibold text-foreground leading-tight">{studentName}</p>
            <p className="text-[11px] text-foreground-subtle mt-0.5 font-medium">{lessonTopic}</p>
          </div>
          <button onClick={onClose} className="text-foreground-subtle hover:text-foreground-muted dark:hover:text-foreground-subtle p-1 rounded-lg hover:bg-hover dark:hover:bg-surface-raised transition-colors cursor-pointer shrink-0 ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          {/* Status toggle */}
          <div className="grid grid-cols-3 gap-2">
            {statusBtns.map((btn) => (
              <button
                key={btn.value}
                onClick={() => { setStatus(btn.value); if (btn.value === "present") setReason(""); }}
                className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl border-2 text-[12px] font-semibold transition-all cursor-pointer ${status === btn.value ? btn.active : btn.cls}`}
              >
                {btn.icon}
                {btn.label}
              </button>
            ))}
          </div>

          {/* Reason (only for absent/excused) */}
          {showReason && (
            <div className="space-y-2">
              <p className="text-[11px] font-semibold text-foreground-muted uppercase tracking-wider">Sabab</p>
              <div className="grid grid-cols-2 gap-1.5">
                {REASON_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setReason(opt.value)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-[12px] font-medium transition-all cursor-pointer text-left ${reason === opt.value ? "border-primary bg-primary-soft text-primary" : "border-border text-foreground-muted hover:border-primary/40 hover:bg-primary-soft/30"}`}
                  >
                    {reason === opt.value && <Check className="w-3 h-3 shrink-0 text-primary" />}
                    {opt.label}
                  </button>
                ))}
              </div>
              {reason === "other" && (
                <input
                  autoFocus
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Sababni kiriting..."
                  className="w-full h-9 px-3 text-sm border border-border rounded-lg bg-surface-raised text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary-ring/50 placeholder:text-foreground-subtle transition-all"
                />
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button onClick={onClose} className="flex-1 h-9 border border-border rounded-lg text-sm font-semibold text-foreground-muted hover:bg-hover transition-colors cursor-pointer">
              Bekor
            </button>
            <button
              onClick={handleSave}
              disabled={status === null}
              className="flex-1 h-9 bg-primary hover:bg-primary-hover disabled:opacity-50 rounded-lg text-sm font-semibold text-white transition-colors cursor-pointer"
            >
              Saqlash
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
