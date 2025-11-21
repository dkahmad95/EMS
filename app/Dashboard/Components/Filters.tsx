// Filters.tsx
"use client";
import { Employee } from "../utils/types";
import { Box, TextField, MenuItem } from "@mui/material";

interface Props {
  employees: Employee[];
  filters: any;
  setFilters: (f: any) => void;
  offices: string[];
}

export default function Filters({ employees, filters, setFilters, offices }: Props) {
  return (
    <Box display="flex" gap={2} flexWrap="wrap" mb={4}>
      <TextField
        select
        label="المكاتب"
        value={filters.office ?? ""}
        onChange={(e) => setFilters({ ...filters, office: e.target.value })}
        sx={{ minWidth: 150 }}
      >
        <MenuItem value=""> جميع المكاتب</MenuItem>
        {offices.map((o) => (
          <MenuItem key={o} value={o}>{o}</MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="الموظفين"
        value={filters.employeeName ?? ""}
        onChange={(e) => setFilters({ ...filters, employeeName: e.target.value })}
        sx={{ minWidth: 180 }}
      >
        <MenuItem value="">جميع الموظفين </MenuItem>
        {employees.map((emp) => (
          <MenuItem key={emp.id} value={emp.name}>{emp.name}</MenuItem>
        ))}
      </TextField>

      <TextField
        type="date"
        label="من تاريخ"
       slotProps={{
            inputLabel: {
              shrink: true,   // the new recommended API
            },
          }}

        value={filters.startDate}
        onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
      />

      <TextField
        type="date"
        label="إلى تاريخ"
       slotProps={{
            inputLabel: {
              shrink: true,   // the new recommended API
            },
          }}

        value={filters.endDate}
        onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
      />
    </Box>
  );
}
