"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePermissions } from "@/app/hooks/usePermissions";
import GovernoratesTab      from "./Components/PreperationsTab/GovernoratesTab";
import DistrictsTab         from "./Components/PreperationsTab/DistrictsTab";
import CitiesTab            from "./Components/PreperationsTab/CitiesTab";
import OfficesTab           from "./Components/PreperationsTab/OfficesTab";
import PermissionGroupsTab  from "./Components/PreperationsTab/PermissionGroupsTab";
import EducationLevelsTab   from "./Components/PreperationsTab/EducationLevelsTab";
import JobTitlesTab         from "./Components/PreperationsTab/JobTitlesTab";
import CurrenciesTab        from "./Components/PreperationsTab/CurrencyTab";
import DestinationsTab      from "./Components/PreperationsTab/DestinationTab";
import { ShieldExclamationIcon } from "@heroicons/react/24/outline";
import { Button } from "@/app/Components/Button";

const preparationTabs = [
  { id: "governorates",    label: "المحافظات" },
  { id: "districts",       label: "الأقضية" },
  { id: "cities",          label: "المدن" },
  { id: "offices",         label: "المكاتب" },
  { id: "educationLevels", label: "المستويات التعليمية" },
  { id: "jobTitles",       label: "المسميات الوظيفية" },
  { id: "currencies",      label: "العملات" },
  { id: "destinations",    label: "الوجهات" },
  { id: "groups",          label: "مجموعات الصلاحيات" },
];

export default function PreperationsPage() {
  const router = useRouter();
  const { canAccessControlPanel, isLoading } = usePermissions();
  const [activeTab, setActiveTab] = useState<string>("");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-t-transparent border-primary-500" />
      </div>
    );
  }

  if (!canAccessControlPanel()) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center mb-5">
          <ShieldExclamationIcon className="w-8 h-8 text-rose-500" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">غير مصرح</h1>
        <p className="text-sm text-gray-500 mb-6 max-w-sm">
          ليس لديك صلاحية للوصول إلى إدارة النظام. يرجى الاتصال بالمسؤول.
        </p>
        <Button variant="primary" onClick={() => router.push("/ems")}>
          العودة إلى الرئيسية
        </Button>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "governorates":    return <GovernoratesTab />;
      case "districts":       return <DistrictsTab />;
      case "cities":          return <CitiesTab />;
      case "offices":         return <OfficesTab />;
      case "educationLevels": return <EducationLevelsTab />;
      case "jobTitles":       return <JobTitlesTab />;
      case "currencies":      return <CurrenciesTab />;
      case "destinations":    return <DestinationsTab />;
      case "groups":          return <PermissionGroupsTab />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-500">اختر تبويباً من القائمة الجانبية</p>
          </div>
        );
    }
  };

  return (
<<<<<<< HEAD
    <div className="animate-fade-in space-y-5">
      {/* Page header */}
      <div className="page-header">
        <h1 className="page-title">إدارة النظام</h1>
        <p className="page-subtitle">ضبط إعدادات النظام والبيانات الأساسية</p>
      </div>

      <div className="flex flex-col md:flex-row gap-5 min-h-[calc(100vh-14rem)]">

        {/* Tab sidebar */}
        <div className="w-full md:w-52 flex-shrink-0">
          <div className="card p-3">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest px-2 mb-2">
              الإعدادات
            </p>
            <nav className="flex md:flex-col flex-wrap gap-1">
              {preparationTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center w-auto md:w-full text-right px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-all duration-150 cursor-pointer
                    ${activeTab === tab.id
                      ? "bg-primary-600 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content area */}
        <div className="card flex-1 p-5 md:p-6 overflow-y-auto">
          {renderContent()}
        </div>
=======
  <div
  dir="rtl"
  className="font-[Tajawal] flex flex-col md:flex-row min-h-screen bg-gray-50"
>
     <div className="w-full md:w-64 md:min-h-screen border-b md:border-b-0 md:border-l border-gray-200 bg-white shadow-md p-3 md:p-4">
        <h2 className="text-lg md:text-2xl underline font-semibold mb-3 md:mb-4 text-gray-700 text-center md:text-right">
          الإعدادات
        </h2>

       <ul className="flex md:flex-col overflow-x-auto md:overflow-visible gap-2 md:space-y-2">
          {preparationTabs.map((tab) => (
            <li key={tab.id}  className="min-w-[120px] md:min-w-0">
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center md:justify-start w-full gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all
                    ${activeTab === tab.id
                    ? "bg-green-700 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                <span className="text-[15px] font-semibold">{tab.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

   <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
        {renderPreparationContent()}
>>>>>>> 118aed278bc0a08f6ab9eba9ee6940dd91e7eb9f
      </div>
    </div>
  );
}
