"use client";

import { useUIStore } from "@/store/useUIStore";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NavItem } from "@/constants/navigation"; // Siz yaratgan interface

interface LeftComponentProps {
  menuItems: NavItem[];
  roleTitle?: string;
}

export default function LeftComponent({ menuItems, roleTitle = "CRM" }: LeftComponentProps) {
  const { t } = useTranslation();
  const { setSidebarOpen, isSidebarCollapsed, setSidebarCollapsed } = useUIStore();
  const pathname = usePathname();
  const collapsed = isSidebarCollapsed;

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 transition-all duration-300 relative">
      {/* BRAND */}
      <div className={`flex items-center transition-all duration-300 ${collapsed ? "px-3 py-6 justify-center gap-0" : "p-6 justify-between gap-3"}`}>
        <div className={`flex items-center gap-3 ${collapsed ? "w-0 overflow-hidden" : ""}`}>
          <span className="w-10 h-10 text-white bg-[#4F46E5] text-base flex justify-center items-center rounded-lg font-bold shrink-0">
            EX
          </span>
          <div className={`overflow-hidden transition-all duration-300 ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}>
            <p className="text-2xl font-black text-slate-900 dark:text-white leading-none whitespace-nowrap">
              {t("brand.name")}
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold mt-1 whitespace-nowrap uppercase">
              {roleTitle}
            </p>
          </div>
        </div>

        <button
          onClick={() => setSidebarCollapsed(!collapsed)}
          className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 cursor-pointer shrink-0"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* NAVIGATSIYA */}
      <nav className="flex-1 mt-4 px-2 overflow-y-auto overflow-x-hidden">
        {menuItems.map((item, index) => {
          // Dynamic Active Logic
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={index}
              onClick={() => setSidebarOpen(false)}
              href={item.href}
              title={collapsed ? item.title : undefined}
              className={`group relative flex items-center w-full rounded-r-xl transition-all duration-200 text-sm font-medium mb-1
                ${collapsed ? "px-0 py-3 justify-center" : "px-6 py-3 gap-4"}
                ${isActive ? "bg-[#4F46E5] text-white border-l-[5px] border-[#3525CD]" : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border-l-[5px] border-transparent"}`}
            >
              {/* Ikonka render qilish */}
              {/* Eslatma: Agar ikonka string bo'lsa, uni componentga o'girib olish kerak */}
              <span className={`w-5 h-5 ${isActive ? "brightness-0 invert" : "opacity-60"}`}>
                 {/* Ikonka render logikasi */}
              </span>

              <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}>
                {item.title}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}