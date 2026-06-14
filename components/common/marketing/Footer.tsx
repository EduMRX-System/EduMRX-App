"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-slate-950 border-t border-slate-200/60 dark:border-slate-900/60 py-8 relative z-10">
      <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-white font-black text-xs">
            E
          </div>
          <span className="font-bold text-xs text-slate-800 dark:text-white tracking-tight">
            EduMRX Premium SaaS
          </span>
        </div>

        <p className="text-[11px] font-medium text-slate-400">
          &copy; {new Date().getFullYear()} EduMRX. Barcha huquqlar
          himoyalangan.
        </p>

        <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400">
          <Link
            href="/privacy"
            className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            Xavfsizlik qoidalari
          </Link>
          <Link
            href="/terms"
            className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            Foydalanish shartlari
          </Link>
        </div>
      </div>
    </footer>
  );
}
