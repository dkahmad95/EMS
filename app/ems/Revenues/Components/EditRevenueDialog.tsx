"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Button } from "@/app/Components/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/server/services/api/revenues/revenues";
import { useEmployees } from "@/server/store/employees";
import { useOffices } from "@/server/store/offices";
import { useDestinations } from "@/server/store/destinations";
import { useCurrencies } from "@/server/store/currencies";
import { message } from "antd";
import Loader from "@/app/Components/Loader";

interface EditRevenueDialogProps {
  open: boolean;
  onClose: () => void;
  entry: Revenue | null;
  onSuccess: () => void;
}

const EditRevenueDialog: React.FC<EditRevenueDialogProps> = ({
  open,
  onClose,
  entry,
  onSuccess,
}) => {
  const queryClient = useQueryClient();

  const { data: employeeList } = useEmployees();
  const { data: officeList } = useOffices();
  const { data: destinationsList } = useDestinations();
  const { data: currenciesList } = useCurrencies();

  const [employeeId, setEmployeeId] = useState<number | null>(null);
  const [officeId, setOfficeId] = useState<number | null>(null);
  const [destinationId, setDestinationId] = useState<number | null>(null);
  const [currencyId, setCurrencyId] = useState<number | null>(null);
  const [date, setDate] = useState("");
  const [revenueAmount, setRevenueAmount] = useState<string>("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (entry) {
      setEmployeeId(entry.employee_id);
      setOfficeId(entry.office_id);
      setDestinationId(entry.destination_id);
      setCurrencyId(entry.currency_id);
      setDate(entry.date?.split("T")[0] ?? entry.date ?? "");
      setRevenueAmount(String(entry.revenue_amount));
      setNotes(entry.notes ?? "");
    }
  }, [entry]);

  const { mutateAsync: updateRevenue, isPending } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Revenue> }) =>
      api.updateRevenue(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["revenues"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardRevenues"] });
      message.success("تم تحديث الإيراد بنجاح");
      onSuccess();
    },
    onError: () => {
      message.error("حدث خطأ أثناء تحديث الإيراد.");
    },
  });

  const handleSave = async () => {
    if (!entry?.id) return;

    await updateRevenue({
      id: entry.id,
      data: {
        employee_id: employeeId ?? undefined,
        office_id: officeId ?? undefined,
        destination_id: destinationId ?? undefined,
        currency_id: currencyId ?? undefined,
        date: date || undefined,
        revenue_amount: revenueAmount ? Number(revenueAmount) : undefined,
        notes: notes || undefined,
      },
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" dir="rtl">
      <DialogTitle>تعديل الإيراد</DialogTitle>
      <div className="mt-2">
        <DialogContent className="grid grid-cols-1 gap-4">

          {/* Employee */}
          <Autocomplete
            options={employeeList ?? []}
            getOptionLabel={(option) => option.name}
            value={employeeList?.find((e) => e.id === employeeId) ?? null}
            onChange={(_, val) => setEmployeeId(val?.id ?? null)}
            renderInput={(params) => <TextField {...params} label="اسم الموظف" />}
          />

          {/* Office */}
          <Autocomplete
            options={officeList ?? []}
            getOptionLabel={(option) => option.name}
            value={officeList?.find((o) => o.id === officeId) ?? null}
            onChange={(_, val) => setOfficeId(val?.id ?? null)}
            renderInput={(params) => <TextField {...params} label="المكتب" />}
          />

          {/* Destination */}
          <Autocomplete
            options={destinationsList ?? []}
            getOptionLabel={(option) => option.name}
            value={destinationsList?.find((d) => d.id === destinationId) ?? null}
            onChange={(_, val) => setDestinationId(val?.id ?? null)}
            renderInput={(params) => <TextField {...params} label="الوجهة" />}
          />

          {/* Date */}
          <TextField
            type="date"
            label="التاريخ"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            fullWidth
          />

          {/* Revenue Amount */}
          <TextField
            type="number"
            label="قيمة الإيراد"
            value={revenueAmount}
            onChange={(e) => setRevenueAmount(e.target.value)}
            fullWidth
          />

          {/* Currency */}
          <FormControl fullWidth>
            <InputLabel id="edit-currency-label">العملة</InputLabel>
            <Select
              labelId="edit-currency-label"
              value={currencyId ?? ""}
              label="العملة"
              onChange={(e) => setCurrencyId(Number(e.target.value))}
            >
              {currenciesList?.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name} ({c.code})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Notes */}
          <TextField
            label="ملاحظات"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            fullWidth
          />
        </DialogContent>
      </div>
      <DialogActions className="flex justify-end gap-3 p-4">
        <Button onClick={onClose} className="bg-gray-400 text-white">
          إلغاء
        </Button>
        <Button
          onClick={handleSave}
          disabled={isPending}
          className="bg-blue-600 text-white flex items-center gap-2"
        >
          {isPending ? <Loader borderColor="white" /> : "حفظ التعديلات"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditRevenueDialog;
