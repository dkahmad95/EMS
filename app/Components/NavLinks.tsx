'use client';

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from 'next/navigation'
import { usePermissions } from "../hooks/usePermissions";

import {
  UserGroupIcon,
  Cog6ToothIcon,
  BanknotesIcon,
  ChartBarIcon,
  UsersIcon
} from "@heroicons/react/24/outline";

const links = [
  {
    name: "لوحة التحكم",
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

export default function NavLinks() {
  const pathname = usePathname();
  const permissions = usePermissions();

  // Show loading state while permissions are being loaded
  if (permissions.isLoading) {
    return (
      <div className="flex justify-center items-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-700"></div>
      </div>
    );
  }

  return (
    <>
      {links.map((link) => {
        // Check if user has access to this link
        const hasAccess = link.checkAccess(permissions);

        // Don't render the link if user doesn't have access
        if (!hasAccess) {
          return null;
        }

        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-green-800 md:flex-none md:justify-start md:p-2 md:px-3",
              {
                "bg-sky-100 text-green-800": pathname === link.href,
              }
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}