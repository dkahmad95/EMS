'use client';

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from 'next/navigation'

import {
  UserGroupIcon,
  Cog6ToothIcon,
  BanknotesIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

const links = [
  {
    name: "لوحة التحكم",
    href: "/ems/Dashboard",
    icon: ChartBarIcon,
  },
  {
    name: "قائمة الموظفين",
    href: "/ems/EmployeesList",
    icon: UserGroupIcon,
  },
  {
    name: "الإيرادات",
    href: "/ems/Revenues",
    icon: BanknotesIcon,
  },
  {
    name: "إدارة النظام",
    href: "/ems/Preperations",
    icon: Cog6ToothIcon,
  },
];

export default function NavLinks() {
     const pathname = usePathname()

  return (
    <>
      {links.map((link) => {
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