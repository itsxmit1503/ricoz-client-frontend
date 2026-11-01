import { Database, History, KeyRound, LayoutDashboard, Settings, Users, type LucideIcon } from "lucide-react";

export const adminNav: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/roles", label: "Roles & Permissions", icon: KeyRound },
  { href: "/admin/master-data", label: "Master Data", icon: Database },
  { href: "/admin/audit-logs", label: "Audit Logs", icon: History },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];
