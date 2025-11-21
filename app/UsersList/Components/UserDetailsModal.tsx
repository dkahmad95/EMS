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
import { Button } from "@/app/Components/Button";
import { useForm, Controller } from "react-hook-form";

interface User {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  city: string;
  joinDate?: string;
}

interface UserDetailsModalProps {
  open: boolean;
  onClose: () => void;
  user?: User | null;
  onUpdate: (data: User) => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  open,
  onClose,
  user,
  onUpdate,
}) => {
  const { control, handleSubmit, reset } = useForm<User>({
    defaultValues: user || {},
  });

  const [cities, setCities] = useState<string[]>([]);

  // Load cities from localStorage
  useEffect(() => {
    const storedCities = JSON.parse(localStorage.getItem("cities") || "[]");
    setCities(storedCities.map((c: any) => c.name || c)); // support array of strings or objects
  }, []);

  useEffect(() => {
    if (user) reset(user);
  }, [user, reset]);

  const onSubmit = (data: User) => {
    onUpdate(data);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" dir="rtl">
      <DialogTitle className="font-bold text-lg">تفاصيل المستخدم</DialogTitle>
      <div className="mt-2 ">
      <DialogContent className="grid grid-cols-1 gap-4 ">
        <Controller
          name="name"
          control={control}
          render={({ field }) => <TextField label="الاسم" {...field} fullWidth />}
        />
        <Controller
          name="email"
          control={control}
          render={({ field }) => <TextField label="البريد الإلكتروني" {...field} fullWidth />}
        />
        <Controller
          name="phoneNumber"
          control={control}
          render={({ field }) => <TextField label="رقم الهاتف" {...field} fullWidth />}
        />
        <Controller
          name="city"
          control={control}
          render={({ field }) => (
            <TextField select label="المدينة" {...field} fullWidth>
              {cities.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      </DialogContent>
      </div>
      <DialogActions className="flex justify-end gap-3 p-4">
        <Button onClick={onClose} className="bg-gray-400 text-white">
          إلغاء
        </Button>
        <Button onClick={handleSubmit(onSubmit)} >
          تحديث
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserDetailsModal;
