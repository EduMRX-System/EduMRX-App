"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

interface TimePickerProps {
  value: string;
  onChange: (v: string) => void;
  label?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function parseValue(v: string): { h: number; m: number } | null {
  if (!v || !/^\d{2}:\d{2}$/.test(v)) return null;
  const [h, m] = v.split(":").map(Number);
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return { h, m };
}

function applyMask(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}:${digits.slice(2)}`;
}

function isValidTime(text: string): boolean {
  if (!/^\d{2}:\d{2}$/.test(text)) return false;
  const [h, m] = text.split(":").map(Number);
  return h >= 0 && h <= 23 && m >= 0 && m <= 59;
}

function ScrollCol({
  selected,
  count,
  startAt = 0,
  onChange,
}: {
  selected: number;
  count: number;
  startAt?: number;
  onChange: (v: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const target = el.querySelector("[data-sel]") as HTMLElement | null;
    if (target) {
      el.scrollTop = target.offsetTop - el.clientHeight / 2 + target.clientHeight / 2;
    }
  }, [selected]);

  return (
    <div ref={ref} className="flex-1 overflow-y-auto max-h-[168px] scroll-smooth py-1">
      {Array.from({ length: count }, (_, i) => {
        const val = startAt + i;
        const isSel = val === selected;
        return (
          <button
            key={val}
            type="button"
            {...(isSel ? { "data-sel": "" } : {})}
            onClick={() => onChange(val)}
            className={`w-full text-center py-1.5 text-[13px] font-mono font-semibold cursor-pointer transition-colors rounded-lg ${
              isSel
                ? "bg-primary text-primary-fg"
                : "text-foreground hover:bg-hover"
            }`}
          >
            {pad(val)}
          </button>
        );
      })}
    </div>
  );
}

export default function TimePicker({
  value,
  onChange,
  label,
  error,
  required,
  placeholder,
}: TimePickerProps) {
  const { t } = useTranslation();
  const parsed = parseValue(value);

  const [open, setOpen] = useState(false);
  const [selH, setSelH] = useState(parsed?.h ?? 9);
  const [selM, setSelM] = useState(parsed?.m ?? 0);
  const [textInput, setTextInput] = useState(value || "");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      const p = parseValue(value);
      if (p) {
        setSelH(p.h);
        setSelM(p.m);
        setTextInput(value);
      }
    } else {
      setTextInput("");
    }
  }, [value]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const commit = useCallback(
    (h: number, m: number) => {
      const v = `${pad(h)}:${pad(m)}`;
      setTextInput(v);
      onChange(v);
    },
    [onChange]
  );

  const handleHour = (h: number) => {
    setSelH(h);
    commit(h, selM);
  };

  const handleMin = (m: number) => {
    setSelM(m);
    commit(selH, m);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = applyMask(e.target.value);
    setTextInput(masked);
    if (isValidTime(masked)) {
      const [h, m] = masked.split(":").map(Number);
      setSelH(h);
      setSelM(m);
      onChange(masked);
    }
  };

  const handleTextBlur = () => {
    if (!isValidTime(textInput) && value) {
      setTextInput(value);
    }
  };

  const displayText = value || "";

  const triggerCls = `border rounded-lg w-full h-[40px] px-3 text-[14px] flex items-center justify-between cursor-pointer transition-all bg-surface text-foreground focus:ring-2 focus:ring-primary-ring ${
    error ? "border-danger/50" : "border-border focus:border-primary"
  } ${open ? "border-primary ring-2 ring-primary-ring" : ""}`;

  return (
    <div ref={ref} className="relative">
      {label && (
        <label className="text-[14px] text-foreground-muted mb-1 block font-semibold">
          {label}
          {required && " *"}
        </label>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={triggerCls}
      >
        <span className={displayText ? "text-foreground font-mono" : "text-foreground-subtle"}>
          {displayText || (placeholder ?? t("common.select_time", "Vaqtni tanlang"))}
        </span>
        <Clock className="w-4 h-4 text-foreground-subtle shrink-0" />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-[220px] bg-surface border border-border rounded-xl shadow-xl z-[60] p-3 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Text input */}
          <input
            type="text"
            inputMode="numeric"
            value={textInput}
            onChange={handleTextChange}
            onBlur={handleTextBlur}
            placeholder="09:00"
            maxLength={5}
            className="w-full border border-border rounded-lg h-8 px-3 text-[13px] font-mono font-semibold text-center outline-none bg-surface text-foreground focus:border-primary focus:ring-2 focus:ring-primary-ring mb-3"
          />

          {/* Column headers */}
          <div className="flex gap-2 mb-1">
            <div className="flex-1 text-center text-[11px] font-semibold text-foreground-subtle uppercase tracking-wide">
              {t("common.hour", "Soat")}
            </div>
            <div className="w-px bg-border-subtle self-stretch" />
            <div className="flex-1 text-center text-[11px] font-semibold text-foreground-subtle uppercase tracking-wide">
              {t("common.minute", "Daqiqa")}
            </div>
          </div>

          {/* Scroll columns */}
          <div className="flex gap-2 border border-border-subtle rounded-lg overflow-hidden">
            <ScrollCol selected={selH} count={24} onChange={handleHour} />
            <div className="w-px bg-border-subtle" />
            <ScrollCol selected={selM} count={60} onChange={handleMin} />
          </div>

          {/* Confirm */}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-2.5 w-full h-8 bg-primary hover:bg-primary-hover text-primary-fg text-[13px] font-semibold rounded-lg cursor-pointer transition-colors"
          >
            {t("common.confirm", "Tasdiqlash")}
          </button>
        </div>
      )}

      {error && (
        <p className="text-red-400 dark:text-danger text-[11px] mt-1">{error}</p>
      )}
    </div>
  );
}
