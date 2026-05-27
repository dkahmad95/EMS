"use client";

import React from "react";
import DeleteModal from "@/app/Components/DeleteModal";

interface DeleteCollectionModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteCollectionModal: React.FC<DeleteCollectionModalProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  return (
    <DeleteModal
      open={open}
      setOpen={onClose}
      Title="حذف التحصيل"
      Body="هل أنت متأكد أنك تريد حذف هذا التحصيل؟"
      handleClick={onConfirm}
    />
  );
};

export default DeleteCollectionModal;
