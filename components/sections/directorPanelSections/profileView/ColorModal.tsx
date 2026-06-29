"use client";

import { useState } from "react";
import { Check, Palette } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { useTranslation } from "react-i18next";
import ModalShell from "./ModalShell";
import type { AccentTheme } from "@/lib/cookies";

const THEMES: { id: AccentTheme; primary: string; soft: string; fg: string; labelKey: string }[] = [
  { id: "indigo", primary: "#6260ff", soft: "#e4e4ff",  fg: "#ffffff", labelKey: "indigo" },
  { id: "lime",   primary: "#9fe870", soft: "#eafadd",  fg: "#163300", labelKey: "lime"   },
  { id: "teal",   primary: "#bdd9d7", soft: "#eaf3f2",  fg: "#03363d", labelKey: "teal"   },
  { id: "royal",  primary: "#3447aa", soft: "#e8ecf8",  fg: "#ffffff", labelKey: "royal"  },
  { id: "sun",    primary: "#fcdb32", soft: "#fef7d0",  fg: "#141d38", labelKey: "sun"    },
  { id: "mint",   primary: "#34e0a1", soft: "#dffaf0",  fg: "#003322", labelKey: "mint"   },
];

export default function ColorModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const { accentTheme, setAccentTheme } = useUIStore();
  const [origAccent] = useState(accentTheme);

  const handleCancel = () => {
    if (accentTheme !== origAccent) setAccentTheme(origAccent);
    onClose();
  };

  return (
    <ModalShell
      icon={<Palette className="w-7 h-7" />}
      iconBg="bg-violet-500"
      title={t("director.profile.color.modal_title")}
      desc={t("director.profile.color.modal_desc")}
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
        {THEMES.map((th) => {
          const active = accentTheme === th.id;
          return (
            <button
              key={th.id}
              onClick={() => setAccentTheme(th.id)}
              className={`relative flex flex-col items-center gap-2.5 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                active ? "" : "border-border hover:border-border-subtle"
              }`}
              style={active ? { borderColor: th.primary, backgroundColor: th.soft } : undefined}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className="w-8 h-8 rounded-full border-2 border-white/60 shadow-sm"
                  style={{ backgroundColor: th.primary }}
                />
                <span
                  className="w-4 h-4 rounded-full border border-white/40"
                  style={{ backgroundColor: th.soft }}
                />
              </div>
              <span
                className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                style={{ backgroundColor: th.primary, color: th.fg }}
              >
                {t(`director.profile.appearance.themes.${th.labelKey}`)}
              </span>
              {active && (
                <span
                  className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: th.primary }}
                >
                  <Check className="w-2.5 h-2.5" style={{ color: th.fg }} strokeWidth={3} />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </ModalShell>
  );
}
