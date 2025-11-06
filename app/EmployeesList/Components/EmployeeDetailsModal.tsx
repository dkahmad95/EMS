"use client";
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/app/Components/Button";

interface EmployeeDetailsModalProps {
  open: boolean;
  onClose: () => void;
  employee?: any;
  onUpdate: (data: any) => void;
}

// Dropdown options
const educationLevels = [
  { value: "ابتدائي", label: "ابتدائي" },
  { value: "ثانوي", label: "ثانوي" },
  { value: "جامعي", label: "جامعي" },
  { value: "ماجستير", label: "ماجستير" },
  { value: "دكتوراه", label: "دكتوراه" },
];

const insuranceOptions = [
  { value: "نعم", label: "نعم" },
  { value: "لا", label: "لا" },
];

const contractOptions = [
  { value: "متفرغ", label: "متفرغ" },
  { value: "متعاقد", label: "متعاقد" },
];

const genderOptions = [
  { value: "ذكر", label: "ذكر" },
  { value: "أنثى", label: "أنثى" },
];

const familyStatusOptions = [
  { value: "أعزب", label: "أعزب" },
  { value: "متزوج", label: "متزوج" },
  { value: "مطلق", label: "مطلق" },
  { value: "أرمل", label: "أرمل" },
];

const jobTitles = [
  { value: "مدير", label: "مدير" },
  { value: "محاسب", label: "محاسب" },
  { value: "مندوب مبيعات", label: "مندوب مبيعات" },
  { value: "سكرتير", label: "سكرتير" },
  { value: "فني", label: "فني" },
];

export default function EmployeeDetailsModal({
  open,
  onClose,
  employee,
  onUpdate,
}: EmployeeDetailsModalProps) {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: employee || {},
  });

  React.useEffect(() => {
    if (employee) reset(employee);
  }, [employee, reset]);

  const onSubmit = (data: any) => {
    onUpdate(data);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" dir="rtl"  >
      <DialogTitle className="font-bold text-lg">تفاصيل الموظف</DialogTitle>
<div className="mt-2">
      <DialogContent className="grid grid-cols-2  md:grid-cols-4 gap-4 mt-3">
        {/* Basic Info */}
        <Controller
          name="id"
          control={control}
          render={({ field }) => (
            <TextField label="الرقم" {...field} fullWidth disabled />
          )}
        />
        <Controller
          name="fileNumber"
          control={control}
          render={({ field }) => (
            <TextField label="رقم الملف" {...field} fullWidth />
          )}
        />
        <Controller
          name="startDate"
          control={control}
          render={({ field }) => (
            <TextField
              label="بدء العمل الفعلي"
              type="date"
              InputLabelProps={{ shrink: true }}
              {...field}
              fullWidth
            />
          )}
        />
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField label="الاسم" {...field} fullWidth />
          )}
        />
        <Controller
          name="insuranceStatus"
          control={control}
          render={({ field }) => (
            <TextField select label="التنسيب الى الضمان" {...field} fullWidth>
              {insuranceOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
        <Controller
          name="insuranceNumber"
          control={control}
          render={({ field }) => (
            <TextField label="رقم الضمان" {...field} fullWidth />
          )}
        />
        <Controller
          name="salary"
          control={control}
          render={({ field }) => (
            <TextField label="الراتب المصرح" type="number" {...field} fullWidth />
          )}
        />
        <Controller
          name="jobTitle"
          control={control}
          render={({ field }) => (
            <TextField select label="الوظيفة" {...field} fullWidth>
              {jobTitles.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
        <Controller
          name="officeLocation"
          control={control}
          render={({ field }) => (
            <TextField label="مركز العمل" {...field} fullWidth />
          )}
        />
        <Controller
          name="contractType"
          control={control}
          render={({ field }) => (
            <TextField select label="متفرغ / متعاقد" {...field} fullWidth>
              {contractOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
        <Controller
          name="birthDate"
          control={control}
          render={({ field }) => (
            <TextField
              label="تاريخ الولادة"
              type="date"
              InputLabelProps={{ shrink: true }}
              {...field}
              fullWidth
            />
          )}
        />
        <Controller
          name="birthPlace"
          control={control}
          render={({ field }) => (
            <TextField label="مواليد" {...field} fullWidth />
          )}
        />
        <Controller
          name="age"
          control={control}
          render={({ field }) => (
            <TextField label="العمر" type="number" {...field} fullWidth />
          )}
        />
        <Controller
          name="educationLevel"
          control={control}
          render={({ field }) => (
            <TextField select label="المستوى العلمي" {...field} fullWidth>
              {educationLevels.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
        <Controller
          name="bloodType"
          control={control}
          render={({ field }) => (
            <TextField label="فئة الدم" {...field} fullWidth />
          )}
        />
        <Controller
          name="phoneNumbers"
          control={control}
          render={({ field }) => (
            <TextField label="أرقام الهواتف" {...field} fullWidth />
          )}
        />
        <Controller
          name="familyStatus"
          control={control}
          render={({ field }) => (
            <TextField select label="الوضع العائلي" {...field} fullWidth>
              {familyStatusOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
        <Controller
          name="childrenCount"
          control={control}
          render={({ field }) => (
            <TextField label="عدد الأولاد" type="number" {...field} fullWidth />
          )}
        />
        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <TextField label="عنوان السكن" {...field} fullWidth />
          )}
        />
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <TextField select label="ن/ذ" {...field} fullWidth>
              {genderOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
        <Controller
          name="notes"
          control={control}
          render={({ field }) => (
            <TextField
              label="ملاحظات"
              {...field}
              fullWidth
              multiline
              rows={3}
            />
          )}
        />
      </DialogContent>
</div>
      <DialogActions className="flex justify-end gap-3 p-4">
        <Button onClick={onClose} className="bg-gray-400 text-white">
          إلغاء
        </Button>
        <Button onClick={handleSubmit(onSubmit)} className="bg-blue-600 text-white">
          تحديث
        </Button>
      </DialogActions>
    </Dialog>
  );
}
