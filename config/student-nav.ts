import {
  LayoutDashboard,
  Users2,
  CalendarDays,
  ClipboardCheck,
  CreditCard,
  BookOpen,
  FileCheck2,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavLink {
  title: string;
  href: string;
  icon: LucideIcon;
}

export interface NavGroup {
  title: string;
  icon: LucideIcon;
  children: NavLink[];
}

export type NavEntry = NavLink | NavGroup;

export const isGroup = (e: NavEntry): e is NavGroup =>
  (e as NavGroup).children !== undefined;

export const studentMenu: NavEntry[] = [
  { title: "student.nav.dashboard", href: "/", icon: LayoutDashboard },
  { title: "student.nav.groups", href: "/groups", icon: Users2 },
  { title: "student.nav.schedule", href: "/schedule", icon: CalendarDays },
  { title: "student.nav.attendance", href: "/attendance", icon: ClipboardCheck },
  { title: "student.nav.homeworks", href: "/homeworks", icon: BookOpen },
  { title: "student.nav.tests", href: "/tests", icon: FileCheck2 },
  { title: "student.nav.payments", href: "/payments", icon: CreditCard },

  { title: "student.nav.settings", href: "/settings", icon: Settings },
];
