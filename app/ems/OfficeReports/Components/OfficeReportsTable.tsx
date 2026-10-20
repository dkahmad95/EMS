"use client";

import React, { useState } from "react";
import { PencilIcon, TrashIcon, PlusIcon, EyeIcon } from "@heroicons/react/24/outline";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import DataTable from "@/app/Components/DataTable";
import { SkeletonTable } from "@/app/Components/Skeleton";
import { EmptyState } from "@/app/Components/EmptyState";
import { ErrorState } from "@/app/Components/ErrorState";
import SearchBar from "@/app/Components/SearchBar";
import { Button } from "@/app/Components/Button";
import PermissionGate from "@/app/Components/PermissionGate";
import { usePermissions } from "@/app/hooks/usePermissions";
import { useServerTable } from "@/app/hooks/useServerTable";
import { useOfficeReports } from "@/server/store/officeReports";
import * as api from "@/server/services/api/officeReports/officeReports";
import OfficeReportFormDialog from "./OfficeReportFormDialog";
import OfficeReportViewDialog from "./OfficeReportViewDialog";
import DeleteOfficeReportModal from "./DeleteOfficeReportModal";

const OfficeReportsTable = () => {
  const queryClient = useQueryClient();
  const { currentOfficeId } = usePermissions();

  const table = useServerTable({ resetDeps: [currentOfficeId] });
  const { data, isLoading, isFetching, isError, refetch } = useOfficeReports({
    ...table.params,
    office_id: currentOfficeId,
  });

  const [selectedReport, setSelectedReport] = useState<OfficeReport | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const openViewModal = (report: OfficeReport) => {
    setSelectedReport(report);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedReport(null);
  };

  const openCreateModal = () => {
    setSelectedReport(null);
    setIsFormModalOpen(true);
  };

  const openEditModal = (report: OfficeReport) => {
    setSelectedReport(report);
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setSelectedReport(null);
  };

  const openDeleteModal = (report: OfficeReport) => {
    setSelectedReport(report);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedReport(null);
  };

  const { mutateAsync: deleteReport } = useMutation({
    mutationFn: (id: number) => api.deleteOfficeReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["officeReports"] });
      closeDeleteModal();
      message.success("تم حذف التقرير بنجاح");
    },
    onError: () => {
      message.error("حدث خطأ أثناء حذف التقرير.");
    },
  });

  const handleDelete = async () => {
    if (!selectedReport?.id) return;
    await deleteReport(selectedReport.id);
  };

  const createButton = (
    <PermissionGate resource="office_reports" action="create">
      <Button variant="primary" size="sm" onClick={openCreateModal}>
        <PlusIcon className="w-4 h-4" aria-hidden="true" />
        إضافة تقرير
      </Button>
    </PermissionGate>
  );

  const columns = [
    { field: "id", headerName: "الرقم", width: 70 },
    {
      field: "employee",
      headerName: "اسم الموظف",
      width: 180,
      valueGetter: (_value: unknown, row: OfficeReport) => row?.employee?.name ?? "—",
    },
    {
      field: "date",
      headerName: "التاريخ",
      width: 120,
      valueGetter: (value: string) => value?.split("T")[0] ?? value ?? "",
    },
    {
      field: "description",
      headerName: "الوصف",
      flex: 1,
      minWidth: 250,
    },
    {
      field: "actions",
      headerName: "العمليات",
      width: 140,
      sortable: false,
      renderCell: (params: { row: OfficeReport }) => (
        <div className="flex h-full items-center justify-center gap-1.5">
          <button
            type="button"
            className="table-action-btn bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
            aria-label="عرض"
            title="عرض"
            onClick={() => openViewModal(params.row)}
          >
            <EyeIcon className="w-4 h-4" aria-hidden="true" />
          </button>
          <PermissionGate resource="office_reports" action="update">
            <button
              type="button"
              className="table-action-edit"
              aria-label="تعديل"
              title="تعديل"
              onClick={() => openEditModal(params.row)}
            >
              <PencilIcon className="w-4 h-4" aria-hidden="true" />
            </button>
          </PermissionGate>
          <PermissionGate resource="office_reports" action="delete">
            <button
              type="button"
              className="table-action-delete"
              aria-label="حذف"
              title="حذف"
              onClick={() => openDeleteModal(params.row)}
            >
              <TrashIcon className="w-4 h-4" aria-hidden="true" />
            </button>
          </PermissionGate>
        </div>
      ),
    },
  ];

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
        <EmptyState title="لا توجد تقارير" action={createButton} />
      </div>
    );
  } else {
    body = (
      <DataTable
        fullHeight
        columns={columns}
        rows={rows}
        rowCount={data?.total}
        paginationModel={table.paginationModel}
        onPaginationModelChange={table.setPaginationModel}
        loading={isFetching}
      />
    );
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-4">
      {/* Toolbar */}
      <div className="card p-4 flex-none">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
          <div className="flex-1 w-full md:max-w-xs">
            <SearchBar
              value={table.searchTerm}
              onChange={table.setSearchTerm}
              placeholder="ابحث بالوصف أو اسم الموظف..."
            />
          </div>

          <div className="flex-1 hidden md:block" />

          {createButton}
        </div>
      </div>

      {body}

      <OfficeReportFormDialog
        open={isFormModalOpen}
        onClose={closeFormModal}
        selectedReport={selectedReport}
      />

      <OfficeReportViewDialog
        open={isViewModalOpen}
        onClose={closeViewModal}
        report={selectedReport}
      />

      <DeleteOfficeReportModal
        open={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default OfficeReportsTable;
