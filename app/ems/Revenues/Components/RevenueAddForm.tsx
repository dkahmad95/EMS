"use client";

import React, { useState } from "react";
import {
  Autocomplete,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
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

const AddRevenueForm: React.FC = () => {
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
      message.success("تم إضافة الإيراد بنجاح");
      setEmployeeId(null);
      setOfficeId(null);
      setDestinationId(null);
      setCurrencyId(null);
      setDate("");
      setRevenueAmount("");
      setNotes("");
    },
    onError: () => {
      message.error("حدث خطأ أثناء إضافة الإيراد.");
    },
  });

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

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-3">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">
        إضافة الإيراد اليومي
      </h2>

      <div className="flex flex-wrap items-end gap-2 md:gap-4">

        {/* EMPLOYEE */}
        <Autocomplete
          options={employeeList ?? []}
          getOptionLabel={(option) => option.name}
          value={employeeList?.find((e) => e.id === employeeId) ?? null}
          onChange={(_, newValue) => setEmployeeId(newValue?.id ?? null)}
          renderInput={(params) => (
            <TextField {...params} label="اسم الموظف" variant="outlined" />
          )}
          sx={{ minWidth: 200 }}
        />

        {/* OFFICE */}
        <Autocomplete
          options={officeList ?? []}
          getOptionLabel={(option) => option.name}
          value={officeList?.find((o) => o.id === officeId) ?? null}
          onChange={(_, newValue) => setOfficeId(newValue?.id ?? null)}
          renderInput={(params) => (
            <TextField {...params} label="المكتب" variant="outlined" />
          )}
          sx={{ minWidth: 200 }}
        />

        {/* DESTINATION */}
        <Autocomplete
          options={destinationsList ?? []}
          getOptionLabel={(option) => option.name}
          value={destinationsList?.find((d) => d.id === destinationId) ?? null}
          onChange={(_, newValue) => setDestinationId(newValue?.id ?? null)}
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
          slotProps={{ inputLabel: { shrink: true } }}
        />

        {/* REVENUE AMOUNT */}
        <TextField
          type="number"
          label="قيمة الإيراد"
          value={revenueAmount}
          onChange={(e) => setRevenueAmount(e.target.value)}
        />

        {/* CURRENCY */}
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="currency-label">العملة</InputLabel>
          <Select
            labelId="currency-label"
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
          disabled={!isFormValid || isPending}
          className="disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
        >
          {isPending ? <Loader borderColor="white" /> : "إضافة الإيراد"}
        </Button>
      </div>
    </div>
  );
};

export default AddRevenueForm;
