"use client";

import React, { useState, useMemo } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { DataTableSkeleton } from "@/app/Components/DataTableSkeleton";
import DataTable from "@/app/Components/DataTable";
import SearchRevenue from "./SearchRevenue";
import EditRevenueDialog from "./EditRevenueDialog";
import DeleteRevenueModal from "./DeleteRevenueModal";
import AddRevenueForm from "./RevenueAddForm";
import { useRevenues } from "@/server/store/revenues";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/server/services/api/revenues/revenues";
import { message } from "antd";

const RevenuesTable = () => {
  const queryClient = useQueryClient();
  const { data: revenues, isLoading } = useRevenues();

  const [selectedEntry, setSelectedEntry] = useState<Revenue | null>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [searchFilters, setSearchFilters] = useState<{
    employee?: string | null;
    office?: string | null;
    startDate?: string;
    endDate?: string;
  }>({});

  const { mutateAsync: deleteRevenue } = useMutation({
    mutationFn: (id: number) => api.deleteRevenue(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["revenues"] });
      setOpenDelete(false);
      setSelectedEntry(null);
      message.success("تم حذف الإيراد بنجاح");
    },
    onError: () => {
      message.error("حدث خطأ أثناء حذف الإيراد.");
    },
  });

  const filtered = useMemo(() => {
    if (!revenues) return [];
    return revenues.filter((r) => {
      const empName = r.employee?.name ?? "";
      const officeName = r.office?.name ?? "";
      const revDate = r.date?.split("T")[0] ?? r.date;

      if (searchFilters.employee && empName !== searchFilters.employee) return false;
      if (searchFilters.office && officeName !== searchFilters.office) return false;
      if (searchFilters.startDate && revDate < searchFilters.startDate) return false;
      if (searchFilters.endDate && revDate > searchFilters.endDate) return false;
      return true;
    });
  }, [revenues, searchFilters]);

  const handleSearch = ({
    employee,
    office,
    startDate,
    endDate,
  }: {
    employee?: string | null;
    office?: string | null;
    startDate?: string;
    endDate?: string;
  }) => {
    setSearchFilters({ employee, office, startDate, endDate });
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
        <span className="text-green-700 font-semibold">
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
    { field: "notes", headerName: "ملاحظات", width: 200 },
    {
      field: "actions",
      headerName: "العمليات",
      width: 120,
      renderCell: (params: any) => (
        <div className="flex gap-2 items-center justify-center">
          <PencilIcon
            className="w-5 text-blue-400 cursor-pointer mt-4"
            onClick={() => {
              setSelectedEntry(params.row);
              setOpenEdit(true);
            }}
          />
          <TrashIcon
            className="w-5 text-red-600 cursor-pointer mt-4"
            onClick={() => {
              setSelectedEntry(params.row);
              setOpenDelete(true);
            }}
          />
        </div>
      ),
    },
  ];
  return (
    <div dir="rtl" className="space-y-6">
      <SearchRevenue onSearch={handleSearch} />
      <AddRevenueForm />

      {isLoading ? (
        <DataTableSkeleton />
      ) : (
        <DataTable columns={columns} rows={filtered} />
      )}

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
        }}
      />
    </div>
  );
};

export default RevenuesTable;
