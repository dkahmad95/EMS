"use client";

import { useState } from "react";
import CitiesTab from "./Components/PreperationsTab/CitiesTab";
import OfficesTab from "./Components/PreperationsTab/OfficesTab";
import PermissionsTab from "./Components/PreperationsTab/PermissionsTab";
import PermissionGroupsTab from "./Components/PreperationsTab/PermissionGroupsTab";
import EducationLevelsTab from "./Components/PreperationsTab/EducationLevelsTab";
import JobTitlesTab from "./Components/PreperationsTab/JobTitlesTab";

import {
  MapPinIcon,
  BuildingOfficeIcon,
  LockClosedIcon,
  UserGroupIcon,
  AcademicCapIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";

export const tabs = [
  { id: "cities", label: "المدن", icon: <MapPinIcon className="h-5 w-5" /> },
  { id: "offices", label: "المكاتب", icon: <BuildingOfficeIcon className="h-5 w-5" /> },
  { id: "permissions", label: "الصلاحيات", icon: <LockClosedIcon className="h-5 w-5" /> },
  { id: "groups", label: "مجموعات الصلاحيات", icon: <UserGroupIcon className="h-5 w-5" /> },
  { id: "educationLevels", label: "المستويات التعليمية", icon: <AcademicCapIcon className="h-5 w-5" /> },
  { id: "jobTitles", label: "المسميات الوظيفية", icon: <BriefcaseIcon className="h-5 w-5" /> },
];

export default function TajhizatPage() {
  const [activeTab, setActiveTab] = useState("cities");

  const renderTabContent = () => {
    switch (activeTab) {
      case "cities":
        return <CitiesTab />;
      case "offices":
        return <OfficesTab />;
      case "permissions":
        return <PermissionsTab />;
      case "groups":
        return <PermissionGroupsTab />;
      case "educationLevels":
        return <EducationLevelsTab />;
      case "jobTitles":
        return <JobTitlesTab />;
      default:
        return (
          <div className="text-gray-500 text-center mt-10">
            يرجى اختيار تبويب من القائمة
          </div>
        );
    }
  };

  return (
    <div dir="rtl" className="font-[Tajawal] flex flex-col md:flex-row h-[calc(100vh-100px)] bg-gray-50">
      {/* Sidebar / Top Tabs */}
      <div className="w-full md:w-1/4 border-b md:border-b-0 md:border-l border-gray-200 bg-white shadow-md p-3 md:p-4">
        <h2 className="text-lg font-semibold mb-3 md:mb-4 text-gray-700 text-center md:text-right">
          الإعدادات
        </h2>

        {/* Tabs list */}
        <ul className="flex md:flex-col flex-wrap justify-center gap-2 md:space-y-2">
          {tabs.map((tab) => (
            <li key={tab.id} className="flex-1 md:flex-none">
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center md:justify-start w-full gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all
                ${
                  activeTab === tab.id
                    ? "bg-green-700 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {tab.icon}
                <span className="text-[15px]">{tab.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1  md:p-6 overflow-y-auto">{renderTabContent()}</div>
    </div>
  );
}
