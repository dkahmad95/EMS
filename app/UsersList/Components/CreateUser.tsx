"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  TextField,
  MenuItem,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Button as MUIButton,
  Box
} from "@mui/material";
import { Button } from "@/app/Components/Button";

type UserFormInputs = {
  name: string;
  phoneNumber: string;
  email?: string;
  city: string;
  role: string;
  permissions: string[];
  password: string;
  confirmPassword: string;
};

export default function CreateUserForm() {
  const router = useRouter();

  const [cities, setCities] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [permissionsList, setPermissionsList] = useState<any[]>([]);

 

  useEffect(() => {
    const savedCities = JSON.parse(localStorage.getItem("cities") || "[]");
    const savedPermissionGroups = JSON.parse(localStorage.getItem("permissionGroups") || "[]");
    const savedPermissions = JSON.parse(localStorage.getItem("permissions") || "[]");

    setCities(savedCities.map((c: any) => ({ value: c.name, label: c.name })));
    setRoles(savedPermissionGroups.map((g: any) => ({ value: g.name, label: g.name })));
    setPermissionsList(savedPermissions.map((p: string) => ({ value: p, label: p })));
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
    reset,
  } = useForm<UserFormInputs>({
    defaultValues: {
      name: "",
      phoneNumber: "",
      email: "",
      city: "",
      role: "",
      permissions: [],
      password: "",
      confirmPassword: "",
    },
  });

  const watchedPassword = watch("password");

  const onSubmit = (data: UserFormInputs) => {
    const { confirmPassword, ...payload } = data;
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

    const newUser = { id: Date.now(), ...payload };
    localStorage.setItem("users", JSON.stringify([...existingUsers, newUser]));

    alert("تم إنشاء المستخدم بنجاح ✔");
    reset();
    router.push("/UsersList");
  };

  return (
    <Box dir="rtl" sx={{ fontFamily: "Tajawal", textAlign: "right", maxWidth: 600, mx: "auto", p: 3 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* اسم المستخدم */}
        <TextField
          fullWidth
          label="اسم المستخدم"
          variant="outlined"
          margin="normal"
          {...register("name", { required: "الاسم مطلوب" })}
          error={!!errors.name}
          helperText={errors.name?.message}
        />

        {/* رقم الهاتف */}
        <TextField
          fullWidth
          label="رقم الهاتف"
          variant="outlined"
          margin="normal"
          {...register("phoneNumber", {
            required: "رقم الهاتف مطلوب",
            pattern: { value: /^[0-9]{8,15}$/, message: "أدخل رقم هاتف صالح" },
          })}
          error={!!errors.phoneNumber}
          helperText={errors.phoneNumber?.message}
        />

        {/* البريد الإلكتروني */}
        <TextField
          fullWidth
          label="البريد الإلكتروني"
          variant="outlined"
          margin="normal"
          {...register("email", {
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "أدخل بريد إلكتروني صالح" },
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        {/* المدينة */}
        <Controller
          name="city"
          control={control}
          rules={{ required: "يرجى اختيار المدينة" }}
          render={({ field }) => (
            <TextField
              select
              fullWidth
              label="المدينة"
              margin="normal"
              value={field.value}
              onChange={field.onChange}
              error={!!errors.city}
              helperText={errors.city?.message}
            >
              {cities.map((city) => (
                <MenuItem key={city.value} value={city.value}>
                  {city.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        {/* الدور */}
        <Controller
          name="role"
          control={control}
          rules={{ required: "يرجى اختيار الدور" }}
          render={({ field }) => (
            <TextField
              select
              fullWidth
              label="الدور"
              margin="normal"
              value={field.value}
              onChange={field.onChange}
              error={!!errors.role}
              helperText={errors.role?.message}
            >
              {roles.map((role) => (
                <MenuItem key={role.value} value={role.value}>
                  {role.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        {/* كلمة المرور */}
        <TextField
          fullWidth
          type= "text" 
          label="كلمة المرور"
          margin="normal"
          {...register("password", {
            required: "كلمة المرور مطلوبة",
            minLength: { value: 8, message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" },
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
         
        />

        {/* تأكيد كلمة المرور */}
        <TextField
          fullWidth
          type= "text" 
          label="تأكيد كلمة المرور"
          margin="normal"
          {...register("confirmPassword", {
            required: "يرجى تأكيد كلمة المرور",
            validate: (v) => v === watchedPassword || "كلمتا المرور غير متطابقتين",
          })}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          
        />

        {/* الصلاحيات */}
        <Box mt={2}>
          <label className="text-sm font-medium text-gray-700 mb-2 block">الصلاحيات الإضافية</label>
          <FormGroup row>
            {permissionsList.map((perm) => (
              <FormControlLabel
                key={perm.value}
                control={<Checkbox {...register("permissions")} value={perm.value} />}
                label={perm.label}
              />
            ))}
          </FormGroup>
        </Box>

        {/* الأزرار */}
        <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
          <MUIButton variant="outlined" color="inherit" onClick={() => router.push("/UsersList")}>
            إلغاء
          </MUIButton>

          <Button type="submit">إنشاء المستخدم</Button>
        </Box>
      </form>
    </Box>
  );
}
