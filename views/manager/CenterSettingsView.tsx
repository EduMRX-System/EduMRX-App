"use client";

import React, { useState } from "react";
import { Contrast, Globe, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useUIStore } from "@/store/useUIStore";
import AppearanceModal from "@/components/sections/directorPanelSections/profileView/AppearanceModal";
import LanguageModal from "@/components/sections/directorPanelSections/profileView/LanguageModal";

type Modal = "appearance" | "language" | null;

export default function CenterSettingsView() {
  const { t } = useTranslation();
  const { theme, language } = useUIStore();
  const [modal, setModal] = useState<Modal>(null);

  const langLabel: Record<string, string> = { uz: "O'zbekcha", ru: "Русский", en: "English" };

  return (
    <div className="space-y-4 max-w-lg">
      <div className="rounded-2xl bg-surface border border-border overflow-hidden divide-y divide-border-subtle dark:divide-border">
        <SettingRow
          icon={<Contrast className="w-5 h-5" />}
          iconBg="bg-success"
          title={t("director.profile.appearance.title")}
          desc={t("director.profile.appearance.desc")}
          value={
            theme === "dark"
              ? t("director.profile.appearance.current_dark")
              : t("director.profile.appearance.current_light")
          }
          onClick={() => setModal("appearance")}
        />
        <SettingRow
          icon={<Globe className="w-5 h-5" />}
          iconBg="bg-orange-500"
          title={t("director.profile.language.title")}
          desc={t("director.profile.language.desc")}
          value={langLabel[language] ?? "O'zbekcha"}
          onClick={() => setModal("language")}
        />
      </div>

      {modal === "appearance" && <AppearanceModal onClose={() => setModal(null)} />}
      {modal === "language" && <LanguageModal onClose={() => setModal(null)} />}
    </div>
  );
}

function SettingRow({
  icon,
  iconBg,
  title,
  desc,
  value,
  onClick,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  desc: string;
  value?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group w-full flex items-center gap-4 p-4 hover:bg-surface-raised dark:hover:bg-hover transition-colors text-left"
    >
      <span className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center text-white shrink-0`}>
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-foreground">{title}</p>
        <p className="text-xs text-foreground-muted mt-0.5 truncate">{desc}</p>
      </div>
      {value && (
        <span className="text-xs font-semibold text-foreground-subtle shrink-0 hidden sm:block">
          {value}
        </span>
      )}
      <ChevronRight className="w-5 h-5 text-foreground-muted shrink-0" />
    </button>
  );
}
