"use client";
import React, { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import DeleteModal from "@/app/Components/DeleteModal";
import DataTable from "@/app/Components/DataTable";
import { DataTableSkeleton } from "@/app/Components/DataTableSkeleton";
import EmployeeDetailsModal from "./EmployeeDetailsModal";
import { Button } from "@/app/Components/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/server/services/api/employees/employees";
import { message } from "antd";

interface EmployeesTableProps {
  employees: Employee[];
  isLoading?: boolean;
  onSuccess?: () => void;
}

const EmployeesTable: React.FC<EmployeesTableProps> = ({ employees, isLoading, onSuccess }) => {
  const queryClient = useQueryClient();
  const [openDelete, setOpenDelete] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const { mutateAsync: deleteEmployee } = useMutation({
    mutationFn: (id: number) => api.deleteEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setOpenDelete(false);
      setSelectedEmployee(null);
      message.success("تم حذف الموظف بنجاح");
      onSuccess?.();
    },
    onError: () => {
      message.error("حدث خطأ أثناء حذف الموظف.");
    },
  });

  const columns = [
    { field: "name", headerName: "الاسم", width: 200 },
    { field: "phone", headerName: "رقم الهاتف", width: 150 },
    {
      field: "office",
      headerName: "المكتب",
      width: 150,
      valueGetter: (params: any) => params?.row?.office?.name ?? "",
    },
    {
      field: "job_title",
      headerName: "المسمى الوظيفي",
      width: 150,
      valueGetter: (params: any) => params?.row?.job_title?.name ?? "",
    },
    {
      field: "actions",
      headerName: "العمليات",
      width: 150,
      renderCell: (params: any) => (
        <div className="flex flex-row gap-3 mt-4" dir="rtl">
          <Button
            onClick={() => {
              setSelectedEmployee(params.row);
              setDetailsOpen(true);
            }}
            className="text-white h-6 px-2 bg-blue-600 hover:bg-blue-500"
          >
            عرض
          </Button>
          <TrashIcon
            className="w-5 text-red-600 cursor-pointer"
            onClick={() => {
              setSelectedEmployee(params.row);
              setOpenDelete(true);
            }}
          />
        </div>
      ),
    },
  ];

  if (isLoading) return <DataTableSkeleton />;

  return (
    <div dir="rtl">
      <DataTable columns={columns} rows={employees} />

      <DeleteModal
        open={openDelete}
        setOpen={setOpenDelete}
        Title="حذف الموظف"
        Body="هل أنت متأكد أنك تريد حذف هذا الموظف؟"
        handleClick={() => selectedEmployee?.id && deleteEmployee(selectedEmployee?.id)}
      />

      <EmployeeDetailsModal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        employee={selectedEmployee}
        onSuccess={() => {
          setDetailsOpen(false);
          queryClient.invalidateQueries({ queryKey: ["employees"] });
          onSuccess?.();
        }}
      />
    </div>
  );
};

export default EmployeesTable;
