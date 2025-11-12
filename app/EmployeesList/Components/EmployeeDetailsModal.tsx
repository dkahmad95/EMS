"use client";
import React, { useEffect, useState } from "react";
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

export default function EmployeeDetailsModal({
  open,
  onClose,
  employee,
  onUpdate,
}: EmployeeDetailsModalProps) {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: employee || {},
  });

  const [cities, setCities] = useState<{ id: number; name: string }[]>([]);
  const [offices, setOffices] = useState<{ name: string; city: string }[]>([]);
  const [jobTitles, setJobTitles] = useState<string[]>([]);
  const [educationLevels, setEducationLevels] = useState<string[]>([]);

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

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  // Load dynamic options from localStorage
  useEffect(() => {
    const citiesLS = JSON.parse(localStorage.getItem("cities") || "[]");
    const officesLS = JSON.parse(localStorage.getItem("offices") || "[]");
    const jobTitlesLS = JSON.parse(localStorage.getItem("jobTitles") || "[]");
    const educationLS = JSON.parse(localStorage.getItem("educationLevels") || "[]");

    setCities(citiesLS);
    setOffices(officesLS);
    setJobTitles(jobTitlesLS);
    setEducationLevels(educationLS);
  }, []);

  React.useEffect(() => {
    if (employee) reset(employee);
  }, [employee, reset]);

  const onSubmit = (data: any) => {
    onUpdate(data);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" dir="rtl">
      <DialogTitle className="font-bold text-lg">تفاصيل الموظف</DialogTitle>
      <div className="mt-2">
        <DialogContent className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">

          {/* ID */}
          <Controller
            name="id"
            control={control}
            render={({ field }) => (
              <TextField label="الرقم" {...field} fullWidth disabled />
            )}
          />


          {/* Start Date */}
          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <TextField
                label="بدء العمل الفعلي"
                type="date"
                slotProps={{ inputLabel: { shrink: true } }}
                {...field}
                fullWidth
              />
            )}
          />

          {/* Name */}
          <Controller
            name="name"
            control={control}
            render={({ field }) => <TextField label="الاسم" {...field} fullWidth />}
          />

          {/* Insurance Status */}
          <Controller
            name="insuranceStatus"
            control={control}
            render={({ field }) => (
              <TextField select label="التأمين" {...field} fullWidth>
                {insuranceOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          {/* Insurance Number */}
          <Controller
            name="insuranceNumber"
            control={control}
            render={({ field }) => <TextField label="رقم الضمان" {...field} fullWidth />}
          />

          {/* Salary */}
          <Controller
            name="salary"
            control={control}
            render={({ field }) => <TextField label="الراتب المصرح" type="number" {...field} fullWidth />}
          />

          {/* Job Title */}
          <Controller
            name="jobTitle"
            control={control}
            render={({ field }) => (
              <TextField select label="الوظيفة" {...field} fullWidth>
                {jobTitles.map((jt) => (
                  <MenuItem key={jt} value={jt}>
                    {jt}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          {/* Office */}
          <Controller
            name="officeLocation"
            control={control}
            render={({ field }) => (
              <TextField select label="مركز العمل" {...field} fullWidth>
                {offices.map((o) => (
                  <MenuItem key={o.name} value={o.name}>
                    {o.name} ({o.city})
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          {/* Contract Type */}
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

          {/* Birth Date */}
          <Controller
            name="birthDate"
            control={control}
            render={({ field }) => (
              <TextField
                label="تاريخ الولادة"
                type="date"
                slotProps={{ inputLabel: { shrink: true } }}
                {...field}
                fullWidth
              />
            )}
          />

          {/* Birth Place (Cities from localStorage) */}
          <Controller
            name="birthPlace"
            control={control}
            render={({ field }) => (
              <TextField select label="مواليد" {...field} fullWidth>
                {cities.map((city) => (
                  <MenuItem key={city.id} value={city.name}>
                    {city.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          {/* Age */}
          <Controller
            name="age"
            control={control}
            render={({ field }) => <TextField label="العمر" type="number" {...field} fullWidth />}
          />

          {/* Education Level */}
          <Controller
            name="educationLevel"
            control={control}
            render={({ field }) => (
              <TextField select label="المستوى العلمي" {...field} fullWidth>
                {educationLevels.map((ed) => (
                  <MenuItem key={ed} value={ed}>
                    {ed}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          {/* Blood Type */}
          <Controller
            name="bloodType"
            control={control}
            render={({ field }) => (
              <TextField select label="فئة الدم" {...field} fullWidth>
                {bloodTypes.map((bt) => (
                  <MenuItem key={bt} value={bt}>
                    {bt}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          {/* Phone Numbers */}
          <Controller
            name="phoneNumbers"
            control={control}
            render={({ field }) => <TextField label="أرقام الهواتف" {...field} fullWidth />}
          />

          {/* Family Status */}
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

          {/* Children Count */}
          <Controller
            name="childrenCount"
            control={control}
            render={({ field }) => <TextField label="عدد الأولاد" type="number" {...field} fullWidth />}
          />

          {/* Address */}
          <Controller
            name="address"
            control={control}
            render={({ field }) => <TextField label="عنوان السكن" {...field} fullWidth />}
          />

          {/* Gender */}
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <TextField select label="الجنس" {...field} fullWidth>
                {genderOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          {/* Notes */}
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
        <Button onClick={handleSubmit(onSubmit)} className="bg-blue-600 text-white">
          تحديث
        </Button>
      </DialogActions>
    </Dialog>
  );
}
