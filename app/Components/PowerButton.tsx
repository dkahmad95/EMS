"use client";
import { PowerIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

interface PowerButtonProps {
  handleUserChange: () => void;
}

const PowerButton = ({ handleUserChange }: PowerButtonProps) => {
  const router = useRouter();

  return (
    <button
      className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-green-800 md:flex-none md:justify-start md:p-2 md:px-3"
      onClick={async () => {
        handleUserChange(); // call the function
        // // Example: redirect to login page after logout
        // router.push("/login");
      }}
    >
      <PowerIcon className="w-6" />
      <div className="hidden md:block text-lg">خروج</div>
    </button>
  );
};

export default PowerButton;
