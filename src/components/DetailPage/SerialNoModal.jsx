import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import MuiAlert from "@mui/material/Alert";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Autocomplete,
  Box,
  Button,
  CardContent,
  IconButton,
  Popover,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
import TableInput from "../Input/TableInput";
import TableModalInput from "../Input/TableModalInput";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function SerialNoModal({
  isOpen,
  handleCloseModal,
  qty,
  serialData,
  setSerialData,
  formData,
  setFormData,
  row,
}) {
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
    margin: 3,
    fontSize: "12px",
    padding: "6px 10px",
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleStart = () => {
    const limitValue = parseInt(qty, 10);
    let startLimit = formData[row]?.startLimit
    const isNumeric = !isNaN(startLimit);
    let array = [];

    if (isNumeric) {
      const numericStart = parseInt(startLimit, 10);
      for (let i = 0; i < limitValue; i++) {
        array.push(numericStart + i);
      }
    } else {

      const match = startLimit.match(/([a-zA-Z]+)([0-9]+)/);
      if (match) {
        const prefix = match[1];
        let number = parseInt(match[2], 10);

        for (let i = 0; i < limitValue; i++) {
          array.push(`${prefix}${number + i}`);
        }
      }else{
        setMessage("Check Start Limit");
        handleOpenAlert();
      }
    }
    setSerialData(array);
  };

  const handleSerialNumberChange = (index, value) => {
    let update = [...serialData];
    update[index] = value;
    setSerialData(update);
  };

  const handleLoad = async () => {
    if (serialData.length) {
      const serialNumber = serialData.map((item) => item).join(", ");
      let update = [...formData];
      update[row].sSerialNo = serialNumber;
      setFormData(update);
      handleCloseModal();
    } else {
      setMessage("Enter Start Limit");
      handleOpenAlert();
    }
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
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <form>
                <Stack
                  direction="row"
                  spacing={1}
                  padding={2}
                  justifyContent="flex-start"
                >
                  <Typography
                    sx={{ flex: "1 1 100%" }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                  >
                    Serial Number Generation
                  </Typography>
                  <Button
                    onClick={handleStart}
                    variant="contained"
                    style={buttonStyle}
                  >
                    Allocation
                  </Button>
                </Stack>

                <Box
                  sx={{
                    width: "auto",
                    paddingLeft: 2,
                    zIndex: 1,
                    backgroundColor: "#ffff",
                    borderRadius: 2,
                  }}
                >
                  <TextField
                    margin="normal"
                    size="small"
                    aria-readonly
                    type="number"
                    value={qty}
                    label="Quantity"
                    autoComplete="off"
                    autoFocus
                    sx={{
                      padding: 0,
                      margin: 0,
                      marginRight: 2, // Add margin between the two TextFields
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
                    }}
                  />

                  <TextField
                    margin="normal"
                    size="small"
                    aria-readonly
                    type="text"
                    value={formData[row]?.startLimit || ""}
                    onChange={(e) => {
                      let update = [...formData];
                      update[row].startLimit = e.target.value;
                      setFormData(update);
                    }}
                    label="Start Limit"
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
                    }}
                  />
                </Box>

                <CardContent>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat( minmax(100px, 1fr))",
                      maxHeight: "50vh",
                      overflowY: "scroll",
                      scrollbarWidth: "thin",
                    }}
                  >
                    {serialData &&
                      serialData.map((sn, index) => (
                        <TextField
                          key={index}
                          value={sn}
                          onChange={(e) =>
                            handleSerialNumberChange(index, e.target.value)
                          }
                          margin="dense"
                          sx={{
                            backgroundColor: "white",
                            borderRadius: "5px",
                            height: "30px",
                            width: "100px",
                          }}
                          InputProps={{ sx: { height: "30px" } }}
                        />
                      ))}
                  </Box>
                </CardContent>
                <Stack
                  direction="row"
                  spacing={1}
                  padding={2}
                  justifyContent="flex-end"
                >
                  <Button
                    onClick={handleLoad}
                    variant="contained"
                    style={buttonStyle}
                  >
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
