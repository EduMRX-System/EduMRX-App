"use client";

// components/profile/LanguageModal.tsx
import { useState } from "react";
import { Globe, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useUIStore } from "@/store/useUIStore";
import ModalShell from "./ModalShell";

const LANGS = [
  { code: "uz", label: "O'zbekcha", flag: "🇺🇿" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "en", label: "English", flag: "🇬🇧" },
];

export default function LanguageModal({ onClose }: { onClose: () => void }) {
  const { i18n } = useTranslation();
  const { language, setLanguage } = useUIStore();
  const [selected, setSelected] = useState(language || "uz");

  const save = () => {
    setLanguage(selected);
    i18n.changeLanguage(selected);
    onClose();
  };

  return (
    <ModalShell
      icon={<Globe className="w-7 h-7" />}
      iconBg="bg-orange-500"
      title="Tilni o'zgartirish"
      desc="Interfeys uchun tilni tanlang"
      onClose={onClose}
      footer={
        <>
          <button
            onClick={onClose}
            className="px-5 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Bekor qilish
          </button>
          <button
            onClick={save}
            className="px-5 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-colors"
          >
            Saqlash
          </button>
        </>
      }
    >
      <div className="space-y-2 py-2">
        {LANGS.map((lang) => {
          const active = selected === lang.code;
          return (
            <button
              key={lang.code}
              onClick={() => setSelected(lang.code)}
              className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border transition-all ${
                active
                  ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30"
                  : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`}
            >
              <span className="text-2xl">{lang.flag}</span>
              <span className="flex-1 text-left text-sm font-bold text-slate-900 dark:text-white">
                {lang.label}
              </span>
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all ${
                  active ? "bg-indigo-600 border-indigo-600" : "border-slate-300 dark:border-slate-600"
                }`}
              >
                {active && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
              </span>
            </button>
          );
        })}
      </div>
    </ModalShell>
  );
}