"use client";

import React from "react";
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
import { employees, offices, destinations, RevenueEntry } from "./data";

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
  const [employeeName, setEmployeeName] = React.useState(entry?.employeeName || "");
  const [office, setOffice] = React.useState(entry?.office || "");
  const [destination, setDestination] = React.useState(entry?.destination || "");
  const [date, setDate] = React.useState(entry?.date || "");
  const [revenueAmount, setRevenueAmount] = React.useState<number | string>(
    entry?.revenueAmount || ""
  );
  const [notes, setNotes] = React.useState(entry?.notes || "");

  React.useEffect(() => {
    if (entry) {
      setEmployeeName(entry.employeeName);
      setOffice(entry.office);
      setDestination(entry.destination || "");
      setDate(entry.date);
      setRevenueAmount(entry.revenueAmount);
      setNotes(entry.notes || "");
    }
  }, [entry]);

  const handleSave = () => {
    if (!entry) return;
    onSave({
      ...entry,
      employeeName,
      office,
      destination,
      date,
      revenueAmount: Number(revenueAmount),
      notes,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} dir="rtl">
      <DialogTitle>تعديل الإيراد</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
        <Autocomplete
          options={employees}
          value={employeeName}
          onChange={(_, val) => setEmployeeName(val || "")}
          renderInput={(params) => <TextField {...params} label="اسم الموظف" />}
        />
        <Autocomplete
          options={offices}
          value={office}
          onChange={(_, val) => setOffice(val || "")}
          renderInput={(params) => <TextField {...params} label="المكتب" />}
        />
        <Autocomplete
          options={destinations}
          value={destination}
          onChange={(_, val) => setDestination(val || "")}
          renderInput={(params) => <TextField {...params} label="الوجهة" />}
        />
        <Input type="date" label="التاريخ" value={date} onChange={(e) => setDate(e.target.value)} />
        <Input
          type="number"
          label="قيمة الإيراد"
          value={revenueAmount}
          onChange={(e) => setRevenueAmount(e.target.value)}
        />
        <Input label="ملاحظات" value={notes} onChange={(e) => setNotes(e.target.value)} />
      </DialogContent>
      <DialogActions sx={{ flexDirection: "row-reverse", mb: 2, mr: 2 }}>
        <Button onClick={onClose}>إلغاء</Button>
        <Button onClick={handleSave} className="bg-blue-600 text-white hover:bg-blue-700">
          حفظ التعديلات
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditRevenueDialog;
