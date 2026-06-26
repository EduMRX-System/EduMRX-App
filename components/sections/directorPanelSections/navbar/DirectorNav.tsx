"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useUIStore } from "@/store/useUIStore";
import { LogoIcons } from "@/constants/icons"; // ← o'z yo'lingizga moslang
import {
    directorMenu,
    isGroup,
    type NavGroup,
    type NavLink,
} from "@/config/director-nav";

function useActive() {
    const pathname = usePathname();
    return (href: string) =>
        href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

interface NavProps {
    onNavigate?: () => void; // mobil: bosilganda drawer yopish
}

export default function DirectorNav({ onNavigate }: NavProps)   {
    const { t } = useTranslation();
    const isActive = useActive();
    const { isSidebarCollapsed, setSidebarCollapsed, theme } = useUIStore();
    const collapsed = isSidebarCollapsed;

    // Faol bo'lim joylashgan guruhlar boshida ochiq
    const initiallyOpen = directorMenu
        .filter((e): e is NavGroup => isGroup(e) && e.children.some((c) => isActive(c.href)))
        .map((g) => g.title);

    const [open, setOpen] = useState<string[]>(initiallyOpen);
    const toggle = (title: string) =>
        setOpen((prev) => (prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]));

    return (
        <aside
            className={`h-full flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ${collapsed ? "w-20" : "w-64"
                }`}
        >
            {/* HEADER: logo + collapse tugmasi */}
            <div
                className={`flex items-center shrink-0 transition-all duration-300 ${collapsed ? "px-3 py-6 justify-center" : "p-6 justify-between gap-3"
                    }`}
            >
                {!collapsed && (
                    <div className="flex items-center gap-3 overflow-hidden">
                        <Image
                            src={theme === "dark" ? LogoIcons.logoDark : LogoIcons.logo}
                            alt="EduMRX Logo"
                            priority
                        />
                    </div>
                )}

                <button
                    onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
                    className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-all duration-200 cursor-pointer shrink-0"
                    title={collapsed ? t("director.nav.expand") : t("director.nav.collapse")}
                >
                    {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                </button>
            </div>

            {/* NAV BODY */}
            <nav className="flex-1 overflow-y-auto overflow-x-hidden pb-4">
                {collapsed
                    ? // ── COLLAPSED: ikonlar + tooltip ──
                    directorMenu.map((entry, i) =>
                        isGroup(entry) ? (
                            <Fragment key={entry.title}>
                                {i > 0 && <div className="my-2 mx-3 border-t border-slate-100 dark:border-slate-800" />}
                                {entry.children.map((c) => (
                                    <NavItemLink key={c.href} item={c} active={isActive(c.href)} collapsed onNavigate={onNavigate} />
                                ))}
                            </Fragment>
                        ) : (
                            <NavItemLink key={entry.href} item={entry} active={isActive(entry.href)} collapsed onNavigate={onNavigate} />
                        )
                    )
                    : // ── EXPANDED: accordion ──
                    directorMenu.map((entry) =>
                        isGroup(entry) ? (
                            <GroupItem
                                key={entry.title}
                                group={entry}
                                open={open.includes(entry.title)}
                                onToggle={() => toggle(entry.title)}
                                isActive={isActive}
                                onNavigate={onNavigate}
                            />
                        ) : (
                            <NavItemLink key={entry.href} item={entry} active={isActive(entry.href)} onNavigate={onNavigate} />
                        )
                    )}
            </nav>
        </aside>
    );
}

// ── Nav link ────────────────────────────────────────────────
function NavItemLink({
    item,
    active,
    collapsed = false,
    nested = false,
    onNavigate,
}: {
    item: NavLink;
    active: boolean;
    collapsed?: boolean;
    nested?: boolean;
    onNavigate?: () => void;
}) {
    const { t } = useTranslation();
    const Icon = item.icon;
    return (
        <Link
            href={item.href}
            onClick={onNavigate}
            title={collapsed ? t(item.title) : undefined}
            className={`
        group relative flex items-center rounded-xl
        transition-all duration-200 font-medium mb-1
        ${nested ? "text-[13px]" : "text-sm"}
        ${collapsed ? "mx-2 px-0 py-3 justify-center" : nested ? "mx-3 pl-11 pr-4 py-2.5 gap-3" : "mx-3 px-4 py-3 gap-4"}
        ${active
                    ? "bg-[#4F46E5] text-white shadow-sm shadow-indigo-500/20"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }
      `}
        >
            <Icon className={`${nested ? "w-[18px] h-[18px]" : "w-5 h-5"} shrink-0 ${active ? "" : "opacity-70 group-hover:opacity-100"}`} />

            {!collapsed && (
                <span className="whitespace-nowrap overflow-hidden transition-all duration-300 w-auto opacity-100">
                    {t(item.title)}
                </span>
            )}

            {collapsed && (
                <div className="absolute left-full ml-2 px-3 py-1.5 bg-slate-900 dark:bg-slate-700 text-white text-xs font-medium rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[9999] whitespace-nowrap pointer-events-none">
                    {t(item.title)}
                    <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-900 dark:bg-slate-700 rotate-45" />
                </div>
            )}
        </Link>
    );
}

// ── Ochiladigan guruh (accordion) ──────────────────────────
function GroupItem({
    group,
    open,
    onToggle,
    isActive,
    onNavigate,
}: {
    group: NavGroup;
    open: boolean;
    onToggle: () => void;
    isActive: (href: string) => boolean;
    onNavigate?: () => void;
}) {
    const { t } = useTranslation();
    const Icon = group.icon;
    const hasActiveChild = group.children.some((c) => isActive(c.href));

    return (
        <div className="mb-1">
            <button
                type="button"
                onClick={onToggle}
                className={`
          group relative flex items-center rounded-xl
          transition-all w-[90%] duration-200 text-sm font-medium mx-3 px-4 py-3  gap-4
          ${hasActiveChild && !open
                        ? "text-[#4F46E5] dark:text-indigo-400"
                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }
        `}
            >
                <Icon className="w-5 h-5 shrink-0 opacity-70 group-hover:opacity-100" />
                <span className="flex-1 text-left whitespace-nowrap">{t(group.title)}</span>
                <ChevronDown className={`w-4 h-4 shrink-0 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
            </button>

            {/* Silliq ochilish */}
            <div className={`grid transition-[grid-template-rows] duration-200 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden">
                    <div className="mt-1">
                        {group.children.map((c) => (
                            <NavItemLink key={c.href} item={c} active={isActive(c.href)} nested onNavigate={onNavigate} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}