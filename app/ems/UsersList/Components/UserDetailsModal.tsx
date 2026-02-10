"use client";

import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { Button } from "@/app/Components/Button";
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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" dir="rtl">
      <DialogTitle className="font-bold text-lg">تفاصيل المستخدم</DialogTitle>
      <DialogContent>
        <div className="grid grid-cols-1 gap-4 mt-2">
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

        </div>
      </DialogContent>
      <DialogActions className="flex justify-end gap-3 p-4">
        <Button
          onClick={onClose}
          className="bg-gray-400 text-white"
          disabled={updateMutation.isPending}
        >
          إلغاء
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? "جاري التحديث..." : "تحديث"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserDetailsModal;