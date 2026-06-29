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
  AlertCircle,
  User,
  Briefcase,
  Layers,
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
  { title: "director.nav.dashboard", href: "/", icon: LayoutDashboard },

  {
      title: "director.nav.learning",
      icon: GraduationCap,
      children: [
          { title: "director.nav.students", href: "/students", icon: GraduationCap },
          { title: "director.nav.teachers", href: "/teachers", icon: UserCog },
      ],
  },
  {
      title: "director.nav.lessons_group",
      icon: BookOpen,
      children: [
          { title: "director.nav.courses", href: "/courses", icon: BookOpen },
          { title: "director.nav.groups", href: "/groups", icon: Users2 },
          { title: "director.nav.schedule", href: "/lessons", icon: CalendarDays },
          { title: "director.nav.attendance", href: "/attendance", icon: ClipboardCheck },
      ],
  },
  {
      title: "director.nav.analytics_group",
      icon: BarChart3,
      children: [
          { title: "director.nav.analytics", href: "/analytics", icon: BarChart3 },
          { title: "director.nav.branch_analytics", href: "/branch-analytics", icon: TrendingUp },
      ],
  },
  {
      title: "director.nav.management",
      icon: Briefcase,
      children: [
          { title: "director.nav.rooms", href: "/rooms", icon: DoorOpen },
          { title: "director.nav.managers", href: "/managers", icon: Users },
          { title: "director.nav.branches", href: "/branches", icon: Building2 },
      ],
  },
  {
      title: "director.nav.finance",
      icon: Wallet,
      children: [
          { title: "director.nav.payments", href: "/payments", icon: CreditCard },
          { title: "director.nav.expenses", href: "/expenses", icon: Wallet },
          { title: "director.nav.debts", href: "/debts", icon: AlertCircle },
      ],
  },

  { title: "director.nav.profile", href: "/profile", icon: User },
];