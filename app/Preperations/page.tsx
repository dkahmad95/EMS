"use client";

import { useState } from "react";
import LocationTab from "./Components/PreperationsTab/LocationTab";
import OfficesTab from "./Components/PreperationsTab/OfficesTab";
import PermissionGroupsTab from "./Components/PreperationsTab/PermissionGroupsTab";
import EducationLevelsTab from "./Components/PreperationsTab/EducationLevelsTab";
import JobTitlesTab from "./Components/PreperationsTab/JobTitlesTab";
import CurrenciesTab from "./Components/PreperationsTab/CurrencyTab";
import DestinationsTab from "./Components/PreperationsTab/DestinationTab";
import UsersList from "../UsersList/page";

import {
  MapPinIcon,
  BuildingOfficeIcon,
  LockClosedIcon,
  UserGroupIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";

// Tabs for preparation section
const preparationTabs = [
  { id: "cities", label: "المدن", icon: <MapPinIcon className="h-5 w-5" /> },
  { id: "governorates", label: "المحافظات", icon: <GlobeAltIcon className="h-5 w-5" /> },
  { id: "districts", label: "الأقضية", icon: <MapPinIcon className="h-5 w-5" /> },
  { id: "offices", label: "المكاتب", icon: <BuildingOfficeIcon className="h-5 w-5" /> },
  { id: "educationLevels", label: "المستويات التعليمية", icon: <AcademicCapIcon className="h-5 w-5" /> },
  { id: "jobTitles", label: "المسميات الوظيفية", icon: <BriefcaseIcon className="h-5 w-5" /> },
  { id: "currencies", label: "العملات", icon: <CurrencyDollarIcon className="h-5 w-5" /> },
  { id: "destinations", label: "الوجهات", icon: <GlobeAltIcon className="h-5 w-5" /> },
  { id: "groups", label: "مجموعات الصلاحيات", icon: <LockClosedIcon className="h-5 w-5" /> },
];

export default function PreperationsPage() {
  // section toggle: "users" or "preparation"
  const [activeSection, setActiveSection] = useState<"users" | "preparation">("users");
  const [activeTab, setActiveTab] = useState<string>(""); // for preparation tabs

  const renderPreparationContent = () => {
    switch (activeTab) {
      case "cities":
        return (
          <LocationTab
            title="المدن"
            storageKey="cities"
            placeholder="أدخل اسم المدينة"
            parentStorageKey="districts"
            parentLabel="القضاء"
            parentPlaceholder="اختر القضاء"
          />
        );
      case "governorates":
        return <LocationTab title="المحافظات" storageKey="governorates" placeholder="أدخل اسم المحافظة" />;
      case "districts":
        return (
          <LocationTab
            title="الأقضية"
            storageKey="districts"
            placeholder="أدخل اسم القضاء"
            parentStorageKey="governorates"
            parentLabel="المحافظة"
            parentPlaceholder="اختر المحافظة"
          />
        );
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
    <div dir="rtl" className="font-[Tajawal] flex flex-col md:flex-row h-[calc(100vh-100px)] bg-gray-50">
      {/* Sidebar / Section Toggle */}
      <div className="w-full md:w-[200px] border-b md:border-b-0 md:border-l border-gray-200 bg-white shadow-md p-3 md:p-4">
        <h2 className="text-lg md:text-2xl underline font-semibold mb-3 md:mb-4 text-gray-700 text-center md:text-right">
          الإعدادات
        </h2>

        <div className="flex justify-center md:flex-col gap-2 md:space-y-2 mb-4">
          <button
            onClick={() => setActiveSection("users")}
            className={`flex items-center justify-center md:justify-start w-full gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all
              ${activeSection === "users" ? "bg-green-700 text-white" : "text-gray-700 hover:bg-gray-100"}`}
          >
            <UserGroupIcon className="h-5 w-5" />
            <span className="text-[15px] font-semibold">المستخدمين</span>
          </button>

          <button
            onClick={() => setActiveSection("preparation")}
            className={`flex items-center justify-center md:justify-start w-full gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all
              ${activeSection === "preparation" ? "bg-green-700 text-white" : "text-gray-700 hover:bg-gray-100"}`}
          >
            <GlobeAltIcon className="h-5 w-5" />
            <span className="text-[15px] font-semibold">الإعدادات التحضيرية</span>
          </button>
        </div>

        {/* Preparation Tabs */}
        {activeSection === "preparation" && (
          <ul className="flex md:flex-col flex-wrap justify-center gap-2 md:space-y-2">
            {preparationTabs.map((tab) => (
              <li key={tab.id} className="flex-1 md:flex-none">
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center md:justify-start w-full gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all
                    ${activeTab === tab.id ? "bg-green-700 text-white" : "text-gray-700 hover:bg-gray-100"}`}
                >
                  {tab.icon}
                  <span className="text-[15px] font-semibold">{tab.label}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 md:p-6 overflow-y-auto mt-8">
        {activeSection === "users" ? <UsersList /> : renderPreparationContent()}
      </div>
    </div>
  );
}
