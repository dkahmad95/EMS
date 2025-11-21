"use client";

import React, { useEffect, useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import DeleteModal from "@/app/Components/DeleteModal";
import DataTable from "@/app/Components/DataTable";
import { DataTableSkeleton } from "@/app/Components/DataTableSkeleton";
import { Button } from "@/app/Components/Button";
import UserDetailsModal from "./UserDetailsModal";

interface User {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  city: string;
  joinDate?: string;
  status?: string;
}

interface UsersTableProps {
  users: User[];
}

const UsersTable: React.FC<UsersTableProps> = ({ users }) => {
  const [openDelete, setOpenDelete] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleDelete = (id: number) => {
    const updatedUsers = users.filter((u) => u.id !== id);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setOpenDelete(false);
    window.location.reload(); // refresh
  };

  const columns = [
    { field: "id", headerName: "الرقم", width: 80 },
    { field: "name", headerName: "الاسم الكامل", width: 150 },
    { field: "email", headerName: "البريد الإلكتروني", width: 200 },
    { field: "phoneNumber", headerName: "رقم الهاتف", width: 150 },
    { field: "city", headerName: "المدينة", width: 120 },
    {
      field: "actions",
      headerName: "العمليات",
      width: 180,
      renderCell: (params: any) => (
        <div className="flex flex-row gap-3 mt-3" dir="rtl">
          <Button
            onClick={() => {
              setSelectedUser(params.row);
              setDetailsOpen(true);
            }}
            className="text-white h-6 px-2 bg-blue-600 hover:bg-blue-500"
          >
            عرض
          </Button>
          <TrashIcon
            className="w-5 text-red-600 cursor-pointer"
            onClick={() => {
              setSelectedUser(params.row);
              setOpenDelete(true);
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div dir="rtl">
      {users.length === 0 ? (
        <DataTableSkeleton />
      ) : (
        <DataTable columns={columns} rows={users} />
      )}

      <DeleteModal
        open={openDelete}
        setOpen={setOpenDelete}
        Title="حذف المستخدم"
        Body="هل أنت متأكد أنك تريد حذف هذا المستخدم؟"
        handleClick={() => selectedUser && handleDelete(selectedUser.id)}
      />

      <UserDetailsModal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        user={selectedUser}
        onUpdate={(data: User) => {
          const updatedUsers = users.map((u) =>
            u.id === data.id ? data : u
          );
          localStorage.setItem("users", JSON.stringify(updatedUsers));
          window.location.reload(); // refresh
        }}
      />
    </div>
  );
};

export default UsersTable;
