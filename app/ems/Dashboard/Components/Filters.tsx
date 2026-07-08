"use client";
import { Employee } from "../utils/types";
import { TextField, MenuItem } from "@mui/material";

interface Props {
  employees: Employee[];
  filters: any;
  setFilters: (f: any) => void;
  currencies: { id: number; name: string }[];
}

const muiSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    fontSize: "14px",
    fontFamily: "Cairo, sans-serif",
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#d1d5db" },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#4f46e5", borderWidth: "2px" },
  },
  "& .MuiInputLabel-root": {
    fontFamily: "Cairo, sans-serif",
    fontSize: "14px",
    "&.Mui-focused": { color: "#4f46e5" },
  },
  "& .MuiMenuItem-root": { fontFamily: "Cairo, sans-serif" },
};

export default function Filters({ employees, filters, setFilters, currencies }: Props) {
  return (
    <div className="flex flex-wrap gap-3">

      {/* Employees */}
      <TextField
        select
        label="الموظفين"
        value={filters.employeeName ?? ""}
        onChange={(e) => setFilters({ ...filters, employeeName: e.target.value })}
        sx={{ minWidth: 170, ...muiSx }}
        size="small"
      >
        <MenuItem value="" sx={{ fontFamily: "Cairo, sans-serif" }}>جميع الموظفين</MenuItem>
        {employees.map((emp) => (
          <MenuItem key={emp.id} value={emp.name} sx={{ fontFamily: "Cairo, sans-serif" }}>{emp.name}</MenuItem>
        ))}
      </TextField>

      {/* Currencies */}
      <TextField
        select
        label="العملة"
        value={filters.currency ?? ""}
        onChange={(e) => setFilters({ ...filters, currency: e.target.value })}
        sx={{ minWidth: 120, ...muiSx }}
        size="small"
      >
        <MenuItem value="" sx={{ fontFamily: "Cairo, sans-serif" }}>جميع العملات</MenuItem>
        {currencies.map((c) => (
          <MenuItem key={c.id} value={c.name} sx={{ fontFamily: "Cairo, sans-serif" }}>{c.name}</MenuItem>
        ))}
      </TextField>

      {/* Date range */}
      <TextField
        type="date"
        label="من تاريخ"
        slotProps={{ inputLabel: { shrink: true } }}
        value={filters.startDate}
        onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
        sx={{ ...muiSx }}
        size="small"
      />

      <TextField
        type="date"
        label="إلى تاريخ"
        slotProps={{ inputLabel: { shrink: true } }}
        value={filters.endDate}
        onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
        sx={{ ...muiSx }}
        size="small"
      />
    </div>
  );
}
