"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  SelectChangeEvent,
  Snackbar,
  Alert,
} from "@mui/material";
import { Button } from "@/app/Components/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePermissions } from "@/app/hooks/usePermissions";
import { usePermissionGroups } from "@/server/store/permissionGroups";
import { useOfficeUsersById } from "@/server/store/officeUsers";
import { updatePermissionGroup } from "@/server/services/api/users/users";

interface AttachPermissionGroupModalProps {
  open: boolean;
  onClose: () => void;
  userId: number;
  username: string;
  currentPermissionGroupId: number | null;
}

const AttachPermissionGroupModal: React.FC<AttachPermissionGroupModalProps> = ({
  open,
  onClose,
  userId,
  username,
  currentPermissionGroupId,
}) => {
  const queryClient = useQueryClient();

  const [selectedPermissionGroupId, setSelectedPermissionGroupId] = useState<number | "">("");
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error"; }>({
    open: false,
    message: "",
    severity: "success",
  });

  const { data: permissionGroups } = usePermissionGroups();

  const assignMutation = useMutation({
    mutationFn: () => updatePermissionGroup(userId, selectedPermissionGroupId as number),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["officeUserById", userId] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setSnackbar({
        open: true,
        message: `تم تحديث مجموعة الصلاحيات - ${username} بنجاح`,
        severity: "success",
      });
      setTimeout(() => {
        onClose();
      }, 500);
    },
    onError: (error: Error) => {
      setSnackbar({
        open: true,
        message: `حدث خطأ أثناء تحديث مجموعة الصلاحيات - ${username}. يرجى المحاولة مرة أخرى`,
        severity: "error",
      });
    },
  });

  useEffect(() => {
    if (open) {
      setSelectedPermissionGroupId(currentPermissionGroupId ?? "");
    } else {
      setSelectedPermissionGroupId("");
      setSnackbar({ ...snackbar, open: false });
    }
  }, [open]);

  const handlePermissionGroupChange = (event: SelectChangeEvent<number | "">) => {
    setSelectedPermissionGroupId(event.target.value as number | "");
  };

  const isFormValid = selectedPermissionGroupId !== "";

  const handleSubmit = () => {
    if (!isFormValid) return;
    console.log(userId, selectedPermissionGroupId);
    assignMutation.mutate();
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" dir="rtl">
      <DialogTitle className="font-bold text-lg">
        تحديث مجموعة الصلاحيات - {username}
      </DialogTitle>
      <DialogContent>
        <div className="space-y-4 mt-2">
          <FormControl fullWidth>
            <InputLabel id="permission-group-label">مجموعة الصلاحيات</InputLabel>
            <Select
              labelId="permission-group-label"
              value={selectedPermissionGroupId}
              onChange={handlePermissionGroupChange}
              label="مجموعة الصلاحيات"
            >
              {(permissionGroups || []).map((group) => (
                <MenuItem key={group.id} value={group.id}>
                  {group.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </DialogContent>
      <DialogActions className="flex justify-end gap-3 p-4">
        <Button
          onClick={onClose}
          className="bg-gray-400 text-white"
          disabled={assignMutation.isPending}
        >
          إلغاء
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={assignMutation.isPending || !isFormValid}
        >
          {assignMutation.isPending ? "جاري الحفظ..." : "حفظ"}
        </Button>
      </DialogActions>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default AttachPermissionGroupModal;
