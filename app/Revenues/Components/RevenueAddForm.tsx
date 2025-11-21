"use client";

import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

import { Input } from "@/app/Components/Input";
import { Button } from "@/app/Components/Button";

interface Destination {
  id: number;
  name: string;
}

interface RevenueEntry {
  id: number;
  employeeName: string;
  office: string;
  destination: string;
  currency: string;
  date: string;
  revenueAmount: number;
  notes?: string;
}

interface AddRevenueFormProps {
  onAdd: (entry: RevenueEntry) => void;
}

const AddRevenueForm: React.FC<AddRevenueFormProps> = ({ onAdd }) => {
  const [employeeList, setEmployeeList] = useState<any[]>([]);
  const [officeList, setOfficeList] = useState<any[]>([]);
  const [currenciesList, setCurrenciesList] = useState<any[]>([]);
  const [destinationsList, setDestinationsList] = useState<Destination[]>([]);

  const [employeeName, setEmployeeName] = useState("");
  const [office, setOffice] = useState("");
  const [destination, setDestination] = useState<Destination | null>(null);
  const [date, setDate] = useState("");
  const [revenueAmount, setRevenueAmount] = useState<number | string>("");
  const [currency, setCurrency] = useState("");
  const [notes, setNotes] = useState("");

  // LOAD DATA FROM LOCAL STORAGE
  useEffect(() => {
    setEmployeeList(JSON.parse(localStorage.getItem("employees") || "[]"));
    setOfficeList(JSON.parse(localStorage.getItem("offices") || "[]"));
    setCurrenciesList(JSON.parse(localStorage.getItem("currencies") || "[]"));
    setDestinationsList(JSON.parse(localStorage.getItem("destinations") || "[]"));
  }, []);

  const handleAdd = () => {
    if (!employeeName || !office || !date || !revenueAmount || !currency || !destination) {
      alert("يرجى إدخال جميع البيانات المطلوبة");
      return;
    }

    const newEntry: RevenueEntry = {
      id: Date.now(),
      employeeName,
      office,
      destination: destination.name, // Save NAME only
      currency,
      date,
      revenueAmount: Number(revenueAmount),
      notes,
    };

    // Save to localStorage
    const stored = JSON.parse(localStorage.getItem("revenues") || "[]");
    stored.push(newEntry);
    localStorage.setItem("revenues", JSON.stringify(stored));

    onAdd(newEntry);

    // Reset fields
    setEmployeeName("");
    setOffice("");
    setDestination(null);
    setDate("");
    setRevenueAmount("");
    setCurrency("");
    setNotes("");
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-3">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">
        إضافة الإيراد اليومي
      </h2>

      <div className="flex flex-wrap items-end gap-2 md:gap-4">

        {/* EMPLOYEE */}
        <Autocomplete
          options={employeeList.map((e) => e.name)}
          value={employeeName}
          onChange={(_, newValue) => setEmployeeName(newValue || "")}
          renderInput={(params) => (
            <TextField {...params} label="اسم الموظف" variant="outlined" />
          )}
          sx={{ minWidth: 200 }}
        />

        {/* OFFICE */}
        <Autocomplete
          options={officeList.map((o) => o.name)}
          value={office}
          onChange={(_, newValue) => setOffice(newValue || "")}
          renderInput={(params) => (
            <TextField {...params} label="المكتب" variant="outlined" />
          )}
          sx={{ minWidth: 200 }}
        />

        {/* DESTINATION */}
        <Autocomplete
          options={destinationsList}
          value={destination}
          onChange={(_, newValue) => setDestination(newValue)}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <TextField {...params} label="الوجهة" variant="outlined" />
          )}
          sx={{ minWidth: 200 }}
        />

        {/* DATE */}
        <TextField
          type="date"
          label="التاريخ"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          slotProps={{
            inputLabel: {
              shrink: true,   // the new recommended API
            },
          }}

        />

        {/* REVENUE AMOUNT */}
        <TextField
          type="text"
          label="قيمة الإيراد"
          value={revenueAmount}
          onChange={(e) => setRevenueAmount(e.target.value)}
        />

        {/* CURRENCY */}
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="currency-label">العملة</InputLabel>
          <Select
            labelId="currency-label"
            value={currency}
            label="العملة"
            onChange={(e) => setCurrency(e.target.value)}
          >
            {currenciesList.map((c: any) => (
              <MenuItem key={c.id} value={c.name}>
                {c.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* NOTES */}
        <TextField
          label="ملاحظات"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="اختياري"
        />

        {/* ADD BUTTON */}
        <Button
          onClick={handleAdd}
          disabled={!employeeName || !office || !date || !revenueAmount || !currency || !destination}
          className="disabled:cursor-not-allowed cursor-pointer"
        >
          إضافة الإيراد
        </Button>
      </div>
    </div>
  );
};

export default AddRevenueForm;
