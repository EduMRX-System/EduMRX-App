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

const ROLE_LABEL: Record<string, string> = {
  director: "Direktor",
  manager: "Menejer",
  teacher: "O'qituvchi",
  student: "O'quvchi",
  parent: "Ota-ona",
};

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
        <Loader2 className="w-7 h-7 text-indigo-600 animate-spin" />
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
        className="group w-full flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors text-left"
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
          <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-base font-black text-slate-900 dark:text-white truncate">
            {profile.full_name}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {ROLE_LABEL[profile.role] ?? profile.role}
          </p>
        </div>

        <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all shrink-0" />
      </button>

      {/* ─── SOZLAMALAR GURUHI ─── */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
        <SettingRow
          icon={<Contrast className="w-5 h-5" />}
          iconBg="bg-emerald-500"
          title="Ko'rinish"
          desc="Ilova mavzusini tanlang"
          value={theme === "dark" ? "Tungi rejim" : "Kunduzgi rejim"}
          onClick={() => setModal("appearance")}
        />
        <SettingRow
          icon={<Globe className="w-5 h-5" />}
          iconBg="bg-orange-500"
          title="Til"
          desc="Interfeys tilini tanlang"
          value={langLabel[language] ?? "O'zbekcha"}
          onClick={() => setModal("language")}
        />
        <SettingRow
          icon={<Lock className="w-5 h-5" />}
          iconBg="bg-indigo-600"
          title="Parol"
          desc="Hisobingiz parolini o'zgartiring"
          value="O'zgartirish"
          onClick={() => setModal("password")}
        />
      </div>

      {/* ─── MARKAZ GURUHI ─── */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
        <SettingRow
          icon={<MapPin className="w-5 h-5" />}
          iconBg="bg-rose-500"
          title="Filiallar manzili"
          desc="Markaz filiallarini xaritada ko'ring"
          onClick={() => router.push("/profile/locations")}
        />
      </div>

      {/* ─── LOG OUT ─── */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
        <button
          onClick={() => setLogoutOpen(true)}
          className="group w-full flex items-center gap-4 p-4 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-left"
        >
          <span className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center text-white shrink-0">
            <LogOut className="w-5 h-5" />
          </span>
          <div className="flex-1">
            <p className="text-sm font-bold text-red-600 dark:text-red-400">Chiqish</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Hisobingizdan xavfsiz chiqing
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
          iconBg="bg-red-500"
          title="Tizimdan chiqish"
          desc="Rostdan ham hisobingizdan chiqmoqchimisiz? Qayta kirish uchun parol kerak bo'ladi."
          confirmText="Ha, chiqish"
          cancelText="Bekor qilish"
          confirmClass="bg-red-600 hover:bg-red-700"
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
      className="group w-full flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
    >
      <span className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center text-white shrink-0`}>
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-900 dark:text-white">{title}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{desc}</p>
      </div>
      {value && (
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 shrink-0 hidden sm:block">
          {value}
        </span>
      )}
      <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-slate-500 shrink-0" />
    </button>
  );
} 