"use client";

import { useState, useMemo } from "react";
import { Button } from "../../Components/Button";
import EmployeesTable from "./Components/EmployeesTable";
import SearchBar from "../../Components/SearchBar";
import { Select, MenuItem } from "@mui/material";
import CreateEmployeeModal from "./Components/CreateEmployee";
import { useEmployees } from "@/server/store/employees";
import { useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "@heroicons/react/24/outline";

const muiSelectSx = {
  borderRadius: "8px",
  fontFamily: "Cairo, sans-serif",
  fontSize: "14px",
  height: "40px",
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#d1d5db" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#9ca3af" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#4f46e5", borderWidth: "2px" },
};

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
    <div className="space-y-5 animate-fade-in">

      {/* Page header */}
      <div className="page-header">
        <h1 className="page-title">قائمة الموظفين</h1>
        <p className="page-subtitle">إدارة بيانات الموظفين والمعلومات الوظيفية</p>
      </div>

      {/* Toolbar */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3">

          {/* Office filter */}
          <Select
            id="officeLocation"
            value={officeFilter}
            onChange={(e) => setOfficeFilter(e.target.value)}
            sx={muiSelectSx}
          >
            {officeOptions.map((loc) => (
              <MenuItem
                key={loc.value}
                value={loc.value}
                sx={{ fontFamily: "Cairo, sans-serif", fontSize: 14 }}
              >
                {loc.label}
              </MenuItem>
            ))}
          </Select>

          {/* Search */}
          <div className="flex-1 w-full md:max-w-xs">
            <SearchBar
              value={searchTerm}
              onChange={(val: string) => setSearchTerm(val)}
              placeholder="ابحث بالاسم أو الهاتف..."
            />
          </div>

          {/* Spacer */}
          <div className="flex-1 hidden md:block" />

          {/* Add button */}
          <Button
            variant="primary"
            onClick={() => setCreateOpen(true)}
          >
            <PlusIcon className="w-4 h-4" />
            إضافة موظف
          </Button>
        </div>
      </div>

      {/* Table */}
      <EmployeesTable
        employees={filteredEmployees}
        isLoading={isLoading}
        onSuccess={handleSuccess}
      />

      <CreateEmployeeModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={() => {
          setCreateOpen(false);
          handleSuccess();
        }}
      />
    </div>
  );
};

export default EmployeesList;
