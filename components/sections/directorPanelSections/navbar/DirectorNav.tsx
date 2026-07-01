"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/store/useUIStore";
import { LogoIcons } from "@/constants/icons";
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
    onNavigate?: () => void;
}

export default function DirectorNav({ onNavigate }: NavProps) {
    const { t } = useTranslation();
    const isActive = useActive();
    const { isSidebarCollapsed, setSidebarCollapsed, theme } = useUIStore();
    const collapsed = isSidebarCollapsed;

    const initiallyOpen = directorMenu
        .filter((e): e is NavGroup => isGroup(e) && e.children.some((c) => isActive(c.href)))
        .map((g) => g.title);

    const [open, setOpen] = useState<string[]>(initiallyOpen);
    const toggle = (title: string) =>
        setOpen((prev) => (prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]));

    return (
        <motion.aside
            initial={false}
            animate={{ width: collapsed ? 80 : 256 }}
            transition={{ type: "spring", stiffness: 300, damping: 35 }}
            className="h-full flex flex-col bg-surface border-r border-border overflow-hidden"
        >
            {/* HEADER: logo + collapse tugmasi */}
            <div
                className={`flex items-center shrink-0 ${
                    collapsed ? "px-3 py-6 justify-center" : "p-6 justify-between gap-3"
                }`}
            >
                <AnimatePresence initial={false}>
                    {!collapsed && (
                        <motion.div
                            key="logo"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="flex items-center gap-3 overflow-hidden"
                        >
                            <Image
                                src={theme === "dark" ? LogoIcons.logoDark : LogoIcons.logo}
                                alt="EduMRX Logo"
                                priority
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
                    className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg border border-border text-foreground-muted hover:bg-hover hover:text-foreground transition-colors duration-200 cursor-pointer shrink-0"
                    title={collapsed ? t("director.nav.expand") : t("director.nav.collapse")}
                >
                    <motion.div
                        animate={{ rotate: collapsed ? 0 : 180 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                        <ChevronRight className="w-5 h-5" />
                    </motion.div>
                </button>
            </div>

            {/* NAV BODY */}
            <nav className="flex-1 overflow-y-auto overflow-x-hidden pb-4">
                <AnimatePresence mode="wait" initial={false}>
                    {collapsed ? (
                        <motion.div
                            key="collapsed"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.12 }}
                        >
                            {directorMenu.map((entry, i) =>
                                isGroup(entry) ? (
                                    <Fragment key={entry.title}>
                                        {i > 0 && <div className="my-2 mx-3 border-t border-border-subtle" />}
                                        {entry.children.map((c) => (
                                            <NavItemLink
                                                key={c.href}
                                                item={c}
                                                active={isActive(c.href)}
                                                collapsed
                                                onNavigate={onNavigate}
                                            />
                                        ))}
                                    </Fragment>
                                ) : (
                                    <NavItemLink
                                        key={entry.href}
                                        item={entry}
                                        active={isActive(entry.href)}
                                        collapsed
                                        onNavigate={onNavigate}
                                    />
                                )
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="expanded"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.12 }}
                        >
                            {directorMenu.map((entry) =>
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
                                    <NavItemLink
                                        key={entry.href}
                                        item={entry}
                                        active={isActive(entry.href)}
                                        onNavigate={onNavigate}
                                    />
                                )
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </motion.aside>
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
        transition-colors duration-200 font-medium mb-1
        ${nested ? "text-[13px]" : "text-sm"}
        ${collapsed ? "mx-2 px-0 py-3 justify-center" : nested ? "mx-3 pl-11 pr-4 py-2.5 gap-3" : "mx-3 px-4 py-3 gap-4"}
        ${active
                    ? "bg-primary text-primary-fg shadow-sm shadow-primary/20"
                    : "text-foreground-muted hover:bg-hover"
                }
      `}
        >
            <Icon
                className={`${nested ? "w-[18px] h-[18px]" : "w-5 h-5"} shrink-0 ${
                    active ? "" : "opacity-70 group-hover:opacity-100"
                }`}
            />

            {!collapsed && (
                <span className="whitespace-nowrap overflow-hidden">{t(item.title)}</span>
            )}

            {collapsed && (
                <div className="absolute left-full ml-2 px-3 py-1.5 bg-foreground text-surface text-xs font-medium rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[9999] whitespace-nowrap pointer-events-none">
                    {t(item.title)}
                    <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-foreground rotate-45" />
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
          transition-colors w-[90%] duration-200 text-sm font-medium mx-3 px-4 py-3 gap-4
          ${hasActiveChild && !open
                        ? "text-primary"
                        : "text-foreground-muted hover:bg-hover"
                    }
        `}
            >
                <Icon className="w-5 h-5 shrink-0 opacity-70 group-hover:opacity-100" />
                <span className="flex-1 text-left whitespace-nowrap">{t(group.title)}</span>
                <ChevronDown
                    className={`w-4 h-4 shrink-0 text-foreground-subtle transition-transform duration-200 ${
                        open ? "rotate-180" : ""
                    }`}
                />
            </button>

            <div
                className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
            >
                <div className="overflow-hidden">
                    <div className="mt-1">
                        {group.children.map((c) => (
                            <NavItemLink
                                key={c.href}
                                item={c}
                                active={isActive(c.href)}
                                nested
                                onNavigate={onNavigate}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
