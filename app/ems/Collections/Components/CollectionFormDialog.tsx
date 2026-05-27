"use client";

import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import FormModal from "@/app/Components/FormModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/server/services/api/collections/collections";
import { useEmployees } from "@/server/store/employees";
import { useOffices } from "@/server/store/offices";
import { message } from "antd";

interface CollectionFormDialogProps {
  open: boolean;
  onClose: () => void;
  selectedCollection: Collection | null;
}

const COLLECTION_TYPE_LABELS: Record<CollectionType, string> = {
  SPONSORSHIP: "كفيل",
  BOX: "حصالة",
};

const emptyForm = () => ({
  employeeId: null as number | null,
  officeId: null as number | null,
  collectionType: "" as CollectionType | "",
  date: "",
  count: "" as string,
  notes: "",
});

const CollectionFormDialog: React.FC<CollectionFormDialogProps> = ({
  open,
  onClose,
  selectedCollection,
}) => {
  const queryClient = useQueryClient();
  const isEditing = selectedCollection !== null;

  const { data: employeeList } = useEmployees();
  const { data: officeList } = useOffices();

  const [form, setForm] = useState(emptyForm());

  useEffect(() => {
    if (open) {
      if (selectedCollection) {
        setForm({
          employeeId: selectedCollection.employee_id,
          officeId: selectedCollection.office_id,
          collectionType: selectedCollection.collection_type,
          date: selectedCollection.date?.split("T")[0] ?? selectedCollection.date ?? "",
          count: String(selectedCollection.count),
          notes: selectedCollection.notes ?? "",
        });
      } else {
        setForm(emptyForm());
      }
    }
  }, [open, selectedCollection]);

  const { mutateAsync: createCollection, isPending: isCreating } = useMutation({
    mutationFn: (data: Parameters<typeof api.createCollection>[0]) =>
      api.createCollection(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      message.success("تم إضافة التحصيل بنجاح");
      onClose();
    },
    onError: () => {
      message.error("حدث خطأ أثناء إضافة التحصيل.");
    },
  });

  const { mutateAsync: updateCollection, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Collection> }) =>
      api.updateCollection(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      message.success("تم تحديث التحصيل بنجاح");
      onClose();
    },
    onError: () => {
      message.error("حدث خطأ أثناء تحديث التحصيل.");
    },
  });

  const isPending = isCreating || isUpdating;

  const isFormValid =
    form.employeeId !== null &&
    form.officeId !== null &&
    form.collectionType !== "" &&
    form.date !== "" &&
    form.count !== "";

  const handleSave = async () => {
    if (!isFormValid) return;

    const payload = {
      employee_id: form.employeeId!,
      office_id: form.officeId!,
      collection_type: form.collectionType as CollectionType,
      date: form.date,
      count: Number(form.count),
      notes: form.notes.trim() || undefined,
    };

    if (isEditing && selectedCollection?.id) {
      await updateCollection({ id: selectedCollection.id, data: payload });
    } else {
      await createCollection(payload);
    }
  };

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title={isEditing ? "تعديل تحصيل" : "إضافة تحصيل"}
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

      <Autocomplete
        options={officeList ?? []}
        getOptionLabel={(option) => option.name}
        value={officeList?.find((o) => o.id === form.officeId) ?? null}
        onChange={(_, val) => setForm((p) => ({ ...p, officeId: val?.id ?? null }))}
        renderInput={(params) => (
          <TextField {...params} label="المكتب" size="small" required />
        )}
        fullWidth
      />

      <FormControl fullWidth size="small" required>
        <InputLabel id="collection-type-label">نوع التحصيل</InputLabel>
        <Select
          labelId="collection-type-label"
          value={form.collectionType}
          label="نوع التحصيل"
          onChange={(e) =>
            setForm((p) => ({ ...p, collectionType: e.target.value as CollectionType }))
          }
        >
          {(Object.keys(COLLECTION_TYPE_LABELS) as CollectionType[]).map((type) => (
            <MenuItem key={type} value={type}>
              {COLLECTION_TYPE_LABELS[type]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

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
        type="number"
        label="العدد"
        value={form.count}
        onChange={(e) => setForm((p) => ({ ...p, count: e.target.value }))}
        fullWidth
        size="small"
        required
        slotProps={{ htmlInput: { min: 0, step: 1 } }}
      />

      <TextField
        label="ملاحظات"
        value={form.notes}
        onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
        placeholder="اختياري"
        fullWidth
        size="small"
        multiline
        rows={2}
      />
    </FormModal>
  );
};

export default CollectionFormDialog;
