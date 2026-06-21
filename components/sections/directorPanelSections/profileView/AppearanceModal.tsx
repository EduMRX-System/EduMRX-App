"use client";

// components/profile/AppearanceModal.tsx
import { useState } from "react";
import { Contrast, Check } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { useTranslation } from "react-i18next";
import ModalShell from "./ModalShell";

export default function AppearanceModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const { theme, setTheme } = useUIStore();
  const [selected, setSelected] = useState<"light" | "dark">(theme === "dark" ? "dark" : "light");

  const save = () => {
    setTheme(selected);
    onClose();
  };

  return (
    <ModalShell
      icon={<Contrast className="w-7 h-7" />}
      iconBg="bg-emerald-500"
      title={t("director.profile.appearance.modal_title")}
      desc={t("director.profile.appearance.modal_desc")}
      onClose={onClose}
      footer={
        <>
          <button
            onClick={onClose}
            className="px-5 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {t("common.cancel")}
          </button>
          <button
            onClick={save}
            className="px-5 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-colors"
          >
            {t("common.save")}
          </button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-3 py-2">
        {(["light", "dark"] as const).map((mode) => {
          const active = selected === mode;
          return (
            <button
              key={mode}
              onClick={() => setSelected(mode)}
              className={`relative p-3 rounded-2xl border-2 transition-all ${
                active
                  ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30"
                  : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              {/* Mini preview */}
              <div
                className={`h-24 rounded-xl overflow-hidden border ${
                  mode === "light"
                    ? "bg-slate-100 border-slate-200"
                    : "bg-slate-900 border-slate-700"
                }`}
              >
                <div className="flex h-full">
                  <div className={`w-1/4 ${mode === "light" ? "bg-white" : "bg-slate-950"}`} />
                  <div className="flex-1 p-2 space-y-1.5">
                    <div className={`h-2 w-3/4 rounded-full ${mode === "light" ? "bg-slate-300" : "bg-slate-700"}`} />
                    <div className={`h-2 w-1/2 rounded-full ${mode === "light" ? "bg-slate-200" : "bg-slate-800"}`} />
                    <div className="h-6 w-full rounded-md bg-indigo-500/80 mt-2" />
                  </div>
                </div>
              </div>

              <p className="text-sm font-bold text-slate-900 dark:text-white mt-3">
                {mode === "light" ? t("director.profile.appearance.light") : t("director.profile.appearance.dark")}
              </p>

              {active && (
                <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </ModalShell>
  );
}