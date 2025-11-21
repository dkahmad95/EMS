"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
} from "@mui/material";
import { Input } from "@/app/Components/Input";
import { Button } from "@/app/Components/Button";
import { RevenueEntry } from "./data";

interface EditRevenueDialogProps {
  open: boolean;
  onClose: () => void;
  entry: RevenueEntry | null;
  onSave: (updated: RevenueEntry) => void;
}

const EditRevenueDialog: React.FC<EditRevenueDialogProps> = ({
  open,
  onClose,
  entry,
  onSave,
}) => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [offices, setOffices] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);

  const [employeeName, setEmployeeName] = useState("");
  const [office, setOffice] = useState("");
  const [destination, setDestination] = useState<string>("");
  const [date, setDate] = useState("");
  const [revenueAmount, setRevenueAmount] = useState<number | string>("");
  const [notes, setNotes] = useState("");

  // Load local storage data
  useEffect(() => {
    setEmployees(JSON.parse(localStorage.getItem("employees") || "[]"));
    setOffices(JSON.parse(localStorage.getItem("offices") || "[]"));
    setDestinations(JSON.parse(localStorage.getItem("destinations") || "[]"));
  }, []);

  // Set initial form data when entry changes

  useEffect(() => {
    if (entry) {
      setEmployeeName(entry.employeeName || "");
      setOffice(entry.office || "");
      setDestination(entry.destination || "");  // FIX
      setDate(entry.date || "");
      setRevenueAmount(entry.revenueAmount || "");
      setNotes(entry.notes || "");
    }
  }, [entry]);

  // Save update
  const handleSave = () => {
    if (!entry) return;

    const updatedItem: RevenueEntry = {
      ...entry,
      employeeName,
      office,
      destination,
      date,
      revenueAmount: Number(revenueAmount),
      notes,
    };

    // Update Local Storage
    const stored = JSON.parse(localStorage.getItem("revenues") || "[]");
    const updatedList = stored.map((item: RevenueEntry) =>
      item.id === updatedItem.id ? updatedItem : item
    );

    localStorage.setItem("revenues", JSON.stringify(updatedList));

    onSave(updatedItem);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" dir="rtl">
      <DialogTitle>تعديل الإيراد</DialogTitle>
      <div className=" mt-2"
      >
        <DialogContent className="grid grid-cols-1 gap-4 ">

          {/* Employee */}
          <Autocomplete
            options={employees.map((e) => e.name)}
            value={employeeName}
            onChange={(_, val) => setEmployeeName(val || "")}
            renderInput={(params) => <TextField {...params} label="اسم الموظف" />}
          />

          {/* Office */}
          <Autocomplete
            options={offices.map((o) => o.name)}
            value={office}
            onChange={(_, val) => setOffice(val || "")}
            renderInput={(params) => <TextField {...params} label="المكتب" />}
          />

          {/* Destination */}
          <Autocomplete
            options={destinations.map((d) => d.name)}
            value={destination}
            onChange={(_, val) => setDestination(val || "")}
            renderInput={(params) => <TextField {...params} label="الوجهة" />}
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
          />

        </DialogContent>
      </div>
      <DialogActions className="flex justify-end gap-3 p-4">
        <Button onClick={onClose}>إلغاء</Button>
        <Button onClick={handleSave}>
          حفظ التعديلات
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditRevenueDialog;
