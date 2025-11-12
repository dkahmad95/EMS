"use client";

import { useState, useEffect } from "react";
import { CreateButton } from "../Components/CreateButton";
import EmployeesTable from "./Components/EmployeesTable";
import SearchBar from "../Components/SearchBar";
import { Select, MenuItem } from "@mui/material";

const EmployeesList = () => {
  const [officeFilter, setOfficeFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState<any[]>([]);
  const [officeOptions, setOfficeOptions] = useState<{ value: string; label: string }[]>([]);

  // Load employees from localStorage
  useEffect(() => {
    const storedEmployees = JSON.parse(localStorage.getItem("employees") || "[]");
    setEmployees(storedEmployees);

    // Get unique office locations from employees
    const offices = Array.from(
      new Set(storedEmployees.map((emp: any) => emp.officeLocation))
    ) as string[];
    const officeList = [{ value: "all", label: "جميع المكاتب" }, ...offices.map((o) => ({ value: o, label: o }))];
    setOfficeOptions(officeList);
  }, []);

  // Filter employees based on office and search term
  const filteredEmployees = employees.filter((emp) => {
    const matchesOffice = officeFilter === "all" || emp.officeLocation === officeFilter;
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.phoneNumbers.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesOffice && matchesSearch;
  });

  return (
    <main className="w-full">
      <div className="flex flex-col w-full items-center justify-between gap-y-2 md:flex-row">
        <h1 className="text-2xl">قائمة الموظفين</h1>
      </div>

      <div className="flex-col md:flex-row my-4 flex items-start md:items-center justify-between gap-2 md:mt-8">
      
          <Select
            id="officeLocation"
            value={officeFilter}
            onChange={(event) => setOfficeFilter(event.target.value)}
          >
            {officeOptions.map((location) => (
              <MenuItem key={location.value} value={location.value}>
                {location.label}
              </MenuItem>
            ))}
          </Select>
         
    

     <div className="flex md:justify-center">
          <SearchBar value={searchTerm} onChange={(val: string) => setSearchTerm(val)} />
        </div>

        <CreateButton label="ادراج موظف" path="/EmployeesList/NewEmployee" />
      </div>

      <EmployeesTable employees={filteredEmployees} />
    </main>
  );
};

export default EmployeesList;
