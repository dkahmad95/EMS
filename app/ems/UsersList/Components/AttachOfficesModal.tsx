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
import {
  bulkAssignOffices,
} from "@/server/services/api/officeUsers/officeUsers";
import { usePermissions } from "@/app/hooks/usePermissions";
import { useOffices } from "@/server/store/offices";
import { usePermissionGroups } from "@/server/store/permissionGroups";
import { useOfficeUsersById } from "@/server/store/officeUsers";

interface AttachOfficesModalProps {
  open: boolean;
  onClose: () => void;
  userId: number;
  username: string;
}

const AttachOfficesModal: React.FC<AttachOfficesModalProps> = ({
  open,
  onClose,
  userId,
  username,
}) => {
  const queryClient = useQueryClient();
  const [selectedOfficeIds, setSelectedOfficeIds] = useState<number[]>([]);
  const [selectedPermissionGroupId, setSelectedPermissionGroupId] = useState<number | "">("");
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error"; }>({
    open: false,
    message: "",
    severity: "success",
  });

  const { data: allOffices } = useOffices();
  const { data: permissionGroups } = usePermissionGroups();
  const { data: currentAssignments, isLoading: loadingAssignments } = useOfficeUsersById(userId, { enabled: open && !!userId });

  const assignMutation = useMutation({
    mutationFn: bulkAssignOffices,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["officeUserById", userId] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setSelectedOfficeIds([]);
      setSelectedPermissionGroupId("");
      setSnackbar({
        open: true,
        message: "تم ربط المكاتب بنجاح ✔",
        severity: "success",
      });
      setTimeout(() => {
        onClose();
      }, 500);
    },
    onError: (error: Error) => {
      console.error("Failed to assign offices:", error);
      setSnackbar({
        open: true,
        message: "حدث خطأ أثناء ربط المكاتب. يرجى المحاولة مرة أخرى",
        severity: "error",
      });
    },
  });

  useEffect(() => {
    if (!open) {
      setSelectedOfficeIds([]);
      setSelectedPermissionGroupId("");
      setSnackbar({ ...snackbar, open: false });
    }
  }, [open]);

  useEffect(() => {
    if (open && currentAssignments) {
      setSelectedOfficeIds(currentAssignments.offices_Ids);
      setSelectedPermissionGroupId(currentAssignments.permission_group_id);
    }
  }, [open, currentAssignments]);

  const handleOfficeChange = (event: SelectChangeEvent<number[]>) => {
    const value = event.target.value;
    setSelectedOfficeIds(typeof value === "string" ? [] : value);
  };

  const handlePermissionGroupChange = (event: SelectChangeEvent<number | "">) => {
    setSelectedPermissionGroupId(event.target.value as number | "");
  };

  const isFormValid = selectedOfficeIds.length > 0 && selectedPermissionGroupId !== "";

  const handleSubmit = () => {
    if (!isFormValid) return;

    const data: AssignOfficesRequest = {
      user_id: userId,
      office_ids: selectedOfficeIds,
      permission_group_id: selectedPermissionGroupId as number,
    };

    assignMutation.mutate(data);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" dir="rtl">
      <DialogTitle className="font-bold text-lg">
        ربط المكاتب - {username}
      </DialogTitle>
      <DialogContent>
        {loadingAssignments ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
          </div>
        ) : (
          <div className="space-y-4 mt-2">
            <FormControl fullWidth>
              <InputLabel id="offices-label">المكاتب</InputLabel>
              <Select
                labelId="offices-label"
                multiple
                value={selectedOfficeIds}
                onChange={handleOfficeChange}
                input={<OutlinedInput label="المكاتب" />}
                renderValue={(selected) => {
                  const selectedNames = allOffices
                    ?.filter((office) => selected.includes(office.id!))
                    .map((office) => office.name);
                  return selectedNames?.join(", ");
                }}
              >
                {allOffices?.map((office) => (
                  <MenuItem key={office.id} value={office.id}>
                    <Checkbox checked={selectedOfficeIds.includes(office.id!)} />
                    <ListItemText primary={office.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

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
        )}
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

export default AttachOfficesModal;
