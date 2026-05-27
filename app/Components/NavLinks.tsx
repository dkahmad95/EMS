'use client';

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { usePermissions } from "../hooks/usePermissions";
import {
  UserGroupIcon,
  Cog6ToothIcon,
  BanknotesIcon,
  ChartBarIcon,
  UsersIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/outline";

const links = [
  {
    name: "لوحة التحليل",
    href: "/ems/Dashboard",
    icon: ChartBarIcon,
    checkAccess: (permissions: ReturnType<typeof usePermissions>) =>
      permissions.canAccessDashboard(),
  },
  {
    name: "قائمة الموظفين",
    href: "/ems/EmployeesList",
    icon: UserGroupIcon,
    checkAccess: (permissions: ReturnType<typeof usePermissions>) =>
      permissions.hasPermission('employees', 'read'),
  },
  {
    name: "الإيرادات",
    href: "/ems/Revenues",
    icon: BanknotesIcon,
    checkAccess: (permissions: ReturnType<typeof usePermissions>) =>
      permissions.hasPermission('revenues', 'read'),
  },
  {
    name: "التحصيلات",
    href: "/ems/Collections",
    icon: ArchiveBoxIcon,
    checkAccess: (permissions: ReturnType<typeof usePermissions>) =>
      permissions.hasPermission('collections', 'read'),
  },
  {
    name: "إدارة المستخدمين",
    href: "/ems/UsersList",
    icon: UsersIcon,
    checkAccess: (permissions: ReturnType<typeof usePermissions>) =>
      permissions.hasPermission('users', 'read'),
  },
  {
    name: "إدارة النظام",
    href: "/ems/Preperations",
    icon: Cog6ToothIcon,
    checkAccess: (permissions: ReturnType<typeof usePermissions>) =>
      permissions.canAccessControlPanel(),
  },
];

interface NavLinksProps {
  collapsed?: boolean;
}

export default function NavLinks({ collapsed = false }: NavLinksProps) {
  const pathname = usePathname();
  const permissions = usePermissions();

  if (permissions.isLoading) {
    return (
      <div className="flex justify-center items-center py-4">
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-t-transparent border-primary-500" />
      </div>
    );
  }

  return (
    <>
      {links.map((link) => {
        const hasAccess = link.checkAccess(permissions);
        if (!hasAccess) return null;

        const LinkIcon = link.icon;
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.name}
            href={link.href}
            title={collapsed ? link.name : undefined}
            className={clsx(
              "nav-link",
              isActive && "nav-link-active",
              collapsed ? "justify-center px-2" : "px-3"
            )}
          >
            <LinkIcon className="w-5 h-5 flex-shrink-0" />
            <span
              className={`overflow-hidden whitespace-nowrap transition-all duration-200 ${
                collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
              }`}
            >
              {link.name}
            </span>
          </Link>
        );
      })}
    </>
  );
}