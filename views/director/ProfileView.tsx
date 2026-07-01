"use client";

import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
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
  Palette,
  CalendarDays,
  LayoutTemplate,
  Building2,
} from "lucide-react";
import { API } from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/useUIStore";
import Skeleton from "@/components/common/Skeleton";
import AppearanceModal from "@/components/sections/directorPanelSections/profileView/AppearanceModal";
import ColorModal from "@/components/sections/directorPanelSections/profileView/ColorModal";
import DatePickerModal from "@/components/sections/directorPanelSections/profileView/DatePickerModal";
import ModalVariantModal from "@/components/sections/directorPanelSections/profileView/ModalVariantModal";
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

type ModalType = "appearance" | "color" | "datepicker" | "modalVariant" | "language" | "password" | null;

interface Props {
  role?: "director" | "manager";
}

const THEME_LABELS: Record<string, string> = {
  indigo: "Indigo",
  lime: "Yashil",
  teal: "Ko'kim",
  royal: "Ko'k",
  sun: "Quyosh",
  mint: "Nane",
};

const PICKER_MODE_KEYS: Record<string, string> = {
  calendar: "common.datepicker.calendar",
  select:   "common.datepicker.select_mode",
  text:     "common.datepicker.text_mode",
};

const MODAL_VARIANT_KEYS: Record<string, string> = {
  center: "director.profile.modalVariant.center",
  right:  "director.profile.modalVariant.right",
};

export default function ProfileView({ role = "director" }: Props) {
  const router = useRouter();
  const { t } = useTranslation();
  const { logout } = useAuthStore();
  const { theme, language, accentTheme, datePickerMode, modalVariant } = useUIStore();
  const [modal, setModal] = useState<ModalType>(null);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const { data: profile, isLoading } = useQuery<ProfileData>({
    queryKey: ["profile"],
    queryFn: async () => (await API.get("me/")).data,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Profile card skeleton */}
        <div className="w-full flex items-center gap-4 p-4 rounded-2xl bg-surface border border-border">
          <Skeleton variant="circle" className="w-14 h-14" />
          <div className="flex-1 min-w-0 space-y-2">
            <Skeleton variant="text" className="w-40 h-4" />
            <Skeleton variant="text" className="w-24" />
          </div>
          <Skeleton variant="block" className="w-5 h-5" />
        </div>

        {/* Settings rows skeleton (6 items) */}
        <div className="rounded-2xl bg-surface border border-border overflow-hidden divide-y divide-border-subtle dark:divide-border">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonSettingRow key={i} />
          ))}
        </div>

        {/* Director markaz guruhi skeleton (center + locations) */}
        {role === "director" && (
          <div className="rounded-2xl bg-surface border border-border overflow-hidden divide-y divide-border-subtle dark:divide-border">
            <SkeletonSettingRow />
            <SkeletonSettingRow />
          </div>
        )}

        {/* Logout row skeleton */}
        <div className="rounded-2xl bg-surface border border-border overflow-hidden">
          <div className="flex items-center gap-4 p-4">
            <Skeleton variant="block" className="w-10 h-10" />
            <div className="flex-1 min-w-0 space-y-2">
              <Skeleton variant="text" className="w-28 h-3.5" />
              <Skeleton variant="text" className="w-44" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const initials =
    `${profile.first_name?.[0] ?? ""}${profile.last_name?.[0] ?? ""}`.toUpperCase();

  const langLabel: Record<string, string> = { uz: "O'zbekcha", ru: "Русский", en: "English" };

  return (
    <div className="space-y-4">
      {/* ─── PROFILE CARD ─── */}
      <button
        onClick={() => router.push("/profile/details")}
        className="group w-full flex items-center gap-4 p-4 rounded-2xl bg-surface border border-border hover:border-primary/40 transition-colors text-left"
      >
        <div className="relative shrink-0">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center overflow-hidden">
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
          <p className="text-base font-black text-foreground truncate">{profile.full_name}</p>
          <p className="text-sm text-foreground-muted mt-0.5">
            {t(`director.profile.role.${profile.role}`) || profile.role}
          </p>
        </div>

        <ChevronRight className="w-5 h-5 text-foreground-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
      </button>

      {/* ─── SOZLAMALAR GURUHI ─── */}
      <div className="rounded-2xl bg-surface border border-border overflow-hidden divide-y divide-border-subtle dark:divide-border">
        <SettingRow
          icon={<Contrast className="w-5 h-5" />}
          iconBg="bg-success"
          title={t("director.profile.appearance.title")}
          desc={t("director.profile.appearance.desc")}
          value={theme === "dark" ? t("director.profile.appearance.current_dark") : t("director.profile.appearance.current_light")}
          onClick={() => setModal("appearance")}
        />
        <SettingRow
          icon={<Palette className="w-5 h-5" />}
          iconBg="bg-violet-500"
          title={t("director.profile.color.title")}
          desc={t("director.profile.color.desc")}
          value={t(`director.profile.appearance.themes.${accentTheme}`) || THEME_LABELS[accentTheme] || accentTheme}
          onClick={() => setModal("color")}
        />
        <SettingRow
          icon={<CalendarDays className="w-5 h-5" />}
          iconBg="bg-sky-500"
          title={t("director.profile.datepicker.title")}
          desc={t("director.profile.datepicker.desc")}
          value={t(PICKER_MODE_KEYS[datePickerMode] ?? "common.datepicker.select_mode")}
          onClick={() => setModal("datepicker")}
        />
        <SettingRow
          icon={<LayoutTemplate className="w-5 h-5" />}
          iconBg="bg-indigo-500"
          title={t("director.profile.modalVariant.title")}
          desc={t("director.profile.modalVariant.desc")}
          value={t(MODAL_VARIANT_KEYS[modalVariant] ?? "director.profile.modalVariant.right")}
          onClick={() => setModal("modalVariant")}
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

      {/* ─── MARKAZ GURUHI (faqat director) ─── */}
      {role === "director" && (
        <div className="rounded-2xl bg-surface border border-border overflow-hidden divide-y divide-border-subtle dark:divide-border">
          <SettingRow
            icon={<Building2 className="w-5 h-5" />}
            iconBg="bg-primary"
            title={t("director.profile.center.title")}
            desc={t("director.profile.center.desc")}
            onClick={() => router.push("/profile/center")}
          />
          <SettingRow
            icon={<MapPin className="w-5 h-5" />}
            iconBg="bg-danger"
            title={t("director.profile.locations.title")}
            desc={t("director.profile.locations.desc")}
            onClick={() => router.push("/profile/locations")}
          />
        </div>
      )}

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
            <p className="text-xs text-foreground-muted mt-0.5">{t("director.profile.logout.desc")}</p>
          </div>
        </button>
      </div>

      {/* ─── MODALLAR ─── */}
      {modal === "appearance"  && <AppearanceModal  onClose={() => setModal(null)} />}
      {modal === "color"       && <ColorModal       onClose={() => setModal(null)} />}
      {modal === "datepicker"  && <DatePickerModal  onClose={() => setModal(null)} />}
      {modal === "modalVariant" && <ModalVariantModal onClose={() => setModal(null)} />}
      {modal === "language"    && <LanguageModal    onClose={() => setModal(null)} />}
      {modal === "password"    && <PasswordModal    onClose={() => setModal(null)} />}

      <AnimatePresence>
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
      </AnimatePresence>
    </div>
  );
}

/* ─── Skeleton setting qatori ─── */
function SkeletonSettingRow() {
  return (
    <div className="flex items-center gap-4 p-4">
      <Skeleton variant="block" className="w-10 h-10" />
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton variant="text" className="w-36 h-3.5" />
        <Skeleton variant="text" className="w-52" />
      </div>
      <Skeleton variant="text" className="w-16 hidden sm:block" />
      <Skeleton variant="block" className="w-5 h-5" />
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
      <ChevronRight className="w-5 h-5 text-foreground-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
    </button>
  );
}
