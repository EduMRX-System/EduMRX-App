import {
  LayoutDashboard,
  BarChart3,
  TrendingUp,
  GraduationCap,
  UserCog,
  ClipboardCheck,
  BookOpen,
  Users2,
  DoorOpen,
  CalendarDays,
  Wallet,
  CreditCard,
  Settings,
  AlertCircle,
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

export const managerMenu: NavEntry[] = [
  { title: "manager.nav.dashboard", href: "/", icon: LayoutDashboard },

  {
    title: "manager.nav.learning",
    icon: GraduationCap,
    children: [
      { title: "manager.nav.students", href: "/students", icon: GraduationCap },
      { title: "manager.nav.teachers", href: "/teachers", icon: UserCog },
    ],
  },

  {
    title: "manager.nav.lessons_group",
    icon: BookOpen,
    children: [
      { title: "manager.nav.courses", href: "/courses", icon: BookOpen },
      { title: "manager.nav.groups", href: "/groups", icon: Users2 },
      { title: "manager.nav.attendance", href: "/attendance", icon: ClipboardCheck },
    ],
  },

  {
    title: "manager.nav.analytics_group",
    icon: BarChart3,
    children: [
      { title: "manager.nav.analytics", href: "/analytics", icon: BarChart3 },
      { title: "manager.nav.analysis", href: "/analysis", icon: TrendingUp },
      { title: "manager.nav.debtor_students", href: "/debtor-students", icon: AlertCircle },
    ],
  },

  {
    title: "manager.nav.management",
    icon: DoorOpen,
    children: [
      { title: "manager.nav.rooms", href: "/rooms", icon: DoorOpen },
    ],
  },

  {
    title: "manager.nav.finance",
    icon: Wallet,
    children: [
      { title: "manager.nav.expenses", href: "/expenses", icon: Wallet },
      { title: "manager.nav.payment_types", href: "/payment-types", icon: CreditCard },
    ],
  },

  { title: "manager.nav.settings", href: "/settings", icon: Settings },
];
