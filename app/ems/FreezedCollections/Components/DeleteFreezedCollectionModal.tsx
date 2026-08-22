"use client";

import React from "react";
import DeleteModal from "@/app/Components/DeleteModal";

interface DeleteFreezedCollectionModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteFreezedCollectionModal: React.FC<DeleteFreezedCollectionModalProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  return (
    <DeleteModal
      open={open}
      setOpen={onClose}
      Title="حذف تجميد/سحب"
      Body="هل أنت متأكد أنك تريد حذف هذا السجل؟"
      handleClick={onConfirm}
    />
  );
};

export default DeleteFreezedCollectionModal;
