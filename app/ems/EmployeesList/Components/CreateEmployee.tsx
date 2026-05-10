"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import { Button } from "@/app/Components/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/server/services/api/employees/employees";
import { useJobTitles } from "@/server/store/jobTitles";
import { useOffices } from "@/server/store/offices";
import { useEducationLevels } from "@/server/store/educationLevels";
import { useCities } from "@/server/store/cities";
import { message } from "antd";
import Loader from "@/app/Components/Loader";


interface CreateEmployeeModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const genderMap: Record<string, string> = { ذكر: "MALE", أنثى: "FEMALE" };
const contractMap: Record<string, string> = { متفرغ: "FULL_TIME", متعاقد: "CONTRACT" };
const familyStatusMap: Record<string, string> = {
  أعزب: "SINGLE",
  متزوج: "MARRIED",
  مطلق: "DIVORCED",
  أرمل: "WIDOWED",
};
const bloodTypeMap: Record<string, string> = {
  "A+": "A_POSITIVE",
  "A-": "A_NEGATIVE",
  "B+": "B_POSITIVE",
  "B-": "B_NEGATIVE",
  "AB+": "AB_POSITIVE",
  "AB-": "AB_NEGATIVE",
  "O+": "O_POSITIVE",
  "O-": "O_NEGATIVE",
};

const contractOptions = [
  { value: "متفرغ", label: "متفرغ" },
  { value: "متعاقد", label: "متعاقد" },
];
const insuranceOptions = [
  { value: "نعم", label: "نعم" },
  { value: "لا", label: "لا" },
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
const bloodTypeOptions = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function CreateEmployeeModal({
  open,
  onClose,
  onSuccess,
}: CreateEmployeeModalProps) {
  const queryClient = useQueryClient();
  const { control, handleSubmit, reset } = useForm<Employee>({
    defaultValues: {
      first_employment_date: "",
      name: "",
      email: "",
      insurance: false,
      insurance_number: "",
      salary: 0,
      job_title_id: 0,
      office_id: 0,
      contract_type: "",
      date_of_birth: "",
      born_in: "",
      number_of_children: 0,
      lives_in: "",
      address: "",
      gender: "",
      family_status: "",
      blood_type: "",
      phone: "",
      education_level_id: 0,
      notes: "",
    },
  });

  const { data: jobTitles } = useJobTitles();
  const { data: offices } = useOffices();
  const { data: educationLevels } = useEducationLevels();
  const { data: cities } = useCities();

  const { mutateAsync: createEmployee, isPending } = useMutation({
    mutationFn: (data: Employee) => api.createEmployee(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      message.success("تم إنشاء الموظف بنجاح");
      reset();
      onSuccess();
    },
    onError: () => {
      message.error("حدث خطأ أثناء إنشاء الموظف.");
    },
  });

  const onSubmit = async (data: any) => {
    const payload: Employee = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      gender: genderMap[data.gender] ?? data.gender,
      contract_type: contractMap[data.contract_type] ?? data.contract_type,
      family_status: familyStatusMap[data.family_status] ?? data.family_status,
      blood_type: bloodTypeMap[data.blood_type] ?? data.blood_type,
      insurance: data.insurance === "نعم" ? true : false,
      insurance_number: data.insurance_number,
      date_of_birth: data.date_of_birth,
      born_in: data.born_in,
      first_employment_date: data.first_employment_date,
      number_of_children: Number(data.number_of_children),
      lives_in: data.lives_in,
      address: data.address,
      salary: Number(data.salary),
      job_title_id: Number(data.job_title_id),
      office_id: Number(data.office_id),
      education_level_id: Number(data.education_level_id),
      notes: data.notes,
    };
    await createEmployee(payload);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth   maxWidth="lg" dir="rtl">
      <DialogTitle className="font-bold text-lg">إنشاء موظف جديد</DialogTitle>
   <div> 
     <DialogContent
  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-3"
  sx={{
    maxHeight: "70vh",
    overflowY: "auto",
  }}
 
>
        <Controller
          name="first_employment_date"
          control={control}
          rules={{ required: "تاريخ بدء العمل مطلوب" }}
          render={({ field, fieldState }) => (
            <TextField label="تاريخ بدء العمل" type="date" slotProps={{ inputLabel: { shrink: true } }} {...field} fullWidth value={field.value ?? ""} error={!!fieldState.error} helperText={fieldState.error?.message} />
          )}
        />

        <Controller
          name="name"
          control={control}
          rules={{ required: "الاسم مطلوب" }}
          render={({ field, fieldState }) => (
            <TextField label="اسم الموظف" {...field} fullWidth value={field.value ?? ""} error={!!fieldState.error} helperText={fieldState.error?.message} />
          )}
        />

        <Controller
          name="phone"
          control={control}
          rules={{ required: "رقم الهاتف مطلوب" }}
          render={({ field, fieldState }) => (
            <TextField label="رقم الهاتف" {...field} fullWidth value={field.value ?? ""} error={!!fieldState.error} helperText={fieldState.error?.message} />
          )}
        />

        <Controller
          name="email"
          control={control}
          rules={{ required: "البريد الإلكتروني مطلوب" }}
          render={({ field, fieldState }) => (
            <TextField label="البريد الإلكتروني" {...field} fullWidth value={field.value ?? ""} error={!!fieldState.error} helperText={fieldState.error?.message} />
          )}
        />

        <Controller
          name="job_title_id"
          control={control}
          rules={{ required: "المسمى الوظيفي مطلوب" }}
          render={({ field, fieldState }) => (
            <TextField select label="المسمى الوظيفي" {...field} fullWidth value={field.value ?? ""} error={!!fieldState.error} helperText={fieldState.error?.message}>
              {jobTitles?.map((jt) => (
                <MenuItem key={jt.id} value={jt.id}>{jt.name}</MenuItem>
              ))}
            </TextField>
          )}
        />

        <Controller
          name="office_id"
          control={control}
          rules={{ required: "يرجى اختيار المكتب" }}
          render={({ field, fieldState }) => (
            <TextField select label="مكتب العمل" {...field} fullWidth value={field.value ?? ""} error={!!fieldState.error} helperText={fieldState.error?.message}>
              {offices?.map((o) => (
                <MenuItem key={o.id} value={o.id}>{o.name}</MenuItem>
              ))}
            </TextField>
          )}
        />

        <Controller
          name="education_level_id"
          control={control}
          rules={{ required: "المستوى العلمي مطلوب" }}
          render={({ field, fieldState }) => (
            <TextField select label="المستوى العلمي" {...field} fullWidth value={field.value ?? ""} error={!!fieldState.error} helperText={fieldState.error?.message}>
              {educationLevels?.map((ed) => (
                <MenuItem key={ed.id} value={ed.id}>{ed.name}</MenuItem>
              ))}
            </TextField>
          )}
        />

        <Controller
          name="salary"
          control={control}
          rules={{ required: "الراتب مطلوب" }}
          render={({ field, fieldState }) => (
            <TextField label="الراتب الشهري" type="number" {...field} fullWidth value={field.value ?? 0} error={!!fieldState.error} helperText={fieldState.error?.message} />
          )}
        />

        <Controller
          name="contract_type"
          control={control}
          render={({ field }) => (
            <TextField select label="متفرغ / متعاقد" {...field} fullWidth value={field.value ?? ""}>
              {contractOptions.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
            </TextField>
          )}
        />

        <Controller
          name="insurance"
          control={control}
          render={({ field }) => (
            <TextField select label="التأمين" {...field} fullWidth value={field.value ?? ""}>
              {insuranceOptions.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
            </TextField>
          )}
        />

        <Controller
          name="insurance_number"
          control={control}
          render={({ field }) => <TextField label="رقم التأمين" {...field} fullWidth value={field.value ?? ""} />}
        />

        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <TextField select label="الجنس" {...field} fullWidth value={field.value ?? ""}>
              {genderOptions.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
            </TextField>
          )}
        />

        <Controller
          name="family_status"
          control={control}
          render={({ field }) => (
            <TextField select label="الوضع العائلي" {...field} fullWidth value={field.value ?? ""}>
              {familyStatusOptions.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
            </TextField>
          )}
        />

        <Controller
          name="number_of_children"
          control={control}
          render={({ field }) => <TextField label="عدد الأولاد" type="number" {...field} fullWidth value={field.value ?? 0} />}
        />

        <Controller
          name="date_of_birth"
          control={control}
          render={({ field }) => <TextField label="تاريخ الولادة" type="date" slotProps={{ inputLabel: { shrink: true } }} {...field} fullWidth value={field.value ?? ""} />}
        />

        <Controller
          name="born_in"
          control={control}
          render={({ field }) => (
            <TextField select label="مكان الولادة" {...field} fullWidth value={field.value ?? ""}>
              {cities?.map((c) => (
                <MenuItem key={c.id} value={c.name}>{c.name}</MenuItem>
              ))}
            </TextField>
          )}
        />

        <Controller
          name="blood_type"
          control={control}
          render={({ field }) => (
            <TextField select label="فصيلة الدم" {...field} fullWidth value={field.value ?? ""}>
              {bloodTypeOptions.map((bt) => (
                <MenuItem key={bt} value={bt}>{bt}</MenuItem>
              ))}
            </TextField>
          )}
        />

        <Controller
          name="lives_in"
          control={control}
          render={({ field }) => (
            <TextField select label="مكان السكن" {...field} fullWidth value={field.value ?? ""}>
              {cities?.map((c) => (
                <MenuItem key={c.id} value={c.name}>{c.name}</MenuItem>
              ))}
            </TextField>
          )}
        />

        <Controller
          name="address"
          control={control}
          render={({ field }) => <TextField label="عنوان السكن التفصيلي" {...field} fullWidth value={field.value ?? ""} />}
        />

        <Controller
          name="notes"
          control={control}
          render={({ field }) => <TextField label="ملاحظات" {...field} fullWidth multiline rows={3} value={field.value ?? ""} />}
        />

      </DialogContent>
       </div>
      <DialogActions className="flex justify-end gap-3 p-4">
        <Button onClick={handleClose} className="bg-gray-400 text-white">
          إلغاء
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={isPending}
          className="bg-green-700 hover:bg-green-600 text-white flex items-center gap-2"
        >
          {isPending ? <Loader borderColor="white" /> : "إنشاء الموظف"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
