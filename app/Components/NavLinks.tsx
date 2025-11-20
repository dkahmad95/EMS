'use client';

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from 'next/navigation'



import {
  HomeIcon,
  UserGroupIcon,
  UsersIcon,
  Cog6ToothIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";

const links = [
  {
    name: "الواجهة",
    href: "/",
    icon: HomeIcon, // 🏠 Home page
  },
  {
    name: "قائمة المستخدمين",
    href: "/UsersList",
    icon: UsersIcon, // 👤 Users list
  },
  {
    name: "قائمة الموظفين",
    href: "/EmployeesList",
    icon: UserGroupIcon, // 👥 Employees list
  },
  {
    name: "الإيرادات",
    href: "/Revenues",
    icon: BanknotesIcon, // 💵 Revenues page
  },
  {
    name: "إدارة النظام",
    href: "/Preperations",
    icon: Cog6ToothIcon, // ⚙️ System settings
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