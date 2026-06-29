"use client";

import { useState } from "react";
import { Check, CalendarDays } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { useTranslation } from "react-i18next";
import ModalShell from "./ModalShell";
import type { DatePickerMode } from "@/lib/cookies";

const DATE_OPTS: { id: DatePickerMode; emoji: string; labelKey: string; descKey: string }[] = [
  { id: "calendar", emoji: "📅", labelKey: "calendar",    descKey: "calendar_desc" },
  { id: "select",   emoji: "🔢", labelKey: "select_mode", descKey: "select_desc"   },
  { id: "text",     emoji: "⌨️", labelKey: "text_mode",   descKey: "text_desc"     },
];

export default function DatePickerModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const { datePickerMode, setDatePickerMode } = useUIStore();
  const [origMode] = useState(datePickerMode);

  const handleCancel = () => {
    if (datePickerMode !== origMode) setDatePickerMode(origMode);
    onClose();
  };

  return (
    <ModalShell
      icon={<CalendarDays className="w-7 h-7" />}
      iconBg="bg-sky-500"
      title={t("director.profile.datepicker.modal_title")}
      desc={t("director.profile.datepicker.modal_desc")}
      onClose={handleCancel}
      footer={
        <>
          <button
            onClick={handleCancel}
            className="px-5 h-11 rounded-xl bg-hover text-foreground text-sm font-bold hover:bg-border transition-colors cursor-pointer"
          >
            {t("common.cancel")}
          </button>
          <button
            onClick={onClose}
            className="px-5 h-11 rounded-xl bg-primary hover:bg-primary-hover text-primary-fg text-sm font-bold transition-colors cursor-pointer"
          >
            {t("common.save")}
          </button>
        </>
      }
    >
      <div className="grid grid-cols-3 gap-2.5 pb-2">
        {DATE_OPTS.map((opt) => {
          const active = datePickerMode === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setDatePickerMode(opt.id)}
              className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                active
                  ? "border-primary bg-primary-soft"
                  : "border-border hover:border-border-subtle hover:bg-hover"
              }`}
            >
              <span className="text-2xl leading-none">{opt.emoji}</span>
              <span className={`text-[13px] font-bold leading-tight ${active ? "text-primary" : "text-foreground"}`}>
                {t(`common.datepicker.${opt.labelKey}`)}
              </span>
              <span className="text-[10px] text-foreground-muted leading-tight">
                {t(`common.datepicker.${opt.descKey}`)}
              </span>
              {active && (
                <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-fg" strokeWidth={3} />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </ModalShell>
  );
}
