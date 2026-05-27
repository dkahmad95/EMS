"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "./Button";
import Loader from "./Loader";

interface FormModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;
  confirmLabel?: string;
  size?: "md" | "lg" | "sm";
  children: React.ReactNode;
}

const FormModal: React.FC<FormModalProps> = ({
  open,
  onClose,
  title,
  onConfirm,
  isLoading = false,
  confirmLabel = "حفظ",
  size = "md",
  children,
}) => {
  const maxWidth = size === "lg" ? "md" : "sm";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={maxWidth}
      aria-labelledby="form-modal-title"
      slotProps={{
        paper: {
          className:
            "rounded-2xl shadow-modal border border-gray-200 max-h-[88vh] animate-scale-in",
          style: { margin: "1rem", borderRadius: "1rem" },
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        component="div"
        className="flex items-center justify-between px-5 py-4 border-b border-gray-100"
        sx={{
          padding: 0,
          font: "inherit",        // resets font-size, font-weight, font-family in one go
          letterSpacing: "inherit",
        }}
      >
        <div className="flex items-center justify-between px-5 py-4 w-full">
          <h2
            id="form-modal-title"
            className="text-base font-semibold text-gray-900"
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      </DialogTitle>

      {/* Body */}
      <DialogContent
        dividers={false}
        className="px-5 py-5"
        sx={{ padding: 0, overflowY: "auto" }}
      >
        <div className="px-5 py-5">
          <div className="space-y-4">{children}</div>
        </div>
      </DialogContent>

      {/* Footer */}
      <DialogActions
        className="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-100 bg-gray-50/60 rounded-b-2xl"
        sx={{ padding: 0 }}
      >
        <div className="flex items-center justify-end gap-3 px-5 py-4 w-full">
          <Button variant="outline" onClick={onClose} disabled={isLoading}
            className="bg-red-600  text-white hover:bg-red-800 border-red-500 hover:border-red-600 focus-visible:ring-red-500">
            إلغاء
          </Button>
          <Button variant="primary" onClick={onConfirm} disabled={isLoading}>
            {isLoading && <Loader borderColor="white" />}
            {confirmLabel}
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default FormModal;