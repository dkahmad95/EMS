"use client";

import { useState, useMemo } from "react";
import { Button } from "../../Components/Button";
import EmployeesTable from "./Components/EmployeesTable";
import SearchBar from "../../Components/SearchBar";
import { Select, MenuItem } from "@mui/material";
import CreateEmployeeModal from "./Components/CreateEmployee";
import { useEmployees } from "@/server/store/employees";
import { useQueryClient } from "@tanstack/react-query";

const EmployeesList = () => {
  const queryClient = useQueryClient();
  const { data: employees, isLoading } = useEmployees();

  const [officeFilter, setOfficeFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  const officeOptions = useMemo(() => {
    if (!employees) return [{ value: "all", label: "جميع المكاتب" }];
    const offices = Array.from(
      new Set(employees.map((emp) => emp.office?.name).filter(Boolean))
    ) as string[];
    return [
      { value: "all", label: "جميع المكاتب" },
      ...offices.map((o) => ({ value: o, label: o })),
    ];
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    if (!employees) return [];
    return employees.filter((emp) => {
      const matchesOffice =
        officeFilter === "all" || emp.office?.name === officeFilter;
      const matchesSearch =
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.phone.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesOffice && matchesSearch;
    });
  }, [employees, officeFilter, searchTerm]);

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["employees"] });
  };

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

        <Button
          onClick={() => setCreateOpen(true)}
          className="bg-green-700 hover:bg-green-600 text-white"
        >
          ادراج موظف
        </Button>
      </div>

      <EmployeesTable employees={filteredEmployees} isLoading={isLoading} onSuccess={handleSuccess} />

      <CreateEmployeeModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={() => {
          setCreateOpen(false);
          handleSuccess();
        }}
      />
    </main>
  );
};

export default EmployeesList;
