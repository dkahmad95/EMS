"use client";

import React from "react";
import DeleteModal from "@/app/Components/DeleteModal";

interface DeleteRevenueModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteRevenueModal: React.FC<DeleteRevenueModalProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  return (
    <DeleteModal
      open={open}
      setOpen={onClose}
      Title="حذف الإيراد"
      Body="هل أنت متأكد أنك تريد حذف هذا الإيراد؟"
      handleClick={onConfirm}
    />
  );
};

export default DeleteRevenueModal;
