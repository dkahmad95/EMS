import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 text-center"
      dir="rtl"
    >
      {/* 404 number */}
      <p className="text-8xl font-extrabold text-primary-100 leading-none select-none mb-2">
        404
      </p>

      {/* Icon */}
      <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-5 -mt-4">
        <svg
          className="w-8 h-8 text-primary-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">الصفحة غير موجودة</h1>
      <p className="text-sm text-gray-500 mb-7 max-w-sm">
        لم نتمكن من العثور على المورد المطلوب. ربما تم نقله أو حذفه.
      </p>

      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-lg
                   hover:bg-primary-700 transition-colors duration-150 shadow-sm"
      >
        العودة للرئيسية
      </Link>
    </div>
  );
}
