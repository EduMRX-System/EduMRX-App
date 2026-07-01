"use client";

import { useState, useEffect } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import RightDrawer from "@/components/common/RightDrawer";

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function firstWeekday(year: number, month: number) {
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1;
}

interface CalButtonProps {
  externalOpen?: boolean;
  onExternalClose?: () => void;
}

export default function CalendarButton({ externalOpen, onExternalClose }: CalButtonProps = {}) {
  const { t } = useTranslation();
  const isControlled = externalOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = isControlled ? externalOpen! : internalOpen;

  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleClose = () => {
    if (isControlled) onExternalClose?.();
    else setInternalOpen(false);
  };

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      const inInput = el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || el.isContentEditable;
      if (e.key === "Escape") { handleClose(); return; }
      if (!isControlled && !inInput && e.key === "k") setInternalOpen(true);
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [isControlled]); // eslint-disable-line react-hooks/exhaustive-deps

  const monthsRaw = t("director.tools.months", { returnObjects: true });
  const months: string[] = Array.isArray(monthsRaw) ? monthsRaw : ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const weekdaysRaw = t("director.tools.weekdays", { returnObjects: true });
  const weekdays: string[] = Array.isArray(weekdaysRaw) ? weekdaysRaw : ["Mo","Tu","We","Th","Fr","Sa","Su"];

  const totalDays = daysInMonth(calYear, calMonth);
  const startOffset = firstWeekday(calYear, calMonth);
  const prevMonth = () => { if (calMonth === 0) { setCalMonth(11); setCalYear((y) => y - 1); } else setCalMonth((m) => m - 1); };
  const nextMonth = () => { if (calMonth === 11) { setCalMonth(0); setCalYear((y) => y + 1); } else setCalMonth((m) => m + 1); };

  const btnCls = `w-9 h-9 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
    isOpen ? "bg-hover text-foreground" : "text-foreground-muted hover:bg-hover hover:text-foreground"
  }`;

  return (
    <>
      {!isControlled && (
        <button
          onClick={() => setInternalOpen((o) => !o)}
          className={btnCls}
          title={`${t("director.tools.calendar")} (K)`}
          aria-label={t("director.tools.calendar")}
        >
          <CalendarDays className="w-[18px] h-[18px]" />
        </button>
      )}

      <RightDrawer isOpen={isOpen} onClose={handleClose} title={t("director.tools.calendar")}>
        <div className="p-3 overflow-y-auto flex-1">
          <div className="flex items-center justify-between mb-2">
            <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-hover text-foreground-muted cursor-pointer transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[14px] font-semibold text-foreground">
              {months[calMonth]} {calYear}
            </span>
            <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-hover text-foreground-muted cursor-pointer transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 mb-1">
            {weekdays.map((d) => (
              <div key={d} className="text-[11px] font-semibold text-foreground-subtle text-center py-1">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-0.5">
            {Array.from({ length: startOffset }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: totalDays }).map((_, i) => {
              const day = i + 1;
              const isToday = calYear === today.getFullYear() && calMonth === today.getMonth() && day === today.getDate();
              const isSel = !!selectedDate && selectedDate.getFullYear() === calYear && selectedDate.getMonth() === calMonth && selectedDate.getDate() === day;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(new Date(calYear, calMonth, day))}
                  className={`w-full aspect-square flex items-center justify-center text-[12px] rounded-lg transition-colors cursor-pointer font-medium ${
                    isSel
                      ? "bg-primary text-primary-fg"
                      : isToday
                      ? "bg-primary-soft text-primary font-bold ring-1 ring-primary/30"
                      : "text-foreground hover:bg-hover"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <div className="mt-3 pt-2.5 border-t border-border-subtle flex items-center justify-between">
            <button
              onClick={() => { setCalYear(today.getFullYear()); setCalMonth(today.getMonth()); }}
              className="text-[12px] font-semibold text-primary hover:text-primary-hover transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-primary-soft"
            >
              {t("director.tools.today")}
            </button>
            {selectedDate && (
              <span className="text-[12px] text-foreground-muted">
                {selectedDate.getDate()} {months[selectedDate.getMonth()]} {selectedDate.getFullYear()}
              </span>
            )}
          </div>
        </div>
      </RightDrawer>
    </>
  );
}
