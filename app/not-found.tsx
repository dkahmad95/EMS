import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center md:min-h-full bg-white text-gray-800 px-4" dir="rtl">
      <h1 className=" text-4xl font-bold text-green-800 mb-4"> غير موجود</h1>
      <p className="text-lg text-center mb-6 text-gray-700">
        لم نتمكن من العثور على المورد المطلوب.
      </p>
      <Link
        href="/"
        className="px-6 py-2 bg-green-800 text-white rounded-lg hover:bg-green-800 transition-colors"
      >
        العودة للرئيسية
      </Link>
    </div>
  );
}
