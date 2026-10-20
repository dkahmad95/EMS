"use client";

import React, { useEffect, useState } from "react";
import { TextField, Autocomplete } from "@mui/material";
import FormModal from "@/app/Components/FormModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/server/services/api/revenues/revenues";
import { useAllEmployees } from "@/server/store/employees";
import { useTokenOffices } from "@/app/hooks/useTokenOffices";
import { useDestinations } from "@/server/store/destinations";
import { useCurrencies } from "@/server/store/currencies";
import { message } from "antd";

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

  const { data: employeeList } = useAllEmployees();
  const { data: officeList } = useTokenOffices();
  const { data: destinationsList } = useDestinations();
  const { data: currenciesList } = useCurrencies();

  const [employeeId, setEmployeeId] = useState<number | null>(null);
  const [officeId, setOfficeId] = useState<number | null>(null);
  const [destinationId, setDestinationId] = useState<number | null>(null);
  const [currencyId, setCurrencyId] = useState<number | null>(null);
  const [date, setDate] = useState("");
  const [revenueAmount, setRevenueAmount] = useState<string>("");
  const [receiptsCount, setReceiptsCount] = useState<string>("1");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (entry) {
      setEmployeeId(entry.employee_id);
      setOfficeId(entry.office_id);
      setDestinationId(entry.destination_id);
      setCurrencyId(entry.currency_id);
      setDate(entry.date?.split("T")[0] ?? entry.date ?? "");
      setRevenueAmount(String(entry.revenue_amount));
      setReceiptsCount(String(entry.receipts_count ?? 1));
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

  const receiptsNum = Number(receiptsCount);
  const receiptsValid = receiptsCount === "" || (Number.isInteger(receiptsNum) && receiptsNum >= 1);

  const handleSave = async () => {
    if (!entry?.id || !receiptsValid) return;

    await updateRevenue({
      id: entry.id,
      data: {
        employee_id: employeeId ?? undefined,
        office_id: officeId ?? undefined,
        destination_id: destinationId ?? undefined,
        currency_id: currencyId ?? undefined,
        date: date || undefined,
        revenue_amount: revenueAmount ? Number(revenueAmount) : undefined,
        receipts_count: receiptsCount ? receiptsNum : undefined,
        notes: notes || undefined,
      },
    });
  };

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title="تعديل الإيراد"
      onConfirm={handleSave}
      isLoading={isPending}
      confirmLabel="حفظ التعديلات"
      size="md"
    >
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
      <Autocomplete
        options={currenciesList ?? []}
        getOptionLabel={(c) => `${c.name} (${c.code})`}
        isOptionEqualToValue={(o, v) => o.id === v.id}
        value={currenciesList?.find((c) => c.id === currencyId) ?? null}
        onChange={(_, val) => setCurrencyId(val?.id ?? null)}
        renderInput={(params) => <TextField {...params} label="العملة" />}
      />

      {/* Receipts count */}
      <TextField
        type="number"
        label="عدد الإيصالات"
        value={receiptsCount}
        onChange={(e) => setReceiptsCount(e.target.value)}
        slotProps={{ htmlInput: { min: 1, step: 1 } }}
        error={!receiptsValid}
        fullWidth
      />

      {/* Notes */}
      <TextField
        label="ملاحظات"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        fullWidth
      />
    </FormModal>
  );
};

export default EditRevenueDialog;
