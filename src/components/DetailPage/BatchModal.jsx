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

export default function BatchModal({
  isOpen,
  handleCloseModal,
  qty,
  settings,
}) {
  const [open, setOpen] = React.useState(false);
  const [warning, setWarning] = useState(false);
  const [message, setMessage] = useState("");
  const [data, setData] = useState([]);
  console.log(settings);
  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setWarning(false);
  };

  useEffect(() => {
    const currentDate = new Date().toISOString().split("T")[0]; // Formats the date as YYYY-MM-DD
  
    const initialData = {
      iId: 1,
      Batch: "",
      "Exp.Date": settings?.bExpDateforBatch ? currentDate : "",
      "Manuf.Date": settings?.bManf_dt ? currentDate : "",
      "Tot.Qty": "",
    };
  
    // Remove keys that are not needed based on settings
    if (!settings?.bExpDateforBatch) {
      delete initialData["Exp.Date"];
    }
  
    if (!settings?.bManf_dt) {
      delete initialData["Manuf.Date"];
    }
  
    setData([initialData]);
  }, [settings]);
  
  

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
  const handleRow = (type)=>{
    if(type === 1){
      const currentDate = new Date().toISOString().split("T")[0]; // Formats the date as YYYY-MM-DD
  
      const initialData = {
        iId: 1,
        Batch: "",
        "Exp.Date": settings?.bExpDateforBatch ? currentDate : "",
        "Manuf.Date": settings?.bManf_dt ? currentDate : "",
        "Tot.Qty": "",
      };
    
      // Remove keys that are not needed based on settings
      if (!settings?.bExpDateforBatch) {
        delete initialData["Exp.Date"];
      }
    
      if (!settings?.bManf_dt) {
        delete initialData["Manuf.Date"];
      }
    
      setData([...data,initialData]);
    }else{
      setData(data.slice(0, -1));
    }
  }

  const checkBatchAndQtyFilled = (data) => {
    for (let i = 0; i < data.length; i++) {
      if (!data[i].Batch || !data[i]["Tot.Qty"]) {
        setMessage("Batch and Quantity must be filled in all rows");
        handleOpenAlert();
        return false;
      }
    }
    return true;
  };

  const handleLoad = ()=>{
    if (checkBatchAndQtyFilled(data)) {
      const totalQty = data.reduce((total, item) => {
        return total + Number(item["Tot.Qty"]);
      }, 0);
      if(totalQty === qty){

      }else{
        setMessage("Total Quandity is not match");
        handleOpenAlert();
      }
    }
  }

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
                  justifyContent="flex-start"
                >
                  <Typography
                    sx={{ flex: "1 1 100%" }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                  >
                    Batch Creation
                  </Typography>
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
                  <TableContainer
                    style={{
                      display: "block",
                      maxHeight: "calc(100vh - 300px)",
                      overflowY: "auto",
                      scrollbarWidth: "thin",
                      scrollbarColor: "#888 #f5f5f5",
                      scrollbarTrackColor: "#f5f5f5",
                      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    {data && data.length ? (
                      <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={"small"}
                      >
                        <TableHead
                          style={{
                            background: `#8c99e0`,
                            position: "sticky",
                            top: 0,
                            zIndex: "1",
                          }}
                        >
                          <TableRow>
                            <TableCell
                              className="text-white"
                              sx={{
                                padding: "4px",
                                border: "1px solid #ddd",
                                whiteSpace: "nowrap",
                                cursor: "pointer",
                                minWidth: "80px",
                              }}
                              padding="checkbox"
                            ></TableCell>
                            {Object.keys(data[0])
                              .filter((header) => header !== "iId")
                              .map((header, index) => (
                                <TableCell
                                  sx={{
                                    border: "1px solid #ddd",
                                    cursor: "pointer",
                                    padding: "4px",
                                    color: "white",
                                  }}
                                  key={`${index}-${header}`}
                                  align="left"
                                  padding="normal"
                                >
                                  {header}
                                </TableCell>
                              ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {data.map((row, indexNum) => {
                            const labelId = `enhanced-table-checkbox-${indexNum}`;

                            return (
                              <TableRow
                                key={row.iId}
                                hover
                                role="checkbox"
                                className={`table-row `}
                                tabIndex={-1}
                                sx={{
                                  cursor: "pointer",
                                }}
                              >
                                <TableCell
                                  style={{
                                    padding: "4px",
                                    border: "1px solid #ddd",
                                  }}
                                  padding="checkbox"
                                  align="center"
                                >
                                  <PopupState
                                    variant="popover"
                                    popupId="demo-popup-popover"
                                  >
                                    {(popupState) => (
                                      <div>
                                        <IconButton
                                          aria-label="options"
                                          {...bindTrigger(popupState)}
                                          sx={{
                                            padding: 0,
                                            fontSize: "1.2rem",
                                          }}
                                        >
                                          <MoreVertIcon
                                            sx={{ fontSize: "1.2rem" }}
                                          />
                                        </IconButton>
                                        <Popover
                                          {...bindPopover(popupState)}
                                          anchorOrigin={{
                                            vertical: "bottom",
                                            horizontal: "center",
                                          }}
                                          transformOrigin={{
                                            vertical: "top",
                                            horizontal: "center",
                                          }}
                                        >
                                          <Stack direction="row">
                                            <IconButton
                                              onClick={() => {
                                                handleRow(1);
                                                popupState.close(); // Close the popover
                                              }}
                                              aria-label="add"
                                              color="#8c99e0"
                                              sx={{
                                                fontSize: "1.2rem",
                                                color: "#8c99e0",
                                              }}
                                            >
                                              <AddCircleIcon
                                                sx={{ fontSize: "1.2rem" }}
                                              />
                                            </IconButton>
                                            {data?.length > 1 ? (
                                              <IconButton
                                                onClick={() => {
                                                  handleRow(0);
                                                  popupState.close(); // Close the popover
                                                }}
                                                aria-label="remove"
                                                sx={{
                                                  fontSize: "1.2rem",
                                                  color: "#8c99e0",
                                                }}
                                              >
                                                <RemoveCircleIcon
                                                  sx={{ fontSize: "1.2rem" }}
                                                />
                                              </IconButton>
                                            ) : null}
                                          </Stack>
                                        </Popover>
                                      </div>
                                    )}
                                  </PopupState>
                                </TableCell>
                                {Object.keys(data[0]).map((column, index) => {
                                  if (column !== "iId") {
                                    return (
                                      <TableCell
                                        sx={{
                                          padding: 0,
                                          border: "1px solid #ddd",
                                          whiteSpace: "nowrap",
                                        }}
                                        key={index + labelId}
                                        component="th"
                                        id={labelId}
                                        scope="row"
                                        padding="0px"
                                        align="left"
                                      >
                                        {column === "Exp.Date" ||
                                        column === "Manuf.Date" ? (
                                          <TableModalInput
                                            type="date"
                                            value={data}
                                            setValue={setData}
                                            column={column}
                                            row={indexNum}
                                          />
                                        ) : column === "Tot.Qty" ? (
                                          <TableModalInput
                                            type="number"
                                            value={data}
                                            setValue={setData}
                                            column={column}
                                            row={indexNum}
                                          />
                                        ) : (
                                          <TableModalInput
                                            type="text"
                                            value={data}
                                            setValue={setData}
                                            column={column}
                                            row={indexNum}
                                          />
                                        )}
                                      </TableCell>
                                    );
                                  }
                                })}
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    ) : null}
                  </TableContainer>
                </CardContent>
                <Stack
                  direction="row"
                  spacing={1}
                  padding={2}
                  justifyContent="flex-end"
                >
                  <Button onClick={handleLoad} variant="contained" style={buttonStyle}>
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
