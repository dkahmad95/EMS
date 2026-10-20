"use client";

import { useRef, useState } from "react";
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
import { ShieldExclamationIcon } from "@heroicons/react/24/outline";
import { Button } from "@/app/Components/Button";
import Loader from "@/app/Components/Loader";

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

const tabId = (id: string) => `preparations-tab-${id}`;
const panelId = (id: string) => `preparations-panel-${id}`;

export default function PreperationsPage() {
  const router = useRouter();
  const { canAccessControlPanel, isLoading } = usePermissions();
  const [activeTab, setActiveTab] = useState<string>(preparationTabs[0].id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  if (!canAccessControlPanel()) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-16 h-16 bg-danger-50 text-danger-600 rounded-xl flex items-center justify-center mb-5">
          <ShieldExclamationIcon className="w-8 h-8" aria-hidden="true" />
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

  const selectTab = (index: number) => {
    const next = preparationTabs[(index + preparationTabs.length) % preparationTabs.length];
    setActiveTab(next.id);
    tabRefs.current[next.id]?.focus();
  };

  // RTL: ArrowRight goes to the previous tab, ArrowLeft to the next.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        selectTab(index - 1);
        break;
      case "ArrowLeft":
      case "ArrowDown":
        e.preventDefault();
        selectTab(index + 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        selectTab(index - 1);
        break;
      case "Home":
        e.preventDefault();
        selectTab(0);
        break;
      case "End":
        e.preventDefault();
        selectTab(preparationTabs.length - 1);
        break;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "governorates": return <GovernoratesTab />;
      case "districts": return <DistrictsTab />;
      case "cities": return <CitiesTab />;
      case "offices": return <OfficesTab />;
      case "educationLevels": return <EducationLevelsTab />;
      case "jobTitles": return <JobTitlesTab />;
      case "currencies": return <CurrenciesTab />;
      case "destinations": return <DestinationsTab />;
      case "groups": return <PermissionGroupsTab />;
      default: return null;
    }
  };

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="page-header">
        <h1 className="page-title">إدارة النظام</h1>
        <p className="page-subtitle">ضبط إعدادات النظام والبيانات الأساسية</p>
      </div>

      <div className="flex flex-col md:flex-row gap-5 min-h-[calc(100vh-14rem)]">

        {/* Tab sidebar */}
        <div className="w-full md:w-52 flex-shrink-0">
          <div className="card p-3">
            <p className="text-xs font-semibold text-gray-500 px-2 mb-2">
              الإعدادات
            </p>
            <nav
              role="tablist"
              aria-label="أقسام إدارة النظام"
              aria-orientation="vertical"
              className="flex md:flex-col flex-wrap gap-1"
            >
              {preparationTabs.map((tab, index) => {
                const selected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    ref={(el) => { tabRefs.current[tab.id] = el; }}
                    type="button"
                    role="tab"
                    id={tabId(tab.id)}
                    aria-selected={selected}
                    aria-controls={panelId(tab.id)}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActiveTab(tab.id)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className={`flex items-center w-auto md:w-full text-start px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer
                      transition-[background-color,color] duration-fast ease-out
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1
                      active:scale-[0.97]
                      ${selected
                        ? "bg-primary-50 text-primary-700 font-semibold"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content area */}
        <div
          role="tabpanel"
          id={panelId(activeTab)}
          aria-labelledby={tabId(activeTab)}
          tabIndex={0}
          className="card flex-1 p-5 md:p-6 overflow-y-auto"
        >
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
