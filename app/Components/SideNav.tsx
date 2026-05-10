import Link from "next/link";
import NavLinks from "./NavLinks";
import Logo from "./Logo";
import PowerButton from "./PowerButton";

export default function SideNav() {
  return (
    <div className="flex h-full py-3 pr-3"> {/* ← outer wrapper: margin/padding from edge */}
      <div className="flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm w-full">

        {/* Brand / Logo strip */}
        <Link
          href="/ems"
          className="flex items-center px-5 py-4 bg-gradient-to-l from-primary-600 to-secondary-600
                     hover:from-primary-700 hover:to-secondary-700 transition-all duration-200
                     flex-shrink-0"
        >
          <Logo />
        </Link>

        {/* Nav section */}
        <div className="flex flex-col flex-1 overflow-y-auto px-3 pt-5 pb-3">
          <p className="px-3 mb-2 text-[11px] font-semibold text-gray-400 uppercase tracking-widest hidden md:block">
            القائمة الرئيسية
          </p>

          <nav className="flex flex-row md:flex-col gap-1">
            <NavLinks />
          </nav>

          <div className="flex-1" />

          <div className="border-t border-gray-100 pt-3 mt-3">
            <PowerButton />
          </div>
        </div>

      </div>
    </div>
  );
}