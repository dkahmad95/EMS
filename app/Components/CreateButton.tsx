import { PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export function CreateButton({label , path}:{label:string, path: string}) {
  return (
    <Link
      href={path}
      className="flex h-10 items-center rounded-lg  "
    >
      <button    className="flex h-10 items-center justify-center min-w-[180px] rounded-lg bg-green-800 px-6 text-sm font-medium text-white transition-colors hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-800 gap-2" >
      <span className="">{label}</span>
      
      <PlusIcon className="h-5 " />
      </button>
    </Link>
  );
}