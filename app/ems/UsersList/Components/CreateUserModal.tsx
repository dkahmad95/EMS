"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Autocomplete,
} from "@mui/material";
import { Button } from "@/app/Components/Button";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "@/server/services/api/users/users";
import { useOffices } from "@/server/store/offices";
import { usePermissionGroups } from "@/server/store/permissionGroups";

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
}

type UserFormInputs = {
  name: string;
  username: string;
  officeId: number;
  permissionGroupId: number;
  password: string;
  confirmPassword: string;
};

const CreateUserModal: React.FC<CreateUserModalProps> = ({
  open,
  onClose,
}) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<UserFormInputs>({
    defaultValues: {
      name: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Register non-native fields
  React.useEffect(() => {
    register("officeId", {
      required: "المكتب مطلوب",
    });

    register("permissionGroupId", {
      required: "مجموعة الصلاحيات مطلوبة",
    });
  }, [register]);

  const { data: officesList } = useOffices();
  const { data: permissionGroupsList } = usePermissionGroups();

  const watchedPassword = watch("password");

  const createMutation = useMutation({
    mutationFn: createUser,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });

      alert("تم إنشاء المستخدم بنجاح");

      reset();

      onClose();
    },

    onError: (error: any) => {
      alert(
        `حدث خطأ أثناء إنشاء المستخدم: ${
          error.response?.data?.message || error.message
        }`
      );
    },
  });

  const onSubmit = (data: UserFormInputs) => {
    const { confirmPassword, ...payload } = data;

    console.log(payload);

    createMutation.mutate(payload);
  };

  const handleClose = () => {
    if (!createMutation.isPending) {
      reset();
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      dir="rtl"
    >
      <DialogTitle className="font-bold text-lg">
        إنشاء مستخدم جديد
      </DialogTitle>

      <DialogContent>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 2 }}
        >
          <TextField
            fullWidth
            label="الاسم"
            variant="outlined"
            margin="normal"
            {...register("name", {
              required: "الاسم مطلوب",

              minLength: {
                value: 3,
                message: "الاسم يجب أن يكون 3 أحرف على الأقل",
              },
            })}
            error={!!errors.name}
            helperText={errors.name?.message}
            disabled={createMutation.isPending}
          />

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

            <Autocomplete
            options={officesList ?? []}
            getOptionLabel={(option) => option.name}
            onChange={(_, val) => {
              setValue("officeId", val?.id as number, {
                shouldValidate: true,
              });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="المكتب"
                margin="normal"
                error={!!errors.officeId}
                helperText={errors.officeId?.message}
                disabled={createMutation.isPending}
              />
            )}
          />

            <Autocomplete
            options={permissionGroupsList ?? []}
            getOptionLabel={(option) => option.name}
            onChange={(_, val) => {
              setValue("permissionGroupId", val?.id as number, {
                shouldValidate: true,
              });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="مجموعة الصلاحيات"
                margin="normal"
                error={!!errors.permissionGroupId}
                helperText={errors.permissionGroupId?.message}
                disabled={createMutation.isPending}
              />
            )}
          />

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

            <TextField
            fullWidth
            type="password"
            label="تأكيد كلمة المرور"
            margin="normal"
            {...register("confirmPassword", {
              required: "يرجى تأكيد كلمة المرور",

              validate: (v) =>
                v === watchedPassword ||
                "كلمتا المرور غير متطابقتين",
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
          {createMutation.isPending
            ? "جاري الإنشاء..."
            : "إنشاء المستخدم"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateUserModal;