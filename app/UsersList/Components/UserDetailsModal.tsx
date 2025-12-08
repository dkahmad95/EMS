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
  phoneNumber: string;
  
  office: string;
 
  permissionGroup?: string;
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

  const [offices, setOffices] = useState<string[]>([]);
  const [permissionGroups, setPermissionGroups] = useState<string[]>([]);

  // Load offices and permission groups from localStorage
  useEffect(() => {
    const storedOffices = JSON.parse(localStorage.getItem("offices") || "[]");
    setOffices(storedOffices.map((c: any) => c.name || c)); // support array of strings or objects

    const storedGroups = JSON.parse(localStorage.getItem("permissionGroups") || "[]");
    setPermissionGroups(storedGroups.map((g: any) => g.name));
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
      <DialogContent >
        <div className="grid grid-cols-1 gap-4 mt-2">
        {/* Name */}
        <Controller
          name="name"
          control={control}
          render={({ field }) => <TextField label="الاسم" {...field} fullWidth />}
        />
        
        {/* Phone Number */}
        <Controller
          name="phoneNumber"
          control={control}
          render={({ field }) => <TextField label="رقم الهاتف" {...field} fullWidth />}
        />

      

        {/* Office */}
        <Controller
          name="office"
          control={control}
          render={({ field }) => (
            <TextField select label="المكتب" {...field} fullWidth>
              {offices.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

      

        {/* Permission Group */}
        <Controller
          name="permissionGroup"
          control={control}
          render={({ field }) => (
            <TextField select label="مجموعة الصلاحيات" {...field} fullWidth>
              {permissionGroups.map((g) => (
                <MenuItem key={g} value={g}>
                  {g}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        {/* Join Date */}
        <Controller
          name="joinDate"
          control={control}
          render={({ field }) => (
            <TextField
              label="تاريخ الانضمام"
              type="date"
              {...field}
              fullWidth
               slotProps={{
            inputLabel: {
              shrink: true,   // the new recommended API
            },
          }}
            />
          )}
        />
        </div>
      </DialogContent>
      <DialogActions className="flex justify-end gap-3 p-4">
        <Button onClick={onClose} className="bg-gray-400 text-white">
          إلغاء
        </Button>
        <Button onClick={handleSubmit(onSubmit)}>تحديث</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserDetailsModal;
