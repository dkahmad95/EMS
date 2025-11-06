"use client";
import React, { useEffect, useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import DeleteModal from "@/app/Components/DeleteModal";
import DataTable from "@/app/Components/DataTable";
import { DataTableSkeleton } from "@/app/Components/DataTableSkeleton";

import EmployeeDetailsModal from "./EmployeeDetailsModal";
import { Button } from "@/app/Components/Button";


const dummyEmployees = [
  {
    id: 1,
    name: "أحمد دقماك",
    insuranceStatus: "مشترك",
    insuranceNumber: "123456",
    salary: 1200,
    jobTitle: "محاسب",
    officeLocation: "بيروت",
    contractType: "متفرغ",
    birthDate: "1990-05-15",
    birthPlace: "بيروت",
    age: 35,
    educationLevel: "جامعي",
    bloodType: "O+",
    phoneNumbers: "9617000001",
    familyStatus: "متزوج",
    childrenCount: 2,
    address: "بيروت - الحمرا",
    notes: "موظف مميز",
    gender: "ذكر",
  },
];

const EmployeesTable = () => {
  const [openDelete, setOpenDelete] = useState(false);
 const [detailsOpen, setDetailsOpen] = useState(false);
const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

 

  const columns = [
    { field: "id", headerName: "الرقم", width: 80 },
    { field: "name", headerName: "الاسم", width: 150 },
    { field: "phoneNumbers", headerName: "رقم الهاتف", width: 180 },
    { field: "officeLocation", headerName: "المكتب", width: 150 },
    {
      field: "salary",
      headerName: "الراتب",
      width: 130,
      renderCell: (params: any) => <div>$ {params.value}</div>,
    },
    {
      field: "actions",
      headerName: "العمليات",
      width: 180,
      renderCell: (params: any) => (
        <div className="flex flex-row gap-3 mt-4" dir="rtl">
         <Button
  onClick={() => {
    setSelectedEmployee(params.row);
    setDetailsOpen(true);
  }}
  className="text-white h-6"
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
      {isLoading ? (
        <DataTableSkeleton />
      ) : (
        <DataTable columns={columns} rows={dummyEmployees} />
      )}

      <DeleteModal
        open={openDelete}
        setOpen={setOpenDelete}
        Title="حذف الموظف"
        Body="هل أنت متأكد أنك تريد حذف هذا الموظف؟"
        handleClick={() => console.log("تم حذف الموظف")}
      />

      <EmployeeDetailsModal
  open={detailsOpen}
  onClose={() => setDetailsOpen(false)}
  employee={selectedEmployee}
  onUpdate={(data) => console.log("Updated employee:", data)}
/>
    </div>
  );
};

export default EmployeesTable;
