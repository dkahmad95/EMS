"use client";
import { useEffect, useState } from "react";
import RevenueSummary from "./Components/RevenueSummary";
import { filterRevenues } from "./utils/filterRevenues";
import { Employee, RevenueRecord } from "./utils/types";
import RevenueChart from "./Components/RevenueChart";
import Filters from "./Components/Filters";
import RevenueTable from "./Components/RevenueTable";
import RevenueTimeChart from "./Components/RevenueTimeChart";

export default function DashboardPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [revenues, setRevenues] = useState<RevenueRecord[]>([]);
  const [offices, setOffices] = useState<{ name: string; city: string }[]>([]);
  const [currencies, setCurrencies] = useState<{ id: number; name: string }[]>([]);
  const [filters, setFilters] = useState({
    office: "",
    employeeName: "",
    currency: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const storedEmployees  = JSON.parse(localStorage.getItem("employees")  || "[]");
    const storedRevenues   = JSON.parse(localStorage.getItem("revenues")   || "[]");
    const storedOffices    = JSON.parse(localStorage.getItem("offices")    || "[]");
    const storedCurrencies = JSON.parse(localStorage.getItem("currencies") || "[]");

    setEmployees(storedEmployees);
    setRevenues(storedRevenues);
    setOffices(storedOffices);
    setCurrencies(storedCurrencies);
  }, []);

  const filtered = filterRevenues(revenues, filters);

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="page-title">لوحة التحليل</h1>
          <p className="page-subtitle mt-1">نظرة عامة على الإيرادات والأداء</p>
        </div>
        <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full border border-primary-200 mt-1">
          <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse" />
          تحليلات مباشرة
        </span>
      </div>

      {/* Filters */}
      <div className="card p-5">
        <p className="section-title mb-3">
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            تصفية البيانات
          </span>
        </p>
        <Filters
          employees={employees}
          filters={filters}
          setFilters={setFilters}
          offices={offices.map((o) => o.name)}
          currencies={currencies}
        />
      </div>

      {/* KPI summary */}
      <RevenueSummary revenues={filtered} />

      {/* Charts grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <RevenueChart data={filtered} groupBy="employeeName" />
        <RevenueChart data={filtered} groupBy="office" />
        <RevenueChart data={filtered} groupBy="currency" />
        <RevenueChart data={filtered} groupBy="destination" />
      </div>

      {/* Time chart */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-5">
          <div className="p-2 bg-primary-100 rounded-lg">
            <svg className="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <h2 className="text-base font-semibold text-gray-900">الإيرادات مع مرور الوقت</h2>
        </div>
        <RevenueTimeChart data={filtered} />
      </div>

      {/* Revenue table */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-5">
          <div className="p-2 bg-secondary-100 rounded-lg">
            <svg className="w-4 h-4 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h2 className="text-base font-semibold text-gray-900">سجل الإيرادات</h2>
        </div>
        <RevenueTable data={filtered} />
      </div>
    </div>
  );
}
