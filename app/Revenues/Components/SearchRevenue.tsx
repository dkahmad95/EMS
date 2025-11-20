"use client";

import React, { useState, useEffect } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { Input } from "@/app/Components/Input";
import { Button } from "@/app/Components/Button";

interface SearchRevenueProps {
  onSearch: (filters: {
    employee?: string | null;
    office?: string | null;
    startDate?: string;
    endDate?: string;
  }) => void;
}

const SearchRevenue: React.FC<SearchRevenueProps> = ({ onSearch }) => {
  const [employeeList, setEmployeeList] = useState<string[]>([]);
  const [officeList, setOfficeList] = useState<string[]>([]);

  const [employee, setEmployee] = useState<string | null>(null);
  const [office, setOffice] = useState<string | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Load employees and offices from localStorage
  useEffect(() => {
    const employeesLS = JSON.parse(localStorage.getItem("employees") || "[]");
    const officesLS = JSON.parse(localStorage.getItem("offices") || "[]");

    setEmployeeList(employeesLS.map((e: any) => e.name));
    setOfficeList(officesLS.map((o: any) => o.name));
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-3">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">بحث الإيرادات</h2>

      <div className="flex flex-wrap items-end gap-2 md:gap-4">

        {/* EMPLOYEE */}
        <Autocomplete
          options={employeeList}
          value={employee}
          onChange={(_, newValue) => setEmployee(newValue)}
          renderInput={(params) => (
            <TextField {...params} label="اسم الموظف" variant="outlined" />
          )}
          sx={{ minWidth: 200 }}
        />

        {/* OFFICE */}
        <Autocomplete
          options={officeList}
          value={office}
          onChange={(_, newValue) => setOffice(newValue)}
          renderInput={(params) => (
            <TextField {...params} label="المكتب" variant="outlined" />
          )}
          sx={{ minWidth: 200 }}
        />

        {/* START DATE */}
        <Input
          type="date"
          label="من تاريخ"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        {/* END DATE */}
        <Input
          type="date"
          label="إلى تاريخ"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        {/* SEARCH */}
        <Button
          onClick={() => onSearch({ employee, office, startDate, endDate })}
          className="bg-green-600 text-white hover:bg-green-700"
        >
          بحث
        </Button>

      </div>
    </div>
  );
};

export default SearchRevenue;
