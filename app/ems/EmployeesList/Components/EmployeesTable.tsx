"use client";
import React, { useEffect, useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import DeleteModal from "@/app/Components/DeleteModal";
import DataTable from "@/app/Components/DataTable";
import { DataTableSkeleton } from "@/app/Components/DataTableSkeleton";
import EmployeeDetailsModal from "./EmployeeDetailsModal";
import { Button } from "@/app/Components/Button";

interface Employee {
  id: number;
  name: string;
  phoneNumbers: string;
  officeLocation: string;
  jobTitle: string;
}
interface EmployeesTableProps {
  employees: Employee[];
}

const EmployeesTable: React.FC<EmployeesTableProps> = ({ employees }) => {
  const [openDelete, setOpenDelete] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const handleDelete = (id: number) => {
    const updatedEmployees = employees.filter((emp) => emp.id !== id);
    localStorage.setItem("employees", JSON.stringify(updatedEmployees));
    setOpenDelete(false);
    window.location.reload(); // optional quick refresh to reflect changes
  };

  const columns = [
    { field: "name", headerName: "الاسم", width: 200 },
    { field: "phoneNumbers", headerName: "رقم الهاتف", width: 150 },
    { field: "officeLocation", headerName: "المكتب", width: 150 },
    { field: "jobTitle", headerName: "المسمى الوظيفي", width: 150 },
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

  return (
    <div dir="rtl">
      <DataTable columns={columns} rows={employees} />

      <DeleteModal
        open={openDelete}
        setOpen={setOpenDelete}
        Title="حذف الموظف"
        Body="هل أنت متأكد أنك تريد حذف هذا الموظف؟"
        handleClick={() => selectedEmployee && handleDelete(selectedEmployee.id)}
      />

      <EmployeeDetailsModal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        employee={selectedEmployee}
        onUpdate={(data) => {
          const updated = employees.map((emp) => (emp.id === data.id ? data : emp));
          localStorage.setItem("employees", JSON.stringify(updated));
          window.location.reload(); // refresh to reflect update
        }}
      />
    </div>
  );
};

export default EmployeesTable;
