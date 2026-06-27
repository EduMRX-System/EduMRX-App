"use client";

import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/useUIStore";
import { Menu, Sun, Moon, Bell, X, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavItem } from "@/constants/navigation";
import QuickToolsPopover from "@/components/sections/directorPanelSections/tools/QuickToolsPopover";
import ToolsWidgetHeader from "@/components/common/ToolsWidgetHeader";

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

export default function Header({ menuItems = [], showQuickTools = false }: HeaderProps) {
    const { t } = useTranslation();
    const { user } = useAuthStore();
    const { setTheme, theme, toggleSidebar } = useUIStore();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);

    // TODO: backenddan keladi — hozircha bo'sh
    const [notifications] = useState<Notification[]>([]);
    const unreadCount = notifications.filter((n) => !n.read).length;

    useEffect(() => {
        setMounted(true);
    }, []);

    // Tashqariga bosilganda dropdown yopiladi
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
                setNotifOpen(false);
            }
        }
        if (notifOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [notifOpen]);

    // Joriy sahifa nomini menu'dan topish
    const current = menuItems
        .filter((item) =>
            item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`),
        )
        .sort((a, b) => b.href.length - a.href.length)[0];

    const pageTitle = current?.title ?? t("header.page");

    if (!mounted) {
        return <div className="h-16 bg-surface animate-pulse" />;
    }

    return (
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

                </div>

                {/* RIGHT cluster */}
                <div className="flex items-center gap-1 shrink-0">
                    {showQuickTools && <ToolsWidgetHeader />}
                    {showQuickTools && <QuickToolsPopover />}

                    {/* Notifications — dropdown bilan */}
                    <div className="relative" ref={notifRef}>
                        <button
                            onClick={() => setNotifOpen((o) => !o)}
                            className={`relative w-9 h-9 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${notifOpen
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

                        {/* DROPDOWN */}
                        {notifOpen && (
                            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-surface border border-border shadow-xl overflow-hidden z-50 animate-[notifIn_0.15s_ease-out]">
                                {/* Header */}
                                <div className="px-5 py-4 bg-primary">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-base font-black text-white">
                                            {t("notifications.title") || "Bildirishnomalar"}
                                        </h3>
                                        <button
                                            onClick={() => setNotifOpen(false)}
                                            className="w-7 h-7 flex items-center justify-center rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition-colors"
                                            aria-label="Close"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-xs text-primary-fg/70 mt-0.5">
                                        Jami: {notifications.length} • O'qilmagan:{" "}
                                        <span className="font-bold text-white">{unreadCount}</span>
                                    </p>
                                </div>

                                {/* List yoki empty */}
                                <div className="max-h-80 overflow-y-auto">
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
                                                    className={`px-5 py-3.5 flex gap-3 hover:bg-hover transition-colors cursor-pointer ${!n.read ? "bg-primary-soft/40" : ""
                                                        }`}
                                                >
                                                    <div
                                                        className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.read ? "bg-transparent" : "bg-primary"
                                                            }`}
                                                    />
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-bold text-foreground truncate">
                                                            {n.title}
                                                        </p>
                                                        <p className="text-xs text-foreground-muted mt-0.5 line-clamp-2">
                                                            {n.body}
                                                        </p>
                                                        <p className="text-[10px] text-foreground-subtle mt-1">{n.time}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Footer — faqat bildirishnoma bo'lsa */}
                                {notifications.length > 0 && (
                                    <div className="px-5 py-3 border-t border-border-subtle flex items-center justify-between">
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
                            </div>
                        )}
                    </div>



                    {/* Divider */}
                    <div className="w-px h-7 bg-border mx-2" />

                    {/* User */}
                    <Link href="/profile" className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-[12px] font-medium text-foreground leading-none">
                                {user?.full_name || t("header.user_name")}
                            </p>
                            <p className="text-[10px] text-foreground-subtle uppercase tracking-widest mt-1">
                                {user?.role || t("header.admin")}
                            </p>
                        </div>

                        <div className="w-9 h-9 rounded-full bg-surface-raised overflow-hidden flex items-center justify-center border border-border">
                            {user?.avatar ? (
                                <Image
                                    src={user.avatar}
                                    alt="avatar"
                                    width={36}
                                    height={36}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-xs font-bold text-foreground-muted">
                                    {user?.full_name?.charAt(0).toUpperCase() || "A"}
                                </span>
                            )}
                        </div>
                    </Link>
                </div>

                <style jsx>{`
        @keyframes notifIn {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
            </div>
        </header>
    );
}