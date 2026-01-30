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
    const storedEmployees = JSON.parse(localStorage.getItem("employees") || "[]");
    const storedRevenues = JSON.parse(localStorage.getItem("revenues") || "[]");
    const storedOffices = JSON.parse(localStorage.getItem("offices") || "[]");
    const storedCurrencies = JSON.parse(localStorage.getItem("currencies") || "[]");

    setEmployees(storedEmployees);
    setRevenues(storedRevenues);
    setOffices(storedOffices);
    setCurrencies(storedCurrencies);
  }, []);

  const filtered = filterRevenues(revenues, filters);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">لوحة التحكم</h1>
          <p className="text-slate-600">نظرة عامة على الإيرادات والأداء</p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg border border-primary-200/50">
          <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span className="text-sm font-medium text-primary-700">تحليلات مباشرة</span>
        </div>
      </div>

      {/* Filters */}
      <div className="card card-hover">
        <Filters
          employees={employees}
          filters={filters}
          setFilters={setFilters}
          offices={offices.map((o) => o.name)}
          currencies={currencies}
        />
      </div>

      {/* Revenue Summary */}
      <RevenueSummary revenues={filtered} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RevenueChart data={filtered} groupBy="employeeName" />
        <RevenueChart data={filtered} groupBy="office" />
        <RevenueChart data={filtered} groupBy="currency" />
        <RevenueChart data={filtered} groupBy="destination" />
      </div>

      {/* Time Chart */}
      <div className="card card-hover">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
          <h2 className="text-xl font-bold text-slate-900">الإيرادات مع مرور الوقت</h2>
        </div>
        <RevenueTimeChart data={filtered} />
      </div>

      {/* Revenue Table */}
      <RevenueTable data={filtered} />
    </div>
  );
}
