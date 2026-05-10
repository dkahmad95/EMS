import * as React from "react";
import Modal from "@mui/material/Modal";
import { Button } from "./Button";

interface ModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleClick: any;
  Title?: string;
  Body?: string;
  id?: string;
}

<<<<<<< HEAD
=======
const style = {
 
  width: 400,
  maxWidth: "90%",
  bgcolor: "white",
  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  p: 4,
  borderRadius: "16px",
  textAlign: "center",
  border: "1px solid #e2e8f0",
};

>>>>>>> 118aed278bc0a08f6ab9eba9ee6940dd91e7eb9f
const DeleteModal: React.FC<ModalProps> = ({
  open,
  setOpen,
  handleClick,
  Title,
  Body,
}) => {
  return (
<<<<<<< HEAD
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-description"
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                   w-[90%] max-w-sm bg-white rounded-2xl shadow-modal
                   border border-gray-200 p-6 text-center animate-scale-in"
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
=======
    <div>
     <Modal
  open={open}
  onClose={() => setOpen(false)}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
  sx={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
>
  <Box
    sx={{
      width: 400,
      maxWidth: "90%",
      bgcolor: "white",
      boxShadow: "0 20px 25px rgba(0,0,0,0.1)",
      p: 4,
      borderRadius: "16px",
      textAlign: "center",
      border: "1px solid #e2e8f0",
    }}
    className="animate-scale-in"
  >
>>>>>>> 118aed278bc0a08f6ab9eba9ee6940dd91e7eb9f

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
            نعم، احذف
          </Button>
          <Button variant="outline" onClick={() => setOpen(false)}>
            إلغاء
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;
