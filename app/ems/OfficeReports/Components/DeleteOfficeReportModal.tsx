"use client";

import React from "react";
import DeleteModal from "@/app/Components/DeleteModal";

interface DeleteOfficeReportModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteOfficeReportModal: React.FC<DeleteOfficeReportModalProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  return (
    <DeleteModal
      open={open}
      setOpen={onClose}
      Title="حذف التقرير"
      Body="هل أنت متأكد أنك تريد حذف هذا التقرير؟"
      handleClick={onConfirm}
    />
  );
};

export default DeleteOfficeReportModal;
