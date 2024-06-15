import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import MuiAlert from "@mui/material/Alert";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Zoom,
  tooltipClasses,
  withStyles,
} from "@mui/material";
import { MDBRow, MDBCol, MDBInput, MDBBtn } from "mdb-react-ui-kit";
import { styled } from "@mui/material/styles";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function BatchModal({ isOpen, handleCloseModal }) {
  const [open, setOpen] = React.useState(false);
  const [warning, setWarning] = useState(false);
  const [message, setMessage] = useState("");

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setWarning(false);
  };

  const handleOpenAlert = () => {
    setWarning(true);
  };

  const modalStyle = {
    display: isOpen ? "block" : "none",
  };

  const iUser = Number(localStorage.getItem("userId"));

  useEffect(() => {
    handleOpen();

    handleClose();
  }, [isOpen]);

  const buttonStyle = {
    textTransform: "none",
    color: `#ffff`,
    backgroundColor: `#8c99e0`,
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div>
      <div
        className={`modal-backdrop fade ${isOpen ? "show" : ""}`}
        style={{
          display: isOpen ? "block" : "none",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
        }}
      ></div>

      <Zoom in={isOpen} timeout={isOpen ? 400 : 300}>
        <div
          className={`modal ${isOpen ? "modal-open" : ""}`}
          style={modalStyle}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <form>
                <Stack
                  direction="row"
                  spacing={1}
                  padding={2}
                  justifyContent="flex-end"
                >
                  <Typography
                    sx={{ flex: "1 1 100%" }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                  >
                    Batch Creation
                  </Typography>
                  <Button variant="contained" style={buttonStyle}>
                    Load
                  </Button>
                  <Button
                    onClick={handleCloseModal}
                    variant="contained"
                    style={buttonStyle}
                  >
                    Close
                  </Button>
                </Stack>

                <Box
                  sx={{
                    width: "auto",
                    marginTop: 1,
                    padding: 3,
                    zIndex: 1,
                    backgroundColor: "#ffff",
                    borderRadius: 2,
                  }}
                >
                  <TextField
                    margin="normal"
                    size="small"
                    disabled
                    type="number"
                    label="Quantity"
                    autoComplete="off"
                    autoFocus
                    sx={{
                      padding: 0,
                      margin: 0,
                      width: "auto", // Adjust the width as needed
                      "& .MuiInputBase-root": {
                        height: 30, // Adjust the height of the input area
                      },
                      "& .MuiInputLabel-root": {
                        transform: "translate(10px, 5px) scale(0.9)", // Adjust label position when not focused
                      },
                      "& .MuiInputLabel-shrink": {
                        transform: "translate(14px, -9px) scale(0.75)", // Adjust label position when focused
                      },
                      "& .MuiInputBase-input": {
                        fontSize: "0.75rem", // Adjust the font size of the input text
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "currentColor", // Keeps the current border color
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "currentColor", // Optional: Keeps the border color on hover
                      },
                    }}
                  />
                  <MDBRow className="mb-4">
                    <MDBCol>
                      <MDBInput
                        required
                        id="form6Example3"
                        maxLength={500}
                        label="Action Required *"
                        labelStyle={{
                          fontSize: "15px",
                        }}
                        autoComplete="off"
                      />
                    </MDBCol>
                  </MDBRow>
                </Box>
              </form>
            </div>
          </div>
        </div>
      </Zoom>

      <Loader open={open} handleClose={handleClose} />
      <ErrorMessage
        open={warning}
        handleClose={handleCloseAlert}
        message={message}
      />
    </div>
  );
}
