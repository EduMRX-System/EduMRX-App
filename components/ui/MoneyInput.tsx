"use client";

import { useState, useEffect } from "react";

interface MoneyInputProps {
  value: string;
  onChange: (raw: string) => void;
  label?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  allowDecimal?: boolean;
  rightSlot?: React.ReactNode;
  rightPadding?: string;
}

function parseRaw(val: string, allowDecimal: boolean): string {
  if (allowDecimal) {
    const s = val.replace(/[^0-9.]/g, "");
    const dot = s.indexOf(".");
    if (dot === -1) return s;
    return s.slice(0, dot + 1) + s.slice(dot + 1).replace(/\./g, "");
  }
  return val.replace(/[^0-9]/g, "");
}

function fmtDisplay(raw: string, allowDecimal: boolean): string {
  if (!raw) return "";
  if (allowDecimal) {
    const [intPart, decPart] = raw.split(".");
    const n = parseInt(intPart || "0", 10);
    const intFmt = isNaN(n) ? "0" : new Intl.NumberFormat("en-US").format(n);
    return decPart !== undefined ? `${intFmt}.${decPart}` : intFmt;
  }
  const n = parseInt(raw, 10);
  return isNaN(n) ? "" : new Intl.NumberFormat("en-US").format(n);
}

export default function MoneyInput({
  value,
  onChange,
  label,
  error,
  required,
  placeholder,
  className = "",
  disabled,
  allowDecimal = false,
  rightSlot,
  rightPadding = "",
}: MoneyInputProps) {
  const [display, setDisplay] = useState(() => fmtDisplay(value, allowDecimal));

  useEffect(() => {
    setDisplay(fmtDisplay(value, allowDecimal));
  }, [value, allowDecimal]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = parseRaw(e.target.value, allowDecimal);
    setDisplay(fmtDisplay(raw, allowDecimal));
    onChange(raw);
  };

  const baseCls = `border rounded-lg w-full h-[40px] px-3 text-[14px] outline-none transition-all bg-surface text-foreground focus:ring-2 focus:ring-primary-ring ${
    error ? "border-danger/50" : "border-border focus:border-primary"
  }`;

  return (
    <div className={className}>
      {label && (
        <label className="text-[14px] text-foreground-muted mb-1 block font-semibold">
          {label}
          {required && " *"}
        </label>
      )}
      <div className="relative flex items-center">
        <input
          type="text"
          inputMode="decimal"
          value={display}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`${baseCls} ${rightPadding}`}
        />
        {rightSlot}
      </div>
      {error && (
        <p className="text-red-400 dark:text-danger text-[11px] mt-1">{error}</p>
      )}
    </div>
  );
}
