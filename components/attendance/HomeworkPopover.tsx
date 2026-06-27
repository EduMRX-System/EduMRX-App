"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { getHomeworkBg } from "@/types/attendance";

interface Props {
  initialPercent?: number | null;
  studentName: string;
  lessonTopic: string;
  onSave: (percent: number | null) => void;
  onClose: () => void;
}

export default function HomeworkPopover({
  initialPercent, studentName, lessonTopic, onSave, onClose,
}: Props) {
  const [value, setValue] = useState<string>(
    initialPercent != null ? String(initialPercent) : ""
  );
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    setTimeout(() => inputRef.current?.select(), 80);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter") handleSave();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  function handleSave() {
    const num = parseInt(value, 10);
    if (value.trim() === "" || value.trim() === "—") {
      onSave(null);
    } else if (!isNaN(num) && num >= 0 && num <= 100) {
      onSave(num);
    } else {
      onSave(null);
    }
    onClose();
  }

  const presets = [100, 90, 80, 70, 50, 0];
  const num = parseInt(value, 10);
  const preview = !isNaN(num) ? num : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className={`fixed inset-0 bg-overlay/60 backdrop-blur-[2px] transition-opacity ${mounted ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      <div className={`bg-surface rounded-2xl shadow-2xl border border-border-subtle w-full max-w-xs relative z-10 transition-all duration-200 ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
        {/* Header */}
        <div className="flex items-start justify-between p-4 pb-3 border-b border-border-subtle">
          <div>
            <p className="text-[13px] font-semibold text-foreground">{studentName}</p>
            <p className="text-[11px] text-foreground-subtle mt-0.5">{lessonTopic} — Uy ishi</p>
          </div>
          <button onClick={onClose} className="text-foreground-subtle hover:text-foreground-muted p-1 rounded-lg hover:bg-hover dark:hover:bg-surface-raised cursor-pointer ml-2"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-4 space-y-3">
          {/* Preview circle + input */}
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${getHomeworkBg(preview)} ${preview != null ? "text-white" : "bg-border/60 dark:bg-surface-raised"}`}>
              {preview != null ? `${preview}` : "—"}
            </div>
            <div className="flex-1">
              <input
                ref={inputRef}
                type="number" min="0" max="100"
                value={value}
                onChange={(e) => {
                  const raw = e.target.value;
                  const n = parseInt(raw, 10);
                  if (raw === "" || (!isNaN(n) && n >= 0 && n <= 100)) setValue(raw);
                }}
                placeholder="0 – 100"
                className="w-full h-10 px-3 text-base font-semibold border border-border rounded-xl bg-surface-raised text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary-ring/50 transition-all placeholder:text-foreground-subtle dark:placeholder:text-foreground-muted"
              />
            </div>
          </div>

          {/* Presets */}
          <div className="flex flex-wrap gap-1.5">
            {presets.map((p) => (
              <button
                key={p}
                onClick={() => setValue(String(p))}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${String(p) === value ? "border-primary bg-primary-soft text-primary" : "border-border text-foreground-muted hover:border-primary/40"}`}
              >
                {p}%
              </button>
            ))}
            <button
              onClick={() => setValue("")}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${value === "" ? "border-border bg-hover text-foreground-muted" : "border-border text-foreground-subtle hover:border-border"}`}
            >
              Bo'sh
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button onClick={onClose} className="flex-1 h-9 border border-border rounded-lg text-sm font-semibold text-foreground-muted hover:bg-hover transition-colors cursor-pointer">Bekor</button>
            <button onClick={handleSave} className="flex-1 h-9 bg-primary hover:bg-primary-hover rounded-lg text-sm font-semibold text-white transition-colors cursor-pointer">Saqlash</button>
          </div>
        </div>
      </div>
    </div>
  );
}
