"use client";

import React, { useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { Button } from "@/app/Components/Button";
import { useAllEmployees } from "@/server/store/employees";
import { MagnifyingGlassIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

/** Server-side filters sent straight to GET /revenues (YYYY-MM-DD dates). */
export type RevenueSearchFilters = {
  employee_id?: number | null;
  date_from?: string;
  date_to?: string;
};

interface SearchRevenueProps {
  onSearch: (filters: RevenueSearchFilters) => void;
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
};

const SearchRevenue: React.FC<SearchRevenueProps> = ({ onSearch }) => {
  const { data: employeeList } = useAllEmployees();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSearch = () => {
    onSearch({
      employee_id: employee?.id ?? undefined,
      date_from: startDate || undefined,
      date_to: endDate || undefined,
    });
  };

  const handleReset = () => {
    setEmployee(null);
    setStartDate("");
    setEndDate("");
    onSearch({});
  };

  return (
    <div >
      <p className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />
        بحث الإيرادات
      </p>

      <div className="flex flex-wrap items-end gap-3">
        {/* Employee */}
        <Autocomplete
          options={employeeList ?? []}
          getOptionLabel={(o) => o.name}
          isOptionEqualToValue={(o, v) => o.id === v.id}
          value={employee}
          onChange={(_, newValue) => setEmployee(newValue)}
          renderInput={(params) => (
            <TextField {...params} label="اسم الموظف" variant="outlined" size="small" />
          )}
          sx={{ minWidth: 200, ...muiSx }}
        />

        {/* Start date */}
        <TextField
          type="date"
          label="من تاريخ"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ ...muiSx }}
          size="small"
        />

        {/* End date */}
        <TextField
          type="date"
          label="إلى تاريخ"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ ...muiSx }}
          size="small"
        />

        {/* Actions */}
        <Button variant="primary" onClick={handleSearch}>
          <MagnifyingGlassIcon className="w-4 h-4" />
          بحث
        </Button>

        <Button variant="outline" onClick={handleReset}>
          <ArrowPathIcon className="w-4 h-4" />
          إعادة تعيين
        </Button>
      </div>
    </div>
  );
};

export default SearchRevenue;
