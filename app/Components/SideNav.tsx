import Link from "next/link";
import NavLinks from "./NavLinks";
import Logo from "./Logo";
import PowerButton from "./PowerButton";
import OfficeSwitcher from "./OfficeSwitcher";

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
          shadow-card
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
            bg-primary-600 hover:bg-primary-700
            transition-[background-color] duration-fast ease-out
            flex-shrink-0
          "
        >
          <Logo
            logoSize={40}
            nameWidth={120}
            textSize="10px"
          />
        </Link>

        {/* Office switcher */}
        <OfficeSwitcher />

        {/* Navigation */}
        <div
          className="
            flex flex-col flex-1
            overflow-y-auto
            scrollbar-hide
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
              text-xs
              font-semibold
              text-gray-500
            "
          >
            القائمة الرئيسية
          </p>

          {/* Nav */}
          <nav
            aria-label="القائمة الرئيسية"
            className="
              flex
              flex-row md:flex-col
              gap-1
              -mx-2 px-2 md:mx-0 md:px-0
              overflow-x-auto md:overflow-visible
              snap-x snap-mandatory md:snap-none
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
