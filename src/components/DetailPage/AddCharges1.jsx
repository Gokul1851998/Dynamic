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
import AutoComplete2 from "../AutoComplete/AutoComplete2";
import { getMasters } from "../../api/ApiCall";
import NormalInput from "../Input/NormalInput";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function AddCharges1({
  isOpen,
  handleCloseModal,
  qty,
  handleSubmit,
}) {
  const [open, setOpen] = React.useState(false);
  const [warning, setWarning] = useState(false);
  const [message, setMessage] = useState("");
  const [start, setStart] = useState([]);

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

  const handleStart = () => {
    const limitValue = parseInt(qty, 10);
    const isNumeric = !isNaN(start);
    let array = [];

    if (isNumeric) {
      const numericStart = parseInt(start, 10);
      for (let i = 0; i <= limitValue; i++) {
        array.push(numericStart + i);
      }
    } else {
      const match = start.match(/([a-zA-Z]+)([0-9]+)/);
      if (match) {
        const prefix = match[1];
        let number = parseInt(match[2], 10);

        for (let i = 0; i <= limitValue; i++) {
          array.push(`${prefix}${number + i}`);
        }
      }
    }

    handleSubmit(array.join());
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
                <CardContent>
              
                    <MDBRow className="mb-4">
                      <MDBCol>
                        <AutoComplete2
                          api={getMasters}
                          iTag={13}
                          label="Currency"
                        />
                      </MDBCol>
                      <MDBCol>
                        <NormalInput
                          type="number"
                          label="ExchangeRate"
                        />
                      </MDBCol>
                    </MDBRow>
                    <MDBRow className="mb-4">
                      <MDBCol>
                      <NormalInput
                          type="number"
                          label="Amount"
                        />
                      </MDBCol>
                      <MDBCol>
                      <NormalInput
                          type="number"
                          label="Trans Amount"
                          read={true}
                        />
                      </MDBCol>
                    </MDBRow>
                    <MDBRow className="mb-4">
                      <MDBCol>
                      <NormalInput
                          type="number"
                          label="Base Amount"
                          read={true}
                        />
                      </MDBCol>
                    
                    </MDBRow>
                 </CardContent>
                <Stack
                  direction="row"
                  spacing={1}
                  padding={2}
                  justifyContent="flex-end"
                >
                  <Button
                    onClick={handleStart}
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
