"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Logo from "./Logo";

/**
 * Desktop (md+): the sidebar sits beside the page as usual.
 * Mobile: a slim top bar with a menu button; the sidebar opens as a drawer over the page
 * and closes on navigation, on the backdrop, or with Escape.
 */
export default function SideNavShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Navigating to another page closes the drawer.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* Mobile top bar */}
      <header className="flex h-14 flex-none items-center justify-between gap-3 bg-primary-600 px-3 md:hidden">
        <Link href="/ems" className="flex min-w-0 items-center">
          <Logo logoSize={32} nameWidth={96} textSize="9px" />
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="فتح القائمة"
          aria-expanded={open}
          aria-controls="side-nav"
          className="inline-flex h-10 w-10 flex-none cursor-pointer items-center justify-center rounded-lg text-white hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>
      </header>

      {/* Backdrop (mobile, drawer open) */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/50 md:hidden"
          aria-hidden="true"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar: drawer on mobile, static column on desktop */}
      <div
        id="side-nav"
        className={`${
          open ? "fixed inset-y-0 start-0 z-50 block w-72 max-w-[85vw]" : "hidden"
        } md:static md:z-auto md:block md:w-64 md:max-w-none md:flex-none`}
      >
        {open && (
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="إغلاق القائمة"
            className="absolute end-4 top-4 z-10 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-white hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white md:hidden"
          >
            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
        {children}
      </div>
    </>
  );
}
