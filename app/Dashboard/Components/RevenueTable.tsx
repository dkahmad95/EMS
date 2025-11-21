"use client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { RevenueRecord } from "../utils/types";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import { DataTableSkeleton } from "@/app/Components/DataTableSkeleton";
import { useEffect, useState } from "react";
import DataTable from "@/app/Components/DataTable";

interface Props {
  data: RevenueRecord[];
}

  const columns: GridColDef[] = [
    { field: "id", headerName: "الرقم", width: 70 },
    { field: "employeeName", headerName: "الموظف", width: 150 },
    { field: "office", headerName: "المكتب", width: 120 },
    { field: "destination", headerName: "الوجهة", width: 130 },
    { field: "currency", headerName: "العملة", width: 100 },
    { field: "date", headerName: "التاريخ", width: 120 },
    {
      field: "revenueAmount",
      headerName: "المبلغ",
      width: 140,
      renderCell: (params) => (
        <Typography fontWeight="bold" color="green">
          {params.value.toLocaleString()}
        </Typography>
      ),
    },
    { field: "notes", headerName: "ملاحظات", width: 200 },
  ];

export default function RevenueTable({ data }: Props) {
    const [isLoading, setIsLoading] = useState(true);
     // ✅ Load revenues from localStorage
      useEffect(() => {
      
    
        const timer = setTimeout(() => setIsLoading(false), 700);
        return () => clearTimeout(timer);
      }, []);
    
  return (
     <Box dir="rtl" sx={{ height: 500, width: "100%" }}>
      {isLoading ? (
             <DataTableSkeleton />
           ) : (
             <DataTable columns={columns} rows={data} />
           )}
    </Box>
  
  );
}
