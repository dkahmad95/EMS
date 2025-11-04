

import { Construction } from "lucide-react";


export default function Home() {
  return (
    <div
      dir="rtl"
      className="flex flex-col items-center justify-center h-full  text-center px-6"
    >

        <Construction className="w-16 h-16 text-yellow-500 mb-4 animate-bounce" />
        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          🚧 هذا التطبيق قيد التطوير 🚧
        </h1>
        <p className="text-gray-600 leading-relaxed font-medium text-lg max-w-md">
          هذا التطبيق حالياً في مرحلة التطوير.
          النسخة الحالية تعرض فقط واجهة المستخدم وتجربة للاستخدام،
          ولا تحتوي على أي وظائف فعلية بعد.
          جميع البيانات المعروضة غير دقيقة وليست نهائية.
          يمكنك القيام بجولة والتفاعل مع العناصر كما تشاء،
          تعليقاتك وملاحظاتك مهمة جداً لتحسين التجربة النهائية.
        </p>
    
    </div>
  );
}
