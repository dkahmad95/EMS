"use client";

import React, { useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { Input } from "@/app/Components/Input";
import { Button } from "@/app/Components/Button";
import { employees, offices } from "./data";

interface SearchRevenueProps {
  onSearch: (filters: {
    employee?: string | null;
    office?: string | null;
    startDate?: string;
    endDate?: string;
  }) => void;
}

const SearchRevenue: React.FC<SearchRevenueProps> = ({ onSearch }) => {
  const [employee, setEmployee] = useState<string | null>(null);
  const [office, setOffice] = useState<string | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-3">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">بحث الإيرادات</h2>
      <div className="flex flex-wrap items-end gap-2 md:gap-4">
        <Autocomplete
          options={employees}
          value={employee}
          onChange={(_, newValue) => setEmployee(newValue || "")}
          renderInput={(params) => <TextField {...params} label="اسم الموظف" variant="outlined" />}
          sx={{ minWidth: 200 }}
        />
        <Autocomplete
          options={offices}
          value={office}
          onChange={(_, newValue) => setOffice(newValue || "")}
          renderInput={(params) => <TextField {...params} label="المكتب" variant="outlined" />}
          sx={{ minWidth: 200 }}
        />
        <Input type="date" label="من تاريخ" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <Input type="date" label="إلى تاريخ" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        <Button onClick={() => onSearch({ employee, office, startDate, endDate })} className="bg-green-600 text-white hover:bg-green-700">
          بحث
        </Button>
      </div>
    </div>
  );
};

export default SearchRevenue;
