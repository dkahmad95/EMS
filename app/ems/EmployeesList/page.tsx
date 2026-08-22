"use client";

import { useState } from "react";
import { Button } from "../../Components/Button";
import EmployeesTable from "./Components/EmployeesTable";
import SearchBar from "../../Components/SearchBar";
import CreateEmployeeModal from "./Components/CreateEmployee";
import { useEmployees } from "@/server/store/employees";
import { usePermissions } from "@/app/hooks/usePermissions";
import { useServerTable } from "@/app/hooks/useServerTable";
import { useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "@heroicons/react/24/outline";

const EmployeesList = () => {
  const queryClient = useQueryClient();
  const { currentOfficeId } = usePermissions();

  const table = useServerTable({ resetDeps: [currentOfficeId] });
  const { data, isLoading, isFetching } = useEmployees({
    ...table.params,
    office_id: currentOfficeId,
  });

  const [createOpen, setCreateOpen] = useState(false);

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["employees"] });
  };

  return (
    <div className="flex flex-col h-full min-h-0 gap-4 animate-fade-in">

      {/* Page header */}
      <div className="page-header !mb-0 flex-none">
        <h1 className="page-title">قائمة الموظفين</h1>
        <p className="page-subtitle">إدارة بيانات الموظفين والمعلومات الوظيفية</p>
      </div>

      {/* Toolbar */}
      <div className="card p-4 flex-none">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3">

          {/* Search */}
          <div className="flex-1 w-full md:max-w-xs">
            <SearchBar
              value={table.searchTerm}
              onChange={table.setSearchTerm}
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
        employees={data?.data ?? []}
        isLoading={isLoading}
        loading={isFetching}
        rowCount={data?.total}
        paginationModel={table.paginationModel}
        onPaginationModelChange={table.setPaginationModel}
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
