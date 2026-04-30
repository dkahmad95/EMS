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
