// page.tsx
"use client";
import { useEffect, useState } from "react";
import RevenueSummary from "./Components/RevenueSummary";   
import { filterRevenues } from "./utils/filterRevenues";
import { Employee, RevenueRecord } from "./utils/types";
import RevenueChart from "./Components/RevenueChart";
import Filters from "./Components/Filters";
import RevenueTable from "./Components/RevenueTable";

export default function DashboardPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [revenues, setRevenues] = useState<RevenueRecord[]>([]);
  const [offices, setOffices] = useState<{ name: string; city: string }[]>([]);
  const [filters, setFilters] = useState({
    office: "",
    employeeName: "",
    startDate: "",
    endDate: ""
  });

useEffect(() => {
  const storedEmployees = JSON.parse(localStorage.getItem("employees") || "[]");
  const storedRevenues = JSON.parse(localStorage.getItem("revenues") || "[]");
  const storedOffices = JSON.parse(localStorage.getItem("offices") || "[]");

  setEmployees(storedEmployees);
  setRevenues(storedRevenues);
  setOffices(storedOffices);
}, []);

  const filtered = filterRevenues(revenues, filters);
console.log("Filtered Revenues:", filtered);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">لوحة التحكم</h1>
      
      <Filters employees={employees} filters={filters} setFilters={setFilters} offices={offices.map(o => o.name)} />
      
      <RevenueSummary revenues={filtered} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <RevenueChart data={filtered} groupBy="employeeName" />
        <RevenueChart data={filtered} groupBy="office" />
        <RevenueChart data={filtered} groupBy="currency" />
        <RevenueChart data={filtered} groupBy="destination" />
      </div>

      <RevenueTable data={filtered} />


    </div>
  );
}
