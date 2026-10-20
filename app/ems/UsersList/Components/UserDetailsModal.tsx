"use client";

import React, { useEffect } from "react";
import { TextField } from "@mui/material";
import FormModal from "@/app/Components/FormModal";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "@/server/services/api/users/users";

interface UserDetailsModalProps {
  open: boolean;
  onClose: () => void;
  userId: number | null;
  users: User[];
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  open,
  onClose,
  userId,
  users,
}) => {
  const user = users.find((u) => u.id === userId);
  const queryClient = useQueryClient();
  const { control, handleSubmit, reset } = useForm<UpdateUserRequest>({
    defaultValues: {
      username: "",
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserRequest }) =>
      updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onClose();
    },
  });

  useEffect(() => {
    if (user && open) {
      reset({
        username: user.username,
      });
    }
  }, [user, open, reset]);

  const onSubmit = (data: UpdateUserRequest) => {
    if (user?.id) {
      updateMutation.mutate({ id: user.id, data });
    }
  };

  if (!user) return null;

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title="تفاصيل المستخدم"
      size="md"
      onConfirm={() => handleSubmit(onSubmit)()}
      isLoading={updateMutation.isPending}
      confirmLabel="تحديث"
    >
      <TextField
        label="رقم المستخدم"
        value={user.id}
        fullWidth
        disabled
      />

      {/* Username */}
      <Controller
        name="username"
        control={control}
        rules={{ required: "اسم المستخدم مطلوب" }}
        render={({ field, fieldState: { error } }) => (
          <TextField
            label="اسم المستخدم"
            {...field}
            fullWidth
            error={!!error}
            helperText={error?.message}
          />
        )}
      />

      {user.created_at && (
        <TextField
          label="تاريخ الإنشاء"
          value={new Date(user.created_at).toLocaleDateString("ar-EG")}
          fullWidth
          disabled
        />
      )}

      {user.updated_at && (
        <TextField
          label="تاريخ آخر تحديث"
          value={new Date(user.updated_at).toLocaleDateString("ar-EG")}
          fullWidth
          disabled
        />
      )}
    </FormModal>
  );
};

export default UserDetailsModal;
