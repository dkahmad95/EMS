"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePermissions } from "@/app/hooks/usePermissions";
import GovernoratesTab from "./Components/PreperationsTab/GovernoratesTab";
import DistrictsTab from "./Components/PreperationsTab/DistrictsTab";
import CitiesTab from "./Components/PreperationsTab/CitiesTab";
import OfficesTab from "./Components/PreperationsTab/OfficesTab";
import PermissionGroupsTab from "./Components/PreperationsTab/PermissionGroupsTab";
import EducationLevelsTab from "./Components/PreperationsTab/EducationLevelsTab";
import JobTitlesTab from "./Components/PreperationsTab/JobTitlesTab";
import CurrenciesTab from "./Components/PreperationsTab/CurrencyTab";
import DestinationsTab from "./Components/PreperationsTab/DestinationTab";

import {
  ShieldExclamationIcon,
} from "@heroicons/react/24/outline";

// Tabs for preparation section
const preparationTabs = [
  { id: "governorates", label: "المحافظات" },
  { id: "districts", label: "الأقضية" },
  { id: "cities", label: "المدن" },
  { id: "offices", label: "المكاتب" },
  { id: "educationLevels", label: "المستويات التعليمية" },
  { id: "jobTitles", label: "المسميات الوظيفية" },
  { id: "currencies", label: "العملات" },
  { id: "destinations", label: "الوجهات" },
  { id: "groups", label: "مجموعات الصلاحيات" },
];

export default function PreperationsPage() {
  const router = useRouter();
  const { canAccessControlPanel, isLoading } = usePermissions();

  const [activeTab, setActiveTab] = useState<string>(""); // for preparation tabs

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }

  if (!canAccessControlPanel()) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <ShieldExclamationIcon className="w-24 h-24 text-red-500 mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">غير مصرح</h1>
        <p className="text-gray-600 mb-6 text-center max-w-md">
          ليس لديك صلاحية للوصول إلى لوحة التحكم. يرجى الاتصال بالمسؤول إذا كنت تعتقد أن هذا خطأ.
        </p>
        <button
          onClick={() => router.push("/ems")}
          className="px-6 py-2 bg-green-700 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          العودة إلى الصفحة الرئيسية
        </button>
      </div>
    );
  }

  const renderPreparationContent = () => {
    switch (activeTab) {
      case "governorates":
        return <GovernoratesTab />;
      case "districts":
        return <DistrictsTab />;
      case "cities":
        return <CitiesTab />;
      case "offices":
        return <OfficesTab />;
      case "educationLevels":
        return <EducationLevelsTab />;
      case "jobTitles":
        return <JobTitlesTab />;
      case "currencies":
        return <CurrenciesTab />;
      case "destinations":
        return <DestinationsTab />;
      case "groups":
        return <PermissionGroupsTab />;
      default:
        return (
          <div className="text-gray-500 text-center mt-10 font-semibold">
            يرجى اختيار تبويب من القائمة
          </div>
        );
    }
  };

  return (
    <div
      dir="rtl"
      className="font-[Tajawal] flex flex-col md:flex-row h-[calc(100vh-100px)] bg-gray-50"
    >
      {/* Sidebar / Section Toggle */}
      <div className="w-full md:w-[200px] border-b md:border-b-0 md:border-l border-gray-200 bg-white shadow-md p-3 md:p-4">
        <h2 className="text-lg md:text-2xl underline font-semibold mb-3 md:mb-4 text-gray-700 text-center md:text-right">
          الإعدادات
        </h2>

        <ul className="flex md:flex-col flex-wrap justify-center gap-2 md:space-y-2">
          {preparationTabs.map((tab) => (
            <li key={tab.id} className="flex-1 md:flex-none">
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

      {/* Main Content */}
      <div className="flex-1 md:p-6 overflow-y-auto mt-8">
        {renderPreparationContent()}
      </div>
    </div>
  );
}