"use client";

import {useEffect, useState} from "react";
import {useForm, Controller} from "react-hook-form";
import {useRouter} from "next/navigation";
import {TextField, MenuItem, Checkbox, FormGroup, FormControlLabel, Button as MUIButton, Box} from "@mui/material";
import {Button} from "@/app/Components/Button";

type UserFormInputs = {
  name: string;
  phoneNumber: string;

  office: string;
  role: string;

  password: string;
  confirmPassword: string;
};

export default function CreateUserForm() {
  const router = useRouter();

  const [offices, setOffices] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);

  useEffect(() => {
    const savedOffices = JSON.parse(localStorage.getItem("offices") || "[]");
    const savedPermissionGroups = JSON.parse(localStorage.getItem("permissionGroups") || "[]");

    setOffices(savedOffices.map((c: any) => ({value: c.name, label: c.name})));
    setRoles(savedPermissionGroups.map((g: any) => ({value: g.name, label: g.name})));
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: {errors},
    control,
    reset,
  } = useForm<UserFormInputs>({
    defaultValues: {
      name: "",
      phoneNumber: "",

      office: "",
      role: "",

      password: "",
      confirmPassword: "",
    },
  });

  const watchedPassword = watch("password");

  const onSubmit = (data: UserFormInputs) => {
    const {confirmPassword, ...payload} = data;
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

    const newUser = {id: Date.now(), ...payload};
    localStorage.setItem("users", JSON.stringify([...existingUsers, newUser]));

    alert("تم إنشاء المستخدم بنجاح ✔");
    reset();
    router.push("/ems/UsersList");
  };

  return (
    <Box dir="rtl" sx={{fontFamily: "Tajawal", textAlign: "right", maxWidth: 600, mx: "auto", p: 3}}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* اسم المستخدم */}
        <TextField
          fullWidth
          label="اسم المستخدم"
          variant="outlined"
          margin="normal"
          {...register("name", {required: "الاسم مطلوب"})}
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
            pattern: {value: /^[0-9]{8,15}$/, message: "أدخل رقم هاتف صالح"},
          })}
          error={!!errors.phoneNumber}
          helperText={errors.phoneNumber?.message}
        />

        {/* المكتب */}
        <Controller
          name="office"
          control={control}
          rules={{required: "يرجى اختيار المكتب"}}
          render={({field}) => (
            <TextField
              select
              fullWidth
              label="المكتب"
              margin="normal"
              value={field.value}
              onChange={field.onChange}
              error={!!errors.office}
              helperText={errors.office?.message}>
              {offices.map((office) => (
                <MenuItem key={office.value} value={office.value}>
                  {office.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        {/* الدور */}
        <Controller
          name="role"
          control={control}
          rules={{required: "يرجى اختيار الدور"}}
          render={({field}) => (
            <TextField
              select
              fullWidth
              label="الدور"
              margin="normal"
              value={field.value}
              onChange={field.onChange}
              error={!!errors.role}
              helperText={errors.role?.message}>
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
          type="text"
          label="كلمة المرور"
          margin="normal"
          {...register("password", {
            required: "كلمة المرور مطلوبة",
            minLength: {value: 8, message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل"},
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
        />

        {/* تأكيد كلمة المرور */}
        <TextField
          fullWidth
          type="text"
          label="تأكيد كلمة المرور"
          margin="normal"
          {...register("confirmPassword", {
            required: "يرجى تأكيد كلمة المرور",
            validate: (v) => v === watchedPassword || "كلمتا المرور غير متطابقتين",
          })}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
        />

        {/* الأزرار */}
        <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
          <MUIButton variant="outlined" color="inherit" onClick={() => router.push("/ems/UsersList")}>
            إلغاء
          </MUIButton>

          <Button type="submit">إنشاء المستخدم</Button>
        </Box>
      </form>
    </Box>
  );
}
