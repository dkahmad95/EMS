"use client";

import React, { useState } from "react";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@/app/Components/Button";
import DataTable from "@/app/Components/DataTable";
import { SkeletonTable } from "@/app/Components/Skeleton";
import { EmptyState } from "@/app/Components/EmptyState";
import { ErrorState } from "@/app/Components/ErrorState";
import SearchRevenue, { type RevenueSearchFilters } from "./SearchRevenue";
import EditRevenueDialog from "./EditRevenueDialog";
import DeleteRevenueModal from "./DeleteRevenueModal";
import AddRevenueForm from "./RevenueAddForm";
import { useRevenues } from "@/server/store/revenues";
import { usePermissions } from "@/app/hooks/usePermissions";
import { useServerTable } from "@/app/hooks/useServerTable";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/server/services/api/revenues/revenues";
import { message } from "antd";

const RevenuesTable = () => {
  const queryClient = useQueryClient();
  const { currentOfficeId } = usePermissions();

  // New object reference only when the user hits search/reset -> resets the page.
  const [searchFilters, setSearchFilters] = useState<RevenueSearchFilters>({});

  const table = useServerTable({ resetDeps: [currentOfficeId, searchFilters] });
  const { data, isLoading, isFetching, isError, refetch } = useRevenues({
    ...table.params,
    office_id: currentOfficeId,
    ...searchFilters,
  });

  const [selectedEntry, setSelectedEntry] = useState<Revenue | null>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);

  const { mutateAsync: deleteRevenue } = useMutation({
    mutationFn: (id: number) => api.deleteRevenue(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["revenues"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardRevenues"] });
      setOpenDelete(false);
      setSelectedEntry(null);
      message.success("تم حذف الإيراد بنجاح");
    },
    onError: () => {
      message.error("حدث خطأ أثناء حذف الإيراد.");
    },
  });

  const handleSearch = (filters: RevenueSearchFilters) => {
    setSearchFilters({ ...filters });
  };

  const handleDelete = async () => {
    if (!selectedEntry?.id) return;
    await deleteRevenue(selectedEntry.id);
  };

  const columns = [
    { field: "id", headerName: "الرقم", width: 70 },
    {
      field: "employee",
      headerName: "اسم الموظف",
      width: 150,
      valueGetter: (params: any) => params?.name ?? "",
    },
    {
      field: "office",
      headerName: "المكتب",
      width: 120,
      valueGetter: (params: any) => params?.name ?? "",
    },
    {
      field: "destination",
      headerName: "الوجهة",
      width: 130,
      valueGetter: (params: any) => params?.name ?? "",
    },
    {
      field: "date",
      headerName: "التاريخ",
      width: 120,
      valueGetter: (params: any) => params ?? "",
    },
    {
      field: "revenue_amount",
      headerName: "الإيراد",
      width: 140,
      renderCell: (params: any) => (
        <span className="text-primary-700 font-semibold" dir="ltr">
          {Number(params.value).toLocaleString()}
        </span>
      ),
    },
    {
      field: "currency",
      headerName: "العملة",
      width: 100,
      valueGetter: (params: any) => params?.name ?? "",
    },
    {
      field: "receipts_count",
      headerName: "عدد الإيصالات",
      width: 120,
      align: "center",
      headerAlign: "center",
      valueGetter: (params: any) => params ?? 1,
    },
    { field: "notes", headerName: "ملاحظات", width: 200 },
    {
      field: "actions",
      headerName: "العمليات",
      width: 120,
      sortable: false,
      renderCell: (params: any) => (
        <div className="flex h-full items-center justify-center gap-1.5">
          <button
            type="button"
            className="table-action-edit"
            aria-label="تعديل"
            title="تعديل"
            onClick={() => {
              setSelectedEntry(params.row);
              setOpenEdit(true);
            }}
          >
            <PencilIcon className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="table-action-delete"
            aria-label="حذف"
            title="حذف"
            onClick={() => {
              setSelectedEntry(params.row);
              setOpenDelete(true);
            }}
          >
            <TrashIcon className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      ),
    },
  ];

  const createButton = (
    <Button variant="primary" onClick={() => setOpenAdd(true)} className="whitespace-nowrap">
      <PlusIcon className="w-4 h-4" aria-hidden="true" />
      إضافة إيراد
    </Button>
  );

  const rows = data?.data ?? [];

  let body: React.ReactNode;
  if (isLoading) {
    body = <SkeletonTable fullHeight cols={columns.length} />;
  } else if (isError) {
    body = (
      <div className="card flex-1 min-h-0 flex items-center justify-center">
        <ErrorState title="حدث خطأ أثناء تحميل البيانات" onRetry={() => refetch()} />
      </div>
    );
  } else if (rows.length === 0) {
    body = (
      <div className="card flex-1 min-h-0 flex items-center justify-center">
        <EmptyState title="لا توجد إيرادات" action={createButton} />
      </div>
    );
  } else {
    body = (
      <DataTable
        fullHeight
        columns={columns}
        rows={rows}
        loading={isFetching}
        rowCount={data?.total}
        paginationModel={table.paginationModel}
        onPaginationModelChange={table.setPaginationModel}
      />
    );
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-4">
      <div className="card flex-none flex items-end justify-between gap-3 p-5">
        <SearchRevenue onSearch={handleSearch} />
        {createButton}
      </div>

      {body}

      <AddRevenueForm open={openAdd} onClose={() => setOpenAdd(false)} />

      <DeleteRevenueModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
      />

      <EditRevenueDialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        entry={selectedEntry}
        onSuccess={() => {
          setOpenEdit(false);
          queryClient.invalidateQueries({ queryKey: ["revenues"] });
          queryClient.invalidateQueries({ queryKey: ["dashboardRevenues"] });
        }}
      />
    </div>
  );
};

export default RevenuesTable;
