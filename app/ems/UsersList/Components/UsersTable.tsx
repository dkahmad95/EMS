"use client";

import React, { useState } from "react";
import { TrashIcon, BuildingOfficeIcon } from "@heroicons/react/24/outline";
import DeleteModal from "@/app/Components/DeleteModal";
import DataTable from "@/app/Components/DataTable";
import { Button } from "@/app/Components/Button";
import UserDetailsModal from "./UserDetailsModal";
import AttachOfficesModal from "./AttachOfficesModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser } from "@/server/services/api/users/users";
import PermissionGate from "@/app/Components/PermissionGate";

interface UsersTableProps {
  users: User[];
}

const UsersTable: React.FC<UsersTableProps> = ({ users }) => {
  const queryClient = useQueryClient();
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [detailsUserId, setDetailsUserId] = useState<number | null>(null);
  const [attachOfficesUserId, setAttachOfficesUserId] = useState<number | null>(null);

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setDeleteUserId(null);
    },
  });

  const handleDelete = () => {
    if (deleteUserId) {
      deleteMutation.mutate(deleteUserId);
    }
  };

  const columns = [
    { field: "id", headerName: "الرقم", width: 100 },
    { field: "username", headerName: "اسم المستخدم", width: 200 },
    {
      field: "created_at",
      headerName: "تاريخ الإنشاء",
      width: 200,
      renderCell: (params: any) => {
        if (!params.row.created_at) return "-";
        return new Date(params.row.created_at).toLocaleDateString("ar-EG");
      },
    },
    {
      field: "actions",
      headerName: "العمليات",
      width: 300,
      renderCell: (params: any) => (
        <div className="flex flex-row gap-3 mt-3" dir="rtl">
          <PermissionGate resource="users" action="update">
            <Button
              onClick={() => setDetailsUserId(params.row.id)}
              className="h-6 px-2"
            >
              عرض
            </Button>
            <Button
              onClick={() => setAttachOfficesUserId(params.row.id)}
              className="h-6 px-2 bg-blue-600 hover:bg-blue-700"
            >
              <BuildingOfficeIcon className="w-4 h-4 inline ml-1" />
              ربط المكاتب
            </Button>
          </PermissionGate>

          <PermissionGate resource="users" action="delete">
            <TrashIcon
              className="w-5 text-red-600 cursor-pointer"
              onClick={() => setDeleteUserId(params.row.id)}
            />
          </PermissionGate>
        </div>
      ),
    },
  ];
  return (
    <div dir="rtl">
      {users.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          لا توجد مستخدمين بعد
        </div>
      ) : (
        <DataTable columns={columns} rows={users} />
      )}

      <DeleteModal
        open={deleteUserId !== null}
        setOpen={(open) => !open && setDeleteUserId(null)}
        Title="حذف المستخدم"
        Body="هل أنت متأكد أنك تريد حذف هذا المستخدم؟"
        handleClick={handleDelete}
      />

      <UserDetailsModal
        open={detailsUserId !== null}
        onClose={() => setDetailsUserId(null)}
        userId={detailsUserId}
        users={users}
      />

      <AttachOfficesModal
        open={attachOfficesUserId !== null}
        onClose={() => setAttachOfficesUserId(null)}
        userId={attachOfficesUserId!}
        username={users.find((u) => u.id === attachOfficesUserId)?.username || ""}
      />
    </div>
  );
};

export default UsersTable;