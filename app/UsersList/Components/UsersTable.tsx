"use client";
import React, { useEffect, useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import DeleteModal from "@/app/Components/DeleteModal";
import DataTable from "@/app/Components/DataTable";
import { DataTableSkeleton } from "@/app/Components/DataTableSkeleton";
import { Button } from "@/app/Components/Button";

interface User {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  city: string;
  joinDate: string;
  status: string;
}

const dummyUsers: User[] = [
  {
    id: 1,
    name: "أحمد دكماك",
    email: "ahmad@example.com",
    phoneNumber: "9617000001",
    city: "بيروت",
    joinDate: "2025-10-01",
    status: "نشط",
  },
  {
    id: 2,
    name: "سارة خليل",
    email: "sara@example.com",
    phoneNumber: "9617000002",
    city: "طرابلس",
    joinDate: "2025-09-21",
    status: "غير نشط",
  },
  {
    id: 3,
    name: "علي منصور",
    email: "ali@example.com",
    phoneNumber: "9617000003",
    city: "صيدا",
    joinDate: "2025-08-15",
    status: "نشط",
  },
  {
    id: 4,
    name: "لينا فارس",
    email: "lina@example.com",
    phoneNumber: "9617000004",
    city: "زحلة",
    joinDate: "2025-10-10",
    status: "نشط",
  },
];

const UsersTable = () => {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleDelete = () => {
    if (selectedId !== null) {
      console.log("تم حذف المستخدم برقم ID:", selectedId);
      setOpen(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const columns = [
    { field: "id", headerName: "الرقم", width: 80 },
    { field: "name", headerName: "الاسم الكامل", width: 150 },
    { field: "email", headerName: "البريد الإلكتروني", width: 200 },
    { field: "phoneNumber", headerName: "رقم الهاتف", width: 150 },
    { field: "city", headerName: "المدينة", width: 120 },
    {
      field: "joinDate",
      headerName: "تاريخ الانضمام",
      width: 130,
      renderCell: (params: any) => <div>{params.value}</div>,
    },
    {
      field: "status",
      headerName: "الحالة",
      width: 100,
      renderCell: (params: any) => (
        <span
          className={`px-2 py-1 rounded-full text-sm ${
            params.value === "نشط"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "actions",
      headerName: "العمليات",
      width: 180,
      renderCell: (params: any) => (
        <div className="flex flex-row gap-3 mt-3" dir="rtl">
          <Button
            onClick={() => alert(`عرض تفاصيل المستخدم: ${params.row.name}`)}
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
        <DataTable columns={columns} rows={dummyUsers} />
      )}

      <DeleteModal
        open={open}
        setOpen={setOpen}
        Title="حذف المستخدم"
        Body="هل أنت متأكد أنك تريد حذف هذا المستخدم؟"
        handleClick={handleDelete}
      />
    </div>
  );
};

export default UsersTable;
