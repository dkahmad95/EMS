"use client";
import React, { useEffect, useState } from "react";

import { TrashIcon } from "@heroicons/react/24/outline";
import DeleteModal from "@/app/Components/DeleteModal";
import DataTable from "@/app/Components/DataTable";
import { DataTableSkeleton } from "@/app/Components/DataTableSkeleton";
import { Button } from "@/app/Components/Button";

interface Employee {
  id: number;
  name: string;
  phoneNumber: string;
  officeLocation: string;
  revenue: number;
  createdDate: string;
}

const dummyEmployees: Employee[] = [
  { id: 1, name: "أحمد دكماك", phoneNumber: "9617000001", officeLocation: "بيروت", revenue: 1200, createdDate: "2025-10-01" },
  { id: 2, name: "سارة خليل", phoneNumber: "9617000002", officeLocation: "طرابلس", revenue: 950, createdDate: "2025-09-21" },
  { id: 3, name: "علي منصور", phoneNumber: "9617000003", officeLocation: "صيدا", revenue: 1500, createdDate: "2025-08-15" },
  { id: 4, name: "لينا فارس", phoneNumber: "9617000004", officeLocation: "زحلة", revenue: 700, createdDate: "2025-10-10" },
];

const EmployeesTable = () => {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleDelete = () => {
    if (selectedId !== null) {
      console.log("تم حذف الموظف برقم ID:", selectedId);
      setOpen(false);
    }
  };

  // محاكاة تحميل البيانات لمدة ثانيتين
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const columns = [
    { field: "id", headerName: "الرقم", width: 80 },
    { field: "name", headerName: "الاسم", width: 150 },
    { field: "phoneNumber", headerName: "رقم الهاتف", width: 180 },
    { field: "officeLocation", headerName: "المكتب", width: 150 },
    {
      field: "revenue",
      headerName: "الإيرادات",
      width: 130,
      renderCell: (params: any) => <div>$ {params.value}</div>,
    },
    {
      field: "createdDate",
      headerName: "تاريخ الانضمام",
      width: 130,
      renderCell: (params: any) => <div>{params.value}</div>,
    },
    {
      field: "actions",
      headerName: "العمليات",
      width: 180,
      renderCell: (params: any) => (
        <div className="flex flex-row  gap-3 mt-4" dir="rtl">
          <Button
            onClick={() => alert(`عرض تفاصيل الموظف ${params.row.name}`)}
            className="text-white h-6"
          >
            عرض
          </Button>
          <TrashIcon
            className="w-5 text-red-600 cursor-pointer"
            onClick={() => {
              setSelectedId(params.row.id);
              setOpen(true);
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div dir="rtl">
      {isLoading ? (
        <DataTableSkeleton />
      ) : (
        <DataTable columns={columns} rows={dummyEmployees} />
      )}

      <DeleteModal
        open={open}
        setOpen={setOpen}
        Title="حذف الموظف"
        Body="هل أنت متأكد أنك تريد حذف هذا الموظف؟"
        handleClick={handleDelete}
      />
    </div>
  );
};

export default EmployeesTable;
