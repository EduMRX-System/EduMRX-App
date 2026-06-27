"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
  ChevronRight,
  Contrast,
  Globe,
  Lock,
  MapPin,
  LogOut,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { API } from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/useUIStore";
import AppearanceModal from "@/components/sections/directorPanelSections/profileView/AppearanceModal";
import LanguageModal from "@/components/sections/directorPanelSections/profileView/LanguageModal";
import PasswordModal from "@/components/sections/directorPanelSections/profileView/PasswordModal";
import ConfirmModal from "@/components/sections/directorPanelSections/profileView/ConfirmModal";



interface ProfileData {
  id: string;
  phone: string;
  email: string | null;
  first_name: string;
  last_name: string;
  full_name: string;
  role: string;
  avatar: string | null;
}


type ModalType = "appearance" | "language" | "password" | null;

export default function ProfileView() {
  const router = useRouter();
  const { t } = useTranslation();
  const { logout } = useAuthStore();
  const { theme, language } = useUIStore();
  const [modal, setModal] = useState<ModalType>(null);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const { data: profile, isLoading } = useQuery<ProfileData>({
    queryKey: ["profile"],
    queryFn: async () => (await API.get("me/")).data,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-7 h-7 text-primary animate-spin" />
      </div>
    );
  }

  if (!profile) return null;

  const initials =
    `${profile.first_name?.[0] ?? ""}${profile.last_name?.[0] ?? ""}`.toUpperCase();

  const langLabel: Record<string, string> = { uz: "O'zbekcha", ru: "Русский", en: "English" };

  return (
    <div className="space-y-4">
      {/* ─── PROFILE CARD (bosilganda → detail) ─── */}
      <button
        onClick={() => router.push("/profile/details")}
        className="group w-full flex items-center gap-4 p-4 rounded-2xl bg-surface border border-border hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors text-left"
      >
        <div className="relative shrink-0">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center overflow-hidden">
            {profile.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatar} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg font-black text-white">{initials || "?"}</span>
            )}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-surface flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-primary" />
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-base font-black text-foreground truncate">
            {profile.full_name}
          </p>
          <p className="text-sm text-foreground-muted mt-0.5">
            {t(`director.profile.role.${profile.role}`) || profile.role}
          </p>
        </div>

        <ChevronRight className="w-5 h-5 text-slate-300 dark:text-foreground-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
      </button>

      {/* ─── SOZLAMALAR GURUHI ─── */}
      <div className="rounded-2xl bg-surface border border-border overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
        <SettingRow
          icon={<Contrast className="w-5 h-5" />}
          iconBg="bg-emerald-500"
          title={t("director.profile.appearance.title")}
          desc={t("director.profile.appearance.desc")}
          value={theme === "dark" ? t("director.profile.appearance.current_dark") : t("director.profile.appearance.current_light")}
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
        <SettingRow
          icon={<Lock className="w-5 h-5" />}
          iconBg="bg-primary"
          title={t("director.profile.password.title")}
          desc={t("director.profile.password.desc")}
          value={t("director.profile.password.change")}
          onClick={() => setModal("password")}
        />
      </div>

      {/* ─── MARKAZ GURUHI ─── */}
      <div className="rounded-2xl bg-surface border border-border overflow-hidden">
        <SettingRow
          icon={<MapPin className="w-5 h-5" />}
          iconBg="bg-rose-500"
          title={t("director.profile.locations.title")}
          desc={t("director.profile.locations.desc")}
          onClick={() => router.push("/profile/locations")}
        />
      </div>

      {/* ─── LOG OUT ─── */}
      <div className="rounded-2xl bg-surface border border-border overflow-hidden">
        <button
          onClick={() => setLogoutOpen(true)}
          className="group w-full flex items-center gap-4 p-4 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-left"
        >
          <span className="w-10 h-10 rounded-xl bg-danger flex items-center justify-center text-white shrink-0">
            <LogOut className="w-5 h-5" />
          </span>
          <div className="flex-1">
            <p className="text-sm font-bold text-red-600 dark:text-red-400">{t("director.profile.logout.title")}</p>
            <p className="text-xs text-foreground-muted mt-0.5">
              {t("director.profile.logout.desc")}
            </p>
          </div>
        </button>
      </div>

      {/* ─── MODALLAR ─── */}
      {modal === "appearance" && <AppearanceModal onClose={() => setModal(null)} />}
      {modal === "language" && <LanguageModal onClose={() => setModal(null)} />}
      {modal === "password" && <PasswordModal onClose={() => setModal(null)} />}

      {logoutOpen && (
        <ConfirmModal
          icon={LogOut}
          iconBg="bg-danger"
          title={t("director.profile.logout.confirm_title")}
          desc={t("director.profile.logout.confirm_desc")}
          confirmText={t("director.profile.logout.confirm_btn")}
          cancelText={t("common.cancel")}
          confirmClass="bg-danger hover:bg-danger/90"
          onConfirm={logout}
          onClose={() => setLogoutOpen(false)}
        />
      )}
    </div>
  );
}

/* ─── Setting qatori ─── */
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
      className="group w-full flex items-center gap-4 p-4 hover:bg-surface-raised dark:hover:bg-slate-800/50 transition-colors text-left"
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
      <ChevronRight className="w-5 h-5 text-slate-300 dark:text-foreground-muted group-hover:text-foreground-muted shrink-0" />
    </button>
  );
} 