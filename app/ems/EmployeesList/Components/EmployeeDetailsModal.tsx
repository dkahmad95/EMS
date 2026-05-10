"use client";
import React, { useEffect } from "react";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/server/services/api/employees/employees";
import { useJobTitles } from "@/server/store/jobTitles";
import { useOffices } from "@/server/store/offices";
import { useEducationLevels } from "@/server/store/educationLevels";
import { useCities } from "@/server/store/cities";
import { message } from "antd";
import Loader from "@/app/Components/Loader";

interface EmployeeDetailsModalProps {
  open: boolean;
  onClose: () => void;
  employee?: Employee | null;
  onSuccess: () => void;
}

const genderMap: Record<string, string> = { ذكر: "MALE", أنثى: "FEMALE" };
const genderReverseMap: Record<string, string> = { MALE: "ذكر", FEMALE: "أنثى" };
const contractMap: Record<string, string> = { متفرغ: "FULL_TIME", متعاقد: "CONTRACT" };
const contractReverseMap: Record<string, string> = { FULL_TIME: "متفرغ", CONTRACT: "متعاقد" };
const familyStatusMap: Record<string, string> = {
  أعزب: "SINGLE", متزوج: "MARRIED", مطلق: "DIVORCED", أرمل: "WIDOWED",
};
const familyStatusReverseMap: Record<string, string> = {
  SINGLE: "أعزب", MARRIED: "متزوج", DIVORCED: "مطلق", WIDOWED: "أرمل",
};
const bloodTypeMap: Record<string, string> = {
  "A+": "A_POSITIVE", "A-": "A_NEGATIVE",
  "B+": "B_POSITIVE", "B-": "B_NEGATIVE",
  "AB+": "AB_POSITIVE", "AB-": "AB_NEGATIVE",
  "O+": "O_POSITIVE", "O-": "O_NEGATIVE",
};
const bloodTypeReverseMap: Record<string, string> = {
  A_POSITIVE: "A+", A_NEGATIVE: "A-",
  B_POSITIVE: "B+", B_NEGATIVE: "B-",
  AB_POSITIVE: "AB+", AB_NEGATIVE: "AB-",
  O_POSITIVE: "O+", O_NEGATIVE: "O-",
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

interface EmployeeFormValues {
  id?: number;
  name: string;
  phone: string;
  email: string;
  salary: number;
  insurance: string;
  insurance_number: string;
  contract_type: string;
  gender: string;
  family_status: string;
  blood_type: string;
  date_of_birth: string;
  born_in: string;
  first_employment_date: string;
  number_of_children: number;
  lives_in: string;
  address: string;
  job_title_id: number;
  office_id: number;
  education_level_id: number;
  notes: string;
}

export default function EmployeeDetailsModal({
  open,
  onClose,
  employee,
  onSuccess,
}: EmployeeDetailsModalProps) {
  const queryClient = useQueryClient();
  const { control, handleSubmit, reset } = useForm<EmployeeFormValues>({
    defaultValues: {
      id: undefined,
      name: "",
      phone: "",
      email: "",
      salary: 0,
      insurance: "",
      insurance_number: "",
      contract_type: "",
      gender: "",
      family_status: "",
      blood_type: "",
      date_of_birth: "",
      born_in: "",
      first_employment_date: "",
      number_of_children: 0,
      lives_in: "",
      address: "",
      job_title_id: 0,
      office_id: 0,
      education_level_id: 0,
      notes: "",
    },
  });

  const { data: jobTitles } = useJobTitles();
  const { data: offices } = useOffices();
  const { data: educationLevels } = useEducationLevels();
  const { data: cities } = useCities();

  useEffect(() => {
    if (employee) {
      reset({
        id: employee.id,
        name: employee.name,
        phone: employee.phone,
        email: employee.email,
        salary: employee.salary,
        insurance: employee.insurance ? "نعم" : "لا",
        insurance_number: employee.insurance_number,
        contract_type: contractReverseMap[employee.contract_type] ?? employee.contract_type,
        gender: genderReverseMap[employee.gender] ?? employee.gender,
        family_status: familyStatusReverseMap[employee.family_status] ?? employee.family_status,
        blood_type: bloodTypeReverseMap[employee.blood_type] ?? employee.blood_type,
        date_of_birth: employee.date_of_birth?.split("T")[0] ?? "",
        born_in: employee.born_in,
        first_employment_date: employee.first_employment_date?.split("T")[0] ?? "",
        number_of_children: employee.number_of_children,
        lives_in: employee.lives_in,
        address: employee.address,
        job_title_id: employee.job_title_id,
        office_id: employee.office_id,
        education_level_id: employee.education_level_id,
        notes: employee.notes ?? "",
      });
    }
  }, [employee, reset]);

  const { mutateAsync: updateEmployee, isPending } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Employee> }) =>
      api.updateEmployee(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      message.success("تم تحديث الموظف بنجاح");
      onSuccess();
    },
    onError: () => {
      message.error("حدث خطأ أثناء تحديث الموظف.");
    },
  });

  const onSubmit = async (data: any) => {
    if (!employee?.id) return;
    const payload: Partial<Employee> = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      gender: genderMap[data.gender] ?? data.gender,
      contract_type: contractMap[data.contract_type] ?? data.contract_type,
      family_status: familyStatusMap[data.family_status] ?? data.family_status,
      blood_type: bloodTypeMap[data.blood_type] ?? data.blood_type,
      insurance: data.insurance === "نعم",
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
    await updateEmployee({ id: employee.id, data: payload });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth   maxWidth="lg" dir="rtl">
      <DialogTitle className="font-bold text-lg">تفاصيل الموظف</DialogTitle>
      <div className="mt-2">
      <DialogContent
  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-3"
  sx={{
    maxHeight: "70vh",
    overflowY: "auto",
  }}
>
          <Controller
            name="id"
            control={control}
            render={({ field }) => (
              <TextField label="الرقم" {...field} fullWidth disabled />
            )}
          />

          <Controller
            name="first_employment_date"
            control={control}
            render={({ field }) => (
              <TextField label="بدء العمل الفعلي" type="date" slotProps={{ inputLabel: { shrink: true } }} {...field} fullWidth />
            )}
          />

          <Controller
            name="name"
            control={control}
            render={({ field }) => <TextField label="الاسم" {...field} fullWidth />}
          />

          <Controller
            name="insurance"
            control={control}
            render={({ field }) => (
              <TextField select label="التأمين" {...field} fullWidth>
                {insuranceOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </TextField>
            )}
          />

          <Controller
            name="insurance_number"
            control={control}
            render={({ field }) => <TextField label="رقم الضمان" {...field} fullWidth />}
          />

          <Controller
            name="salary"
            control={control}
            render={({ field }) => <TextField label="الراتب المصرح" type="number" {...field} fullWidth />}
          />

          <Controller
            name="job_title_id"
            control={control}
            render={({ field }) => (
              <TextField select label="الوظيفة" {...field} fullWidth>
                {jobTitles?.map((jt) => (
                  <MenuItem key={jt.id} value={jt.id}>{jt.name}</MenuItem>
                ))}
              </TextField>
            )}
          />

          <Controller
            name="office_id"
            control={control}
            render={({ field }) => (
              <TextField select label="مركز العمل" {...field} fullWidth>
                {offices?.map((o) => (
                  <MenuItem key={o.id} value={o.id}>{o.name}</MenuItem>
                ))}
              </TextField>
            )}
          />

          <Controller
            name="contract_type"
            control={control}
            render={({ field }) => (
              <TextField select label="متفرغ / متعاقد" {...field} fullWidth>
                {contractOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </TextField>
            )}
          />

          <Controller
            name="date_of_birth"
            control={control}
            render={({ field }) => (
              <TextField label="تاريخ الولادة" type="date" slotProps={{ inputLabel: { shrink: true } }} {...field} fullWidth />
            )}
          />

          <Controller
            name="born_in"
            control={control}
            render={({ field }) => (
              <TextField select label="مواليد" {...field} fullWidth>
                {cities?.map((city) => (
                  <MenuItem key={city.id} value={city.name}>{city.name}</MenuItem>
                ))}
              </TextField>
            )}
          />

          <Controller
            name="education_level_id"
            control={control}
            render={({ field }) => (
              <TextField select label="المستوى العلمي" {...field} fullWidth>
                {educationLevels?.map((ed) => (
                  <MenuItem key={ed.id} value={ed.id}>{ed.name}</MenuItem>
                ))}
              </TextField>
            )}
          />

          <Controller
            name="blood_type"
            control={control}
            render={({ field }) => (
              <TextField select label="فئة الدم" {...field} fullWidth>
                {bloodTypeOptions.map((bt) => (
                  <MenuItem key={bt} value={bt}>{bt}</MenuItem>
                ))}
              </TextField>
            )}
          />

          <Controller
            name="phone"
            control={control}
            render={({ field }) => <TextField label="أرقام الهواتف" {...field} fullWidth />}
          />

          <Controller
            name="family_status"
            control={control}
            render={({ field }) => (
              <TextField select label="الوضع العائلي" {...field} fullWidth>
                {familyStatusOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </TextField>
            )}
          />

          <Controller
            name="number_of_children"
            control={control}
            render={({ field }) => <TextField label="عدد الأولاد" type="number" {...field} fullWidth />}
          />

          <Controller
            name="lives_in"
            control={control}
            render={({ field }) => (
              <TextField select label="السكن" {...field} fullWidth>
                {cities?.map((city) => (
                  <MenuItem key={city.id} value={city.name}>{city.name}</MenuItem>
                ))}
              </TextField>
            )}
          />

          <Controller
            name="address"
            control={control}
            render={({ field }) => <TextField label="عنوان السكن التفصيلي" {...field} fullWidth />}
          />

          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <TextField select label="الجنس" {...field} fullWidth>
                {genderOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </TextField>
            )}
          />

          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <TextField label="ملاحظات" {...field} fullWidth multiline rows={3} />
            )}
          />
        </DialogContent>
      </div>
      <DialogActions className="flex justify-end gap-3 p-4">
        <Button onClick={onClose} className="bg-gray-400 text-white">
          إلغاء
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={isPending}
          className="bg-blue-600 text-white flex items-center gap-2"
        >
          {isPending ? <Loader borderColor="white" /> : "تحديث"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
