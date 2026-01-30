import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
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

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  maxWidth: "90%",
  bgcolor: "white",
  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  p: 4,
  borderRadius: "16px",
  textAlign: "center",
  border: "1px solid #e2e8f0",
};

const DeleteModal: React.FC<ModalProps> = ({
  open,
  setOpen,
  handleClick,
  Title,
  Body,
}) => {
  return (
    <div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="animate-scale-in ">
          {/* Icon */}
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-danger-100 mb-4 ">
            <svg
              className="h-6 w-6 text-danger-600"
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

          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            className="text-slate-900 font-semibold mb-2"
          >
            {Title || "تأكيد الحذف"}
          </Typography>
          <Typography
            id="modal-modal-description"
            sx={{ mt: 2 }}
            className="text-slate-600 mb-6"
          >
            {Body || "هل أنت متأكد من أنك تريد حذف هذا العنصر؟"}
          </Typography>
          <div className="flex justify-center items-center gap-3 mt-3">
            <Button
              variant="danger"
              onClick={async (e) => {
                e.preventDefault();
                await handleClick();
                setOpen(false);
              }}
            >
              نعم
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false);
              }}
            >
              إلغاء
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default DeleteModal;
