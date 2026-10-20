"use client";

import React, { useState } from "react";
import type { GridPaginationModel } from "@mui/x-data-grid";
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import DeleteModal from "@/app/Components/DeleteModal";
import DataTable from "@/app/Components/DataTable";
import { SkeletonTable } from "@/app/Components/Skeleton";
import { EmptyState } from "@/app/Components/EmptyState";
import { ErrorState } from "@/app/Components/ErrorState";
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
  /** Fetch failed -> error state */
  isError?: boolean;
  onRetry?: () => void;
  /** Background refetch -> DataGrid overlay */
  loading?: boolean;
  paginationModel?: GridPaginationModel;
  onPaginationModelChange?: (model: GridPaginationModel) => void;
  /** Rendered inside the empty state (the page's create button). */
  emptyAction?: React.ReactNode;
}

const COLUMN_COUNT = 6;

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  total,
  search,
  isLoading,
  isError,
  onRetry,
  loading,
  paginationModel,
  onPaginationModelChange,
  emptyAction,
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
      sortable: false,
      renderCell: (params: any) => (
        <div className="flex h-full items-center gap-2">
          <PermissionGate resource="users" action="update">
            <Button variant="ghost" size="sm" onClick={() => handleEdit(params.row)}>
              <PencilSquareIcon className="w-4 h-4" aria-hidden="true" />
              تعديل
            </Button>
          </PermissionGate>

          <PermissionGate resource="users" action="delete">
            <button
              type="button"
              aria-label="حذف"
              title="حذف"
              onClick={() => setDeleteUserId(params.row.id)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-danger-600 hover:bg-danger-50 transition-[background-color,color] duration-fast ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1"
            >
              <TrashIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </PermissionGate>
        </div>
      ),
    },
  ];

  const isEmpty = !isLoading && !isError && total === 0 && !search;

  let body: React.ReactNode;
  if (isLoading) {
    body = <SkeletonTable fullHeight cols={COLUMN_COUNT} />;
  } else if (isError) {
    body = (
      <div className="card flex-1 min-h-0 flex items-center justify-center">
        <ErrorState title="حدث خطأ أثناء تحميل البيانات" onRetry={onRetry} />
      </div>
    );
  } else if (isEmpty) {
    body = (
      <div className="card flex-1 min-h-0 flex items-center justify-center">
        <EmptyState
          title="لا توجد مستخدمين بعد"
          description="إدارة حسابات المستخدمين والصلاحيات"
          action={emptyAction}
        />
      </div>
    );
  } else {
    body = (
      <DataTable
        fullHeight
        columns={columns}
        rows={users}
        loading={loading}
        rowCount={total}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
      />
    );
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-4">
      {body}

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
