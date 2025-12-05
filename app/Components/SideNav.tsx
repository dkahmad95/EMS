
import Link from "next/link";

import NavLinks from "./NavLinks";
import Logo from "./Logo";

import PowerButton from "./PowerButton";

interface SideNavProps {
  handleUserChange: () => void;
}

export default function SideNav({ handleUserChange }: SideNavProps) {



    return (
        <div className="flex h-full flex-col px-3 py-4 md:px-2">
            <Link
                className="mb-2 flex h-20  items-center justify-start rounded-md bg-green-800 p-4 md:h-40 md:justify-center md:p-2"
                href="/"
            >
                <div className="w-32 flex items-center justify-center text-white md:w-40">
                    <Logo />
                </div>
            </Link>
            <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">

                <NavLinks />
                <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
                <PowerButton handleUserChange={handleUserChange} />
            </div>
        </div>
    );
}