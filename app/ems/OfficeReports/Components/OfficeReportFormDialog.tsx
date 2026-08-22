"use client";

import React, { useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import FormModal from "@/app/Components/FormModal";
import { useAllEmployees } from "@/server/store/employees";
import * as api from "@/server/services/api/officeReports/officeReports";

interface OfficeReportFormDialogProps {
  open: boolean;
  onClose: () => void;
  selectedReport: OfficeReport | null;
}

const emptyForm = () => ({
  employeeId: null as number | null,
  date: "",
  description: "",
});

const OfficeReportFormDialog: React.FC<OfficeReportFormDialogProps> = ({
  open,
  onClose,
  selectedReport,
}) => {
  const queryClient = useQueryClient();
  const isEditing = selectedReport !== null;

  const { data: employeeList } = useAllEmployees();

  const [form, setForm] = useState(emptyForm());

  useEffect(() => {
    if (!open) return;
    if (selectedReport) {
      setForm({
        employeeId: selectedReport.employee_id,
        date: selectedReport.date?.split("T")[0] ?? selectedReport.date ?? "",
        description: selectedReport.description ?? "",
      });
    } else {
      setForm(emptyForm());
    }
  }, [open, selectedReport]);

  const { mutateAsync: createReport, isPending: isCreating } = useMutation({
    mutationFn: (data: api.OfficeReportPayload) => api.createOfficeReport(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["officeReports"] });
      message.success("تم إضافة التقرير بنجاح");
      onClose();
    },
    onError: () => {
      message.error("حدث خطأ أثناء إضافة التقرير.");
    },
  });

  const { mutateAsync: updateReport, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<api.OfficeReportPayload> }) =>
      api.updateOfficeReport(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["officeReports"] });
      message.success("تم تحديث التقرير بنجاح");
      onClose();
    },
    onError: () => {
      message.error("حدث خطأ أثناء تحديث التقرير.");
    },
  });

  const isPending = isCreating || isUpdating;

  const isFormValid =
    form.employeeId !== null && form.date !== "" && form.description.trim() !== "";

  const handleSave = async () => {
    if (!isFormValid) return;

    const payload: api.OfficeReportPayload = {
      employee_id: form.employeeId!,
      date: form.date,
      description: form.description.trim(),
    };

    if (isEditing && selectedReport?.id) {
      await updateReport({ id: selectedReport.id, data: payload });
    } else {
      await createReport(payload);
    }
  };

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title={isEditing ? "تعديل تقرير" : "إضافة تقرير"}
      onConfirm={handleSave}
      isLoading={isPending}
      confirmLabel={isEditing ? "تحديث" : "إضافة"}
      size="md"
    >
      <Autocomplete
        options={employeeList ?? []}
        getOptionLabel={(option) => option.name}
        value={employeeList?.find((e) => e.id === form.employeeId) ?? null}
        onChange={(_, val) => setForm((p) => ({ ...p, employeeId: val?.id ?? null }))}
        renderInput={(params) => (
          <TextField {...params} label="اسم الموظف" size="small" required />
        )}
        fullWidth
      />

      <TextField
        type="date"
        label="التاريخ"
        value={form.date}
        onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
        slotProps={{ inputLabel: { shrink: true } }}
        fullWidth
        size="small"
        required
      />

      <TextField
        label="الوصف"
        value={form.description}
        onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
        fullWidth
        size="small"
        multiline
        rows={4}
        required
      />
    </FormModal>
  );
};

export default OfficeReportFormDialog;
