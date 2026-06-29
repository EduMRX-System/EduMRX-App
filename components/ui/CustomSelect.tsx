"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface CustomSelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (v: string) => void;
  options: CustomSelectOption[];
  label?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  size?: "sm" | "md";
  disabled?: boolean;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  label,
  error,
  required,
  placeholder = "Tanlang...",
  className = "",
  triggerClassName = "",
  size = "md",
  disabled,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setFocused(-1);
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => {
    if (!open || focused < 0 || !listRef.current) return;
    const item = listRef.current.children[focused] as HTMLElement | null;
    item?.scrollIntoView({ block: "nearest" });
  }, [focused, open]);

  const handleKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;
      if (!open) {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
          e.preventDefault();
          setOpen(true);
          setFocused(Math.max(0, options.findIndex((o) => o.value === value)));
        }
        return;
      }
      switch (e.key) {
        case "Escape":
          setOpen(false);
          setFocused(-1);
          break;
        case "ArrowDown":
          e.preventDefault();
          setFocused((i) => Math.min(i + 1, options.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocused((i) => Math.max(i - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (focused >= 0) {
            onChange(options[focused].value);
            setOpen(false);
            setFocused(-1);
          }
          break;
      }
    },
    [open, focused, options, value, onChange, disabled]
  );

  const triggerSizeCls =
    size === "sm"
      ? "h-9 px-2.5 text-[12px] font-semibold rounded-xl"
      : "h-10 px-3 text-sm rounded-xl";

  const borderCls = error
    ? "border-danger/50"
    : open
    ? "border-primary ring-2 ring-primary-ring"
    : "border-border";

  return (
    <div ref={ref} className={`relative ${className}`}>
      {label && (
        <label className="text-[14px] text-foreground-muted mb-1 block font-semibold">
          {label}
          {required && " *"}
        </label>
      )}

      <button
        type="button"
        disabled={disabled}
        onKeyDown={handleKey}
        onClick={() => {
          if (disabled) return;
          setOpen((v) => !v);
          setFocused(Math.max(0, options.findIndex((o) => o.value === value)));
        }}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`
          w-full flex items-center justify-between gap-2 border transition-all cursor-pointer
          bg-surface text-foreground focus:outline-none
          hover:bg-hover focus:border-primary focus:ring-2 focus:ring-primary-ring
          disabled:opacity-50 disabled:cursor-not-allowed
          ${triggerSizeCls} ${borderCls} ${triggerClassName}
        `}
      >
        <span
          className={`truncate ${
            selected ? "text-foreground" : "text-foreground-subtle"
          }`}
        >
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-foreground-subtle shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 right-0 mt-1 bg-surface border border-border rounded-xl shadow-xl z-[60] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <div ref={listRef} className="py-1 max-h-52 overflow-y-auto">
            {options.map((opt, i) => {
              const isSel = opt.value === value;
              const isFoc = focused === i;
              return (
                <div
                  key={opt.value}
                  role="option"
                  aria-selected={isSel}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                    setFocused(-1);
                  }}
                  className={`
                    px-3 py-2 text-sm cursor-pointer flex items-center justify-between transition-colors
                    ${isSel ? "bg-primary-soft text-primary font-semibold" : "text-foreground"}
                    ${isFoc && !isSel ? "bg-hover" : ""}
                    ${!isSel && !isFoc ? "hover:bg-hover" : ""}
                  `}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSel && <Check className="w-3.5 h-3.5 shrink-0 text-primary" />}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {error && (
        <p className="text-danger text-[11px] mt-1">{error}</p>
      )}
    </div>
  );
}
