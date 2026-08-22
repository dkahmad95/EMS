"use client";

import React, { useState } from "react";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { DataTableSkeleton } from "@/app/Components/DataTableSkeleton";
import DataTable from "@/app/Components/DataTable";
import SearchBar from "@/app/Components/SearchBar";
import { Button } from "@/app/Components/Button";
import PermissionGate from "@/app/Components/PermissionGate";
import { usePermissions } from "@/app/hooks/usePermissions";
import { useServerTable } from "@/app/hooks/useServerTable";
import { useOfficeReports } from "@/server/store/officeReports";
import * as api from "@/server/services/api/officeReports/officeReports";
import OfficeReportFormDialog from "./OfficeReportFormDialog";
import DeleteOfficeReportModal from "./DeleteOfficeReportModal";

const OfficeReportsTable = () => {
  const queryClient = useQueryClient();
  const { currentOfficeId } = usePermissions();

  const table = useServerTable({ resetDeps: [currentOfficeId] });
  const { data, isLoading, isFetching } = useOfficeReports({
    ...table.params,
    office_id: currentOfficeId,
  });

  const [selectedReport, setSelectedReport] = useState<OfficeReport | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
      width: 120,
      sortable: false,
      renderCell: (params: { row: OfficeReport }) => (
        <div className="flex gap-2 items-center justify-center">
          <PermissionGate resource="office_reports" action="update">
            <PencilIcon
              className="w-5 text-blue-400 cursor-pointer mt-4"
              onClick={() => openEditModal(params.row)}
            />
          </PermissionGate>
          <PermissionGate resource="office_reports" action="delete">
            <TrashIcon
              className="w-5 text-red-600 cursor-pointer mt-4"
              onClick={() => openDeleteModal(params.row)}
            />
          </PermissionGate>
        </div>
      ),
    },
  ];

  return (
    <div dir="rtl" className="space-y-6">
      {/* Toolbar */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
          <div className="flex-1 w-full md:max-w-xs">
            <SearchBar
              value={table.searchTerm}
              onChange={table.setSearchTerm}
              placeholder="ابحث بالوصف أو اسم الموظف..."
            />
          </div>

          <div className="flex-1 hidden md:block" />

          <PermissionGate resource="office_reports" action="create">
            <Button variant="primary" size="sm" onClick={openCreateModal}>
              <PlusIcon className="w-4 h-4" />
              إضافة تقرير
            </Button>
          </PermissionGate>
        </div>
      </div>

      {isLoading ? (
        <DataTableSkeleton />
      ) : (
        <DataTable
          columns={columns}
          rows={data?.data ?? []}
          rowCount={data?.total}
          paginationModel={table.paginationModel}
          onPaginationModelChange={table.setPaginationModel}
          loading={isFetching}
        />
      )}

      <OfficeReportFormDialog
        open={isFormModalOpen}
        onClose={closeFormModal}
        selectedReport={selectedReport}
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
