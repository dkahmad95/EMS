import * as React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { Button } from "./Button";

interface ModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleClick: any;
  Title?: string;
  Body?: string;
  id?: string;
}

const DeleteModal: React.FC<ModalProps> = ({
  open,
  setOpen,
  handleClick,
  Title,
  Body,
}) => {
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-description"
    >
      <Box
        className="
          flex items-center justify-center
          min-h-screen
          p-4
        "
      >
        <div
          className="
            w-full max-w-sm
            bg-white
            rounded-2xl
            shadow-xl
            border border-gray-200
            p-6
            text-center
            animate-scale-in
          "
        >
          {/* Danger icon */}
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
            <svg
              className="h-6 w-6 text-rose-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>

          <h2
            id="delete-modal-title"
            className="text-lg font-semibold text-gray-900 mb-2"
          >
            {Title || "تأكيد الحذف"}
          </h2>

          <p
            id="delete-modal-description"
            className="text-sm text-gray-500 mb-6"
          >
            {Body || "هل أنت متأكد من أنك تريد حذف هذا العنصر؟"}
          </p>

          <div className="flex items-center justify-center gap-3">
            <Button
              variant="danger"
              onClick={async (e) => {
                e.preventDefault();
                await handleClick();
                setOpen(false);
              }}
            >
              نعم، أنا متأكد
            </Button>

            <Button
              variant="outline"
              onClick={() => setOpen(false)}
            >
              إلغاء
            </Button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default DeleteModal;