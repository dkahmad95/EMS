import { PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export function CreateButton({ label, path }: { label: string; path: string }) {
  return (
    <Link href={path} className="inline-block">
      <button className="flex h-10 items-center justify-center min-w-[180px] rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 px-6 text-sm font-medium text-white transition-all duration-200 hover:from-primary-700 hover:to-primary-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 active:scale-95 shadow-soft hover:shadow-soft-md gap-2">
        <span>{label}</span>
        <PlusIcon className="h-5 w-5" />
      </button>
    </Link>
  );
}
