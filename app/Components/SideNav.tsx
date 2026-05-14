import Link from "next/link";
import NavLinks from "./NavLinks";
import Logo from "./Logo";
import PowerButton from "./PowerButton";

export default function SideNav() {
  return (
    <div className="h-full p-2 md:p-3">
      <div
        className="
          flex flex-col
          h-full
          bg-white
          border border-gray-200
          rounded-2xl
          shadow-sm
          overflow-hidden
        "
      >
        {/* Logo */}
        <Link
          href="/ems"
          className="
            flex items-center justify-center md:justify-start
            px-3 md:px-5
            py-3 md:py-4
            bg-gradient-to-l from-primary-600 to-secondary-600
            hover:from-primary-700 hover:to-secondary-700
            transition-all duration-200
            flex-shrink-0
          "
        >
          <Logo />
        </Link>

        {/* Navigation */}
        <div
          className="
            flex flex-col flex-1
            overflow-y-auto
            px-2 md:px-3
            pt-3 md:pt-5
            pb-2 md:pb-3
          "
        >
          {/* Title */}
          <p
            className="
              hidden md:block
              px-3 mb-2
              text-[11px]
              font-semibold
              text-gray-400
              uppercase
              tracking-widest
            "
          >
            القائمة الرئيسية
          </p>

          {/* Nav */}
          <nav
            className="
              flex
              flex-row md:flex-col
              gap-1
              overflow-x-auto md:overflow-visible
              scrollbar-hide
            "
          >
            <NavLinks />
          </nav>

          {/* Spacer */}
          <div className="flex-1 hidden md:block" />

          {/* Power Button */}
          <div
            className="
              border-t border-gray-100
              pt-3 mt-3
               md:block
            "
          >
            <PowerButton />
          </div>
        </div>
      </div>
    </div>
  );
}