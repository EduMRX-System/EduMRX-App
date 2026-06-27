"use client";

import { useUIStore } from "@/store/useUIStore";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NavItem } from "@/constants/navigation";

interface LeftComponentProps {
  menuItems: NavItem[];
  roleTitle?: string;
}

export default function LeftComponent({
  menuItems,
  roleTitle = "CRM",
}: LeftComponentProps) {
  const { t } = useTranslation();
  const { setSidebarOpen, isSidebarCollapsed, setSidebarCollapsed } = useUIStore();
  const pathname = usePathname();
  const collapsed = isSidebarCollapsed;

  return (
    // Floating wrapper — atrofida padding, left'ga yopishmaydi
    <div className="h-screen p-3">
      <div className="h-full flex flex-col bg-surface rounded-2xl border border-border shadow-sm transition-all duration-300 relative overflow-hidden">
        {/* BRAND */}
        <div
          className={`flex items-center transition-all duration-300 shrink-0 ${collapsed ? "px-3 py-6 justify-center gap-0" : "p-6 justify-between gap-3"
            }`}
        >
          <div className={`flex items-center gap-3 ${collapsed ? "w-0 overflow-hidden" : ""}`}>
            <span
              className={`w-10 h-10 text-white bg-[#4F46E5] text-base flex justify-center items-center rounded-xl font-bold shrink-0 ${collapsed ? "hidden" : ""
                }`}
            >
              EX
            </span>
            <div
              className={`overflow-hidden transition-all duration-300 ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                }`}
            >
              <p className="text-2xl font-black text-foreground leading-none whitespace-nowrap">
                {t("brand.name")}
              </p>
              <p className="text-foreground-muted text-[10px] font-bold mt-1 whitespace-nowrap uppercase tracking-wider">
                {roleTitle}
              </p>
            </div>
          </div>

          <button
            onClick={() => setSidebarCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg border border-border text-foreground-muted hover:bg-hover hover:text-foreground transition-all duration-200 cursor-pointer shrink-0"
            title={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* NAVIGATSIYA */}
        <nav className="flex-1 mt-4 pr-2 overflow-y-auto overflow-x-hidden">
          {menuItems.map((item, index) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                key={index}
                onClick={() => setSidebarOpen(false)}
                href={item.href}
                title={collapsed ? item.title : undefined}
                className={`
                  group relative flex items-center w-full rounded-r-xl
                  transition-all duration-200 text-sm font-medium mb-1
                  ${collapsed ? "px-0 py-3 justify-center" : "px-6 py-3 gap-4"}
                  ${isActive
                    ? "bg-[#4F46E5] text-white border-l-[5px] border-[#3525CD]"
                    : "text-foreground-muted hover:bg-hover border-l-[5px] border-transparent"
                  }
                `}
              >
                {/* Lucide ikon */}
                <Icon
                  className={`w-5 h-5 shrink-0 ${isActive ? "" : "opacity-70 group-hover:opacity-100"
                    }`}
                />

                {/* Label — collapsed holatda yashiriladi */}
                <span
                  className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                    }`}
                >
                  {item.title}
                </span>

                {/* Tooltip — faqat collapsed holatda */}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-3 py-1.5 bg-foreground text-surface text-xs font-medium rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[9999] whitespace-nowrap pointer-events-none">
                    {item.title}
                    <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-foreground rotate-45" />
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}