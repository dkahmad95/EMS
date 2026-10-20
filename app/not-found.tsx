import Link from "next/link";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { EmptyState } from "@/app/Components/EmptyState";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 text-center">
      {/* 404 number */}
      <p className="text-8xl font-extrabold text-primary-100 leading-none select-none" aria-hidden="true">
        404
      </p>

      <EmptyState
        icon={MagnifyingGlassIcon}
        title="الصفحة غير موجودة"
        description="لم نتمكن من العثور على المورد المطلوب. ربما تم نقله أو حذفه."
        action={
          <Link
            href="/"
            className="btn-base font-semibold h-10 px-4 text-sm rounded-lg bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500"
          >
            العودة للرئيسية
          </Link>
        }
        className="h-auto"
      />
    </div>
  );
}
