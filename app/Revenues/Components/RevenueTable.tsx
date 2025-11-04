"use client";

import React, { useState, useEffect } from "react";
import {
  TextField,
  Autocomplete,
} from "@mui/material";
import { TrashIcon } from "@heroicons/react/24/outline";
import DeleteModal from "@/app/Components/DeleteModal";
import DataTable from "@/app/Components/DataTable";
import { DataTableSkeleton } from "@/app/Components/DataTableSkeleton";
import { Button } from "@/app/Components/Button";
import { Input } from "@/app/Components/Input";

// Revenue data interface
interface RevenueEntry {
  id: number;
  employeeName: string;
  office: string;
  date: string;
  revenueAmount: number;
  notes?: string;
}

// Dummy employee & office lists
const employees = [
  "أحمد دكماك",
  "سارة خليل",
  "علي منصور",
  "لينا فارس",
  "محمد رباح",
  "نور حيدر",
  "جواد ناصر",
];

const offices = ["بيروت", "طرابلس", "صيدا", "زحلة", "صور"];

// Dummy revenues
const initialRevenues: RevenueEntry[] = [
  { id: 1, employeeName: "أحمد دكماك", office: "بيروت", date: "2025-11-01", revenueAmount: 2500, notes: "يوم جيد" },
  { id: 2, employeeName: "سارة خليل", office: "طرابلس", date: "2025-11-01", revenueAmount: 1800, notes: "مبيعات ثابتة" },
  { id: 3, employeeName: "أحمد دكماك", office: "بيروت", date: "2025-11-02", revenueAmount: 2700, notes: "زيادة طفيفة" },
  { id: 4, employeeName: "لينا فارس", office: "زحلة", date: "2025-11-03", revenueAmount: 2200, notes: "عمل رائع" },
  { id: 5, employeeName: "علي منصور", office: "صيدا", date: "2025-11-02", revenueAmount: 1900, notes: "يوم عادي" },
  { id: 6, employeeName: "أحمد دكماك", office: "بيروت", date: "2025-11-03", revenueAmount: 3000, notes: "أفضل أداء" },
  { id: 7, employeeName: "سارة خليل", office: "طرابلس", date: "2025-10-30", revenueAmount: 2000, notes: "مبيعات مرتفعة" },
];

const RevenuesTable = () => {
  const [revenues, setRevenues] = useState<RevenueEntry[]>(initialRevenues);
  const [filtered, setFiltered] = useState<RevenueEntry[]>(initialRevenues);
  const [isLoading, setIsLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Add Revenue form states
  const [employeeName, setEmployeeName] = useState("");
  const [office, setOffice] = useState("");
  const [date, setDate] = useState("");
  const [revenueAmount, setRevenueAmount] = useState<number | string>("");
  const [notes, setNotes] = useState("");

  // Search & Filter states
  const [searchEmployee, setSearchEmployee] = useState<string | null>(null);
  const [searchOffice, setSearchOffice] = useState<string | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Add Revenue Handler
  const handleAddRevenue = () => {
    if (!employeeName || !office || !date || !revenueAmount) {
      alert("يرجى إدخال جميع البيانات المطلوبة");
      return;
    }

    const newEntry: RevenueEntry = {
      id: revenues.length + 1,
      employeeName,
      office,
      date,
      revenueAmount: Number(revenueAmount),
      notes,
    };

    setRevenues([...revenues, newEntry]);
    setFiltered([...revenues, newEntry]);
    setEmployeeName("");
    setOffice("");
    setDate("");
    setRevenueAmount("");
    setNotes("");
  };

  // Delete handler
  const handleDelete = () => {
    if (selectedId !== null) {
      const updated = revenues.filter((r) => r.id !== selectedId);
      setRevenues(updated);
      setFiltered(updated);
      setOpen(false);
    }
  };

  // Search Handler
  const handleSearch = () => {
    let filteredData = revenues;

    if (searchEmployee) {
      filteredData = filteredData.filter((r) => r.employeeName === searchEmployee);
    }

    if (searchOffice) {
      filteredData = filteredData.filter((r) => r.office === searchOffice);
    }

    if (startDate && endDate) {
      filteredData = filteredData.filter((r) => r.date >= startDate && r.date <= endDate);
    }

    setFiltered(filteredData);
  };

  // Table Columns
  const columns = [
    { field: "id", headerName: "الرقم", width: 70 },
    { field: "employeeName", headerName: "اسم الموظف", width: 150 },
    { field: "office", headerName: "المكتب", width: 120 },
    { field: "date", headerName: "التاريخ", width: 130 },
    {
      field: "revenueAmount",
      headerName: "الإيراد (ل.ل)",
      width: 140,
      renderCell: (params: any) => (
        <span className="text-green-700 font-semibold">
          {params.value.toLocaleString()}
        </span>
      ),
    },
    { field: "notes", headerName: "ملاحظات", width: 200 },
    {
      field: "actions",
      headerName: "العمليات",
      width: 100,
      renderCell: (params: any) => (
    <div className="flex justify-center items-center">
        <TrashIcon
          className="w-5 text-red-600 cursor-pointer mt-4 "
          onClick={() => {
            setSelectedId(params.row.id);
            setOpen(true);
          }}
        />
        </div>
      ),
    },
  ];

  return (
    <div dir="rtl" className="space-y-6">
           {/* ====== Search Section ====== */}
      <div className="bg-white p-4 rounded-lg shadow space-y-3">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">بحث الإيرادات</h2>
        <div className="flex flex-wrap items-end gap-2 md:gap-4">
          <Autocomplete
            options={employees}
            value={searchEmployee}
            onChange={(_, newValue) => setSearchEmployee(newValue || "")}
            renderInput={(params) => (
              <TextField {...params} label="اسم الموظف" variant="outlined" />
            )}
            sx={{ minWidth: 200 }}
          />
          <Autocomplete
            options={offices}
            value={searchOffice}
            onChange={(_, newValue) => setSearchOffice(newValue || "")}
            renderInput={(params) => (
              <TextField {...params} label="المكتب" variant="outlined" />
            )}
            sx={{ minWidth: 200 }}
          />
          <Input
            type="date"
            label="من تاريخ"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            type="date"
            label="إلى تاريخ"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <Button
            onClick={handleSearch}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            بحث
          </Button>
        </div>
      </div>

      {/* ====== Add Revenue Section ====== */}
      <div className="bg-white p-4 rounded-lg shadow space-y-3">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">إضافة الإيراد اليومي</h2>
        <div className="flex flex-wrap items-end gap-2 md:gap-4">
          <Autocomplete
            options={employees}
            value={employeeName}
            onChange={(_, newValue) => setEmployeeName(newValue || "")}
            renderInput={(params) => (
              <TextField {...params} label="اسم الموظف" variant="outlined" />
            )}
            sx={{ minWidth: 200 }}
          />
          <Autocomplete
            options={offices}
            value={office}
            onChange={(_, newValue) => setOffice(newValue || "")}
            renderInput={(params) => (
              <TextField {...params} label="المكتب" variant="outlined" />
            )}
            sx={{ minWidth: 200 }}
          />
          <Input
            type="date"
            label="التاريخ"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <Input
            type="number"
            label="قيمة الإيراد"
            value={revenueAmount}
            onChange={(e) => setRevenueAmount(e.target.value)}
          />
          <Input
            label="ملاحظات"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="اختياري"
          />
          <Button
            onClick={handleAddRevenue}
            disabled={!employeeName || !office || !date || !revenueAmount}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            إضافة الإيراد
          </Button>
        </div>
      </div>

   
      {/* ====== Table Section ====== */}
      {isLoading ? (
        <DataTableSkeleton />
      ) : (
        <DataTable columns={columns} rows={filtered} />
      )}

      {/* ====== Delete Modal ====== */}
      <DeleteModal
        open={open}
        setOpen={setOpen}
        Title="حذف الإيراد"
        Body="هل أنت متأكد أنك تريد حذف هذا الإيراد؟"
        handleClick={handleDelete}
      />
    </div>
  );
};

export default RevenuesTable;
