"use client";

import { useState, useMemo } from "react";
import { Button } from "../../Components/Button";
import EmployeesTable from "./Components/EmployeesTable";
import SearchBar from "../../Components/SearchBar";
import CreateEmployeeModal from "./Components/CreateEmployee";
import { useEmployees } from "@/server/store/employees";
import { usePermissions } from "@/app/hooks/usePermissions";
import { useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "@heroicons/react/24/outline";

const EmployeesList = () => {
  const queryClient = useQueryClient();
  const { currentOfficeId } = usePermissions();
  const { data: employees, isLoading } = useEmployees(currentOfficeId);

  const [searchTerm, setSearchTerm] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  const filteredEmployees = useMemo(() => {
    if (!employees) return [];
    return employees.filter(
      (emp) =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [employees, searchTerm]);

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
