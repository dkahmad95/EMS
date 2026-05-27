"use client";

import React, { useState } from "react";
import {
  Autocomplete,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
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

interface AddRevenueFormProps {
  open: boolean;
  onClose: () => void;
}

const AddRevenueForm: React.FC<AddRevenueFormProps> = ({ open, onClose }) => {
  const queryClient = useQueryClient();

  const { data: employeeList } = useEmployees();
  const { data: officeList } = useOffices();
  const { data: currenciesList } = useCurrencies();
  const { data: destinationsList } = useDestinations();

  const [employeeId, setEmployeeId] = useState<number | null>(null);
  const [officeId, setOfficeId] = useState<number | null>(null);
  const [destinationId, setDestinationId] = useState<number | null>(null);
  const [currencyId, setCurrencyId] = useState<number | null>(null);
  const [date, setDate] = useState("");
  const [revenueAmount, setRevenueAmount] = useState<string>("");
  const [notes, setNotes] = useState("");

  const { mutateAsync: createRevenue, isPending } = useMutation({
    mutationFn: (data: Revenue) => api.createRevenue(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["revenues"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardRevenues"] });
      message.success("تم إضافة الإيراد بنجاح");
      resetForm();
      onClose();
    },
    onError: () => {
      message.error("حدث خطأ أثناء إضافة الإيراد.");
    },
  });

  const resetForm = () => {
    setEmployeeId(null);
    setOfficeId(null);
    setDestinationId(null);
    setCurrencyId(null);
    setDate("");
    setRevenueAmount("");
    setNotes("");
  };

  const isFormValid =
    employeeId !== null &&
    officeId !== null &&
    destinationId !== null &&
    currencyId !== null &&
    date !== "" &&
    revenueAmount !== "";

  const handleAdd = async () => {
    if (!isFormValid) return;

    await createRevenue({
      employee_id: employeeId!,
      office_id: officeId!,
      destination_id: destinationId!,
      currency_id: currencyId!,
      date,
      revenue_amount: Number(revenueAmount),
      notes: notes || undefined,
    });
  };

  const handleClose = () => {
    if (!isPending) {
      resetForm();
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      dir="rtl"
    >
      <DialogTitle className="font-bold text-lg">
        إضافة الإيراد اليومي
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <Autocomplete
            options={employeeList ?? []}
            getOptionLabel={(option) => option.name}
            value={employeeList?.find((e) => e.id === employeeId) ?? null}
            onChange={(_, newValue) => setEmployeeId(newValue?.id ?? null)}
            disabled={isPending}
            renderInput={(params) => (
              <TextField {...params} label="اسم الموظف" variant="outlined" />
            )}
          />

          <Autocomplete
            options={officeList ?? []}
            getOptionLabel={(option) => option.name}
            value={officeList?.find((o) => o.id === officeId) ?? null}
            onChange={(_, newValue) => setOfficeId(newValue?.id ?? null)}
            disabled={isPending}
            renderInput={(params) => (
              <TextField {...params} label="المكتب" variant="outlined" />
            )}
          />

          <Autocomplete
            options={destinationsList ?? []}
            getOptionLabel={(option) => option.name}
            value={destinationsList?.find((d) => d.id === destinationId) ?? null}
            onChange={(_, newValue) => setDestinationId(newValue?.id ?? null)}
            disabled={isPending}
            renderInput={(params) => (
              <TextField {...params} label="الوجهة" variant="outlined" />
            )}
          />

          <TextField
            type="date"
            label="التاريخ"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            disabled={isPending}
            fullWidth
          />

          <TextField
            type="number"
            label="قيمة الإيراد"
            value={revenueAmount}
            onChange={(e) => setRevenueAmount(e.target.value)}
            disabled={isPending}
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel id="currency-label">العملة</InputLabel>
            <Select
              labelId="currency-label"
              value={currencyId ?? ""}
              label="العملة"
              onChange={(e) => setCurrencyId(Number(e.target.value))}
              disabled={isPending}
            >
              {currenciesList?.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name} ({c.code})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="ملاحظات"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="اختياري"
            disabled={isPending}
            fullWidth
            className="md:col-span-2"
          />
        </Box>
      </DialogContent>

      <DialogActions className="flex justify-end gap-3 p-4">
        <Button
          onClick={handleClose}
          className="bg-gray-400 text-white"
          disabled={isPending}
        >
          إلغاء
        </Button>

        <Button
          onClick={handleAdd}
          disabled={!isFormValid || isPending}
          className="disabled:cursor-not-allowed"
        >
          {isPending ? <Loader borderColor="white" /> : "إضافة الإيراد"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddRevenueForm;
