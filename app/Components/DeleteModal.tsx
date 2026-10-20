"use client";

import * as React from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { DialogShell } from "./FormModal";
import { Button } from "./Button";

interface ModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleClick: any;
  Title?: string;
  Body?: string;
  id?: string;
}

const DeleteModal: React.FC<ModalProps> = ({ open, setOpen, handleClick, Title, Body }) => {
  const [loading, setLoading] = React.useState(false);
  const close = () => setOpen(false);

  const confirm = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await handleClick();
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogShell
      open={open}
      onClose={close}
      title={Title || "تأكيد الحذف"}
      size="sm"
      isLoading={loading}
      footer={
        <>
          <Button variant="muted" onClick={close} disabled={loading}>
            إلغاء
          </Button>
          <Button variant="danger" onClick={confirm} loading={loading}>
            نعم، أنا متأكد
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-danger-50 text-danger-600">
          <ExclamationTriangleIcon className="h-6 w-6" aria-hidden="true" />
        </span>
        <p className="pt-3 text-sm text-gray-600">
          {Body || "هل أنت متأكد من أنك تريد حذف هذا العنصر؟"}
        </p>
      </div>
    </DialogShell>
  );
};

export default DeleteModal;
