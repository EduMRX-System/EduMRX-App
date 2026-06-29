"use client";

import { useState } from "react";
import { Contrast, Check, Sun, Moon } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { useTranslation } from "react-i18next";
import ModalShell from "./ModalShell";

export default function AppearanceModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const { theme, setTheme } = useUIStore();
  const [origTheme] = useState(theme);

  const handleCancel = () => {
    if (theme !== origTheme) setTheme(origTheme);
    onClose();
  };

  return (
    <ModalShell
      icon={<Contrast className="w-7 h-7" />}
      iconBg="bg-success"
      title={t("director.profile.appearance.modal_title")}
      desc={t("director.profile.appearance.modal_desc")}
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
      <div className="grid grid-cols-2 gap-3 pb-2">
        {(["light", "dark"] as const).map((mode) => {
          const active = theme === mode;
          return (
            <button
              key={mode}
              onClick={() => setTheme(mode)}
              className={`relative p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                active ? "border-primary bg-primary-soft/50" : "border-border hover:border-border-subtle"
              }`}
            >
              <div className={`h-20 rounded-xl overflow-hidden border flex items-center justify-center ${
                mode === "light" ? "bg-slate-100 border-slate-200" : "bg-slate-900 border-slate-700"
              }`}>
                {mode === "light"
                  ? <Sun className="w-8 h-8 text-amber-500" />
                  : <Moon className="w-8 h-8 text-slate-400" />}
              </div>
              <p className="text-sm font-bold text-foreground mt-2.5 text-center">
                {mode === "light"
                  ? t("director.profile.appearance.light")
                  : t("director.profile.appearance.dark")}
              </p>
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
