import {
  LayoutDashboard,
  BarChart3,
  TrendingUp,
  GraduationCap,
  UserCog,
  ClipboardCheck,
  BookOpen,
  Users,
  Users2,
  Building2,
  DoorOpen,
  CalendarDays,
  CreditCard,
  Wallet,
  User,
  Briefcase,
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

export const directorMenu: NavEntry[] = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },

  {
      title: "O'quv",
      icon: GraduationCap,
      children: [
          { title: "O'quvchilar", href: "/students", icon: GraduationCap },
          { title: "O'qituvchilar", href: "/teachers", icon: UserCog },
      ],
  },
  {
      title: "Darslar",
      icon: BookOpen,
      children: [
          { title: "Kurslar", href: "/courses", icon: BookOpen },
          { title: "Guruhlar", href: "/groups", icon: Users2 },
          { title: "Dars jadvali", href: "/lessons", icon: CalendarDays },
          { title: "Davomat", href: "/attendance", icon: ClipboardCheck },
      ],
  },
  {
      title: "Analitika",
      icon: BarChart3,
      children: [
          { title: "Umumiy analitika", href: "/analytics", icon: BarChart3 },
          { title: "Filial tahlili", href: "/branch-analytics", icon: TrendingUp },
      ],
  },
  {
      title: "Boshqaruv",
      icon: Briefcase,
      children: [
          { title: "Xonalar", href: "/rooms", icon: DoorOpen },
          { title: "Menejerlar", href: "/managers", icon: Users },
          { title: "Filiallar", href: "/branches", icon: Building2 },
      ],
  },
  {
      title: "Moliya",
      icon: Wallet,
      children: [
          { title: "To'lovlar", href: "/payments", icon: CreditCard },
          { title: "Xarajatlar", href: "/expenses", icon: Wallet },
      ],
  },

  { title: "Profil", href: "/profile", icon: User },
];