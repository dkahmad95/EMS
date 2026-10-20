"use client";

import React, { useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import FormModal from "@/app/Components/FormModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/server/services/api/revenues/revenues";
import { useAllEmployees } from "@/server/store/employees";
import { useTokenOffices } from "@/app/hooks/useTokenOffices";
import { useDestinations } from "@/server/store/destinations";
import { useCurrencies } from "@/server/store/currencies";
import { message } from "antd";
import { todayLocal } from "@/app/ems/Dashboard/utils/date";
import { LAST_REVENUE_OFFICE_KEY } from "@/app/utils/storageKeys";

interface AddRevenueFormProps {
  open: boolean;
  onClose: () => void;
}

const readLastOffice = (): number | null => {
  try {
    const raw = localStorage.getItem(LAST_REVENUE_OFFICE_KEY);
    const n = raw ? Number(raw) : NaN;
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
};

const saveLastOffice = (id: number): void => {
  try {
    localStorage.setItem(LAST_REVENUE_OFFICE_KEY, String(id));
  } catch {
    /* storage unavailable */
  }
};

const isUsd = (c: Currency): boolean =>
  (c.currency_type as unknown as string) === "USD" || c.code?.toUpperCase() === "USD";

const AddRevenueForm: React.FC<AddRevenueFormProps> = ({ open, onClose }) => {
  const queryClient = useQueryClient();

  const { data: employeeList } = useAllEmployees();
  const { data: officeList } = useTokenOffices();
  const { data: currenciesList } = useCurrencies();
  const { data: destinationsList } = useDestinations();

  const [employeeId, setEmployeeId] = useState<number | null>(null);
  const [officeId, setOfficeId] = useState<number | null>(null);
  const [destinationId, setDestinationId] = useState<number | null>(null);
  const [currencyId, setCurrencyId] = useState<number | null>(null);
  const [date, setDate] = useState(todayLocal);
  const [revenueAmount, setRevenueAmount] = useState<string>("");
  const [receiptsCount, setReceiptsCount] = useState<string>("1");
  const [notes, setNotes] = useState("");

  // The dialog stays mounted (only `open` toggles), so defaults are (re)applied on open:
  // currency -> USD, office -> the last office this user picked. Both only fill empty fields.
  useEffect(() => {
    if (!open) return;
    if (currencyId == null) {
      const usd = currenciesList?.find(isUsd);
      if (usd?.id != null) setCurrencyId(usd.id);
    }
    if (officeId == null) {
      const last = readLastOffice();
      if (last != null && officeList?.some((o) => o.id === last)) setOfficeId(last);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, currenciesList, officeList]);

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
    setDate(todayLocal());
    setRevenueAmount("");
    setReceiptsCount("1");
    setNotes("");
  };

  const receiptsNum = Number(receiptsCount);
  const isFormValid =
    employeeId !== null &&
    officeId !== null &&
    destinationId !== null &&
    currencyId !== null &&
    date !== "" &&
    revenueAmount !== "" &&
    Number.isInteger(receiptsNum) &&
    receiptsNum >= 1;

  const handleAdd = async () => {
    if (!isFormValid) return;

    await createRevenue({
      employee_id: employeeId!,
      office_id: officeId!,
      destination_id: destinationId!,
      currency_id: currencyId!,
      date,
      revenue_amount: Number(revenueAmount),
      receipts_count: receiptsNum,
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
    <FormModal
      open={open}
      onClose={handleClose}
      title="إضافة الإيراد اليومي"
      onConfirm={handleAdd}
      isLoading={isPending}
      confirmLabel="إضافة الإيراد"
      size="lg"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          onChange={(_, newValue) => {
            setOfficeId(newValue?.id ?? null);
            if (newValue?.id != null) saveLastOffice(newValue.id);
          }}
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

        <Autocomplete
          options={currenciesList ?? []}
          getOptionLabel={(c) => `${c.name} (${c.code})`}
          isOptionEqualToValue={(o, v) => o.id === v.id}
          value={currenciesList?.find((c) => c.id === currencyId) ?? null}
          onChange={(_, newValue) => setCurrencyId(newValue?.id ?? null)}
          disabled={isPending}
          renderInput={(params) => (
            <TextField {...params} label="العملة" variant="outlined" />
          )}
        />

        <TextField
          type="number"
          label="عدد الإيصالات"
          value={receiptsCount}
          onChange={(e) => setReceiptsCount(e.target.value)}
          slotProps={{ htmlInput: { min: 1, step: 1 } }}
          error={receiptsCount !== "" && !(Number.isInteger(receiptsNum) && receiptsNum >= 1)}
          disabled={isPending}
          fullWidth
        />

        <TextField
          label="ملاحظات"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="اختياري"
          disabled={isPending}
          fullWidth
          className="md:col-span-2"
        />
      </div>
    </FormModal>
  );
};

export default AddRevenueForm;
