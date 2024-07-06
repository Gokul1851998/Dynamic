import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import { TextField, Popover, Stack } from "@mui/material";
import { MDBCard } from "mdb-react-ui-kit";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useLocation } from "react-router-dom";
import Loader from "../Loader/Loader";
import BatchModal from "./BatchModal";
import SerialNoModal from "./SerialNoModal";
import AddCharges1 from "./AddCharges1";
import AutoCompleteTable from "../AutoComplete/ActoCompleteTable";
import TableInput2 from "../Input/TableInput";
import DynamicInputs from "./DynamicInputs";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

function EnhancedTableHead({ rows, handleBatchOpen }) {
  return (
    <TableHead
      style={{
        backgroundColor: "#8c99e0",
        position: "sticky",
        top: 0,
        zIndex: "5",
      }}
    >
      <TableRow>
        <TableCell
          sx={{
            padding: "4px",
            border: "1px solid #ddd",
            whiteSpace: "nowrap",
          }}
          padding="checkbox"
        ></TableCell>
        {rows.map((header, index) => (
          <TableCell
            key={index}
            sx={{ border: "1px solid #ddd", color: "#FFFF" }}
            align="left"
            padding="normal"
            onClick={() => header === "Add Charge" && handleBatchOpen(0, 3)}
          >
            {header}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function BodyTable({ bodyFields, bodySettings }) {
  const iUser = localStorage.getItem("userId");
  const location = useLocation();
  const iDocType = location.state;
  const [data, setData] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [batchModal, setBatchModal] = React.useState(false);
  const [qty, setQty] = React.useState(0);
  const [modal, setModal] = React.useState(0);
  const [row, setRow] = React.useState(0);
  const tableContainerRef = React.useRef(null);
  const [formData, setFormData] = React.useState([]);
  const [warning, setWarning] = React.useState(false)
  const [message, setMessage] = React.useState("")

  const handleCloseAlert = ()=>{
    setWarning(false)
  }

  const handleOpenAlert = ()=>{
    setWarning(true)
  }

  // Fetch initial data
  const fetchData = async () => {
    setOpen(true);

    // Initialize initialData
    let initialData = {};
    bodyFields.forEach((field) => {
      initialData[field.sFieldCaption] = "";
    });

    // Conditionally remove the "Batch" field if bEnableBatch is false
    if (bodySettings?.bEnableBatch === false) {
      delete initialData["Batch"];
    }
    setData([initialData]);
    setFormData([initialData]);

    setOpen(false);
  };

  React.useEffect(() => {
    fetchData();
  }, [bodyFields]);

  React.useEffect(() => {
    // Remove focus from any input fields on component mount
    if (tableContainerRef.current) {
      const inputs = tableContainerRef.current.querySelectorAll("input");
      inputs.forEach((input) => {
        input.blur();
      });
    }
  }, []);

  const handleBatchOpen = (value, type) => {
    const quantity = Number(data[value]?.fQty);
  
    if (type === 1 && !quantity) {
      setMessage("Enter Quantity");
      handleOpenAlert();
      return;
    }
    setModal(type);
    setQty(quantity);
    setBatchModal(true);
    setRow(value);
  };
  

  const handleBatchClose = () => {
    setBatchModal(false);
    setQty(0);
    setModal(0);
    setRow(0);
  };

  const handleBatchSubmit = (values) => {
    let update = [...data];
    update[row]["Serial No"] = values;
    setData(update);
    handleBatchClose();
  };

  const handleRow = (type) => {
    if (type === 1) {
      const initialData = {};
      bodyFields.forEach((field) => {
        initialData[field.sFieldCaption] = "";
      });
      setData([...data, initialData]);
      setFormData([...formData, initialData]);
    } else {
      setData(data.slice(0, -1));
      setFormData(formData.slice(0, -1));
    }
  };

  const handleInputChange = (event, fieldName, index) => {
    const value = event.target.value;
    let updatedData = [...data];
    let updatedFormData = [...formData];

    updatedData[index][fieldName] = value;
    updatedFormData[index][fieldName] = value;

    setData(updatedData);
    setFormData(updatedFormData);
  };
 
  return (
    <>
      <MDBCard
        className="text-center mt-2"
        style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)" }}
      >
        {data.length > 0 && (
          <TableContainer
            ref={tableContainerRef}
            style={{
              display: "block",
              maxHeight: "calc(100vh - 400px)",
              overflowY: "auto",
              scrollbarWidth: "thin",
              borderRadius: 2,
              scrollbarColor: "#888 #f5f5f5",
              scrollbarTrackColor: "#f5f5f5",
            }}
          >
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size="small"
            >
              <EnhancedTableHead
                rows={Object.keys(data[0])}
                handleBatchOpen={handleBatchOpen}
              />

              <TableBody>
                {data.map((row, indexNum) => {
                  const labelId = `enhanced-table-checkbox-${indexNum}`;

                  return (
                    <TableRow
                      hover
                      className={`table-row `}
                      role="checkbox"
                      tabIndex={-1}
                      key={indexNum}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell padding="checkbox">
                        <PopupState
                          variant="popover"
                          popupId="demo-popup-popover"
                        >
                          {(popupState) => (
                            <div>
                              <IconButton
                                aria-label="options"
                                {...bindTrigger(popupState)}
                                sx={{ padding: 0, fontSize: "1.2rem" }}
                              >
                                <MoreVertIcon sx={{ fontSize: "1.2rem" }} />
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
                                      popupState.close();
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
                                  {data?.length > 1 && (
                                    <IconButton
                                      onClick={() => {
                                        handleRow(0);
                                        popupState.close();
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
                                  )}
                                </Stack>
                              </Popover>
                            </div>
                          )}
                        </PopupState>
                      </TableCell>
                      {bodyFields
                        .filter(
                          (field) =>
                            field.bVisible &&
                            !["iTransDtId"].includes(field.sFieldName)
                        )
                        .map((field, index) => (
                          <TableCell
                            sx={{
                              padding: 0,
                              border: "1px solid #ddd",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                            }}
                            key={index + labelId}
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="0px"
                            align="left"
                          >
                            {field?.iFieldID === 6 ? (
                              <TextField
                                hidden={!bodySettings?.bEnableBatch}
                                id={`form3Example${index + 1}`}
                                type={
                                  field.iDataType === 1 ||
                                  field.iDataType === 4 ||
                                  field.iDataType === 8
                                    ? "number"
                                    : "text"
                                }
                                readOnly={field.bReadOnly}
                                size="small"
                                value={formData[indexNum][field.sFieldName] || ""}
                                fullWidth
                                onClick={() => handleBatchOpen(indexNum, 1)}
                                autoComplete="off"
                                sx={{
                                  padding: 0,
                                  margin: 0,
                                  width: 250, // Adjust the width as needed
                                  "& .MuiInputBase-root": {
                                    height: 30, // Adjust the height of the input area
                                  },
                                  "& .MuiInputLabel-root": {
                                    transform:
                                      "translate(10px, 5px) scale(0.9)", // Adjust label position when not focused
                                  },
                                  "& .MuiInputLabel-shrink": {
                                    transform:
                                      "translate(14px, -9px) scale(0.75)", // Adjust label position when focused
                                  },
                                  "& .MuiInputBase-input": {
                                    fontSize: "0.75rem", // Adjust the font size of the input text
                                  },
                                  "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                    {
                                      borderColor: "currentColor", // Keeps the current border color
                                    },
                                  "&:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "currentColor", // Optional: Keeps the border color on hover
                                  },
                                }}
                              />
                            ) : (
                              <>
                                {field.iDataType === 3 ? (
                                  <TextField
                                    id={`form3Example${index + 1}`}
                                    type="date"
                                    readOnly={field.bReadOnly}
                                    size="small"
                                    value={formData[indexNum][field.sFieldName] || ""}
                                    onChange={(e) =>
                                      handleInputChange(e, field.sFieldName, indexNum)
                                    }
                                    fullWidth
                                    autoComplete="off"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                ) : field.iDataType === 5 ||
                                  field.iDataType === 6 ? (
                                    <AutoCompleteTable
                                    iTag={field.iLinkTag}
                                    iUser={localStorage.getItem("userId")}
                                    fieldName={field.sFieldName}
                                    value={formData}
                                    inputValue={setFormData}
                                    row={indexNum}
                                    fullWidth
                                  />
                                ) : (
                                  <TextField
                                    id={`form3Example${index + 1}`}
                                    type={
                                      field.iDataType === 1 ||
                                      field.iDataType === 4 ||
                                      field.iDataType === 8
                                        ? "number"
                                        : "text"
                                    }
                                    readOnly={field.bReadOnly}
                                    size="small"
                                    value={formData[indexNum][field.sFieldName] || ""}
                                    onChange={(e) =>
                                      handleInputChange(e, field.sFieldName, indexNum)
                                    }
                                    fullWidth
                                    onClick={(e) => e.stopPropagation()}
                                    autoComplete="off"
                                    sx={{
                                      padding: 0,
                                      margin: 0,
                                      width: 250, // Adjust the width as needed
                                      "& .MuiInputBase-root": {
                                        height: 30, // Adjust the height of the input area
                                      },
                                      "& .MuiInputLabel-root": {
                                        transform:
                                          "translate(10px, 5px) scale(0.9)", // Adjust label position when not focused
                                      },
                                      "& .MuiInputLabel-shrink": {
                                        transform:
                                          "translate(14px, -9px) scale(0.75)", // Adjust label position when focused
                                      },
                                      "& .MuiInputBase-input": {
                                        fontSize: "0.75rem", // Adjust the font size of the input text
                                      },
                                      "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                        {
                                          borderColor: "currentColor", // Keeps the current border color
                                        },
                                      "&:hover .MuiOutlinedInput-notchedOutline":
                                        {
                                          borderColor: "currentColor", // Optional: Keeps the border color on hover
                                        },
                                    }}
                                  />
                                )}
                              </>
                            )}
                          </TableCell>
                        ))}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </MDBCard>

      {modal === 1 ? (
        <BatchModal
        settings={bodySettings}
          isOpen={batchModal}
          handleCloseModal={handleBatchClose}
          qty={qty}
        />
      ) : modal === 2 ? (
        <SerialNoModal
          isOpen={batchModal}
          handleCloseModal={handleBatchClose}
          qty={qty}
          handleSubmit={handleBatchSubmit}
        />
      ) : modal === 3 ? (
        <AddCharges1
          isOpen={batchModal}
          handleCloseModal={handleBatchClose}
          qty={qty}
          handleSubmit={handleBatchSubmit}
        />
      ) : null}

      <Loader open={open} handleClose={setOpen} />
      <ErrorMessage
        open={warning}
        handleClose={handleCloseAlert}
        message={message}
      />
    </>
  );
}
