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

interface HeaderProps {
    menuItems?: NavItem[];
}

interface Notification {
    id: string;
    title: string;
    body: string;
    time: string;
    read: boolean;
}

export default function Header({ menuItems = [] }: HeaderProps) {
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
        return <div className="h-16 bg-white dark:bg-slate-900 animate-pulse" />;
    }

    return (
        <header className="pt-3">
            <div className="px-5 h-16 flex items-center justify-between gap-4">
                {/* LEFT: hamburger + page title */}
                <div className="flex items-center gap-3 min-w-0">
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shrink-0"
                        aria-label="Open menu"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="min-w-0">
                        <h1 className="text-lg font-black text-slate-900 dark:text-white tracking-tight truncate leading-none">
                            {pageTitle}
                        </h1>
                    </div>
                </div>

                {/* RIGHT cluster */}
                <div className="flex items-center gap-1 shrink-0">
                    {/* Notifications — dropdown bilan */}
                    <div className="relative" ref={notifRef}>
                        <button
                            onClick={() => setNotifOpen((o) => !o)}
                            className={`relative w-9 h-9 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${notifOpen
                                ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                                : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                                }`}
                            aria-label="Notifications"
                        >
                            <Bell className="w-5 h-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white dark:border-slate-900">
                                    {unreadCount > 9 ? "9+" : unreadCount}
                                </span>
                            )}
                        </button>

                        {/* DROPDOWN */}
                        {notifOpen && (
                            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-900/10 dark:shadow-black/40 overflow-hidden z-50 animate-[notifIn_0.15s_ease-out]">
                                {/* Header */}
                                <div className="px-5 py-4 bg-gradient-to-r from-indigo-600 to-violet-600">
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
                                    <p className="text-xs text-indigo-100 mt-0.5">
                                        Jami: {notifications.length} • O'qilmagan:{" "}
                                        <span className="font-bold text-white">{unreadCount}</span>
                                    </p>
                                </div>

                                {/* List yoki empty */}
                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="py-12 flex flex-col items-center justify-center text-center px-6">
                                            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                                                <Bell className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                                            </div>
                                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                Bildirishnomalar yo'q
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                            {notifications.map((n) => (
                                                <div
                                                    key={n.id}
                                                    className={`px-5 py-3.5 flex gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${!n.read ? "bg-indigo-50/40 dark:bg-indigo-950/20" : ""
                                                        }`}
                                                >
                                                    <div
                                                        className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.read ? "bg-transparent" : "bg-indigo-500"
                                                            }`}
                                                    />
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                                            {n.title}
                                                        </p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                                                            {n.body}
                                                        </p>
                                                        <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Footer — faqat bildirishnoma bo'lsa */}
                                {notifications.length > 0 && (
                                    <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                        <button className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                            <Check className="w-3.5 h-3.5" />
                                            Hammasini o'qilgan
                                        </button>
                                        <Link
                                            href="/notifications"
                                            onClick={() => setNotifOpen(false)}
                                            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                                        >
                                            Barchasini ko'rish
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>



                    {/* Divider */}
                    <div className="w-px h-7 bg-slate-200 dark:bg-slate-800 mx-2" />

                    {/* User */}
                    <Link href="/settings" className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-[12px] font-medium text-slate-900 dark:text-white leading-none">
                                {user?.full_name || t("header.user_name")}
                            </p>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">
                                {user?.role || t("header.admin")}
                            </p>
                        </div>

                        <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center border border-slate-200 dark:border-slate-700">
                            {user?.avatar ? (
                                <Image
                                    src={user.avatar}
                                    alt="avatar"
                                    width={36}
                                    height={36}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
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