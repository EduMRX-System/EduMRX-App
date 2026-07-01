"use client";

import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/useUIStore";
import {
  Menu,
  Bell,
  Check,
  Search,
  LogOut,
  User,
  LayoutDashboard,
  ChevronDown,
  Sun,
  Moon,
  Calculator,
  CalendarDays,
  StickyNote,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavItem } from "@/constants/navigation";
import QuickToolsPopover from "@/components/sections/directorPanelSections/tools/QuickToolsPopover";
import CalculatorButton from "@/components/common/header/CalculatorButton";
import CalendarButton from "@/components/common/header/CalendarButton";
import RightDrawer from "@/components/common/RightDrawer";
import GlobalSearchModal from "@/components/common/GlobalSearchModal";
import type { AccentTheme } from "@/lib/cookies";

const THEME_SWATCHES: { id: AccentTheme; color: string }[] = [
  { id: "indigo", color: "#6260ff" },
  { id: "lime",   color: "#9fe870" },
  { id: "teal",   color: "#bdd9d7" },
  { id: "royal",  color: "#3447aa" },
  { id: "sun",    color: "#fcdb32" },
  { id: "mint",   color: "#34e0a1" },
];

interface HeaderProps {
  menuItems?: NavItem[];
  showQuickTools?: boolean;
}

interface Notification {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

export default function Header({
  menuItems = [],
  showQuickTools: _showQuickTools = false,
}: HeaderProps) {
  const { t } = useTranslation();
  const { user, logout } = useAuthStore();
  const { toggleSidebar, theme, setTheme, accentTheme, setAccentTheme } = useUIStore();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [calcOpen, setCalcOpen] = useState(false);
  const [calOpen, setCalOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const [notifications] = useState<Notification[]>([]);
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    if (!profileOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [profileOpen]);

  // Cmd/Ctrl+K to open search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const current = menuItems
    .filter((item) =>
      item.href === "/"
        ? pathname === "/"
        : pathname === item.href || pathname.startsWith(`${item.href}/`),
    )
    .sort((a, b) => b.href.length - a.href.length)[0];

  const pageTitle = current?.title ?? t("header.page");

  const role = user?.role === "manager" ? "manager" : "director";

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    router.push("/");
  };

  if (!mounted) {
    return <div className="h-16 bg-surface animate-pulse" />;
  }

  const avatarInitial = user?.full_name?.charAt(0).toUpperCase() ?? "A";

  return (
    <>
      <header className="pt-3">
        <div className="px-5 h-16 flex items-center justify-between gap-4">
          {/* LEFT: hamburger + page title */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 -ml-2 text-foreground-muted hover:bg-hover rounded-lg transition-colors cursor-pointer shrink-0"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="text-sm font-semibold text-foreground truncate">
              {pageTitle}
            </span>
          </div>

          {/* RIGHT cluster */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Global search button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 h-9 px-3 rounded-lg border border-border text-foreground-subtle hover:border-primary/50 hover:text-foreground transition-colors cursor-pointer text-[12px] font-medium"
              title="Qidirish (Ctrl+K)"
            >
              <Search className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline text-[12px]">
                {t("header.search.title")}
              </span>
              <kbd className="hidden md:inline-flex items-center gap-0.5 text-[10px] border border-border rounded px-1 py-0.5 ml-1 text-foreground-subtle font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen((o) => !o)}
                className={`relative w-9 h-9 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                  notifOpen
                    ? "bg-hover text-foreground"
                    : "text-foreground-muted hover:bg-hover hover:text-foreground"
                }`}
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-danger text-primary-fg text-[10px] font-bold flex items-center justify-center border-2 border-surface">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
            </div>

            <RightDrawer
              isOpen={notifOpen}
              onClose={() => setNotifOpen(false)}
              title={t("notifications.title") || "Bildirishnomalar"}
            >
              <div className="px-5 py-3 bg-primary shrink-0">
                <p className="text-xs text-primary-fg/70">
                  Jami: {notifications.length} • O'qilmagan:{" "}
                  <span className="font-bold text-white">{unreadCount}</span>
                </p>
              </div>
              <div className="flex-1 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center px-6">
                    <div className="w-14 h-14 rounded-2xl bg-hover flex items-center justify-center mb-3">
                      <Bell className="w-6 h-6 text-foreground-subtle" />
                    </div>
                    <p className="text-sm font-medium text-foreground-muted">
                      Bildirishnomalar yo'q
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-border-subtle">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`px-5 py-3.5 flex gap-3 hover:bg-hover transition-colors cursor-pointer ${
                          !n.read ? "bg-primary-soft/40" : ""
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                            n.read ? "bg-transparent" : "bg-primary"
                          }`}
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-foreground truncate">
                            {n.title}
                          </p>
                          <p className="text-xs text-foreground-muted mt-0.5 line-clamp-2">
                            {n.body}
                          </p>
                          <p className="text-[10px] text-foreground-subtle mt-1">
                            {n.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {notifications.length > 0 && (
                <div className="px-5 py-3 border-t border-border-subtle flex items-center justify-between shrink-0">
                  <button className="flex items-center gap-1.5 text-xs font-bold text-foreground-muted hover:text-primary transition-colors">
                    <Check className="w-3.5 h-3.5" />
                    Hammasini o'qilgan
                  </button>
                  <Link
                    href="/notifications"
                    onClick={() => setNotifOpen(false)}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    Barchasini ko'rish
                  </Link>
                </div>
              )}
            </RightDrawer>

            {/* Divider */}
            <div className="w-px h-7 bg-border mx-1.5" />

            {/* Profile dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileOpen((o) => !o)}
                className={`flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-xl transition-colors cursor-pointer ${
                  profileOpen ? "bg-hover" : "hover:bg-hover"
                }`}
              >
                {/* Avatar with online status dot */}
                <div className="relative w-8 h-8 shrink-0">
                  <div className="w-8 h-8 rounded-full bg-surface-raised overflow-hidden flex items-center justify-center border border-border">
                    {user?.avatar ? (
                      <Image
                        src={user.avatar}
                        alt="avatar"
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-bold text-foreground-muted">
                        {avatarInitial}
                      </span>
                    )}
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-success border-2 border-surface" />
                </div>

                {/* Name */}
                <div className="text-left hidden sm:block">
                  <p className="text-[12px] font-semibold text-foreground leading-none">
                    {user?.full_name || t("header.user_name")}
                  </p>
                  <p className="text-[10px] text-foreground-subtle mt-0.5 capitalize">
                    {user?.role || t("header.admin")}
                  </p>
                </div>

                <ChevronDown
                  className={`w-3.5 h-3.5 text-foreground-subtle transition-transform duration-200 hidden sm:block ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown panel */}
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-surface border border-border rounded-2xl shadow-2xl z-[9999] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* User card */}
                  <div className="px-4 py-4 border-b border-border-subtle">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-primary-soft overflow-hidden flex items-center justify-center border border-primary/20 shrink-0">
                        {user?.avatar ? (
                          <Image
                            src={user.avatar}
                            alt="avatar"
                            width={44}
                            height={44}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-[15px] font-bold text-primary">
                            {avatarInitial}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[14px] font-semibold text-foreground truncate">
                          {user?.full_name || t("header.user_name")}
                        </p>
                        <p className="text-[12px] text-foreground-subtle font-mono truncate mt-0.5">
                          {user?.phone || user?.email || "—"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Dark/Light toggle + Color theme */}
                  <div className="px-4 py-3 border-b border-border-subtle space-y-3">
                    {/* Dark mode toggle */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {theme === "dark" ? (
                          <Moon className="w-4 h-4 text-foreground-subtle shrink-0" />
                        ) : (
                          <Sun className="w-4 h-4 text-foreground-subtle shrink-0" />
                        )}
                        <span className="text-[13px] text-foreground">
                          {t("header.profile_menu.dark_mode")}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer shrink-0 ${
                          theme === "dark" ? "bg-primary" : "bg-border"
                        }`}
                        aria-label="Toggle dark mode"
                      >
                        <span
                          className={`absolute top-0.5 left-0 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                            theme === "dark" ? "translate-x-[18px]" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Color theme swatches */}
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] text-foreground-subtle shrink-0">
                        {t("header.profile_menu.theme")}
                      </span>
                      <div className="flex gap-1.5 ml-auto">
                        {THEME_SWATCHES.map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => setAccentTheme(s.id)}
                            style={{ backgroundColor: s.color }}
                            className={`w-5 h-5 rounded-full border-2 transition-all cursor-pointer ${
                              accentTheme === s.id
                                ? "border-white shadow-md scale-125 ring-1 ring-black/20"
                                : "border-transparent hover:scale-110"
                            }`}
                            title={s.id}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Nav items */}
                  <div className="py-1.5 border-b border-border-subtle">
                    <Link
                      href={`/${role}`}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-foreground hover:bg-hover transition-colors cursor-pointer"
                    >
                      <LayoutDashboard className="w-4 h-4 text-foreground-subtle shrink-0" />
                      {t("header.profile_menu.dashboard")}
                    </Link>

                    <Link
                      href={`/${role}/profile`}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-foreground hover:bg-hover transition-colors cursor-pointer"
                    >
                      <User className="w-4 h-4 text-foreground-subtle shrink-0" />
                      {t("header.profile_menu.profile")}
                    </Link>
                  </div>

                  {/* Tools */}
                  <div className="py-1.5 border-b border-border-subtle">
                    <button
                      type="button"
                      onClick={() => { setProfileOpen(false); setCalcOpen(true); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-foreground hover:bg-hover transition-colors cursor-pointer"
                    >
                      <Calculator className="w-4 h-4 text-foreground-subtle shrink-0" />
                      {t("director.tools.calculator")}
                    </button>

                    <button
                      type="button"
                      onClick={() => { setProfileOpen(false); setCalOpen(true); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-foreground hover:bg-hover transition-colors cursor-pointer"
                    >
                      <CalendarDays className="w-4 h-4 text-foreground-subtle shrink-0" />
                      {t("director.tools.calendar")}
                    </button>

                    <button
                      type="button"
                      onClick={() => { setProfileOpen(false); setNotesOpen(true); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-foreground hover:bg-hover transition-colors cursor-pointer"
                    >
                      <StickyNote className="w-4 h-4 text-foreground-subtle shrink-0" />
                      {t("director.tools.quick_tools")}
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="py-1.5">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-danger hover:bg-danger/5 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 shrink-0" />
                      {t("header.profile_menu.logout")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Global search modal */}
      <GlobalSearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

      {/* Controlled tool drawers — opened from profile dropdown */}
      <CalculatorButton
        externalOpen={calcOpen}
        onExternalClose={() => setCalcOpen(false)}
      />
      <CalendarButton
        externalOpen={calOpen}
        onExternalClose={() => setCalOpen(false)}
      />
      <QuickToolsPopover
        externalOpen={notesOpen}
        onExternalClose={() => setNotesOpen(false)}
      />
    </>
  );
}
