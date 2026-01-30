"use client";

import React, { useState, useEffect } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

import { DataTableSkeleton } from "@/app/Components/DataTableSkeleton";
import DataTable from "@/app/Components/DataTable";

import SearchRevenue from "./SearchRevenue";
import EditRevenueDialog from "./EditRevenueDialog";
import DeleteRevenueModal from "./DeleteRevenueModal";
import { RevenueEntry } from "./data";
import AddRevenueForm from "./RevenueAddForm";

const RevenuesTable = () => {
  const [revenues, setRevenues] = useState<RevenueEntry[]>([]);
  const [filtered, setFiltered] = useState<RevenueEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<RevenueEntry | null>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  // ✅ Load revenues from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("revenues") || "[]");
    setRevenues(stored);
    setFiltered(stored);

    const timer = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  // ✅ Add
  const handleAdd = (entry: RevenueEntry) => {
    const updated = [...revenues, entry];

    localStorage.setItem("revenues", JSON.stringify(updated));

    setRevenues(updated);
    setFiltered(updated);
  };

  // ✅ Delete
  const handleDelete = () => {
    if (!selectedEntry) return;

    const updated = revenues.filter((r) => r.id !== selectedEntry.id);

    localStorage.setItem("revenues", JSON.stringify(updated));

    setRevenues(updated);
    setFiltered(updated);
    setOpenDelete(false);
  };

  // ✅ Edit
  const handleEditSave = (updatedEntry: RevenueEntry) => {
    const updated = revenues.map((r) =>
      r.id === updatedEntry.id ? updatedEntry : r
    );

    localStorage.setItem("revenues", JSON.stringify(updated));

    setRevenues(updated);
    setFiltered(updated);
    setOpenEdit(false);
  };

  // ✅ Search
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
    let filteredData = revenues;

    if (employee) filteredData = filteredData.filter((r) => r.employeeName === employee);
    if (office) filteredData = filteredData.filter((r) => r.office === office);
    if (startDate && endDate)
      filteredData = filteredData.filter((r) => r.date >= startDate && r.date <= endDate);

    setFiltered(filteredData);
  };

  const columns = [
    { field: "id", headerName: "الرقم", width: 70 },
    { field: "employeeName", headerName: "اسم الموظف", width: 150 },
    { field: "office", headerName: "المكتب", width: 120 },
    { field: "destination", headerName: "الوجهة", width: 130 },
    { field: "date", headerName: "التاريخ", width: 120 },
    {
      field: "revenueAmount",
      headerName: "الإيراد",
      width: 140,
      renderCell: (params: any) => (
        <span className="text-green-700 font-semibold">
          {params.value.toLocaleString()}
        </span>
      ),
    },
    {
      field: "currency",
      headerName: "العملة",
      width: 100,
      renderCell: (params: any) => (
        <span className="text-gray-700">{params.value}</span>
      ),
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
      <AddRevenueForm onAdd={handleAdd} />

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
        onSave={handleEditSave}
      />
    </div>
  );
};

export default RevenuesTable;
