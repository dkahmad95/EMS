"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
} from "@mui/material";
import { Button } from "@/app/Components/Button";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "@/server/services/api/users/users";

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
}

type UserFormInputs = {
  username: string;
  password: string;
  confirmPassword: string;
};

const CreateUserModal: React.FC<CreateUserModalProps> = ({ open, onClose }) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<UserFormInputs>({
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const watchedPassword = watch("password");

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      alert("تم إنشاء المستخدم بنجاح ✔");
      reset();
      onClose();
    },
    onError: (error: any) => {
      alert(
        `حدث خطأ أثناء إنشاء المستخدم: ${error.response?.data?.message || error.message}`
      );
    },
  });

  const onSubmit = (data: UserFormInputs) => {
    const { confirmPassword, ...payload } = data;
    createMutation.mutate(payload);
  };

  const handleClose = () => {
    if (!createMutation.isPending) {
      reset();
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" dir="rtl">
      <DialogTitle className="font-bold text-lg">إنشاء مستخدم جديد</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
          {/* اسم المستخدم */}
          <TextField
            fullWidth
            label="اسم المستخدم"
            variant="outlined"
            margin="normal"
            {...register("username", {
              required: "اسم المستخدم مطلوب",
              minLength: {
                value: 3,
                message: "اسم المستخدم يجب أن يكون 3 أحرف على الأقل",
              },
            })}
            error={!!errors.username}
            helperText={errors.username?.message}
            disabled={createMutation.isPending}
          />

          {/* كلمة المرور */}
          <TextField
            fullWidth
            type="password"
            label="كلمة المرور"
            margin="normal"
            {...register("password", {
              required: "كلمة المرور مطلوبة",
              minLength: {
                value: 8,
                message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل",
              },
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
            disabled={createMutation.isPending}
          />

          {/* تأكيد كلمة المرور */}
          <TextField
            fullWidth
            type="password"
            label="تأكيد كلمة المرور"
            margin="normal"
            {...register("confirmPassword", {
              required: "يرجى تأكيد كلمة المرور",
              validate: (v) => v === watchedPassword || "كلمتا المرور غير متطابقتين",
            })}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            disabled={createMutation.isPending}
          />
        </Box>
      </DialogContent>
      <DialogActions className="flex justify-end gap-3 p-4">
        <Button
          onClick={handleClose}
          className="bg-gray-400 text-white"
          disabled={createMutation.isPending}
        >
          إلغاء
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? "جاري الإنشاء..." : "إنشاء المستخدم"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateUserModal;