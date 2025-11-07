"use client";

import React, { useState } from "react";
import { Autocomplete, TextField, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Input } from "@/app/Components/Input";
import { Button } from "@/app/Components/Button";
import { employees, offices, destinations, RevenueEntry } from "./data";

interface AddRevenueFormProps {
  onAdd: (entry: RevenueEntry) => void;
}

const AddRevenueForm: React.FC<AddRevenueFormProps> = ({ onAdd }) => {
  const [employeeName, setEmployeeName] = useState("");
  const [office, setOffice] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [revenueAmount, setRevenueAmount] = useState<number | string>("");
  const [currency, setCurrency] = useState("");
  const [notes, setNotes] = useState("");

  const handleAdd = () => {
    if (!employeeName || !office || !date || !revenueAmount || !currency || !destination) {
      alert("يرجى إدخال جميع البيانات المطلوبة");
      return;
    }

    const newEntry: RevenueEntry = {
      id: Date.now(),
      employeeName,
      office,
      destination,
      currency,
      date,
      revenueAmount: Number(revenueAmount),
      notes,
    };
    onAdd(newEntry);

    setEmployeeName("");
    setOffice("");
    setDate("");
    setRevenueAmount("");
    setCurrency("");
    setNotes("");
    setDestination("");
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-3">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">إضافة الإيراد اليومي</h2>
      <div className="flex flex-wrap items-end gap-2 md:gap-4">
        <Autocomplete
          options={employees}
          value={employeeName}
          onChange={(_, newValue) => setEmployeeName(newValue || "")}
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

        <Autocomplete
          options={destinations}
          value={destination}
          onChange={(_, newValue) => setDestination(newValue || "")}
          renderInput={(params) => <TextField {...params} label="الوجهة" variant="outlined" />}
          sx={{ minWidth: 200 }}
        />

        <Input type="date" label="التاريخ" value={date} onChange={(e) => setDate(e.target.value)} />
        <Input type="number" label="قيمة الإيراد" value={revenueAmount} onChange={(e) => setRevenueAmount(e.target.value)} />

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="currency-label">العملة</InputLabel>
          <Select labelId="currency-label" value={currency} label="العملة" onChange={(e) => setCurrency(e.target.value)}>
            <MenuItem value="USD">دولار</MenuItem>
            <MenuItem value="LBP">ليرة</MenuItem>
            <MenuItem value="EUR">يورو</MenuItem>
          </Select>
        </FormControl>

        <Input label="ملاحظات" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="اختياري" />

        <Button
          onClick={handleAdd}
          disabled={!employeeName || !office || !date || !revenueAmount || !currency || !destination}
          className="bg-blue-600 text-white hover:bg-blue-700 disabled:cursor-not-allowed cursor-pointer"
        >
          إضافة الإيراد
        </Button>
      </div>
    </div>
  );
};

export default AddRevenueForm;
