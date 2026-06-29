// constants/navigation.ts
import {
  LayoutDashboard,
  BarChart3,
  TrendingUp,
  Users,
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

// ─── TEACHER (namuna) ───────────────────────────────────
export const teacherMenu: NavItem[] = [
  { title: "Dashboard", href: "/teacher", icon: LayoutDashboard },
  { title: "Guruhlarim", href: "/teacher/groups", icon: Users },
  { title: "Profil", href: "/teacher/profile", icon: User },
];

// ─── STUDENT (namuna) ───────────────────────────────────
export const studentMenu: NavItem[] = [
  { title: "Dashboard", href: "/student", icon: LayoutDashboard },
  { title: "To'lovlarim", href: "/student/payments", icon: CreditCard },
  { title: "Profil", href: "/student/profile", icon: User },
];
