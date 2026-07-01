import {
  LayoutDashboard,
  Users2,
  GraduationCap,
  CalendarDays,
  BarChart3,
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

export const teacherMenu: NavEntry[] = [
  { title: "teacher.nav.dashboard", href: "/", icon: LayoutDashboard },
  { title: "teacher.nav.groups", href: "/groups", icon: Users2 },
  { title: "teacher.nav.students", href: "/students", icon: GraduationCap },
  { title: "teacher.nav.schedule", href: "/schedule", icon: CalendarDays },
  { title: "teacher.nav.tests", href: "/tests", icon: FileCheck2 },
  { title: "teacher.nav.reports", href: "/reports", icon: BarChart3 },

  { title: "teacher.nav.settings", href: "/settings", icon: Settings },
];
