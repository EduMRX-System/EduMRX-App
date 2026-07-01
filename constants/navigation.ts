// constants/navigation.ts
import {
  LayoutDashboard,
  BarChart3,
  TrendingUp,
  Users,
  Users2,
  Building2,
  CreditCard,
  Wallet,
  Bell,
  Settings,
  User,
  type LucideIcon,
  ClipboardCheck,
  UserCog,
  GraduationCap,
  Layers,
  CalendarDays,
  BookOpen,
  FileCheck2,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export const directorMenu: NavItem[] = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Analitika", href: "/analytics", icon: BarChart3 },
  { title: "Filial tahlili", href: "/branch-analytics", icon: TrendingUp },

  { title: "O'quvchilar", href: "/students", icon: GraduationCap },
  { title: "O'qituvchilar", href: "/teachers", icon: UserCog },
  { title: "Davomat", href: "/attendance", icon: ClipboardCheck },

  { title: "Menejerlar", href: "/managers", icon: Users },
  { title: "Filiallar", href: "/branches", icon: Building2 },
  { title: "To'lovlar", href: "/payments", icon: CreditCard },
  { title: "Xarajatlar", href: "/expenses", icon: Wallet },
  { title: "Profil", href: "/profile", icon: User },
];

// ─── MANAGER ────────────────────────────────────────────
export const managerMenu: NavItem[] = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "O'quvchilar", href: "/students", icon: Users },
  { title: "O'qituvchilar", href: "/teachers", icon: UserCog },
  { title: "Guruhlar", href: "/groups", icon: Building2 },
  { title: "Davomat", href: "/attendance", icon: ClipboardCheck },
  { title: "Analitika", href: "/analytics", icon: BarChart3 },
  { title: "Xonalar", href: "/rooms", icon: User },
  { title: "Xarajatlar", href: "/expenses", icon: CreditCard },
  { title: "Sozlamalar", href: "/settings", icon: User },
];

// ─── TEACHER ────────────────────────────────────────────
export const teacherMenu: NavItem[] = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Guruhlarim", href: "/groups", icon: Users2 },
  { title: "O'quvchilar", href: "/students", icon: GraduationCap },
  { title: "Dars jadvali", href: "/schedule", icon: CalendarDays },
  { title: "Testlar", href: "/tests", icon: FileCheck2 },
  { title: "Hisobotlar", href: "/reports", icon: BarChart3 },
  { title: "Sozlamalar", href: "/settings", icon: Settings },
];

// ─── STUDENT ────────────────────────────────────────────
export const studentMenu: NavItem[] = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Guruhlarim", href: "/groups", icon: Users2 },
  { title: "Dars jadvali", href: "/schedule", icon: CalendarDays },
  { title: "Davomat", href: "/attendance", icon: ClipboardCheck },
  { title: "Uy vazifalari", href: "/homeworks", icon: BookOpen },
  { title: "Testlar", href: "/tests", icon: FileCheck2 },
  { title: "To'lovlarim", href: "/payments", icon: CreditCard },
  { title: "Sozlamalar", href: "/settings", icon: Settings },
];
