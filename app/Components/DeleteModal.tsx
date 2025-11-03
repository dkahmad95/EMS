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
  maxWidth: "90%", // Ensure it doesn't exceed the viewport width
  bgcolor: "white",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: "8px",
  textAlign: "center",
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
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <b>{Title && Title}</b>
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <b>{Body && Body}</b>
          </Typography>
          <div className="flex justify-center items-center gap-x-10 mt-6">
            <Button
              className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-white transition-colors hover:bg-gray-200"
              onClick={async (e) => {
                e.preventDefault();
                await handleClick();
                setOpen(false);
              }}
            >
              Yes
            </Button>
            <Button
              className={`text-white `}
              onClick={() => {
                setOpen(false);
              }}
            >
              No
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default DeleteModal;