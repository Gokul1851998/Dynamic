import React, { useEffect, useState, useRef } from "react";
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
  rowName,
  setBifurcation,
  bifurcation,
  formData,
  setFormData
}) {
  const [open, setOpen] = React.useState(false);
  const [warning, setWarning] = useState(false);
  const [message, setMessage] = useState("");
  const [addCharges, setAddCharges] = useState(bifurcation);
  const hasRunEffect = useRef(false);

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

  useEffect(() => {
    if (!hasRunEffect.current) {
      const fieldExists = addCharges.some((item) => item.fieldName === rowName);
      if (!fieldExists) {
        setAddCharges((prev) => [...prev, { fieldName: rowName }]);
      }
      hasRunEffect.current = true;
    }
  }, [rowName, setAddCharges]);

  // Function to find the index of a field
  const findIndex = (fieldName) => {
    return addCharges.findIndex((item) => item.fieldName === fieldName);
  };

  const indexNum = findIndex(rowName);

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

  const handleChanges = () => {
    setBifurcation([...addCharges]);

    const totalGross = formData.reduce((sum, row) => sum + row.fGross, 0);
    let sumAllocated = 0; // To track the sum of allocated amounts
    const updatedTableData = formData.map((row, index) => {
      if (index === formData.length - 1) {
        // For the last row, adjust to make the total match transAmount exactly
        const newValue = addCharges[indexNum]["Trans Amount"] - sumAllocated;
        return {
          ...row,
          [rowName]: parseFloat(newValue.toFixed(2)), // Ensure the last entry balances out exactly with two decimal places
        };
      } else {
        // Calculate new value normally
        let newValue = (row.fGross / totalGross) * addCharges[indexNum]["Trans Amount"];
        newValue = parseFloat(newValue.toFixed(2)); // Format to two decimal places
        sumAllocated += newValue; // Add to the running total of allocated amounts
        return {
          ...row,
          [rowName]: newValue,
        };
      }
    });
    setFormData(updatedTableData)
    handleCloseModal();
  };

  const handleAmount = (value) => {
    let update = [...addCharges];
    update[indexNum]["Trans Amount"] = value * addCharges[indexNum]["Exchange Rate"];
    update[indexNum]["Base Amount"] = value * addCharges[indexNum]["Exchange Rate"];
    setAddCharges(update);
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
                        index={indexNum}
                        value={addCharges}
                        setValue={setAddCharges}
                      />
                    </MDBCol>
                    <MDBCol>
                      <MDBInput
                        readOnly
                        size="small"
                        id={`form3Example1`}
                        value={addCharges[indexNum]?.["Exchange Rate"] || ""}
                        label="Exchange Rate"
                        type="number"
                        autoComplete="off"
                      />
                    </MDBCol>
                  </MDBRow>
                  <MDBRow className="mb-4">
                    <MDBCol>
                      <MDBInput
                        size="small"
                        id={`form3Example2`}
                        value={addCharges[indexNum]?.["Amount"] || ""}
                        label="Amount"
                        type="number"
                        autoComplete="off"
                        onChange={(e) => {
                          let update = [...addCharges];
                          update[indexNum]["Amount"] = e.target.value;
                          setAddCharges(update);
                        }}
                        onBlur={(e) => handleAmount(e.target.value)}
                      />
                    </MDBCol>
                    <MDBCol>
                      <MDBInput
                        readOnly
                        size="small"
                        id={`form3Example3`}
                        value={addCharges[indexNum]?.["Trans Amount"] || ""}
                        label="Trans Amount"
                        type="number"
                        autoComplete="off"
                      />
                    </MDBCol>
                  </MDBRow>
                  <MDBRow className="mb-4">
                    <MDBCol>
                      <MDBInput
                        readOnly
                        size="small"
                        id={`form3Example4`}
                        value={addCharges[indexNum]?.["Base Amount"] || ""}
                        label="Base Amount"
                        type="number"
                        autoComplete="off"
                      />
                    </MDBCol>
                    <MDBCol></MDBCol>
                  </MDBRow>
                </CardContent>
                <Stack
                  direction="row"
                  spacing={1}
                  padding={2}
                  justifyContent="flex-end"
                >
                  <Button
                    onClick={handleChanges}
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
