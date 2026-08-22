"use client";

import React, { useState } from "react";
import type { GridPaginationModel } from "@mui/x-data-grid";
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import DeleteModal from "@/app/Components/DeleteModal";
import DataTable from "@/app/Components/DataTable";
import { DataTableSkeleton } from "@/app/Components/DataTableSkeleton";
import { Button } from "@/app/Components/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser } from "@/server/services/api/users/users";
import PermissionGate from "@/app/Components/PermissionGate";
import UpdateUserModal from "./UpdateUserModal";

interface UsersTableProps {
  users: User[];
  /** Total rows on the server (`total` from the paginated envelope). */
  total?: number;
  /** Active (debounced) search term — suppresses the empty state while searching. */
  search?: string;
  /** First load -> skeleton */
  isLoading?: boolean;
  /** Background refetch -> DataGrid overlay */
  loading?: boolean;
  paginationModel?: GridPaginationModel;
  onPaginationModelChange?: (model: GridPaginationModel) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  total,
  search,
  isLoading,
  loading,
  paginationModel,
  onPaginationModelChange,
}) => {
  const queryClient = useQueryClient();
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

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

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsUpdateModalOpen(true);
  };

  const columns = [
    { field: "name", headerName: "الاسم", width: 200 },
    { field: "username", headerName: "اسم المستخدم", width: 200 },
    { field: "permission_group_name", headerName: "مجموعة الصلاحيات", width: 200 },
    { field: "office_name", headerName: "المكتب", width: 200 },
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
      width: 200,
      renderCell: (params: any) => (
        <div className="flex flex-row gap-3 mt-3" dir="rtl">
          <PermissionGate resource="users" action="update">
            <Button
              onClick={() => handleEdit(params.row)}
              className="h-6 px-2 bg-blue-500 hover:bg-blue-600"
            >
              <PencilSquareIcon className="w-4 h-4 inline ml-1" />
              تعديل
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

  if (isLoading) return <DataTableSkeleton />;

  const isEmpty = !isLoading && total === 0 && !search;

  return (
    <div dir="rtl">
      {isEmpty ? (
        <div className="text-center text-gray-500 py-8">
          لا توجد مستخدمين بعد
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={users}
          loading={loading}
          rowCount={total}
          paginationModel={paginationModel}
          onPaginationModelChange={onPaginationModelChange}
        />
      )}

      <DeleteModal
        open={deleteUserId !== null}
        setOpen={(open) => !open && setDeleteUserId(null)}
        Title="حذف المستخدم"
        Body="هل أنت متأكد أنك تريد حذف هذا المستخدم؟"
        handleClick={handleDelete}
      />

      <UpdateUserModal
        open={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />
    </div>
  );
};

export default UsersTable;
