"use client";
import React, { useState } from "react";
import type { GridPaginationModel } from "@mui/x-data-grid";
import { TrashIcon } from "@heroicons/react/24/outline";
import DeleteModal from "@/app/Components/DeleteModal";
import DataTable from "@/app/Components/DataTable";
import { SkeletonTable } from "@/app/Components/Skeleton";
import { EmptyState } from "@/app/Components/EmptyState";
import { ErrorState } from "@/app/Components/ErrorState";
import EmployeeDetailsModal from "./EmployeeDetailsModal";
import { Button } from "@/app/Components/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/server/services/api/employees/employees";
import { message } from "antd";

interface EmployeesTableProps {
  employees: Employee[];
  /** First load -> skeleton */
  isLoading?: boolean;
  /** Fetch failed -> error state */
  isError?: boolean;
  onRetry?: () => void;
  /** Background refetch (page change / search) -> DataGrid overlay */
  loading?: boolean;
  /** Active (debounced) search term; suppresses the empty state while searching. */
  search?: string;
  rowCount?: number;
  paginationModel?: GridPaginationModel;
  onPaginationModelChange?: (model: GridPaginationModel) => void;
  onSuccess?: () => void;
  /** Rendered inside the empty state (the page's create button). */
  emptyAction?: React.ReactNode;
}

const COLUMN_COUNT = 5;

const EmployeesTable: React.FC<EmployeesTableProps> = ({
  employees,
  isLoading,
  isError,
  onRetry,
  loading,
  search,
  rowCount,
  paginationModel,
  onPaginationModelChange,
  onSuccess,
  emptyAction,
}) => {
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
      valueGetter: (_value: any, row: Employee) => row?.office?.name ?? "—",
    },
    {
      field: "job_title",
      headerName: "المسمى الوظيفي",
      width: 150,
      valueGetter: (_value: any, row: Employee) => row?.job_title?.name ?? "—",
    },
    {
      field: "actions",
      headerName: "العمليات",
      width: 150,
      sortable: false,
      renderCell: (params: any) => (
        <div className="flex h-full items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedEmployee(params.row);
              setDetailsOpen(true);
            }}
          >
            عرض
          </Button>
          <button
            type="button"
            aria-label="حذف"
            title="حذف"
            onClick={() => {
              setSelectedEmployee(params.row);
              setOpenDelete(true);
            }}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-danger-600 hover:bg-danger-50 transition-[background-color,color] duration-fast ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1"
          >
            <TrashIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      ),
    },
  ];

  const isEmpty = !isLoading && !isError && rowCount === 0 && !search;

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
          title="لا توجد موظفين بعد"
          description="إدارة بيانات الموظفين والمعلومات الوظيفية"
          action={emptyAction}
        />
      </div>
    );
  } else {
    body = (
      <DataTable
        fullHeight
        columns={columns}
        rows={employees}
        loading={loading}
        rowCount={rowCount}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
      />
    );
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-4">
      {body}

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
