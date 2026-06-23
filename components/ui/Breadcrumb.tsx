"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { ChevronRight, Home } from "lucide-react";

// URL segment (lowercase) → existing i18n translation key
const SEGMENT_KEY: Record<string, string> = {
  students:           "director.nav.students",
  teachers:           "director.nav.teachers",
  courses:            "director.nav.courses",
  groups:             "director.nav.groups",
  lessons:            "director.nav.lessons",
  attendance:         "director.nav.attendance",
  analytics:          "director.nav.analytics",
  "branch-analytics": "director.nav.branch_analytics",
  rooms:              "director.nav.rooms",
  managers:           "director.nav.managers",
  branches:           "director.nav.branches",
  payments:          "director.nav.payments",
  expenses:            "director.nav.expenses",
  profile:            "director.nav.profile",
  locations:          "director.profile.locations.title",
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const NUM_RE  = /^\d+$/;

const isId = (seg: string) => UUID_RE.test(seg) || NUM_RE.test(seg);

const capitalize = (s: string) =>
  s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, " ");

export default function Breadcrumb() {
  const { t } = useTranslation();
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);

  // Root page — no breadcrumb needed
  if (segments.length === 0) return null;

  type Item = { label: string; href: string };
  const items: Item[] = [{ label: t("director.nav.dashboard"), href: "/" }];

  let path = "";
  for (const seg of segments) {
    path += `/${seg}`;
    if (isId(seg)) {
      items.push({ label: t("common.detail"), href: path });
      continue;
    }
    const key = SEGMENT_KEY[seg];
    items.push({ label: key ? t(key) : capitalize(seg), href: path });
  }

  // Single item means we're on the home/dashboard page — nothing to render
  if (items.length <= 1) return null;

  return (
    <nav
      aria-label="breadcrumb"
      className="flex items-center flex-wrap gap-0.5 mb-5 text-sm select-none"
    >
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <span key={item.href} className="flex items-center gap-0.5">
            {idx > 0 && (
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700 mx-0.5 shrink-0" />
            )}

            {isLast ? (
              <span className="font-semibold text-slate-800 dark:text-white">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="flex items-center gap-1 font-medium text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                {idx === 0 && <Home className="w-3.5 h-3.5 shrink-0" />}
                <span>{item.label}</span>
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
