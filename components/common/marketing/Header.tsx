"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
    GraduationCap,
    Menu,
    X,
    Sun,
    Moon,
    Globe,
    ChevronDown,
    ArrowRight,
} from "lucide-react";
import { useUIStore } from "@/store/useUIStore";

const LANGUAGES = [
    { code: "uz", label: "O'zbek", flag: "🇺🇿" },
    { code: "ru", label: "Русский", flag: "🇷🇺" },
    { code: "en", label: "English", flag: "🇬🇧" },
];

export default function Header() {
    const { t, i18n } = useTranslation();
    const { theme, setTheme } = useUIStore();
    const pathname = usePathname();

    const [mounted, setMounted] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => setMobileOpen(false), [pathname]);

    const navLinks = [
        { label: t("nav.home", "Bosh sahifa"), href: "/" },
        { label: t("nav.features", "Imkoniyatlar"), href: "/features" },
        { label: t("nav.pricing", "Tariflar"), href: "/pricing" },
        { label: t("nav.about", "Biz haqimizda"), href: "/about" },
        { label: t("nav.contact", "Bog'lanish"), href: "/contact" },
    ];

    const currentLang = LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];

    const isActive = (href: string) =>
        href === "/" ? pathname === "/" : pathname.startsWith(href);

    const [loginUrl, setLoginUrl] = useState("https://login.edumrx.uz");

    useEffect(() => {
        if (window.location.hostname === "localhost") {
            setLoginUrl("/login");
        }
    }, []);

    return (
        <>
            {/* Floating pill navbar */}
            <div className="fixed top-0 inset-x-0 z-50 flex justify-center px-4">
                <motion.header
                    initial={{ y: -24, opacity: 0 }}
                    animate={{ y: scrolled ? 12 : 16, opacity: 1 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className={`w-full max-w-5xl transition-all duration-300 rounded-2xl ${scrolled
                        ? "bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border border-slate-200/60 dark:border-slate-700/50 shadow-lg shadow-slate-900/5"
                        : "bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/40 dark:border-slate-800/40"
                        }`}
                >
                    <nav className="px-3 sm:px-4 h-14 flex items-center justify-between gap-2">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 group shrink-0 pl-1">
                            <motion.div
                                whileHover={{ rotate: -8, scale: 1.08 }}
                                transition={{ type: "spring", stiffness: 400 }}
                                className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/30"
                            >
                                <GraduationCap className="w-[18px] h-[18px] text-white" />
                            </motion.div>
                            <span className="font-black text-base tracking-tight text-slate-900 dark:text-white">
                                EduMRX
                            </span>
                        </Link>

                        {/* Desktop nav - center */}
                        <div className="hidden lg:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`relative px-3 py-1.5 text-[13px] font-semibold rounded-lg transition-colors ${isActive(link.href)
                                        ? "text-white"
                                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                        }`}
                                >
                                    <span className="relative z-10">{link.label}</span>
                                    {isActive(link.href) && (
                                        <motion.div
                                            layoutId="nav-pill"
                                            className="absolute inset-0 bg-indigo-600 rounded-lg shadow-md shadow-indigo-500/30"
                                            transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            ))}
                        </div>

                        {/* Right controls */}
                        <div className="flex items-center gap-1 shrink-0">
                            {/* Language */}
                            <div className="relative">
                                <button
                                    onClick={() => setLangOpen(!langOpen)}
                                    className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[13px] font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-colors"
                                >
                                    <Globe className="w-4 h-4" />
                                    <span className="hidden sm:inline uppercase">{currentLang.code}</span>
                                    <ChevronDown className={`w-3 h-3 transition-transform ${langOpen ? "rotate-180" : ""}`} />
                                </button>

                                <AnimatePresence>
                                    {langOpen && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setLangOpen(false)} />
                                            <motion.div
                                                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute right-0 top-full mt-2 w-40 z-20 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl py-1"
                                            >
                                                {LANGUAGES.map((lang) => (
                                                    <button
                                                        key={lang.code}
                                                        onClick={() => {
                                                            i18n.changeLanguage(lang.code);
                                                            setLangOpen(false);
                                                        }}
                                                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium transition-colors ${i18n.language === lang.code
                                                            ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30"
                                                            : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                                                            }`}
                                                    >
                                                        <span className="text-base">{lang.flag}</span>
                                                        <span>{lang.label}</span>
                                                    </button>
                                                ))}
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Theme toggle */}
                            {mounted && (
                                <button
                                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                    className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-colors"
                                >
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={theme}
                                            initial={{ rotate: -90, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: 90, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                                        </motion.div>
                                    </AnimatePresence>
                                </button>
                            )}

                            {/* Login */}
                            <a
                                href={loginUrl}
                                className="hidden sm:inline-flex group h-8 px-3.5 ml-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-bold rounded-lg items-center gap-1 transition-all shadow-md shadow-indigo-500/25"
                            >
                                <span>{t("nav.login", "Kirish")}</span>
                                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </a>

                            {/* Mobile burger */}
                            <button
                                onClick={() => setMobileOpen(true)}
                                className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                        </div>
                    </nav>
                </motion.header>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
                            onClick={() => setMobileOpen(false)}
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed right-0 top-0 bottom-0 z-50 w-72 bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 lg:hidden"
                        >
                            <div className="flex items-center justify-between px-5 h-16 border-b border-slate-200 dark:border-slate-800">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                                        <GraduationCap className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="font-black text-slate-900 dark:text-white">EduMRX</span>
                                </div>
                                <button
                                    onClick={() => setMobileOpen(false)}
                                    className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-4 space-y-1">
                                {navLinks.map((link, i) => (
                                    <motion.div
                                        key={link.href}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <Link
                                            href={link.href}
                                            className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${isActive(link.href)
                                                ? "bg-indigo-600 text-white"
                                                : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                                                }`}
                                        >
                                            {link.label}
                                        </Link>
                                    </motion.div>
                                ))}

                                <a
                                    href={loginUrl}
                                    className="flex items-center justify-center gap-1.5 mt-4 h-11 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors"
                                >
                                    <span>{t("nav.login", "Kirish")}</span>
                                    <ArrowRight className="w-4 h-4" />
                                </a>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}