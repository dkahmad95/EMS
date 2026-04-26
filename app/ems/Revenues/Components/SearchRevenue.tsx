"use client";

import React, { useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { Button } from "@/app/Components/Button";
import { useEmployees } from "@/server/store/employees";
import { useOffices } from "@/server/store/offices";

interface SearchRevenueProps {
  onSearch: (filters: {
    employee?: string | null;
    office?: string | null;
    startDate?: string;
    endDate?: string;
  }) => void;
}

const SearchRevenue: React.FC<SearchRevenueProps> = ({ onSearch }) => {
  const { data: employeeList } = useEmployees();
  const { data: officeList } = useOffices();

  const [employee, setEmployee] = useState<string | null>(null);
  const [office, setOffice] = useState<string | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleReset = () => {
    setEmployee(null);
    setOffice(null);
    setStartDate("");
    setEndDate("");
    onSearch({});
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-3">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">بحث الإيرادات</h2>

      <div className="flex flex-wrap items-end gap-2 md:gap-4">

        {/* EMPLOYEE */}
        <Autocomplete
          options={employeeList?.map((e) => e.name) ?? []}
          value={employee}
          onChange={(_, newValue) => setEmployee(newValue)}
          renderInput={(params) => (
            <TextField {...params} label="اسم الموظف" variant="outlined" />
          )}
          sx={{ minWidth: 200 }}
        />

        {/* OFFICE */}
        <Autocomplete
          options={officeList?.map((o) => o.name) ?? []}
          value={office}
          onChange={(_, newValue) => setOffice(newValue)}
          renderInput={(params) => (
            <TextField {...params} label="المكتب" variant="outlined" />
          )}
          sx={{ minWidth: 200 }}
        />

        {/* START DATE */}
        <TextField
          type="date"
          label="من تاريخ"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />

        {/* END DATE */}
        <TextField
          type="date"
          label="إلى تاريخ"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />

        {/* SEARCH */}
        <Button
          onClick={() => onSearch({ employee, office, startDate, endDate })}
          className="cursor-pointer"
        >
          بحث
        </Button>

        {/* RESET */}
        <Button
          onClick={handleReset}
          className="cursor-pointer bg-gray-400 hover:bg-gray-300 text-white"
        >
          إعادة تعيين
        </Button>

      </div>
    </div>
  );
};

export default SearchRevenue;
