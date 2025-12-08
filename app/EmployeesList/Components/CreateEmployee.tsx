"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, MenuItem } from "@mui/material";
import { Button } from "@/app/Components/Button";
import { useRouter } from "next/navigation";

interface EmployeeFormInputs {
  id?: number;
  fileNumber?: string;
  startDate?: string;
  name: string;
  email: string;
  insuranceStatus?: string;
  insuranceNumber?: string;
  salary: number;
  jobTitle: string;
  officeLocation: string;
  contractType?: string;
  birthDate?: string;
  birthPlace?: string;
  age?: number;
  educationLevel: string;
  bloodType?: string;
  phoneNumbers: string;
  familyStatus?: string;
  childrenCount?: number;
  address?: string;
  detailedAddress?: string;
  gender?: string;
  notes?: string;
  permissionGroup: string;
}

export default function CreateEmployeeForm() {
  const { control, handleSubmit, reset } = useForm<EmployeeFormInputs>({
    defaultValues: {
      fileNumber: "",
      startDate: "",
      name: "",
      email: "",
      insuranceStatus: "",
      insuranceNumber: "",
      salary: 0,
      jobTitle: "",
      officeLocation: "",
      contractType: "",
      birthDate: "",
      birthPlace: "",
      age: 0,
      educationLevel: "",
      bloodType: "",
      phoneNumbers: "",
      familyStatus: "",
      childrenCount: 0,
      address: "",
      detailedAddress: "",
      gender: "",
      notes: "",
      permissionGroup: "",
    },
  });

  const [cities, setCities] = useState<{ name: string; id: number }[]>([]);
  const [offices, setOffices] = useState<{ name: string; city: string }[]>([]);
  const [jobTitles, setJobTitles] = useState<string[]>([]);
  const [educationLevels, setEducationLevels] = useState<string[]>([]);
  const [permissionGroups, setPermissionGroups] = useState<{ name: string; id: number }[]>([]);

   const route = useRouter();
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

  // Load dynamic selects from localStorage
  useEffect(() => {
    const citiesLS = JSON.parse(localStorage.getItem("cities") || "[]");
    const officesLS = JSON.parse(localStorage.getItem("offices") || "[]");
    const jobTitlesLS = JSON.parse(localStorage.getItem("jobTitles") || "[]");
    const educationLS = JSON.parse(localStorage.getItem("educationLevels") || "[]");
    const permissionGroupsLS = JSON.parse(localStorage.getItem("permissionGroups") || "[]");

    setCities(citiesLS);
    setOffices(officesLS);
    setJobTitles(jobTitlesLS);
    setEducationLevels(educationLS);
    setPermissionGroups(permissionGroupsLS);
  }, []);

  const onSubmit = (data: EmployeeFormInputs) => {
    const employees = JSON.parse(localStorage.getItem("employees") || "[]");
    localStorage.setItem(
      "employees",
      JSON.stringify([...employees, { ...data, id: Date.now() }])
    );
    alert(" تم إنشاء الموظف بنجاح!");
    route.push("/EmployeesList");
    reset();
  };
  // Hard-coded Blood Types
const bloodTypeOptions = [
  "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"
];

  return (
    <div dir="rtl" className="font-[Tajawal] text-right p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-md bg-white shadow p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* File Number
        <Controller
          name="fileNumber"
          control={control}
          render={({ field }) => (
            <TextField label="رقم الملف" {...field} fullWidth value={field.value ?? ""} />
          )}
        /> */}

        {/* Start Date */}
        <Controller
          name="startDate"
          control={control}
          render={({ field }) => (
            <TextField label="تاريخ بدء العمل" type="date"  slotProps={{ inputLabel: { shrink: true } }} {...field} fullWidth value={field.value ?? ""} />
          )}
        />

        {/* Name */}
        <Controller
          name="name"
          control={control}
          rules={{ required: "الاسم مطلوب" }}
          render={({ field, fieldState }) => (
            <TextField label="اسم الموظف" {...field} fullWidth value={field.value ?? ""} error={!!fieldState.error} helperText={fieldState.error?.message} />
          )}
        />

        {/* Phone Numbers */}
        <Controller
          name="phoneNumbers"
          control={control}
          rules={{
            required: "رقم الهاتف مطلوب",
            pattern: { value: /^[0-9]{8,15}$/, message: "أدخل رقم هاتف صالح" },
          }}
          render={({ field, fieldState }) => (
            <TextField label="رقم الهاتف" {...field} fullWidth value={field.value ?? ""} error={!!fieldState.error} helperText={fieldState.error?.message} />
          )}
        />

        {/* Email */}
        <Controller
          name="email"
          control={control}
          rules={{
            required: "البريد الإلكتروني مطلوب",
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "أدخل بريد إلكتروني صالح" },
          }}
          render={({ field, fieldState }) => (
            <TextField label="البريد الإلكتروني" {...field} fullWidth value={field.value ?? ""} error={!!fieldState.error} helperText={fieldState.error?.message} />
          )}
        />

        {/* Job Title */}
        <Controller
          name="jobTitle"
          control={control}
          rules={{ required: "المسمى الوظيفي مطلوب" }}
          render={({ field, fieldState }) => (
            <TextField select label="المسمى الوظيفي" {...field} fullWidth value={field.value ?? ""} error={!!fieldState.error} helperText={fieldState.error?.message}>
              {jobTitles.map((jt) => <MenuItem key={jt} value={jt}>{jt}</MenuItem>)}
            </TextField>
          )}
        />

        {/* Office */}
        <Controller
          name="officeLocation"
          control={control}
          rules={{ required: "يرجى اختيار المكتب" }}
          render={({ field, fieldState }) => (
            <TextField select label="مكتب العمل" {...field} fullWidth value={field.value ?? ""} error={!!fieldState.error} helperText={fieldState.error?.message}>
              {offices.map((o) => <MenuItem key={o.name} value={o.name}>{o.name} ({o.city})</MenuItem>)}
            </TextField>
          )}
        />

        {/* Education Level */}
        <Controller
          name="educationLevel"
          control={control}
          rules={{ required: "المستوى العلمي مطلوب" }}
          render={({ field, fieldState }) => (
            <TextField select label="المستوى العلمي" {...field} fullWidth value={field.value ?? ""} error={!!fieldState.error} helperText={fieldState.error?.message}>
              {educationLevels.map((ed) => <MenuItem key={ed} value={ed}>{ed}</MenuItem>)}
            </TextField>
          )}
        />

        {/* Permission Group */}
        <Controller
          name="permissionGroup"
          control={control}
          render={({ field }) => (
            <TextField select label="مجموعة الصلاحيات" {...field} fullWidth value={field.value ?? ""}>
              {permissionGroups.map((pg) => <MenuItem key={pg.id} value={pg.name}>{pg.name}</MenuItem>)}
            </TextField>
          )}
        />

        {/* Salary */}
        <Controller
          name="salary"
          control={control}
          rules={{ required: "الراتب مطلوب", min: { value: 0, message: "الراتب يجب أن يكون موجباً" } }}
          render={({ field, fieldState }) => (
            <TextField label="الراتب الشهري" type="number" {...field} fullWidth value={field.value ?? 0} error={!!fieldState.error} helperText={fieldState.error?.message} />
          )}
        />

        {/* Contract Type */}
        <Controller
          name="contractType"
          control={control}
          render={({ field }) => (
            <TextField select label="متفرغ / متعاقد" {...field} fullWidth value={field.value ?? ""}>
              {contractOptions.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
            </TextField>
          )}
        />

        {/* Insurance Status */}
        <Controller
          name="insuranceStatus"
          control={control}
          render={({ field }) => (
            <TextField select label="التأمين" {...field} fullWidth value={field.value ?? ""}>
              {insuranceOptions.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
            </TextField>
          )}
        />

        {/* Insurance Number */}
        <Controller
          name="insuranceNumber"
          control={control}
          render={({ field }) => <TextField label="رقم التأمين" {...field} fullWidth value={field.value ?? ""} />}
        />

        {/* Gender */}
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <TextField select label="الجنس" {...field} fullWidth value={field.value ?? ""}>
              {genderOptions.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
            </TextField>
          )}
        />

        {/* Family Status */}
        <Controller
          name="familyStatus"
          control={control}
          render={({ field }) => (
            <TextField select label="الوضع العائلي" {...field} fullWidth value={field.value ?? ""}>
              {familyStatusOptions.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
            </TextField>
          )}
        />

        {/* Children Count */}
        <Controller
          name="childrenCount"
          control={control}
          render={({ field }) => <TextField label="عدد الأولاد" type="number" {...field} fullWidth value={field.value ?? 0} />}
        />

        {/* Birth Date */}
        <Controller
          name="birthDate"
          control={control}
          render={({ field }) => <TextField label="تاريخ الولادة" type="date"  slotProps={{ inputLabel: { shrink: true } }} {...field} fullWidth value={field.value ?? ""} />}
        />

     {/* // Birth Place (select from cities) */}
<Controller
  name="birthPlace"
  control={control}
  render={({ field }) => (
    <TextField
      select
      label="مكان الولادة"
      {...field}
      fullWidth
      value={field.value ?? ""}
    >
      {cities.map((c) => (
        <MenuItem key={c.id} value={c.name}>
          {c.name}
        </MenuItem>
      ))}
    </TextField>
  )}
/>


        {/* Age */}
        <Controller
          name="age"
          control={control}
          render={({ field }) => <TextField label="العمر" type="number" {...field} fullWidth value={field.value ?? 0} />}
        />

     {/* Blood Type (hard-coded select) */}
<Controller
  name="bloodType"
  control={control}
  render={({ field }) => (
    <TextField
      select
      label="فصيلة الدم"
      {...field}
      fullWidth
      value={field.value ?? ""}
    >
      {bloodTypeOptions.map((bt) => (
        <MenuItem key={bt} value={bt}>
          {bt}
        </MenuItem>
      ))}
    </TextField>
  )}
/>
   {/* // Birth Place (select from cities) */}
<Controller
  name="address"
  control={control}
  render={({ field }) => (
    <TextField
      select
      label="مكان السكن"
      {...field}
      fullWidth
      value={field.value ?? ""}
    >
      {cities.map((c) => (
        <MenuItem key={c.id} value={c.name}>
          {c.name}
        </MenuItem>
      ))}
    </TextField>
  )}
/>
        {/* Detailed Address */}
        <Controller
          name="detailedAddress"
          control={control}
          render={({ field }) => <TextField label="عنوان السكن التفصيلي" {...field} fullWidth value={field.value ?? ""} />}
        />


        {/* Notes */}
        <Controller
          name="notes"
          control={control}
          render={({ field }) => <TextField label="ملاحظات" {...field} fullWidth multiline rows={3} value={field.value ?? ""} />}
        />

        {/* Submit Button */}
        <div className="col-span-1 md:col-span-4 flex justify-end mt-4">
          <Button type="submit" className="bg-green-700 hover:bg-green-600 text-white">إنشاء الموظف</Button>
        </div>

      </form>
    </div>
  );
}
