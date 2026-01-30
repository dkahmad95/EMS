import Link from "next/link";
import NavLinks from "./NavLinks";
import Logo from "./Logo";
import PowerButton from "./PowerButton";

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2 bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100">
      <Link
        className="mb-4 flex h-20 items-center justify-start rounded-xl bg-primary-700 p-4 md:h-40 md:justify-center md:p-2 shadow-soft-lg  overflow-hidden group"
        href="/ems"
      >
        <div className="w-32 flex items-center justify-center text-white md:w-40 relative z-10">
          <Logo />
        </div>
      </Link>
      
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-3">
        <NavLinks />
        
        <div className="hidden h-auto w-full grow rounded-xl  md:block"></div>
        
        <PowerButton />
      </div>
    </div>
  );
}
