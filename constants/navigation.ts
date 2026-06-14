export interface NavItem {
  title: string;
  href: string;
  icon: string;
}

export const ADMIN_MENU: NavItem[] = [
  { title: "Asosiy Dashboard", href: "/admin", icon: "LayoutDashboard" },
  { title: "O'quv Markazlar", href: "/admin/centers", icon: "Building" },
  { title: "Direktorlar", href: "/admin/directors", icon: "UserCheck" },
  { title: "O'qituvchilar", href: "/admin/teachers", icon: "GraduationCap" },
  { title: "O'quvchilar", href: "/admin/students", icon: "Users" },
  { title: "Moliya", href: "/admin/financial", icon: "Wallet" },
  { title: "Sozlamalar", href: "/admin/settings", icon: "Settings" },
];