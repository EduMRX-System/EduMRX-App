"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sun, Moon, Globe } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";

interface NavItem {
  slug: string;
  label: string;
  href: string;
}

export default function Header() {
  const pathname = usePathname();
  const { theme, language, setTheme, setLanguage } = useUIStore();

  const navItems: NavItem[] = [
    { slug: "home", label: "Bosh sahifa", href: "/" },
    { slug: "about", label: "Biz haqimizda", href: "/about" },
    { slug: "features", label: "Imkoniyatlar", href: "/features" },
    { slug: "pricing", label: "Tariflar", href: "/pricing" },
    { slug: "contact", label: "Bog'lanish", href: "/contact" },
  ];

  const languages: { code: "uz" | "en" | "ru"; label: string }[] = [
    { code: "uz", label: "UZ" },
    { code: "en", label: "EN" },
    { code: "ru", label: "RU" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/60 dark:border-slate-900/60 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto max-w-6xl h-14 px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center text-white font-black text-sm">
            E
          </div>
          <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
            EduMRX
          </span>
        </Link>

        {/* Navigation Grid */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.slug}
                href={item.href}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  isActive
                    ? "bg-slate-100 dark:bg-slate-900 text-indigo-600 dark:text-white"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Controls Layer */}
        <div className="flex items-center gap-2">
          {/* Language Menu */}
          <div className="relative group">
            <button className="h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 flex items-center gap-1.5 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
              <Globe className="w-3.5 h-3.5" />
              <span>{language.toUpperCase()}</span>
            </button>
            <div className="absolute right-0 top-full mt-1 w-20 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-1 hidden group-hover:block">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`w-full text-left px-2 py-1 text-[11px] font-bold rounded-md block transition-colors ${
                    language === l.code
                      ? "bg-slate-100 dark:bg-slate-900 text-indigo-600 dark:text-white"
                      : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme}
            className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
          >
            {theme === "light" ? (
              <Moon className="w-3.5 h-3.5" />
            ) : (
              <Sun className="w-3.5 h-3.5" />
            )}
          </button>

          {/* CTA Console Button */}
          <Link
            href="/login"
            className="h-8 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg flex items-center transition-colors"
          >
            Console Kirish
          </Link>
        </div>
      </div>
    </header>
  );
}
